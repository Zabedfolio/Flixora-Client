import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve session token from cookies (Edge-compatible)
  const sessionToken =
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('__Secure-better-auth.session_token')?.value;

  // 1. ADMIN DASHBOARD ROUTE PROTECTION (/admin and /admin/*)
  if (pathname.startsWith('/admin')) {
    if (!sessionToken) {
      const accessDeniedUrl = new URL('/access-denied', request.url);
      accessDeniedUrl.searchParams.set('reason', 'unauthenticated');
      accessDeniedUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(accessDeniedUrl);
    }

    try {
      // Fetch session from Node.js API route to verify admin role
      const sessionRes = await fetch(new URL('/api/auth/get-session', request.url), {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });

      if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        const user = sessionData?.user;

        if (!user) {
          const accessDeniedUrl = new URL('/access-denied', request.url);
          accessDeniedUrl.searchParams.set('reason', 'unauthenticated');
          accessDeniedUrl.searchParams.set('callbackUrl', pathname);
          return NextResponse.redirect(accessDeniedUrl);
        }

        if (user.role !== 'admin') {
          // Logged-in non-admin trying to breach admin dashboard -> redirect to production-level access-denied page
          const accessDeniedUrl = new URL('/access-denied', request.url);
          accessDeniedUrl.searchParams.set('reason', 'admin_required');
          accessDeniedUrl.searchParams.set('callbackUrl', pathname);
          return NextResponse.redirect(accessDeniedUrl);
        }
      } else {
        const accessDeniedUrl = new URL('/access-denied', request.url);
        accessDeniedUrl.searchParams.set('reason', 'unauthenticated');
        accessDeniedUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(accessDeniedUrl);
      }
    } catch (err) {
      console.error('[Middleware Admin Check Error]:', err);
    }
  }

  // 2. USER DASHBOARD ROUTE PROTECTION (/dashboard and /dashboard/*)
  if (pathname.startsWith('/dashboard')) {
    if (!sessionToken) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. ADMIN API PROTECTION (/api/admin/*)
  if (pathname.startsWith('/api/admin')) {
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Authentication required.' },
        { status: 401 }
      );
    }

    try {
      const sessionRes = await fetch(new URL('/api/auth/get-session', request.url), {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });

      if (!sessionRes.ok) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized: Invalid session.' },
          { status: 401 }
        );
      }

      const sessionData = await sessionRes.json();
      const user = sessionData?.user;

      if (!user || user.role !== 'admin') {
        return NextResponse.json(
          { success: false, message: 'Forbidden: Admin access required.' },
          { status: 403 }
        );
      }
    } catch (err) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Authentication error.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/api/admin/:path*'],
};
