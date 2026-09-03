import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const userDoc = await db
      .collection('user')
      .findOne({ _id: new ObjectId(authSession.user.id) });

    if (!userDoc) {
      return NextResponse.json(
        { success: false, message: 'User profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userDoc._id.toString(),
        name: userDoc.name || authSession.user.name,
        email: userDoc.email || authSession.user.email,
        image: userDoc.image || authSession.user.image || null,
        avatarId: userDoc.avatarId || null,
        role: userDoc.role || 'user',
        plan: userDoc.plan || '',
        planId: userDoc.planId || '',
        createdAt: userDoc.createdAt,
        updatedAt: userDoc.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('GET /api/user/profile error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
