import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'biddroho_super_secret_production_key_2026_jwt_auth_rock_band';
const key = new TextEncoder().encode(JWT_SECRET);
const SESSION_COOKIE = 'biddroho_admin_session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle /admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    let isAuthenticated = false;

    if (token) {
      try {
        await jwtVerify(token, key, { algorithms: ['HS256'] });
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }
    }

    // If trying to access /admin/login while already authenticated, redirect to /admin/dashboard
    if (pathname === '/admin/login') {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.next();
    }

    // For /admin root, redirect to dashboard if authenticated or login if not
    if (pathname === '/admin') {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }

    // For all other /admin/* routes, require authentication
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
