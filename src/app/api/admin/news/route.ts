import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission, hasPermission } from '@/lib/permissions/rbac';
import { recordAuditLog } from '@/lib/audit/logger';
import { newsSchema } from '@/lib/validation/schemas';

export async function GET(req: NextRequest) {
  try {
    await requirePermission('news.view');
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    const db = await getDatabase();
    const query: any = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    const newsList = await db.collection('news')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      news: newsList.map((n) => ({ ...n, _id: n._id.toString() })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Error fetching news' },
      { status: err.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requirePermission('news.create');
    const body = await req.json();

    const parsed = newsSchema.parse(body);

    if (parsed.status === 'PUBLISHED' && !hasPermission(user, 'news.publish')) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to publish news. Save as DRAFT instead.' },
        { status: 403 }
      );
    }

    const db = await getDatabase();
    const newsCol = db.collection('news');

    const existing = await newsCol.findOne({ slug: parsed.slug });
    if (existing) {
      return NextResponse.json(
        { error: `An article with slug "${parsed.slug}" already exists.` },
        { status: 400 }
      );
    }

    const docToInsert = {
      ...parsed,
      author: user.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await newsCol.insertOne(docToInsert);

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'NEWS_CREATED',
      resource: 'news',
      resourceId: result.insertedId.toString(),
      metadata: { title: parsed.title, slug: parsed.slug, status: parsed.status },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'News article created successfully.',
        news: { ...docToInsert, _id: result.insertedId.toString() },
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
