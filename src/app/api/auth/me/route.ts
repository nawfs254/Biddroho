import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/permissions/rbac';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    user,
  });
}
