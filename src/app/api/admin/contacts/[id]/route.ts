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
    const user = await requirePermission('contacts.update');
    const { id } = await params;
    const body = await req.json();
    const { status, internalNotes } = body;

    const db = await getDatabase();
    const query = buildIdQuery(id);

    const updateDoc: any = { updatedAt: new Date() };
    if (status) updateDoc.status = status;
    if (internalNotes !== undefined) updateDoc.internalNotes = internalNotes;

    const res = await db.collection('contacts').updateOne(query, { $set: updateDoc });
    if (res.matchedCount === 0) {
      return NextResponse.json({ error: 'Contact submission not found' }, { status: 404 });
    }

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'CONTACT_UPDATED',
      resource: 'contacts',
      resourceId: id,
      metadata: { status },
    });

    return NextResponse.json({ success: true, message: 'Contact status updated.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update error' }, { status: err.status || 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('contacts.delete');
    const { id } = await params;
    const db = await getDatabase();
    const query = buildIdQuery(id);

    await db.collection('contacts').deleteOne(query);

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'CONTACT_DELETED',
      resource: 'contacts',
      resourceId: id,
    });

    return NextResponse.json({ success: true, message: 'Contact deleted.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Deletion error' }, { status: err.status || 400 });
  }
}
