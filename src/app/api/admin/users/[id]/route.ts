import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission } from '@/lib/permissions/rbac';
import { hashPassword } from '@/lib/auth/password';
import { recordAuditLog } from '@/lib/audit/logger';

import { buildIdQuery } from '@/lib/db/query';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const actor = await requirePermission('users.update');
    const { id } = await params;
    const body = await req.json();

    const db = await getDatabase();
    const query = buildIdQuery(id);

    const targetUser = await db.collection('users').findOne(query);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updateDoc: any = { updatedAt: new Date() };

    if (body.name) updateDoc.name = body.name;
    if (body.email) updateDoc.email = String(body.email).toLowerCase().trim();
    if (Array.isArray(body.roles) && body.roles.length > 0) updateDoc.roles = body.roles;
    if (body.status) updateDoc.status = body.status;

    if (body.password && String(body.password).length >= 8) {
      updateDoc.passwordHash = await hashPassword(body.password);
    }

    await db.collection('users').updateOne(query, { $set: updateDoc });

    await recordAuditLog({
      userId: actor._id,
      userName: actor.name,
      action: 'USER_UPDATED',
      resource: 'users',
      resourceId: id,
      metadata: { targetEmail: targetUser.email, updatedFields: Object.keys(updateDoc) },
    });

    return NextResponse.json({ success: true, message: 'User updated successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update error' }, { status: err.status || 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const actor = await requirePermission('users.delete');
    const { id } = await params;

    // Prevent deleting own account
    if (actor._id === id) {
      return NextResponse.json({ error: 'Cannot delete your own administrator account.' }, { status: 400 });
    }

    const db = await getDatabase();
    const query = buildIdQuery(id);

    const targetUser = await db.collection('users').findOne(query);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await db.collection('users').deleteOne(query);

    await recordAuditLog({
      userId: actor._id,
      userName: actor.name,
      action: 'USER_DELETED',
      resource: 'users',
      resourceId: id,
      metadata: { deletedEmail: targetUser.email },
    });

    return NextResponse.json({ success: true, message: 'User account removed.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Deletion error' }, { status: err.status || 400 });
  }
}
