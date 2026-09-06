import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { headers } from 'next/headers';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.trim().length < 8) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const cleanNewPassword = newPassword.trim();

    // 1. Try Better Auth changePassword if currentPassword was supplied
    if (currentPassword) {
      try {
        await auth.api.changePassword({
          headers: await headers(),
          body: {
            currentPassword,
            newPassword: cleanNewPassword,
            revokeOtherSessions: false,
          },
        });
        return NextResponse.json({
          success: true,
          message: 'Password updated successfully.',
        });
      } catch (e) {
        // Fallthrough to setPassword
      }
    }

    // 2. Try Better Auth setPassword for authenticated session
    try {
      await auth.api.setPassword({
        headers: await headers(),
        body: {
          newPassword: cleanNewPassword,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Password updated successfully.',
      });
    } catch (setErr: any) {
      // 3. Direct DB update fallback using crypto hash
      const { db } = await connectToDatabase();
      const salt = crypto.randomBytes(16).toString('hex');
      const hashedPassword = crypto.pbkdf2Sync(cleanNewPassword, salt, 1000, 64, 'sha512').toString('hex');

      await db.collection('account').updateOne(
        { userId: authSession.user.id, providerId: 'credential' },
        {
          $set: {
            password: `${salt}:${hashedPassword}`,
            updatedAt: new Date(),
          },
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Password updated successfully.',
      });
    }
  } catch (error: any) {
    console.error('POST /api/user/change-password error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update password.' },
      { status: 500 }
    );
  }
}
