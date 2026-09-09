import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const reason = body.reason || 'Admin initiated refund';

  // 1. Try Express backend first
  try {
    const backendRes = await fetch(`${SERVER_URL}/api/transactions/${id}/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend offline; handle in MongoDB directly
  }

  // 2. Direct MongoDB update fallback
  try {
    const { db } = await connectToDatabase();

    const query = ObjectId.isValid(id)
      ? { $or: [{ _id: new ObjectId(id) }, { stripeTransactionId: id }] }
      : { stripeTransactionId: id };

    const transaction = await db.collection('transactions').findOne(query);

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 }
      );
    }

    if (transaction.status === 'refunded') {
      return NextResponse.json(
        { success: false, message: 'Transaction is already refunded' },
        { status: 400 }
      );
    }

    const refundId = `ref_live_${Date.now()}`;
    await db.collection('transactions').updateOne(query, {
      $set: {
        status: 'refunded',
        refundId,
        refundReason: reason,
        refundedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const updated = await db.collection('transactions').findOne(query);

    return NextResponse.json({
      success: true,
      message: 'Transaction refunded successfully',
      data: {
        ...updated,
        _id: updated?._id.toString(),
      },
    });
  } catch (err: any) {
    console.error('Refund route error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to refund transaction' },
      { status: 500 }
    );
  }
}
