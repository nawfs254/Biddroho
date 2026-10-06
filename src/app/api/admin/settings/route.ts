import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission } from '@/lib/permissions/rbac';
import { recordAuditLog } from '@/lib/audit/logger';

export async function GET() {
  try {
    await requirePermission('settings.view');
    const db = await getDatabase();
    const settings = await db.collection('settings').findOne({ key: 'band_settings' });

    return NextResponse.json({
      success: true,
      settings: settings || {},
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error fetching settings' }, { status: err.status || 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requirePermission('settings.update');
    const body = await req.json();

    const db = await getDatabase();
    const { _id, key, ...rest } = body;

    // Ensure connectLinks are well-formed with unique IDs
    if (Array.isArray(rest.connectLinks)) {
      rest.connectLinks = rest.connectLinks.map((item: any, i: number) => ({
        id: item.id || `link_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}`,
        label: String(item.label || '').trim(),
        url: String(item.url || '').trim(),
      }));
    }

    const updateDoc: any = {
      ...rest,
      key: 'band_settings',
      updatedAt: new Date(),
    };

    // Clean up legacy URL fields so they never conflict with dynamic connectLinks
    delete updateDoc.spotifyUrl;
    delete updateDoc.appleMusicUrl;
    delete updateDoc.youtubeUrl;
    delete updateDoc.youtubeMusicUrl;
    delete updateDoc.facebookUrl;
    delete updateDoc.instagramUrl;
    delete updateDoc.bandcampUrl;

    await db.collection('settings').updateOne(
      { key: 'band_settings' },
      {
        $set: updateDoc,
        $unset: {
          spotifyUrl: '',
          appleMusicUrl: '',
          youtubeUrl: '',
          youtubeMusicUrl: '',
          facebookUrl: '',
          instagramUrl: '',
          bandcampUrl: '',
        },
      },
      { upsert: true }
    );

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'SETTINGS_UPDATED',
      resource: 'settings',
      resourceId: 'band_settings',
    });

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully.',
      connectLinks: updateDoc.connectLinks,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error updating settings' }, { status: err.status || 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requirePermission('settings.update');
    const { searchParams } = new URL(req.url);
    const linkId = searchParams.get('id');
    const linkIndex = searchParams.get('index');

    const db = await getDatabase();
    const settings = await db.collection('settings').findOne({ key: 'band_settings' });

    if (!settings || !Array.isArray(settings.connectLinks)) {
      return NextResponse.json({ success: true, message: 'No links to delete.', connectLinks: [] });
    }

    let updatedLinks = [...settings.connectLinks];

    if (linkId) {
      updatedLinks = updatedLinks.filter((item: any) => item.id !== linkId);
    } else if (linkIndex !== null && !isNaN(Number(linkIndex))) {
      const idx = Number(linkIndex);
      if (idx >= 0 && idx < updatedLinks.length) {
        updatedLinks.splice(idx, 1);
      }
    }

    await db.collection('settings').updateOne(
      { key: 'band_settings' },
      {
        $set: { connectLinks: updatedLinks, updatedAt: new Date() },
        $unset: {
          spotifyUrl: '',
          appleMusicUrl: '',
          youtubeUrl: '',
          youtubeMusicUrl: '',
          facebookUrl: '',
          instagramUrl: '',
          bandcampUrl: '',
        },
      }
    );

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'SETTINGS_LINK_DELETED',
      resource: 'settings',
      resourceId: linkId || `index_${linkIndex}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Platform button deleted from backend successfully.',
      connectLinks: updatedLinks,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error deleting link' }, { status: err.status || 400 });
  }
}
