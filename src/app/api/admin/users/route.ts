import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission } from '@/lib/permissions/rbac';
import { hashPassword } from '@/lib/auth/password';
import { recordAuditLog } from '@/lib/audit/logger';
import { userCreateSchema } from '@/lib/validation/schemas';

export async function GET(req: NextRequest) {
  try {
    await requirePermission('users.view');
    const db = await getDatabase();
    const users = await db.collection('users')
      .find({})
      .project({ passwordHash: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      users: users.map((u) => ({ ...u, _id: u._id.toString() })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error fetching users' }, { status: err.status || 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const actor = await requirePermission('users.create');
    const body = await req.json();

    const parsed = userCreateSchema.parse(body);
    const db = await getDatabase();
    const usersCol = db.collection('users');

    const normalizedEmail = parsed.email.toLowerCase().trim();
    const existing = await usersCol.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(parsed.password);

    const docToInsert = {
      name: parsed.name,
      email: normalizedEmail,
      passwordHash: hashedPassword,
      roles: parsed.roles,
      status: parsed.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCol.insertOne(docToInsert);

    await recordAuditLog({
      userId: actor._id,
      userName: actor.name,
      action: 'USER_CREATED',
      resource: 'users',
      resourceId: result.insertedId.toString(),
      metadata: { email: normalizedEmail, roles: parsed.roles },
    });

    const { passwordHash: _, ...safeUser } = docToInsert;

    return NextResponse.json(
      {
        success: true,
        message: 'Team user created successfully.',
        user: { ...safeUser, _id: result.insertedId.toString() },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Creation error' }, { status: err.status || 400 });
  }
}
