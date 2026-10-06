import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission } from '@/lib/permissions/rbac';
import { recordAuditLog } from '@/lib/audit/logger';
import { memberSchema } from '@/lib/validation/schemas';

import { buildIdQuery } from '@/lib/db/query';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission('members.view');
    const { id } = await params;
    const db = await getDatabase();
    const member = await db.collection('members').findOne(buildIdQuery(id));

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      member: { ...member, _id: member._id.toString() },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: err.status || 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('members.update');
    const { id } = await params;
    const body = await req.json();

    const parsed = memberSchema.parse(body);
    const db = await getDatabase();
    const query = buildIdQuery(id);

    const updateDoc = {
      ...parsed,
      updatedAt: new Date(),
    };

    const res = await db.collection('members').updateOne(query, { $set: updateDoc });
    if (res.matchedCount === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'MEMBER_UPDATED',
      resource: 'members',
      resourceId: id,
      metadata: { name: parsed.name, role: parsed.role },
    });

    return NextResponse.json({
      success: true,
      message: 'Member profile updated successfully.',
      member: { ...updateDoc, _id: id },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Update error' },
      { status: err.status || 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('members.delete');
    const { id } = await params;

    const db = await getDatabase();
    const query = buildIdQuery(id);

    const existing = await db.collection('members').findOne(query);
    if (!existing) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    await db.collection('members').deleteOne(query);

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'MEMBER_REMOVED',
      resource: 'members',
      resourceId: id,
      metadata: { name: existing.name },
    });

    return NextResponse.json({
      success: true,
      message: 'Member removed successfully.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Deletion error' },
      { status: err.status || 400 }
    );
  }
}
