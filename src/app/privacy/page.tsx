'use client';

import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-10 font-sans selection:bg-[#FF4C00] selection:text-black">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* HEADER */}
        <div className="space-y-3 border-b border-zinc-900 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00] font-black text-xs uppercase tracking-widest">
            <ShieldCheck size={14} /> Legal Documentation
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-zinc-400 font-mono">Last Updated: September 16, 2026</p>
        </div>

        {/* POLICY CONTENT */}
        <div className="space-y-8 text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
          <section className="space-y-3 bg-[#0C0C0C] border border-zinc-850 rounded-2xl p-6">
            <h2 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
              <Lock size={16} className="text-[#FF4C00]" /> 1. Information We Collect
            </h2>
            <p>
              When you use Flixora, we collect account details (such as name, email address, and profile settings), payment transaction records processed securely through Stripe/bKash/Nagad, streaming preferences, and cinema seat booking details.
            </p>
          </section>

          <section className="space-y-3 bg-[#0C0C0C] border border-zinc-850 rounded-2xl p-6">
            <h2 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
              <Eye size={16} className="text-[#FF4C00]" /> 2. How We Use Your Data
            </h2>
            <p>
              Your data is strictly used to deliver adaptive streaming, generate instant QR gate entry tickets, process billing, personalize AI recommendations, and maintain parental security controls. We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="space-y-3 bg-[#0C0C0C] border border-zinc-850 rounded-2xl p-6">
            <h2 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#FF4C00]" /> 3. Data Protection & Encryption
            </h2>
            <p>
              All user communications and database transactions use TLS 1.3 encryption and MongoDB Atlas security protocols. Gate ticket validation payloads use HMAC cryptographic verification hashes.
            </p>
          </section>

          <section className="space-y-3 bg-[#0C0C0C] border border-zinc-850 rounded-2xl p-6">
            <h2 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
              <FileText size={16} className="text-[#FF4C00]" /> 4. Your Rights & Account Deletion
            </h2>
            <p>
              You may request a copy of your stored data, update profile settings, or delete your account at any time through Dashboard Settings. For privacy inquiries, email privacy@flixora.com.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
