import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  limit: number; // Maximum allowed requests in window
  windowMs: number; // Time window in milliseconds
  cooldownMs?: number; // Minimum gap between consecutive requests
}

interface RateLimitEntry {
  timestamps: number[];
  lastRequest: number;
}

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
  retryAfterSeconds: number;
  reason?: 'limit_exceeded' | 'cooldown';
}

// In-memory sliding window rate limit cache
const memoryStore = new Map<string, RateLimitEntry>();

// Periodic garbage collection to prevent memory leaks (runs every 5 minutes)
let lastCleanup = Date.now();
function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60 * 1000) return;
  lastCleanup = now;

  const maxRetention = 60 * 60 * 1000; // 1 hour max
  for (const [key, entry] of memoryStore.entries()) {
    if (now - entry.lastRequest > maxRetention) {
      memoryStore.delete(key);
    }
  }
}

/**
 * Extracts the real client IP address from request headers.
 * Supports Cloudflare (CF-Connecting-IP), reverse proxies (X-Forwarded-For, X-Real-IP).
 */
export function getClientIp(req: Request | NextRequest): string {
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp && cfIp.trim()) return cfIp.trim();

  const realIp = req.headers.get('x-real-ip');
  if (realIp && realIp.trim()) return realIp.trim();

  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const parts = forwardedFor.split(',');
    if (parts.length > 0 && parts[0].trim()) {
      return parts[0].trim();
    }
  }

  return '127.0.0.1';
}

/**
 * In-memory sliding window rate limiter with cooldown enforcement.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanupExpiredEntries();

  const now = Date.now();
  const { limit, windowMs, cooldownMs = 0 } = config;

  let entry = memoryStore.get(key);
  if (!entry) {
    entry = { timestamps: [], lastRequest: 0 };
    memoryStore.set(key, entry);
  }

  // 1. Check burst cooldown (e.g. at least 15s between submissions)
  if (cooldownMs > 0 && entry.lastRequest > 0) {
    const elapsedSinceLast = now - entry.lastRequest;
    if (elapsedSinceLast < cooldownMs) {
      const waitSeconds = Math.ceil((cooldownMs - elapsedSinceLast) / 1000);
      return {
        allowed: false,
        limit,
        remaining: 0,
        resetMs: cooldownMs - elapsedSinceLast,
        retryAfterSeconds: waitSeconds,
        reason: 'cooldown',
      };
    }
  }

  // 2. Filter out timestamps older than the sliding window
  const windowStart = now - windowMs;
  entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);

  // 3. Check window limit
  if (entry.timestamps.length >= limit) {
    const oldestTimestamp = entry.timestamps[0];
    const resetMs = Math.max(0, oldestTimestamp + windowMs - now);
    const retryAfterSeconds = Math.max(1, Math.ceil(resetMs / 1000));

    return {
      allowed: false,
      limit,
      remaining: 0,
      resetMs,
      retryAfterSeconds,
      reason: 'limit_exceeded',
    };
  }

  // 4. Record new request
  entry.timestamps.push(now);
  entry.lastRequest = now;

  const remaining = Math.max(0, limit - entry.timestamps.length);
  const oldestTimestamp = entry.timestamps[0];
  const resetMs = Math.max(0, oldestTimestamp + windowMs - now);

  return {
    allowed: true,
    limit,
    remaining,
    resetMs,
    retryAfterSeconds: 0,
  };
}

/**
 * Creates a standard HTTP 429 Too Many Requests response with compliant rate-limit headers.
 */
export function rateLimitResponse(
  result: RateLimitResult,
  customMessage?: string
): NextResponse {
  const message =
    customMessage ||
    (result.reason === 'cooldown'
      ? `Please wait ${result.retryAfterSeconds} seconds before sending another submission.`
      : `Rate limit exceeded. You have submitted too many requests. Please wait ${Math.ceil(result.retryAfterSeconds / 60)} minute(s) before trying again.`);

  const headers = new Headers();
  headers.set('Retry-After', result.retryAfterSeconds.toString());
  headers.set('X-RateLimit-Limit', result.limit.toString());
  headers.set('X-RateLimit-Remaining', result.remaining.toString());
  headers.set('X-RateLimit-Reset', Math.ceil((Date.now() + result.resetMs) / 1000).toString());

  return NextResponse.json(
    {
      error: message,
      retryAfter: result.retryAfterSeconds,
    },
    {
      status: 429,
      headers,
    }
  );
}

/**
 * Checks recent submissions stored in MongoDB to persist rate limiting across server restarts and workers.
 */
export async function checkDatabaseRateLimit(
  collection: any,
  query: Record<string, any>,
  windowMs: number,
  limit: number
): Promise<{ allowed: boolean; count: number; retryAfterSeconds: number }> {
  try {
    const cutoff = new Date(Date.now() - windowMs);
    const count = await collection.countDocuments({
      ...query,
      createdAt: { $gte: cutoff },
    });

    if (count >= limit) {
      const retryAfterSeconds = Math.ceil(windowMs / 1000);
      return { allowed: false, count, retryAfterSeconds };
    }

    return { allowed: true, count, retryAfterSeconds: 0 };
  } catch (err) {
    console.error('[RateLimit DB Check Error]', err);
    // On DB error, do not block legitimate users, rely on in-memory rate limiting
    return { allowed: true, count: 0, retryAfterSeconds: 0 };
  }
}

