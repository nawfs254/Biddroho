import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import {
  getClientIp,
  checkRateLimit,
  checkDatabaseRateLimit,
  rateLimitResponse,
} from '@/lib/rateLimit';
import { requirePermission } from '@/lib/permissions/rbac';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);

    // 1. In-memory Rate Limit & 15s Burst Cooldown on Client IP
    // Max 3 booking inquiries per 15 minutes per IP; min 15s between submits
    const ipRateLimit = checkRateLimit(`booking:ip:${clientIp}`, {
      limit: 3,
      windowMs: 15 * 60 * 1000,
      cooldownMs: 15 * 1000,
    });

    if (!ipRateLimit.allowed) {
      return rateLimitResponse(
        ipRateLimit,
        ipRateLimit.reason === 'cooldown'
          ? `Please wait ${ipRateLimit.retryAfterSeconds} seconds before submitting another booking inquiry.`
          : `Too many booking inquiries submitted from your network. Please wait ${Math.ceil(
              ipRateLimit.retryAfterSeconds / 60
            )} minutes before trying again.`
      );
    }

    const body = await req.json();

    // 2. Anti-Spam Honeypot Detection
    // If the hidden honeypot field is filled, an automated spam bot triggered it
    if (body.website || body.hp_company || body.business_fax) {
      // Return 400 or silent rejection to thwart bot crawlers
      return NextResponse.json(
        { error: 'Bot submission detected.' },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      phone,
      organization,
      eventDate,
      eventType,
      venue,
      city,
      expectedAudience,
      venueSetting,
      eventNature,
      otherArtists,
      sponsors,
      additionalInfo,
    } = body;

    // 3. Strict Server-Side Validation & Sanitization
    if (
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !eventDate?.trim() ||
      !eventType?.trim() ||
      !venue?.trim() ||
      !city?.trim()
    ) {
      return NextResponse.json(
        { error: 'Missing required booking fields. Name, email, phone, date, type, venue, and city are mandatory.' },
        { status: 400 }
      );
    }

    // Email format validation
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Length caps to prevent payload flooding / buffer overflow attacks
    if (
      name.length > 100 ||
      normalizedEmail.length > 150 ||
      phone.length > 30 ||
      venue.length > 150 ||
      city.length > 100 ||
      (additionalInfo && additionalInfo.length > 3000)
    ) {
      return NextResponse.json(
        { error: 'Field length exceeds maximum acceptable limits.' },
        { status: 400 }
      );
    }

    // 4. In-Memory Rate Limit by Email (Max 3 per hour per email address)
    const emailRateLimit = checkRateLimit(`booking:email:${normalizedEmail}`, {
      limit: 3,
      windowMs: 60 * 60 * 1000,
    });

    if (!emailRateLimit.allowed) {
      return rateLimitResponse(
        emailRateLimit,
        `Too many booking inquiries submitted for ${normalizedEmail}. Please wait an hour before submitting again.`
      );
    }

    const db = await getDatabase();
    const bookings = db.collection('bookings');

    // 5. Database-level Persistent Rate Limit Check
    // Prevents attackers from bypassing memory limits via server reboots or distributed pods
    const dbIpCheck = await checkDatabaseRateLimit(
      bookings,
      { clientIp },
      15 * 60 * 1000,
      3
    );

    if (!dbIpCheck.allowed) {
      return NextResponse.json(
        {
          error:
            'Too many booking inquiries recorded from this IP recently. Please wait 15 minutes before submitting again.',
        },
        { status: 429 }
      );
    }

    const dbEmailCheck = await checkDatabaseRateLimit(
      bookings,
      { email: normalizedEmail },
      60 * 60 * 1000,
      4
    );

    if (!dbEmailCheck.allowed) {
      return NextResponse.json(
        {
          error:
            'Too many inquiries on file for this email address. Please allow our management team 24-48 hours to review your existing submissions.',
        },
        { status: 429 }
      );
    }

    // 6. Record New Inquiry
    const newInquiry = {
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      organization: (organization || '').trim(),
      eventDate: eventDate.trim(),
      eventType: eventType.trim(),
      venue: venue.trim(),
      city: city.trim(),
      expectedAudience: (expectedAudience || '').trim(),
      venueSetting: (venueSetting || '').trim(),
      eventNature: (eventNature || '').trim(),
      otherArtists: (otherArtists || '').trim(),
      sponsors: (sponsors || '').trim(),
      additionalInfo: (additionalInfo || '').trim(),
      status: 'NEW',
      clientIp,
      userAgent: req.headers.get('user-agent')?.slice(0, 200) || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await bookings.insertOne(newInquiry);

    return NextResponse.json(
      {
        success: true,
        message: 'Booking inquiry received and verified by BIDDROHO Management.',
        bookingId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in /api/book POST:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while saving booking inquiry.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Protected: Only authenticated staff with bookings.view permission can view bookings
    await requirePermission('bookings.view');

    const db = await getDatabase();
    const bookings = db.collection('bookings');
    const recentBookings = await bookings
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({
      success: true,
      count: recentBookings.length,
      bookings: recentBookings.map((b) => ({ ...b, _id: b._id.toString() })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unauthorized access' },
      { status: error.status || 401 }
    );
  }
}
