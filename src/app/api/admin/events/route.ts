import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission, hasPermission } from '@/lib/permissions/rbac';
import { recordAuditLog } from '@/lib/audit/logger';
import { eventSchema } from '@/lib/validation/schemas';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requirePermission('events.view');
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const db = await getDatabase();
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await db.collection('events')
      .find(query)
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      events: events.map((e) => ({ ...e, _id: e._id.toString() })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Unauthorized or server error' },
      { status: err.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requirePermission('events.create');
    const body = await req.json();

    const parsed = eventSchema.parse(body);

    if (parsed.status === 'PUBLISHED' && !hasPermission(user, 'events.publish')) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to publish events directly. Save as DRAFT instead.' },
        { status: 403 }
      );
    }

    const db = await getDatabase();
    const eventsCollection = db.collection('events');

    // Check duplicate slug
    const existing = await eventsCollection.findOne({ slug: parsed.slug });
    if (existing) {
      return NextResponse.json(
        { error: `An event with slug "${parsed.slug}" already exists.` },
        { status: 400 }
      );
    }

    const docToInsert = {
      ...parsed,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await eventsCollection.insertOne(docToInsert);

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'EVENT_CREATED',
      resource: 'events',
      resourceId: result.insertedId.toString(),
      metadata: { title: parsed.title, slug: parsed.slug, status: parsed.status },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Event created successfully.',
        event: { ...docToInsert, _id: result.insertedId.toString() },
      },
      { status: 201 }
    );
  } catch (err: any) {
    if (err?.name === 'ZodError' || Array.isArray(err?.issues)) {
      const issue = err.issues?.[0];
      const message = issue ? `Validation error on '${issue.path?.join('.')}': ${issue.message}` : 'Validation error';
      return NextResponse.json({ error: message, issues: err.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: err.message || 'Validation or creation error' },
      { status: err.status || 400 }
    );
  }
}
