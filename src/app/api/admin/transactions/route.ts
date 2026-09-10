import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || 'https://flixora-server.vercel.app';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.max(1, Math.min(100, Number(searchParams.get('limit')) || 10));
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';

  // 1. Try Express backend first
  try {
    const query = searchParams.toString();
    const backendRes = await fetch(`${SERVER_URL}/api/transactions?${query}`, {
      cache: 'no-store',
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend offline; query MongoDB directly
  }

  // 2. Direct MongoDB fallback
  try {
    const { db } = await connectToDatabase();

    const filter: Record<string, any> = {};

    if (status && status !== 'all') {
      filter.status = status.toLowerCase();
    }

    if (search.trim()) {
      filter.$or = [
        { stripeTransactionId: { $regex: search.trim(), $options: 'i' } },
        { userEmail: { $regex: search.trim(), $options: 'i' } },
        { invoiceId: { $regex: search.trim(), $options: 'i' } },
        { userName: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    let [transactions, total] = await Promise.all([
      db.collection('transactions').find(filter).sort({ date: -1 }).skip(skip).limit(limit).toArray(),
      db.collection('transactions').countDocuments(filter),
    ]);

    // If transactions collection is empty, check payments collection
    if (total === 0) {
      const payments = await db.collection('payments').find({}).sort({ createdAt: -1 }).toArray();
      if (payments.length > 0) {
        // Seed transactions from payments
        const mapped = payments.map((p: any, i: number) => ({
          stripeTransactionId: p.stripeSessionId || `pi_seed_${i + 1}`,
          userId: p.userId || 'usr_demo',
          userEmail: p.userEmail || `user_${i + 1}@flixora.tv`,
          userName: `User ${i + 1}`,
          planName: p.planName || 'Standard',
          amount: parseFloat((p.amount || '$11.99').replace(/[^0-9.]/g, '')) || 11.99,
          currency: 'USD',
          status: (p.status === 'Paid' ? 'success' : 'failed'),
          date: p.createdAt ? new Date(p.createdAt) : new Date(),
          invoiceId: p.invoiceId || `INV-2026-${1000 + i}`,
          paymentMethod: p.paymentMethod || 'Card (Stripe)',
        }));
        await db.collection('transactions').insertMany(mapped);
        transactions = await db.collection('transactions').find(filter).sort({ date: -1 }).skip(skip).limit(limit).toArray();
        total = await db.collection('transactions').countDocuments(filter);
      }
    }

    const formatted = transactions.map((t: any) => ({
      ...t,
      _id: t._id.toString(),
      date: t.date ? new Date(t.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    }));

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      success: true,
      data: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
      summary: {
        totalRevenue: formatted.reduce((acc: number, t: any) => acc + (t.status === 'success' ? t.amount : 0), 0),
        successfulCount: formatted.filter((t: any) => t.status === 'success').length,
        refundedCount: formatted.filter((t: any) => t.status === 'refunded').length,
        failedCount: formatted.filter((t: any) => t.status === 'failed').length,
      },
    });
  } catch (err: any) {
    console.error('Transactions route error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Transactions error' },
      { status: 500 }
    );
  }
}
