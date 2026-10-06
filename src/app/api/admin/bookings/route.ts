import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission } from '@/lib/permissions/rbac';

export async function GET(req: NextRequest) {
  try {
    await requirePermission('bookings.view');
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const db = await getDatabase();
    const query: any = {};

    if (status) {
      if (status === 'NEW') {
        query.$or = [{ status: 'NEW' }, { status: 'pending' }];
      } else {
        query.status = status;
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
      ];
    }

    const bookings = await db.collection('bookings')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      count: bookings.length,
      bookings: bookings.map((b) => ({ ...b, _id: b._id.toString() })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Error fetching bookings' },
      { status: err.status || 500 }
    );
  }
}
