'use client';

import React from 'react';
import Link from 'next/link';
import { Film, Tv, Shield, Award, Users, Globe, Sparkles, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-10 font-sans selection:bg-[#FF4C00] selection:text-black">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* HERO SECTION */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#0E0E0E] to-[#050505] border border-zinc-800 p-8 sm:p-14 overflow-hidden text-center space-y-6">
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-[#FF4C00]/10 blur-3xl rounded-full pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00] font-black text-xs uppercase tracking-widest">
            <Sparkles size={14} /> About Flixora
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Reimagining Next-Gen Entertainment & Live Cinema
          </h1>

          <p className="text-zinc-400 text-sm sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Flixora is the world’s premiere digital streaming platform and hybrid cinema hall reservation engine, bringing thousands of blockbuster movies, TV series, anime, and physical theater passes directly to your fingertips.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/explore"
              className="px-8 py-3.5 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF4C00]/20 flex items-center gap-2 cursor-pointer"
            >
              <Play size={16} fill="currentColor" /> Explore Catalogue
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        {/* METRICS STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Active Streamers', value: '10M+', sub: 'Across 120 Countries' },
            { label: '4K Ultra HD Titles', value: '50,000+', sub: 'Movies, Series & Anime' },
            { label: 'Cinema Hall Partners', value: '500+', sub: 'Bangladesh & Worldwide' },
            { label: 'Uptime & Reliability', value: '99.99%', sub: 'Low Latency CDN' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#0C0C0C] border border-zinc-900 rounded-2xl p-6 text-center space-y-1">
              <span className="text-2xl sm:text-4xl font-black font-mono text-[#FF4C00]">{stat.value}</span>
              <p className="text-xs font-bold text-white uppercase tracking-wider">{stat.label}</p>
              <span className="text-[10px] text-zinc-500 font-medium block">{stat.sub}</span>
            </div>
          ))}
        </div>

        {/* MISSION & VISION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0C0C0C] border border-zinc-850 rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00]">
              <Film size={24} />
            </div>
            <h2 className="text-xl font-black uppercase text-white">Our Mission</h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-medium">
              We aim to break down boundaries between streaming content at home and experiencing live blockbusters in physical cinema halls. By offering AI-powered recommendations, 4K HDR playback, and automated gate ticket passes, Flixora creates a seamless entertainment ecosystem.
            </p>
            <ul className="space-y-2 text-xs text-zinc-300 pt-2 font-medium">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FF4C00]" /> High fidelity 4K HDR streaming with Dolby Atmos</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FF4C00]" /> Real-time parabolic seat selection & ticket verification</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FF4C00]" /> Instant multi-profile & parental control integration</li>
            </ul>
          </div>

          <div className="bg-[#0C0C0C] border border-zinc-850 rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00]">
              <Globe size={24} />
            </div>
            <h2 className="text-xl font-black uppercase text-white">Global Vision</h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-medium">
              Empowering creators and cinema lovers globally with state-of-the-art tech. Whether you are catching the newest anime release, streaming trending movies, or booking theater seats in Dhaka or Sylhet, Flixora delivers unmatched speed and aesthetics.
            </p>
            <ul className="space-y-2 text-xs text-zinc-300 pt-2 font-medium">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FF4C00]" /> Global content localization in multiple languages</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FF4C00]" /> Direct integration with regional payment gateways (bKash, Nagad, Visa)</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FF4C00]" /> Zero-buffer adaptive bitrate streaming protocol</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
