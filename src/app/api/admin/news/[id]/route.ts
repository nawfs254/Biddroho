import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission, hasPermission } from '@/lib/permissions/rbac';
import { recordAuditLog } from '@/lib/audit/logger';
import { newsSchema } from '@/lib/validation/schemas';

import { buildIdQuery } from '@/lib/db/query';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission('news.view');
    const { id } = await params;
    const db = await getDatabase();
    const article = await db.collection('news').findOne(buildIdQuery(id));

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      news: { ...article, _id: article._id.toString() },
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
    const user = await requirePermission('news.update');
    const { id } = await params;
    const body = await req.json();

    const parsed = newsSchema.parse(body);

    if (parsed.status === 'PUBLISHED' && !hasPermission(user, 'news.publish')) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to publish news.' },
        { status: 403 }
      );
    }

    const db = await getDatabase();
    const query = buildIdQuery(id);

    const updateDoc = {
      ...parsed,
      updatedAt: new Date(),
    };

    const res = await db.collection('news').updateOne(query, { $set: updateDoc });

    if (res.matchedCount === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'NEWS_UPDATED',
      resource: 'news',
      resourceId: id,
      metadata: { title: parsed.title, status: parsed.status },
    });

    return NextResponse.json({
      success: true,
      message: 'Article updated successfully.',
      news: { ...updateDoc, _id: id },
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
    const user = await requirePermission('news.delete');
    const { id } = await params;

    const db = await getDatabase();
    const query = buildIdQuery(id);

    const existing = await db.collection('news').findOne(query);
    if (!existing) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    await db.collection('news').deleteOne(query);

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'NEWS_DELETED',
      resource: 'news',
      resourceId: id,
      metadata: { title: existing.title },
    });

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Deletion error' },
      { status: err.status || 400 }
    );
  }
}
