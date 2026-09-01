import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Check, ShieldCheck, Tv, Mail, ArrowRight } from 'lucide-react';
import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';

import { stripe } from '@/app/(auth)/lib/stripe';
import { auth } from '@/app/(auth)/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';

interface SuccessProps {
  searchParams: Promise<{
    session_id?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function Success({ searchParams }: SuccessProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  // -----------------------------------
  // Validate session ID
  // -----------------------------------
  if (!sessionId) {
    redirect('/cancel?error=Missing%20payment%20session%20ID');
  }

  // -----------------------------------
  // Retrieve Stripe session
  // -----------------------------------
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    });
  } catch (error) {
    console.error('Error fetching Stripe session:', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to verify payment session';
    redirect(`/cancel?error=${encodeURIComponent(message)}`);
  }

  // -----------------------------------
  // Stripe session validation
  // -----------------------------------
  if (session.status === 'open') {
    redirect('/');
  }

  if (session.status !== 'complete') {
    redirect(
      `/cancel?error=${encodeURIComponent(
        `Subscription payment status is ${session.status}`,
      )}`,
    );
  }

  // -----------------------------------
  // Fetch active user session details
  // -----------------------------------
  const authSession = await auth.api.getSession({
    headers: await headers(),
  });

  const userName = authSession?.user?.name || 'User';
  const userAvatar = authSession?.user?.image || null;

  // -----------------------------------
  // Retrieve plan details from DB
  // -----------------------------------
  const { db } = await connectToDatabase();
  const plans = await db.collection('plans').find({}).toArray();

  const fromPlanId = params.from || '';
  const toPlanId = params.to || '';

  const fromPlan = plans.find(
    (p: any) =>
      p.slug === fromPlanId ||
      p._id.toString() === fromPlanId ||
      p.name.toLowerCase() === fromPlanId.toLowerCase(),
  );
  const toPlan = plans.find(
    (p: any) =>
      p.slug === toPlanId ||
      p._id.toString() === toPlanId ||
      p.name.toLowerCase() === toPlanId.toLowerCase(),
  );

  const fromPlanName = fromPlan?.name || 'Basic';
  const toPlanName = toPlan?.name || 'Premium';

  // -----------------------------------
  // Payment information
  // -----------------------------------
  const customerEmail =
    session.customer_details?.email || 'Your Stripe billing email';
  const lineItem = session.line_items?.data?.[0];
  const amountPaid = lineItem?.amount_total
    ? `$${(lineItem.amount_total / 100).toFixed(2)}`
    : '$14.99';

  // -----------------------------------
  // Update User Plan & Record Payment in MongoDB
  // -----------------------------------
  if (authSession?.user?.id && toPlan) {
    try {
      // 1. Update user active planId
      await db.collection('user').updateOne(
        { _id: new ObjectId(authSession.user.id) },
        {
          $set: {
            planId: toPlan._id.toString(),
            plan: toPlan.name,
            updatedAt: new Date(),
          },
        },
      );

      // 2. Log payment details in payments collection if not already recorded
      const existingPayment = await db
        .collection('payments')
        .findOne({ stripeSessionId: sessionId });
      if (!existingPayment) {
        const invoiceNum = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;

        await db.collection('payments').insertOne({
          userId: authSession.user.id,
          planId: toPlan._id.toString(),
          amount: amountPaid,
          status: 'Paid',
          stripeSessionId: sessionId,
          invoiceId: invoiceNum,
          createdAt: new Date(),
        });
      }
    } catch (dbErr) {
      console.error('Error updating user plan or recording payment:', dbErr);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans flex items-center justify-center pt-24 pb-12 px-4 relative select-none">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF4C00]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-900/40 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Card */}
      <main className="w-full max-w-md bg-[#0A0A0A] border border-zinc-800/60 rounded-2xl p-6 shadow-[0_0_50px_rgba(255,76,0,0.04)] relative overflow-hidden flex flex-col items-center text-center">
        {/* Neon border glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#FF4C00] to-transparent shadow-[0_0_20px_#FF4C00]" />

        {/* Checkmark */}
        <div className="w-14 h-14 rounded-xl bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00] mb-4 relative animate-pulse shadow-[0_0_30px_rgba(255,76,0,0.1)]">
          <Check size={26} strokeWidth={3} />
        </div>

        {/* Heading */}
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-1.5">
          Subscription Upgraded!
        </h1>
        <p className="text-xs text-zinc-400 font-medium max-w-xs mb-4 leading-relaxed">
          Your payment was processed successfully. Enjoy streaming in high
          quality resolution!
        </p>

        {/* User Card */}
        <div className="flex items-center gap-3 bg-[#111]/45 border border-zinc-900/60 px-4 py-2 rounded-xl mb-4 w-full max-w-xs justify-center">
          {userAvatar ? (
            <Image
              src={userAvatar}
              alt={userName}
              width={28}
              height={28}
              className="rounded-full border border-[#FF4C00] object-cover shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-zinc-900 border border-[#FF4C00] flex items-center justify-center font-bold text-white text-[10px] shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col text-left">
            <span className="text-[7px] text-zinc-500 font-black uppercase tracking-wider">
              Account User
            </span>
            <span className="text-xs font-black text-white leading-tight">
              {userName}
            </span>
          </div>
        </div>

        {/* Plan Upgrade Visual Flow */}
        <div className="flex items-center justify-between gap-4 mb-4 bg-[#111] border border-zinc-900 p-3 rounded-xl w-full max-w-sm text-center">
          <div className="flex flex-col flex-1">
            <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">
              Previous Plan
            </span>
            <span className="text-[11px] font-black text-zinc-400 mt-0.5 uppercase tracking-wide">
              {fromPlanName}
            </span>
          </div>
          <div className="text-[#FF4C00] font-black animate-pulse flex items-center shrink-0">
            ➔
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[8px] text-[#FF4C00] font-bold uppercase tracking-wider">
              Active Plan
            </span>
            <span className="text-[11px] font-black text-white mt-0.5 uppercase tracking-wide">
              {toPlanName}
            </span>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="w-full bg-[#111] border border-zinc-900 rounded-xl p-4 text-left flex flex-col gap-3 mb-6">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
              Billing Summary
            </span>
            <span className="bg-[#FF4C00]/10 border border-[#FF4C00]/25 text-[#FF4C00] text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
              Active
            </span>
          </div>

          {/* Plan Cost */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-300 shrink-0">
              <Tv size={15} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-black text-white uppercase tracking-wide">
                Flixora {toPlanName} Plan
              </span>
              <span className="text-[10px] text-zinc-400 font-bold">
                {amountPaid} / month
              </span>
            </div>
          </div>

          {/* Receipt Email */}
          <div className="flex items-center gap-3 bg-zinc-950/50 border border-zinc-900/60 p-2.5 rounded-lg">
            <Mail size={13} className="text-zinc-500 shrink-0" />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[8px] text-zinc-500 font-black uppercase tracking-wider">
                Receipt Email
              </span>
              <span className="text-xs text-zinc-300 font-semibold truncate max-w-2xs">
                {customerEmail}
              </span>
            </div>
          </div>

          {/* Stripe Security */}
          <div className="flex items-center gap-2 mt-0.5 text-[9px] font-bold text-zinc-500">
            <ShieldCheck size={12} className="text-emerald-500 shrink-0" />
            <span>Secured and powered by Stripe</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full">
          <Link
            href="/dashboard"
            className="flex-1 bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-[11px] uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#FF4C00]/10 outline-none"
          >
            Go To Dashboard
            <ArrowRight size={12} strokeWidth={2.5} />
          </Link>
          <Link
            href="/"
            className="flex-1 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-950/40 text-zinc-300 font-bold text-[11px] uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center outline-none"
          >
            Start Watching
          </Link>
        </div>
      </main>
    </div>
  );
}
