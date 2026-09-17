import { auth } from '@/app/(auth)/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

/**
 * Get current authenticated user session on the server side
 */
export async function getServerSession() {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });
    return session;
  } catch (error) {
    console.error('Error fetching server session:', error);
    return null;
  }
}

/**
 * Server-side guard requiring an authenticated user session.
 * Used in server components, API routes, and server actions.
 */
export async function requireUserAuth() {
  const session = await getServerSession();
  if (!session || !session.user) {
    return {
      user: null,
      session: null,
      response: NextResponse.json(
        { success: false, message: 'Unauthorized: Authentication required.' },
        { status: 401 }
      ),
    };
  }

  const status = (session.user as any).status;
  if (status === 'suspended' || status === 'banned') {
    return {
      user: null,
      session: null,
      response: NextResponse.json(
        { success: false, message: `Forbidden: Account is ${status}.` },
        { status: 403 }
      ),
    };
  }

  return {
    user: session.user as AuthenticatedUser,
    session,
    response: null,
  };
}

/**
 * Server-side guard requiring an ADMIN role user session.
 * Used in admin server components, admin API routes, and admin server actions.
 */
export async function requireAdminAuth() {
  const session = await getServerSession();
  if (!session || !session.user) {
    return {
      user: null,
      session: null,
      response: NextResponse.json(
        { success: false, message: 'Unauthorized: Authentication required.' },
        { status: 401 }
      ),
    };
  }

  const status = (session.user as any).status;
  if (status === 'suspended' || status === 'banned') {
    return {
      user: null,
      session: null,
      response: NextResponse.json(
        { success: false, message: `Forbidden: Account is ${status}.` },
        { status: 403 }
      ),
    };
  }

  const role = (session.user as any).role;
  if (role !== 'admin') {
    return {
      user: null,
      session: null,
      response: NextResponse.json(
        { success: false, message: 'Forbidden: Admin access required.' },
        { status: 403 }
      ),
    };
  }

  return {
    user: session.user as AuthenticatedUser,
    session,
    response: null,
  };
}
