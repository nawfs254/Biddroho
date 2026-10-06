import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission } from '@/lib/permissions/rbac';
import { recordAuditLog } from '@/lib/audit/logger';

function buildQuery(id: string): any {
  try {
    return { _id: new ObjectId(id) };
  } catch {
    return { _id: id };
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('press.update');
    const { id } = await params;
    const body = await req.json();

    const db = await getDatabase();
    const query = buildQuery(id);

    const updateDoc: any = { ...body, updatedAt: new Date() };
    delete updateDoc._id;

    await db.collection('press_releases').updateOne(query, { $set: updateDoc });

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'PRESS_RELEASE_UPDATED',
      resource: 'press',
      resourceId: id,
    });

    return NextResponse.json({ success: true, message: 'Press release updated.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update error' }, { status: err.status || 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('press.delete');
    const { id } = await params;
    const db = await getDatabase();
    const query = buildQuery(id);

    await db.collection('press_releases').deleteOne(query);

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'PRESS_RELEASE_DELETED',
      resource: 'press',
      resourceId: id,
    });

    return NextResponse.json({ success: true, message: 'Press release deleted.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Deletion error' }, { status: err.status || 400 });
  }
}
