import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getDatabase } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/permissions/rbac';
import { recordAuditLog } from '@/lib/audit/logger';

export const dynamic = 'force-dynamic';

// Max file size: 15MB
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Session required for media uploads.' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file received in upload request.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Allowed formats: JPG, PNG, WebP, GIF, SVG.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds 15MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB provided).` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize extension and base filename
    const ext = path.extname(file.name).toLowerCase() || '.jpg';
    const cleanBase = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 40);

    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const finalFilename = `${cleanBase || 'media'}-${uniqueId}${ext}`;

    // 1. Primary Storage: Store buffer in MongoDB (Works everywhere, including Vercel serverless)
    const db = await getDatabase();
    await db.collection('media_files').updateOne(
      { filename: finalFilename },
      {
        $set: {
          filename: finalFilename,
          category,
          contentType: file.type,
          data: buffer,
          size: file.size,
          originalName: file.name,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    // 2. Secondary Storage: Attempt local disk cache if filesystem is writable
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', category);
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, finalFilename);
      await writeFile(filePath, buffer);
    } catch {
      // Expected in serverless/Vercel (EROFS read-only filesystem).
      // File is safely stored in MongoDB and served by Next.js /api/uploads rewrite.
    }

    const publicUrl = `/uploads/${category}/${finalFilename}`;

    // Audit log
    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'MEDIA_UPLOADED',
      resource: 'media',
      resourceId: finalFilename,
      metadata: {
        originalName: file.name,
        size: file.size,
        mimeType: file.type,
        category,
        url: publicUrl,
      },
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: finalFilename,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error: any) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error processing file upload.' },
      { status: 500 }
    );
  }
}
