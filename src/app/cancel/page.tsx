import Link from 'next/link';
import { AlertCircle, HelpCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface CancelProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function CancelPage({ searchParams }: CancelProps) {
  let errorMessage = 'The checkout session was cancelled or could not be completed.';

  try {
    const params = await searchParams;
    if (params.error) {
      errorMessage = params.error;
    }
  } catch (e) {
    console.error('Error parsing search params in cancel page:', e);
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans flex items-center justify-center py-12 px-6 relative select-none">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-950/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-900/40 blur-[100px] rounded-full pointer-events-none" />

      <main className="w-full max-w-xl bg-[#0A0A0A] border border-zinc-800/60 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(239,68,68,0.03)] relative overflow-hidden flex flex-col items-center text-center">
        {/* Neon border glow top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_20px_rgba(239,68,68,0.5)]" />

        {/* Glowing Alert/X Badge */}
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-8 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
          <AlertCircle size={38} strokeWidth={2.5} />
        </div>

        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-2">
          Payment Unsuccessful
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 font-medium max-w-sm mb-8 leading-relaxed">
          We were unable to complete your transaction. No charges have been made to your account.
        </p>

        {/* Error Details Card */}
        <div className="w-full bg-[#111] border border-zinc-900 rounded-2xl p-6 text-left flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3.5">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Error Details</span>
            <span className="bg-red-500/10 border border-red-500/25 text-red-500 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
              Failed
            </span>
          </div>

          <div className="bg-zinc-950/50 border border-zinc-900/50 p-4 rounded-xl">
            <p className="text-xs text-zinc-400 font-medium leading-relaxed font-mono whitespace-pre-wrap break-words">
              {errorMessage}
            </p>
          </div>

          <div className="flex items-center gap-2.5 text-[10px] font-bold text-zinc-550 leading-relaxed">
            <HelpCircle size={14} className="text-zinc-500 shrink-0" />
            <span>Need help? Double-check card information, fund availability, or contact your card issuer.</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/dashboard/subscription"
            className="flex-1 bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#FF4C00]/10 outline-none"
          >
            <RefreshCw size={14} strokeWidth={2.5} className="animate-spin-slow" />
            Try Again
          </Link>

          <Link
            href="/dashboard"
            className="flex-1 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-950/40 text-zinc-300 font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 outline-none"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
