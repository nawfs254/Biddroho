import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    if (!pathSegments || pathSegments.length === 0) {
      return new NextResponse('File not found', { status: 404 });
    }

    const filename = pathSegments[pathSegments.length - 1];
    const db = await getDatabase();
    const fileDoc = await db.collection('media_files').findOne({ filename });

    if (!fileDoc || !fileDoc.data) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Convert BSON Binary to Buffer if needed
    const buffer = Buffer.isBuffer(fileDoc.data)
      ? fileDoc.data
      : fileDoc.data.buffer
      ? Buffer.from(fileDoc.data.buffer)
      : Buffer.from(fileDoc.data);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': fileDoc.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving media file from MongoDB:', error);
    return new NextResponse('Error retrieving media file', { status: 500 });
  }
}
