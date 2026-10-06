import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await getDatabase();
    const settings = await db.collection('settings').findOne({ key: 'band_settings' });

    return NextResponse.json({
      success: true,
      settings: settings || null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Error fetching settings' },
      { status: 500 }
    );
  }
}
