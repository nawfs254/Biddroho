import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission } from '@/lib/permissions/rbac';
import { recordAuditLog } from '@/lib/audit/logger';

export async function GET(req: NextRequest) {
  try {
    await requirePermission('subscribers.view');
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    const db = await getDatabase();
    const query: any = {};
    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }

    const subs = await db.collection('subscribers')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      subscribers: subs.map((s) => ({ ...s, _id: s._id.toString() })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error fetching subscribers' }, { status: err.status || 500 });
  }
}
