import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission } from '@/lib/permissions/rbac';
import { recordAuditLog } from '@/lib/audit/logger';
import { PERMISSIONS_LIST } from '@/lib/permissions/definitions';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requirePermission('roles.view');
    const db = await getDatabase();
    const roles = await db.collection('roles').find({}).toArray();

    // Count users per role
    const users = await db.collection('users').find({}).toArray();
    const roleCounts: Record<string, number> = {};

    for (const u of users) {
      if (Array.isArray(u.roles)) {
        for (const r of u.roles) {
          roleCounts[r] = (roleCounts[r] || 0) + 1;
        }
      }
    }

    const enhancedRoles = roles.map((r) => ({
      ...r,
      _id: r._id.toString(),
      userCount: roleCounts[r.name] || 0,
    }));

    return NextResponse.json({
      success: true,
      roles: enhancedRoles,
      availablePermissions: PERMISSIONS_LIST,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error fetching roles' }, { status: err.status || 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const actor = await requirePermission('roles.update');
    const body = await req.json();
    const { roleName, permissions } = body;

    if (!roleName || !Array.isArray(permissions)) {
      return NextResponse.json({ error: 'Role name and permissions array are required.' }, { status: 400 });
    }

    if (roleName === 'ADMIN' && !permissions.includes('*') && permissions.length < PERMISSIONS_LIST.length) {
      return NextResponse.json({ error: 'Cannot revoke core system privileges from the ADMIN role.' }, { status: 400 });
    }

    const db = await getDatabase();
    const res = await db.collection('roles').updateOne(
      { name: roleName },
      { $set: { permissions: permissions, updatedAt: new Date() } }
    );

    if (res.matchedCount === 0) {
      return NextResponse.json({ error: 'Role not found.' }, { status: 404 });
    }

    await recordAuditLog({
      userId: actor._id,
      userName: actor.name,
      action: 'ROLE_PERMISSIONS_UPDATED',
      resource: 'roles',
      resourceId: roleName,
      metadata: { roleName, permissionsCount: permissions.length },
    });

    return NextResponse.json({
      success: true,
      message: `Permissions updated for role ${roleName}.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error updating role' }, { status: err.status || 400 });
  }
}
