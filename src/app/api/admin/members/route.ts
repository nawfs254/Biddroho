import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission } from '@/lib/permissions/rbac';
import { recordAuditLog } from '@/lib/audit/logger';
import { memberSchema } from '@/lib/validation/schemas';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requirePermission('members.view');
    const db = await getDatabase();
    const members = await db.collection('members')
      .find({})
      .sort({ displayOrder: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      members: members.map((m) => ({ ...m, _id: m._id.toString() })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Error fetching members' },
      { status: err.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requirePermission('members.create');
    const body = await req.json();

    const parsed = memberSchema.parse(body);
    const db = await getDatabase();
    const membersCol = db.collection('members');

    const docToInsert = {
      ...parsed,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await membersCol.insertOne(docToInsert);

    await recordAuditLog({
      userId: user._id,
      userName: user.name,
      action: 'MEMBER_ADDED',
      resource: 'members',
      resourceId: result.insertedId.toString(),
      metadata: { name: parsed.name, role: parsed.role },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Band member profile created.',
        member: { ...docToInsert, _id: result.insertedId.toString() },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Validation error' },
      { status: err.status || 400 }
    );
  }
}
