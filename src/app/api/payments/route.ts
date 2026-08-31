import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/app/(auth)/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers()
    });

    if (!authSession?.user?.id) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized'
      }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    // Fetch payments for the authenticated user, sorted by newest first
    const payments = await db.collection('payments')
      .find({ userId: authSession.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    // Map database fields to the frontend BillingRecord format
    const formattedPayments = payments.map((p: any) => ({
      id: p._id.toString(),
      date: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      amount: p.amount,
      status: p.status,
      planId: p.planId,
      invoiceId: p.invoiceId
    }));

    return NextResponse.json({
      success: true,
      data: formattedPayments
    });
  } catch (error: any) {
    console.error('GET /api/payments error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch billing history'
    }, { status: 500 });
  }
}
