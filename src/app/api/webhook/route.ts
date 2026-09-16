import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/app/(auth)/lib/stripe';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const metadata = session.metadata || {};
    const userId = metadata.userId;
    const planKey = metadata.planId || 'premium';

    try {
      const { db } = await connectToDatabase();
      
      const plans = await db.collection('plans').find({}).toArray();
      const targetPlan = plans.find(
        (p: any) =>
          p.slug === planKey ||
          p._id.toString() === planKey ||
          p.name.toLowerCase().includes(planKey.toLowerCase())
      );

      const targetPlanId = targetPlan?._id?.toString() || planKey;
      const targetPlanName = targetPlan?.name || (planKey.charAt(0).toUpperCase() + planKey.slice(1));

      let filter: any = null;
      if (userId) {
        filter = ObjectId.isValid(userId)
          ? { $or: [{ _id: new ObjectId(userId) }, { _id: userId }, { id: userId }] }
          : { $or: [{ _id: userId }, { id: userId }] };
      } else if (session.customer_details?.email || metadata.userEmail) {
        filter = { email: session.customer_details?.email || metadata.userEmail };
      }

      if (filter) {
        // 1. Update User Record
        const userDoc = await db.collection('user').findOneAndUpdate(
          filter,
          {
            $set: {
              planId: targetPlanId,
              plan: targetPlanName,
              updatedAt: new Date(),
            },
          },
          { returnDocument: 'after' }
        );

        // 2. Record Payment Entry
        const existingPayment = await db
          .collection('payments')
          .findOne({ stripeSessionId: session.id });

        if (!existingPayment) {
          const invoiceNum = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
          const amountPaid = session.amount_total
            ? `$${(session.amount_total / 100).toFixed(2)}`
            : '$14.99';

          // Extract resolved user ID from updated user or metadata
          const targetUserId = userDoc?._id?.toString() || userId || 'authenticated_user';

          await db.collection('payments').insertOne({
            userId: targetUserId,
            userEmail: session.customer_details?.email || metadata.userEmail || '',
            planId: targetPlanId,
            planName: targetPlanName,
            amount: amountPaid,
            status: 'Paid',
            stripeSessionId: session.id,
            invoiceId: invoiceNum,
            createdAt: new Date(),
          });
        }

        console.log(`[Stripe Webhook] Successfully updated user subscription & payment log for session ${session.id}`);
      }
    } catch (dbErr) {
      console.error('[Stripe Webhook] DB update error:', dbErr);
    }
  }

  return NextResponse.json({ received: true });
}
