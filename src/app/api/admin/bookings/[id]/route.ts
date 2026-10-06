import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission } from '@/lib/permissions/rbac';
import { recordAuditLog } from '@/lib/audit/logger';

import { buildIdQuery } from '@/lib/db/query';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission('bookings.view');
    const { id } = await params;
    const db = await getDatabase();
    const booking = await db.collection('bookings').findOne(buildIdQuery(id));

    if (!booking) {
      return NextResponse.json({ error: 'Booking inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      booking: { ...booking, _id: booking._id.toString() },
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
    const user = await requirePermission('bookings.update');
    const { id } = await params;
    const body = await req.json();

    const { status, noteText, budget, retainedAmount, cancellationReason } = body;
    const db = await getDatabase();
    const query = buildIdQuery(id);

    const existing = await db.collection('bookings').findOne(query);
    if (!existing) {
      return NextResponse.json({ error: 'Booking inquiry not found' }, { status: 404 });
    }

    const updateFields: any = {
      updatedAt: new Date(),
    };

    if (status) {
      updateFields.status = status;
    }

    if (budget !== undefined) {
      updateFields.budget = budget;
    }

    if (retainedAmount !== undefined) {
      updateFields.retainedAmount = retainedAmount;
    }

    if (cancellationReason !== undefined) {
      updateFields.cancellationReason = cancellationReason;
    }

    const updateOp: any = { $set: updateFields };

    if (noteText && String(noteText).trim()) {
      const newNote = {
        id: new ObjectId().toString(),
        author: user.name,
        authorEmail: user.email,
        text: String(noteText).trim(),
        createdAt: new Date(),
      };
      updateOp.$push = { internalNotes: newNote };
    }

    await db.collection('bookings').updateOne(query, updateOp);

    if (status && status !== existing.status) {
      await recordAuditLog({
        userId: user._id,
        userName: user.name,
        action: 'BOOKING_STATUS_CHANGED',
        resource: 'bookings',
        resourceId: id,
        metadata: {
          clientName: existing.name,
          oldStatus: existing.status,
          newStatus: status,
        },
      });
    }

    const updated = await db.collection('bookings').findOne(query);

    return NextResponse.json({
      success: true,
      message: 'Booking record updated.',
      booking: updated ? { ...updated, _id: updated._id.toString() } : null,
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
    const user = await requirePermission('bookings.delete');
    const { id } = await params;

    const db = await getDatabase();
    const query = buildIdQuery(id);

    const existing = await db.collection('bookings').findOne(query);
    if (!existing) {
      return NextResponse.json({ error: 'Booking inquiry not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const force = searchParams.get('force') === 'true';

    // Business rule: Confirmed bookings represent official show contracts.
    // Prompt management to cancel show first unless explicitly forced.
    if (existing.status === 'CONFIRMED' && !force) {
      return NextResponse.json(
        { error: 'This booking is marked as CONFIRMED. Please cancel the show first, or confirm permanent deletion.' },
        { status: 400 }
      );
    }

    await db.collection('bookings').deleteOne({ _id: existing._id });

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'BOOKING_DELETED',
      resource: 'bookings',
      resourceId: id,
      metadata: { clientName: existing.name, date: existing.eventDate },
    });

    return NextResponse.json({
      success: true,
      message: 'Booking inquiry deleted.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Deletion error' },
      { status: err.status || 400 }
    );
  }
}
