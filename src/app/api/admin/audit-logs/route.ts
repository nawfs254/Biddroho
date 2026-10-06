import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission } from '@/lib/permissions/rbac';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requirePermission('audit.view');
    const { searchParams } = new URL(req.url);
    const resource = searchParams.get('resource') || '';
    const action = searchParams.get('action') || '';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const db = await getDatabase();
    const query: any = {};
    if (resource) query.resource = resource;
    if (action) query.action = action;

    const logs = await db.collection('audit_logs')
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      logs: logs.map((l) => ({ ...l, _id: l._id.toString() })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error fetching audit logs' }, { status: err.status || 500 });
  }
}
