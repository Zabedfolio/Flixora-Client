import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Check, ShieldCheck, Tv, Mail, ArrowRight } from 'lucide-react';

import { stripe } from '@/app/(auth)/lib/stripe';

interface SuccessProps {
  searchParams: Promise<{
    session_id?: string;
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
  // Payment information
  // -----------------------------------

  const customerEmail =
    session.customer_details?.email || 'Your Stripe billing email';

  const lineItem = session.line_items?.data?.[0];

  const planName = lineItem?.description || 'Flixora Subscription Plan';

  const amountPaid = lineItem?.amount_total
    ? `$${(lineItem.amount_total / 100).toFixed(2)}`
    : '$14.99';

  // -----------------------------------
  // JSX is OUTSIDE try/catch
  // -----------------------------------

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans flex items-center justify-center py-12 px-6 relative select-none">
      {/* Decorative background glows */}

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF4C00]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-900/40 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Card */}

      <main className="w-full max-w-xl bg-[#0A0A0A] border border-zinc-800/60 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(255,76,0,0.05)] relative overflow-hidden flex flex-col items-center text-center">
        {/* Neon border glow */}

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-linear-to-r from-transparent via-[#FF4C00] to-transparent shadow-[0_0_20px_#FF4C00]" />

        {/* Checkmark */}

        <div className="w-20 h-20 rounded-2xl bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00] mb-8 relative animate-pulse shadow-[0_0_30px_rgba(255,76,0,0.1)]">
          <Check size={38} strokeWidth={3} />
        </div>

        {/* Heading */}

        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-2">
          Subscription Activated!
        </h1>

        <p className="text-xs md:text-sm text-zinc-400 font-medium max-w-sm mb-8 leading-relaxed">
          Thank you! Your payment was processed successfully. You now have full
          access to stream your favorite movies and shows.
        </p>

        {/* Subscription Details */}

        <div className="w-full bg-[#111] border border-zinc-900 rounded-2xl p-6 text-left flex flex-col gap-4 mb-8">
          {/* Plan Details Header */}

          <div className="flex items-center justify-between border-b border-zinc-900 pb-3.5">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
              Plan Details
            </span>

            <span className="bg-[#FF4C00]/10 border border-[#FF4C00]/25 text-[#FF4C00] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
              Active
            </span>
          </div>

          {/* Plan */}

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-300 shrink-0">
              <Tv size={18} />
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-black text-white uppercase tracking-wide">
                {planName}
              </span>

              <span className="text-xs text-zinc-400 font-bold">
                {amountPaid} / month
              </span>
            </div>
          </div>

          {/* Receipt Email */}

          <div className="flex items-center gap-3 bg-zinc-950/50 border border-zinc-900/60 p-3 rounded-xl mt-1">
            <Mail size={15} className="text-zinc-500 shrink-0" />

            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[9px] text-zinc-500 font-black uppercase tracking-wider">
                Receipt Email
              </span>

              <span className="text-xs text-zinc-300 font-semibold truncate max-w-2xs">
                {customerEmail}
              </span>
            </div>
          </div>

          {/* Stripe Security */}

          <div className="flex items-center gap-2.5 mt-1 text-[10px] font-bold text-zinc-500">
            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />

            <span>Secured and powered by Stripe</span>
          </div>
        </div>

        {/* Buttons */}

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/dashboard"
            className="flex-1 bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#FF4C00]/10 outline-none"
          >
            Go To Dashboard
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>

          <Link
            href="/"
            className="flex-1 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-950/40 text-zinc-300 font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center outline-none"
          >
            Start Watching
          </Link>
        </div>
      </main>
    </div>
  );
}
