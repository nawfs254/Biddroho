import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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

    // Server-side validation
    if (!name || !email || !phone || !eventDate || !eventType || !venue || !city) {
      return NextResponse.json(
        { error: 'Missing required booking fields.' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const bookings = db.collection('bookings');

    const newInquiry = {
      name,
      email,
      phone,
      organization: organization || '',
      eventDate,
      eventType,
      venue,
      city,
      expectedAudience: expectedAudience || '',
      venueSetting: venueSetting || '',
      eventNature: eventNature || '',
      otherArtists: otherArtists || '',
      sponsors: sponsors || '',
      additionalInfo: additionalInfo || '',
      status: 'pending', // pending, reviewed, accepted, declined
      createdAt: new Date(),
    };

    const result = await bookings.insertOne(newInquiry);

    return NextResponse.json(
      {
        success: true,
        message: 'Booking inquiry recorded successfully in MongoDB.',
        bookingId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in /api/book:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while saving booking inquiry.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
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
      bookings: recentBookings,
    });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
