import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission } from '@/lib/permissions/rbac';
import { recordAuditLog } from '@/lib/audit/logger';

import { buildIdQuery } from '@/lib/db/query';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('subscribers.update');
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const db = await getDatabase();
    const query = buildIdQuery(id);

    await db.collection('subscribers').updateOne(query, { $set: { status } });

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'SUBSCRIBER_STATUS_CHANGED',
      resource: 'subscribers',
      resourceId: id,
      metadata: { status },
    });

    return NextResponse.json({ success: true, message: 'Subscriber status updated.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update error' }, { status: err.status || 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('subscribers.delete');
    const { id } = await params;
    const db = await getDatabase();
    const query = buildIdQuery(id);

    await db.collection('subscribers').deleteOne(query);

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'SUBSCRIBER_DELETED',
      resource: 'subscribers',
      resourceId: id,
    });

    return NextResponse.json({ success: true, message: 'Subscriber removed.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Deletion error' }, { status: err.status || 400 });
  }
}
