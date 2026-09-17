'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldAlert, Lock, ArrowLeft, Home, LogIn, LayoutDashboard, KeyRound, Terminal } from 'lucide-react';
import { authClient } from '@/app/(auth)/lib/auth-client';

function AccessDeniedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'forbidden';
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const userRole = (user as any)?.role || 'unauthenticated';

  const isRoleIssue = reason === 'admin_required' || (user && userRole !== 'admin');

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#040404] px-4 pt-28 sm:pt-36 pb-20 sm:px-6 font-sans selection:bg-[#FF4C00] selection:text-black">
      
      {/* Background Animated Security Grid & Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF4C00]/12 blur-[140px] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/90 to-transparent" />
      </div>

      {/* Decorative Security Perimeter Lines */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF4C00]/0 via-[#FF4C00]/40 to-[#FF4C00]/0" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF4C00]/0 via-[#FF4C00]/40 to-[#FF4C00]/0" />

      {/* Main Container */}
      <div className="relative z-10 mx-auto w-full max-w-2xl text-center space-y-8">
        
        {/* Security Badge Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 rounded-full border border-[#FF4C00]/40 bg-[#FF4C00]/10 px-4 py-1.5 backdrop-blur-xl shadow-lg shadow-[#FF4C00]/10"
        >
          <ShieldAlert className="h-4 w-4 text-[#FF4C00]" />
          <span className="text-[11px] font-mono font-black tracking-[0.25em] text-[#FF4C00] uppercase">
            SECURITY GATEKEEPER &bull; RESTRICTED ENCLAVE
          </span>
        </motion.div>

        {/* 403 Hero Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative mx-auto my-2"
        >
          <div className="absolute left-1/2 top-1/2 h-28 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF4C00]/25 blur-[60px]" />
          <h1 className="relative text-[72px] sm:text-[110px] font-black leading-none tracking-tighter text-white font-mono select-none">
            4<span className="text-[#FF4C00] drop-shadow-[0_0_25px_rgba(255,76,0,0.8)]">0</span>3
          </h1>
        </motion.div>

        {/* Heading & Contextual Description */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
            {isRoleIssue ? 'Administrator Privileges Required' : 'Access Restricted'}
          </h2>
          <p className="mx-auto max-w-lg text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
            {isRoleIssue
              ? 'You attempted to access a protected Super Admin route. Your current user account does not possess the elevated permissions needed to view this dashboard.'
              : 'You must log in with valid account credentials to access this protected Flixora portal.'}
          </p>
        </motion.div>

        {/* Security Diagnostics Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-[#0B0B0B] border border-[#181818] rounded-2xl p-5 text-left text-xs space-y-3 shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-zinc-400 border-b border-[#181818] pb-3 font-mono text-[11px]">
            <div className="flex items-center gap-2 text-white font-bold">
              <Terminal size={14} className="text-[#FF4C00]" />
              <span>SECURITY DIAGNOSTICS</span>
            </div>
            <span className="text-[#FF4C00] font-black uppercase tracking-wider text-[10px]">
              STATUS 403 FORBIDDEN
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-300 font-mono text-[11px]">
            <div className="space-y-1 bg-zinc-950/60 p-2.5 rounded-xl border border-[#141414]">
              <span className="text-zinc-500 uppercase text-[9px] font-bold block">Current Session</span>
              <span className="text-white font-bold truncate block">
                {user ? user.email : 'Unauthenticated Guest'}
              </span>
            </div>

            <div className="space-y-1 bg-zinc-950/60 p-2.5 rounded-xl border border-[#141414]">
              <span className="text-zinc-500 uppercase text-[9px] font-bold block">Account Role</span>
              <span className={`font-bold uppercase block ${userRole === 'admin' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {userRole}
              </span>
            </div>

            <div className="space-y-1 bg-zinc-950/60 p-2.5 rounded-xl border border-[#141414]">
              <span className="text-zinc-500 uppercase text-[9px] font-bold block">Target Route</span>
              <span className="text-[#FF4C00] font-bold truncate block">{callbackUrl}</span>
            </div>

            <div className="space-y-1 bg-zinc-950/60 p-2.5 rounded-xl border border-[#141414]">
              <span className="text-zinc-500 uppercase text-[9px] font-bold block">Enforcement Mode</span>
              <span className="text-zinc-300 font-bold block">Server Edge Guard</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          {isRoleIssue ? (
            <>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF4C00]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LayoutDashboard size={16} /> Go to User Dashboard
              </Link>
              <Link
                href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-900 border border-[#181818] hover:border-[#FF4C00]/40 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound size={16} className="text-[#FF4C00]" /> Switch Account
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF4C00]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn size={16} /> Sign In to Flixora
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-900 border border-[#181818] hover:border-[#FF4C00]/40 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home size={16} /> Return Home
              </Link>
            </>
          )}
        </motion.div>

      </div>
    </main>
  );
}

export default function AccessDeniedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center text-xs font-mono">
          Loading Security Gate...
        </div>
      }
    >
      <AccessDeniedContent />
    </Suspense>
  );
}
