import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const contactsCollection = db.collection('contacts');

    const newContact = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: (subject || 'General Inquiry').trim(),
      message: message.trim(),
      status: 'UNREAD',
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
