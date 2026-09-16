'use client';

import React from 'react';
import Link from 'next/link';
import { Newspaper, Download, Mail, ExternalLink, Calendar, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PRESS_RELEASES = [
  {
    title: 'Flixora Launches Hybrid Cinema Booking Engine across Bangladesh',
    date: 'September 10, 2026',
    category: 'Product Launch',
    summary: 'Streamlining theater ticket reservations with photorealistic 3D seat maps and automated gate check-in verification.',
  },
  {
    title: 'Flixora Expands 4K Ultra HD Anime & International Blockbuster Catalogue',
    date: 'August 14, 2026',
    category: 'Content Expansion',
    summary: 'Partnering with top global studios to stream original theatrical anime releases directly to OTT subscribers.',
  },
  {
    title: 'Flixora Achieves 10 Million Active Streaming Subscribers',
    date: 'July 01, 2026',
    category: 'Corporate Milestone',
    summary: 'Rapid platform growth driven by AI recommendation engine and seamless cross-device synchronization.',
  },
];

export default function PressRoomPage() {
  const handleDownloadKit = () => {
    toast.success('Media Kit assets zip package download started!');
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-10 font-sans selection:bg-[#FF4C00] selection:text-black">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00] font-black text-xs uppercase tracking-widest">
            <Newspaper size={14} /> Press & Media Center
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Flixora Newsroom & Brand Assets
          </h1>
          <p className="text-zinc-400 text-xs sm:text-base font-medium">
            Find the latest official press releases, corporate announcements, logos, and media contacts.
          </p>
        </div>

        {/* BRAND ASSETS DOWNLOAD */}
        <div className="bg-[#0C0C0C] border border-zinc-850 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-black uppercase text-white">Official Brand & Press Kit</h3>
            <p className="text-xs text-zinc-400 font-medium">
              High-resolution Flixora logos, brand guidelines, color palettes, and executive headshots.
            </p>
          </div>
          <button
            onClick={handleDownloadKit}
            className="px-6 py-3 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Download size={16} /> Download Media Kit (.zip)
          </button>
        </div>

        {/* PRESS RELEASES */}
        <div className="space-y-4">
          <h2 className="text-lg font-black uppercase text-white border-b border-zinc-900 pb-3">Latest Press Releases</h2>

          <div className="space-y-4">
            {PRESS_RELEASES.map((pr, idx) => (
              <div key={idx} className="bg-[#0C0C0C] border border-zinc-900 rounded-2xl p-6 space-y-2">
                <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  <span className="text-[#FF4C00]">{pr.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {pr.date}</span>
                </div>
                <h3 className="text-base font-black text-white">{pr.title}</h3>
                <p className="text-xs text-zinc-400 font-medium">{pr.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MEDIA CONTACT */}
        <div className="bg-[#0E0E0E] border border-zinc-800 rounded-3xl p-8 text-center space-y-3">
          <Mail size={24} className="text-[#FF4C00] mx-auto" />
          <h3 className="text-base font-black uppercase text-white">Media & Press Inquiries</h3>
          <p className="text-xs text-zinc-400 font-medium max-w-md mx-auto">
            For journalist questions, interview requests, or official press inquiries, please contact our PR team.
          </p>
          <a
            href="mailto:press@flixora.com"
            className="inline-block px-6 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono font-bold text-xs hover:border-[#FF4C00] transition-colors"
          >
            press@flixora.com
          </a>
        </div>

      </div>
    </div>
  );
}
