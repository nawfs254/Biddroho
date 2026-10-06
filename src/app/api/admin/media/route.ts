import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission } from '@/lib/permissions/rbac';
import { recordAuditLog } from '@/lib/audit/logger';

export async function GET(req: NextRequest) {
  try {
    await requirePermission('media.view');
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || '';
    const category = searchParams.get('category') || '';

    const db = await getDatabase();
    const query: any = {};
    if (type) query.type = type;
    if (category) query.category = category;

    const mediaList = await db.collection('media').find(query).toArray();

    return NextResponse.json({
      success: true,
      media: mediaList.map((m) => ({ ...m, _id: m._id.toString() })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error fetching media' }, { status: err.status || 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requirePermission('media.upload');
    const body = await req.json();

    const { title, type, category, url, thumbnailUrl, caption, location, youtubeId } = body;

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required.' }, { status: 400 });
    }

    const db = await getDatabase();
    const docToInsert = {
      id: `media-${Date.now()}`,
      title,
      type: type || 'photo',
      category: category || 'live',
      url,
      thumbnailUrl: thumbnailUrl || url,
      caption: caption || '',
      location: location || '',
      youtubeId: youtubeId || '',
      createdAt: new Date(),
    };

    const res = await db.collection('media').insertOne(docToInsert);

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'MEDIA_ADDED',
      resource: 'media',
      resourceId: res.insertedId.toString(),
      metadata: { title, type },
    });

    return NextResponse.json({
      success: true,
      media: { ...docToInsert, _id: res.insertedId.toString() },
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error adding media' }, { status: err.status || 400 });
  }
}
