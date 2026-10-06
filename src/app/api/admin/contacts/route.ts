import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission } from '@/lib/permissions/rbac';
import { recordAuditLog } from '@/lib/audit/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requirePermission('contacts.view');
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const db = await getDatabase();
    const query: any = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const contacts = await db.collection('contacts')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      contacts: contacts.map((c) => ({ ...c, _id: c._id.toString() })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Error fetching contacts' },
      { status: err.status || 500 }
    );
  }
}
