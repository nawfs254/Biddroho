import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission, hasPermission } from '@/lib/permissions/rbac';
import { recordAuditLog } from '@/lib/audit/logger';
import { musicReleaseSchema } from '@/lib/validation/schemas';

export async function GET(req: NextRequest) {
  try {
    await requirePermission('music.view');
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';

    const db = await getDatabase();
    const query: any = {};

    if (type) query.type = type;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
      ];
    }

    const releases = await db.collection('releases')
      .find(query)
      .sort({ year: -1, releaseDate: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      releases: releases.map((r) => ({ ...r, _id: r._id.toString() })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Error fetching releases' },
      { status: err.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requirePermission('music.create');
    const body = await req.json();

    const parsed = musicReleaseSchema.parse(body);

    if (parsed.status === 'PUBLISHED' && !hasPermission(user, 'music.publish')) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to publish releases. Save as DRAFT.' },
        { status: 403 }
      );
    }

    const db = await getDatabase();
    const releasesCol = db.collection('releases');

    const existing = await releasesCol.findOne({ slug: parsed.slug });
    if (existing) {
      return NextResponse.json(
        { error: `A release with slug "${parsed.slug}" already exists.` },
        { status: 400 }
      );
    }

    const docToInsert = {
      ...parsed,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await releasesCol.insertOne(docToInsert);

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'RELEASE_CREATED',
      resource: 'music',
      resourceId: result.insertedId.toString(),
      metadata: { title: parsed.title, slug: parsed.slug, type: parsed.type },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Music release created successfully.',
        release: { ...docToInsert, _id: result.insertedId.toString() },
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
      { error: err.message || 'Creation error' },
      { status: err.status || 400 }
    );
  }
}
