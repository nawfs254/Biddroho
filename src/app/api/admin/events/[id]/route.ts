import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission, hasPermission } from '@/lib/permissions/rbac';
import { recordAuditLog } from '@/lib/audit/logger';
import { eventSchema } from '@/lib/validation/schemas';

import { buildIdQuery } from '@/lib/db/query';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission('events.view');
    const { id } = await params;
    const db = await getDatabase();
    const event = await db.collection('events').findOne(buildIdQuery(id));

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      event: { ...event, _id: event._id.toString() },
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
    const user = await requirePermission('events.update');
    const { id } = await params;
    const body = await req.json();

    const parsed = eventSchema.parse(body);

    if (parsed.status === 'PUBLISHED' && !hasPermission(user, 'events.publish')) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to publish events.' },
        { status: 403 }
      );
    }

    const db = await getDatabase();
    const query = buildIdQuery(id);

    const updateDoc = {
      ...parsed,
      updatedAt: new Date(),
    };

    const res = await db.collection('events').updateOne(query, { $set: updateDoc });

    if (res.matchedCount === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'EVENT_UPDATED',
      resource: 'events',
      resourceId: id,
      metadata: { title: parsed.title, status: parsed.status },
    });

    return NextResponse.json({
      success: true,
      message: 'Event updated successfully.',
      event: { ...updateDoc, _id: id },
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
    const user = await requirePermission('events.delete');
    const { id } = await params;

    const db = await getDatabase();
    const query = buildIdQuery(id);

    const existing = await db.collection('events').findOne(query);
    if (!existing) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    await db.collection('events').deleteOne(query);

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'EVENT_DELETED',
      resource: 'events',
      resourceId: id,
      metadata: { title: existing.title },
    });

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Deletion error' },
      { status: err.status || 400 }
    );
  }
}
