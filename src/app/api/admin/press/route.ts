import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission } from '@/lib/permissions/rbac';
import { recordAuditLog } from '@/lib/audit/logger';

export async function GET() {
  try {
    await requirePermission('press.view');
    const db = await getDatabase();
    const releases = await db.collection('press_releases').find({}).sort({ date: -1 }).toArray();

    return NextResponse.json({
      success: true,
      pressReleases: releases.map((p) => ({ ...p, _id: p._id.toString() })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error fetching press' }, { status: err.status || 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requirePermission('press.create');
    const body = await req.json();
    const { title, slug, excerpt, content, coverImage, status, pdfUrl } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required.' }, { status: 400 });
    }

    const db = await getDatabase();
    const docToInsert = {
      title,
      slug,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      excerpt: excerpt || '',
      content,
      coverImage: coverImage || '/assets/hero_live.jpg',
      pdfUrl: pdfUrl || '',
      status: status || 'PUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await db.collection('press_releases').insertOne(docToInsert);

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'PRESS_RELEASE_CREATED',
      resource: 'press',
      resourceId: res.insertedId.toString(),
      metadata: { title, slug },
    });

    return NextResponse.json({
      success: true,
      pressRelease: { ...docToInsert, _id: res.insertedId.toString() },
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error creating press release' }, { status: err.status || 400 });
  }
}
