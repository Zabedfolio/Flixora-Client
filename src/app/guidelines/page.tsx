'use client';

import React from 'react';
import { ShieldAlert, CheckCircle2, Flag, FileCheck, Film } from 'lucide-react';

export default function ContentGuidelinesPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-10 font-sans selection:bg-[#FF4C00] selection:text-black">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* HEADER */}
        <div className="space-y-3 border-b border-zinc-900/80 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00] font-black text-xs uppercase tracking-widest">
            <FileCheck size={14} /> Community Standards
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Content Guidelines & Safety
          </h1>
          <p className="text-xs text-zinc-400 font-mono">Last Updated: September 16, 2026</p>
        </div>

        {/* GUIDELINES CONTENT */}
        <div className="space-y-8 text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
          <section className="space-y-3 bg-[#0B0B0B] border border-[#141414] rounded-2xl p-6 hover:border-[#FF4C00]/30 transition-all">
            <h2 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
              <Film size={16} className="text-[#FF4C00]" /> 1. Age Classification & Content Ratings
            </h2>
            <p>
              Flixora strictly labels content with standard MPAA, TV Parental, and Anime ratings (G, PG, PG-13, R, TV-MA). All titles indexed in the Kids Catalogue are curated for family-safe viewing.
            </p>
          </section>

          <section className="space-y-3 bg-[#0B0B0B] border border-[#141414] rounded-2xl p-6 hover:border-[#FF4C00]/30 transition-all">
            <h2 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
              <ShieldAlert size={16} className="text-[#FF4C00]" /> 2. Community Reviews & Comments
            </h2>
            <p>
              Movie ratings, user reviews, and public playlist comments must maintain respect. Spam, hate speech, harassment, explicit spoilers without tags, or inappropriate profiles will be removed by automated AI moderation or admin flags.
            </p>
          </section>

          <section className="space-y-3 bg-[#0B0B0B] border border-[#141414] rounded-2xl p-6 hover:border-[#FF4C00]/30 transition-all">
            <h2 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#FF4C00]" /> 3. Copyright & Intellectual Property
            </h2>
            <p>
              All movies, television shows, anime, posters, trailers, and studio media displayed on Flixora are licensed or authorized by respective production companies and distributor partners.
            </p>
          </section>

          <section className="space-y-3 bg-[#0B0B0B] border border-[#141414] rounded-2xl p-6 hover:border-[#FF4C00]/30 transition-all">
            <h2 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
              <Flag size={16} className="text-[#FF4C00]" /> 4. Reporting Violations
            </h2>
            <p>
              If you encounter inappropriate reviews, content safety concerns, or copyright issues, report them directly using the Flag button on reviews or contact safety@flixora.com.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
