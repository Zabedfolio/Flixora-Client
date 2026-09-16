import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './app/(auth)/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const user = session?.user;

    // 1. ADMIN DASHBOARD ROUTE PROTECTION (/admin and /admin/*)
    if (pathname.startsWith('/admin')) {
      if (!user) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }

      if ((user as any).role !== 'admin') {
        // Logged-in non-admin user trying to access admin dashboard -> redirect to user dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // 2. USER DASHBOARD ROUTE PROTECTION (/dashboard and /dashboard/*)
    if (pathname.startsWith('/dashboard')) {
      if (!user) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // 3. ADMIN API PROTECTION (/api/admin/*)
    if (pathname.startsWith('/api/admin')) {
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized: Authentication required.' },
          { status: 401 }
        );
      }

      if ((user as any).role !== 'admin') {
        return NextResponse.json(
          { success: false, message: 'Forbidden: Admin access required.' },
          { status: 403 }
        );
      }
    }
  } catch (err) {
    console.error('[Next.js Middleware Auth Error]:', err);
    if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Authentication validation error.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/api/admin/:path*'],
};
