'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, ShieldCheck, Tv, Mail, ArrowRight, Loader2 } from 'lucide-react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionId = searchParams.get('session_id') || '';
  const fromPlanParam = searchParams.get('from') || 'Basic';
  const toPlanParam = searchParams.get('to') || 'Premium';

  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [details, setDetails] = useState<{
    userName: string;
    userEmail: string;
    userAvatar: string | null;
    fromPlanName: string;
    toPlanName: string;
    amountPaid: string;
  }>({
    userName: 'Subscriber',
    userEmail: 'customer@flixora.tv',
    userAvatar: null,
    fromPlanName: fromPlanParam,
    toPlanName: toPlanParam,
    amountPaid: '$14.99',
  });

  // 1. Verify payment session via API
  useEffect(() => {
    let isMounted = true;

    async function verifyPayment() {
      try {
        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            from: fromPlanParam,
            to: toPlanParam,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.data && isMounted) {
            setDetails({
              userName: json.data.userName || 'Subscriber',
              userEmail: json.data.userEmail || 'customer@flixora.tv',
              userAvatar: json.data.userAvatar || null,
              fromPlanName: json.data.fromPlanName || fromPlanParam,
              toPlanName: json.data.toPlanName || toPlanParam,
              amountPaid: json.data.amountPaid || '$14.99',
            });
          }
        }
      } catch (err) {
        console.error('Payment verification error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    verifyPayment();

    return () => {
      isMounted = false;
    };
  }, [sessionId, fromPlanParam, toPlanParam]);

  // 2. Countdown timer to auto-redirect to dashboard
  useEffect(() => {
    if (loading) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, router]);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans flex items-center justify-center pt-20 pb-12 px-4 relative select-none">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF4C00]/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Payment Success Card */}
      <main className="w-full max-w-md bg-[#0A0A0A] border border-[#1A1A1A] rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(255,76,0,0.06)] relative overflow-hidden flex flex-col items-center text-center">
        {/* Top Gradient Accent Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#FF4C00] to-transparent shadow-[0_0_20px_#FF4C00]" />

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00] mb-5 shadow-[0_0_30px_rgba(255,76,0,0.15)] shrink-0">
          <Check size={30} strokeWidth={3} />
        </div>

        {/* Title & Description */}
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-2">
          Payment Successful!
        </h1>
        <p className="text-xs text-zinc-400 font-medium max-w-xs mb-5 leading-relaxed">
          Your subscription has been upgraded successfully. Welcome to Flixora Premium Streaming!
        </p>

        {/* User Badge Chip */}
        <div className="flex items-center gap-3 bg-[#121212] border border-[#222] px-4 py-2.5 rounded-xl mb-5 w-full max-w-xs justify-center">
          {details.userAvatar ? (
            <Image
              src={details.userAvatar}
              alt={details.userName}
              width={32}
              height={32}
              className="rounded-full border border-[#FF4C00] object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF4C00] to-amber-500 flex items-center justify-center font-black text-black text-xs shrink-0">
              {details.userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col text-left min-w-0">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
              Account Holder
            </span>
            <span className="text-xs font-black text-white leading-tight truncate">
              {details.userName}
            </span>
          </div>
        </div>

        {/* Upgrade Flow Badge */}
        <div className="flex items-center justify-between gap-3 mb-5 bg-[#121212] border border-[#222] p-3 rounded-2xl w-full text-center">
          <div className="flex flex-col flex-1">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
              Previous
            </span>
            <span className="text-xs font-black text-zinc-400 mt-0.5 uppercase tracking-wide">
              {details.fromPlanName}
            </span>
          </div>
          <div className="text-[#FF4C00] flex items-center shrink-0">
            <ArrowRight size={16} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[9px] text-[#FF4C00] font-bold uppercase tracking-wider">
              Active Plan
            </span>
            <span className="text-xs font-black text-white mt-0.5 uppercase tracking-wide">
              {details.toPlanName}
            </span>
          </div>
        </div>

        {/* Subscription Summary */}
        <div className="w-full bg-[#121212] border border-[#222] rounded-2xl p-4 text-left flex flex-col gap-3.5 mb-6">
          <div className="flex items-center justify-between border-b border-[#222] pb-2.5">
            <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">
              Billing Summary
            </span>
            <span className="bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00] text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Active
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-center text-zinc-300 shrink-0">
              <Tv size={16} />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs font-black text-white uppercase tracking-wide truncate">
                Flixora {details.toPlanName}
              </span>
              <span className="text-[11px] text-zinc-400 font-bold">
                {details.amountPaid} / month
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#181818] border border-[#2B2B2B] p-2.5 rounded-xl">
            <Mail size={14} className="text-zinc-500 shrink-0" />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                Receipt Sent To
              </span>
              <span className="text-xs text-zinc-300 font-semibold truncate">
                {details.userEmail}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[10px] font-bold text-zinc-500">
            <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
            <span>Encrypted payment processed securely via Stripe</span>
          </div>
        </div>

        {/* Redirect Timer Notification */}
        <div className="mb-6 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-400 bg-[#141414] border border-[#222] px-4 py-2.5 rounded-full w-full">
          <Loader2 size={14} className="animate-spin text-[#FF4C00] shrink-0" />
          <span>
            Redirecting to Dashboard in <strong className="text-[#FF4C00] font-mono text-sm">{countdown}s</strong>...
          </span>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/dashboard"
            className="flex-1 bg-[#FF4C00] hover:bg-[#E04300] text-black font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#FF4C00]/20 outline-none"
          >
            <span>Go To Dashboard</span>
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
          <Link
            href="/"
            className="flex-1 bg-[#141414] hover:bg-[#1C1C1C] border border-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center outline-none"
          >
            <span>Start Watching</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#FF4C00]" />
          <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
            Verifying Payment...
          </span>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
