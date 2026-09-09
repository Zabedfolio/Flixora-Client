import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/app/(auth)/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    const { db } = await connectToDatabase();

    const userFilter: any[] = [{ userId: authSession.user.id }];
    if (authSession.user.email) {
      userFilter.push({ userEmail: authSession.user.email });
      userFilter.push({ userId: authSession.user.email });
    }

    // Fetch payments for the authenticated user, sorted by newest first
    const payments = await db
      .collection('payments')
      .find({ $or: userFilter })
      .sort({ createdAt: -1 })
      .toArray();

    // Map database fields to the frontend BillingRecord format
    const formattedPayments = payments.map((p: any) => ({
      _id: p._id.toString(),
      id: p._id.toString(),
      userId: p.userId,
      date: p.createdAt
        ? new Date(p.createdAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      amount: p.amount,
      status: p.status,
      planId: p.planId,
      invoiceId:
        p.invoiceId || `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    }));

    return NextResponse.json({
      success: true,
      data: formattedPayments,
    });
  } catch (error: any) {
    console.error('GET /api/payments error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch billing history',
      },
      { status: 500 },
    );
  }
}
