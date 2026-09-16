import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: Request) {
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
    const userId = authSession.user.id;

    const filter = ObjectId.isValid(userId)
      ? { $or: [{ _id: new ObjectId(userId) }, { _id: userId }] }
      : { _id: userId };

    const updatedUser = await db.collection('user').findOneAndUpdate(
      filter,
      {
        $set: {
          plan: '',
          planId: '',
          subscriptionStatus: 'cancelled',
          isActive: false,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    await db.collection('payments').updateMany(
      { userId, status: 'Paid' },
      { $set: { status: 'Cancelled', updatedAt: new Date() } }
    );

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: updatedUser,
    });
  } catch (error: any) {
    console.error('POST /api/subscription/cancel error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
