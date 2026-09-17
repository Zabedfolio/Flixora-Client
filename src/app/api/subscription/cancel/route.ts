import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Authentication required.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const cancelReason = (body.cancelReason || '').trim() || 'User requested cancellation';

    const { db } = await connectToDatabase();
    const rawId = authSession.user.id;
    const filter = ObjectId.isValid(rawId)
      ? { $or: [{ _id: new ObjectId(rawId) }, { _id: rawId }] }
      : { _id: rawId };

    // 1. Update user document to reset plan to "No Plan"
    const updateResult = await db.collection('user').updateOne(filter, {
      $set: {
        plan: 'No Plan',
        planId: '',
        subscriptionExpiresAt: '',
        cancelledAt: new Date().toISOString(),
        cancelReason: cancelReason,
        updatedAt: new Date(),
      },
    });

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'User account not found' },
        { status: 404 }
      );
    }

    // 2. Insert cancellation entry into payments history
    await db.collection('payments').insertOne({
      userId: rawId,
      planId: '',
      planName: 'No Plan',
      amount: '$0.00',
      status: 'Cancelled',
      cancelReason: cancelReason,
      invoiceId: `CANCEL-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully. Your plan has shifted to No Plan.',
      user: {
        id: rawId,
        plan: 'No Plan',
        planId: '',
      },
    });
  } catch (error: any) {
    console.error('POST /api/subscription/cancel error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
