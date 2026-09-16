'use client';

import React from 'react';
import { Scale, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-10 font-sans selection:bg-[#FF4C00] selection:text-black">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* HEADER */}
        <div className="space-y-3 border-b border-zinc-900/80 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00] font-black text-xs uppercase tracking-widest">
            <Scale size={14} /> Terms & Agreements
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-zinc-400 font-mono">Last Updated: September 16, 2026</p>
        </div>

        {/* TERMS CONTENT */}
        <div className="space-y-8 text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
          <section className="space-y-3 bg-[#0B0B0B] border border-[#141414] rounded-2xl p-6 hover:border-[#FF4C00]/30 transition-all">
            <h2 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
              <FileText size={16} className="text-[#FF4C00]" /> 1. Acceptance of Terms
            </h2>
            <p>
              By accessing Flixora, creating an account, subscribing to video streaming plans, or reserving physical cinema hall tickets, you agree to comply with and be bound by these Terms of Service.
            </p>
          </section>

          <section className="space-y-3 bg-[#0B0B0B] border border-[#141414] rounded-2xl p-6 hover:border-[#FF4C00]/30 transition-all">
            <h2 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#FF4C00]" /> 2. Cinema Passes & Ticket Usage
            </h2>
            <p>
              Cinema tickets booked via Flixora represent single-entry admission passes to partner cinema halls. Each QR code pass is unique and verified electronically at entrance gates. Fraudulent duplication or re-selling is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3 bg-[#0B0B0B] border border-[#141414] rounded-2xl p-6 hover:border-[#FF4C00]/30 transition-all">
            <h2 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
              <AlertCircle size={16} className="text-[#FF4C00]" /> 3. Subscriptions & Payment Terms
            </h2>
            <p>
              Subscriptions renew automatically depending on the chosen billing interval. Users can cancel or change subscription plans at any time via Dashboard Settings. Payments processed through Stripe or regional gateways (bKash/Nagad) are subject to gateway terms.
            </p>
          </section>

          <section className="space-y-3 bg-[#0B0B0B] border border-[#141414] rounded-2xl p-6 hover:border-[#FF4C00]/30 transition-all">
            <h2 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
              <Scale size={16} className="text-[#FF4C00]" /> 4. Account Responsibility & Security
            </h2>
            <p>
              Users are responsible for maintaining account credential confidentiality and managing Kids Mode Parental PIN locks. Flixora reserves the right to terminate accounts that violate community standards or engage in streaming piracy.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
