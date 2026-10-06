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
    const user = await requirePermission('media.update');
    const { id } = await params;
    const body = await req.json();

    const db = await getDatabase();
    const query = buildIdQuery(id);

    const updateDoc: any = { ...body, updatedAt: new Date() };
    delete updateDoc._id;

    await db.collection('media').updateOne(query, { $set: updateDoc });

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'MEDIA_UPDATED',
      resource: 'media',
      resourceId: id,
    });

    return NextResponse.json({ success: true, message: 'Media updated.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update error' }, { status: err.status || 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('media.delete');
    const { id } = await params;
    const db = await getDatabase();
    const query = buildIdQuery(id);

    await db.collection('media').deleteOne(query);

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'MEDIA_DELETED',
      resource: 'media',
      resourceId: id,
    });

    return NextResponse.json({ success: true, message: 'Media asset deleted.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Deletion error' }, { status: err.status || 400 });
  }
}
