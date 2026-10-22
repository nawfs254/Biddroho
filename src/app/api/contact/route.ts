import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import {
  getClientIp,
  checkRateLimit,
  checkDatabaseRateLimit,
  rateLimitResponse,
} from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);

    // 1. IP rate limit & cooldown: max 5 messages per 15 minutes, 15s burst cooldown
    const ipRateLimit = checkRateLimit(`contact:ip:${clientIp}`, {
      limit: 5,
      windowMs: 15 * 60 * 1000,
      cooldownMs: 15 * 1000,
    });

    if (!ipRateLimit.allowed) {
      return rateLimitResponse(
        ipRateLimit,
        ipRateLimit.reason === 'cooldown'
          ? `Please wait ${ipRateLimit.retryAfterSeconds} seconds before sending another message.`
          : `Too many contact messages received from your network. Please wait ${Math.ceil(
              ipRateLimit.retryAfterSeconds / 60
            )} minutes before trying again.`
      );
    }

    const body = await req.json();

    // 2. Anti-spam honeypot
    if (body.website || body.business_fax || body.hp_company) {
      return NextResponse.json(
        { error: 'Bot submission detected.' },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Length caps
    if (name.length > 100 || normalizedEmail.length > 150 || message.length > 3000) {
      return NextResponse.json(
        { error: 'Message or input exceeds maximum acceptable length.' },
        { status: 400 }
      );
    }

    // 3. Email rate limit
    const emailRateLimit = checkRateLimit(`contact:email:${normalizedEmail}`, {
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });

    if (!emailRateLimit.allowed) {
      return rateLimitResponse(
        emailRateLimit,
        `Too many messages submitted for ${normalizedEmail}. Please wait before submitting again.`
      );
    }

    const db = await getDatabase();
    const contactsCollection = db.collection('contacts');

    // 4. DB Persistent check
    const dbIpCheck = await checkDatabaseRateLimit(
      contactsCollection,
      { clientIp },
      15 * 60 * 1000,
      5
    );

    if (!dbIpCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many messages recorded from this IP recently. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    const newContact = {
      name: name.trim(),
      email: normalizedEmail,
      subject: (subject || 'General Inquiry').trim(),
      message: message.trim(),
      status: 'UNREAD',
      clientIp,
      internalNotes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await contactsCollection.insertOne(newContact);

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent to BIDDROHO management.',
      id: result.insertedId.toString(),
    });
  } catch (err: any) {
    console.error('Contact submission error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to submit contact message.' },
      { status: 500 }
    );
  }
}
