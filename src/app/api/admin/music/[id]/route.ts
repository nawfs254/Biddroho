import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission, hasPermission } from '@/lib/permissions/rbac';
import { recordAuditLog } from '@/lib/audit/logger';
import { musicReleaseSchema } from '@/lib/validation/schemas';

import { buildIdQuery } from '@/lib/db/query';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission('music.view');
    const { id } = await params;
    const db = await getDatabase();
    const release = await db.collection('releases').findOne(buildIdQuery(id));

    if (!release) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      release: { ...release, _id: release._id.toString() },
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
    const user = await requirePermission('music.update');
    const { id } = await params;
    const body = await req.json();

    const parsed = musicReleaseSchema.parse(body);

    if (parsed.status === 'PUBLISHED' && !hasPermission(user, 'music.publish')) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to publish releases.' },
        { status: 403 }
      );
    }

    const db = await getDatabase();
    const query = buildIdQuery(id);

    const updateDoc = {
      ...parsed,
      updatedAt: new Date(),
    };

    const res = await db.collection('releases').updateOne(query, { $set: updateDoc });

    if (res.matchedCount === 0) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'RELEASE_UPDATED',
      resource: 'music',
      resourceId: id,
      metadata: { title: parsed.title, status: parsed.status },
    });

    return NextResponse.json({
      success: true,
      message: 'Release updated successfully.',
      release: { ...updateDoc, _id: id },
    });
  } catch (err: any) {
    if (err?.name === 'ZodError' || Array.isArray(err?.issues)) {
      const issue = err.issues?.[0];
      const message = issue ? `Validation error on '${issue.path?.join('.')}': ${issue.message}` : 'Validation error';
      return NextResponse.json({ error: message, issues: err.issues }, { status: 400 });
    }
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
    const user = await requirePermission('music.delete');
    const { id } = await params;

    const db = await getDatabase();
    const query = buildIdQuery(id);

    const existing = await db.collection('releases').findOne(query);
    if (!existing) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    await db.collection('releases').deleteOne(query);

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'RELEASE_DELETED',
      resource: 'music',
      resourceId: id,
      metadata: { title: existing.title },
    });

    return NextResponse.json({
      success: true,
      message: 'Release deleted successfully.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Deletion error' },
      { status: err.status || 400 }
    );
  }
}
