import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { comparePassword } from '@/lib/auth/password';
import { signSessionToken } from '@/lib/auth/jwt';
import { recordAuditLog } from '@/lib/audit/logger';
import { SESSION_COOKIE_NAME } from '@/lib/permissions/rbac';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await usersCollection.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Account is suspended or inactive. Please contact system admin.' },
        { status: 403 }
      );
    }

    const passwordMatch = await comparePassword(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Update lastLoginAt
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: new Date(), updatedAt: new Date() } }
    );

    // Sign JWT token
    const token = await signSessionToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      roles: user.roles || [],
    });

    // Audit log
    await recordAuditLog({
      userId: user._id.toString(),
      userName: user.name,
      action: 'USER_LOGIN',
      resource: 'auth',
      resourceId: user._id.toString(),
      metadata: { ip: req.headers.get('x-forwarded-for') || 'local' },
    });

    // Set HTTP-only Cookie
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        roles: user.roles,
        avatar: user.avatar || '',
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal authentication server error.' },
      { status: 500 }
    );
  }
}
