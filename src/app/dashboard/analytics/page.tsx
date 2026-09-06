"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Video,
  Eye,
  ListVideo,
  Users,
  Upload,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity,
  Globe
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Catalog Videos",
    value: "148",
    growth: "+12 this week",
    icon: Video,
    color: "text-[#FF4C00]",
    bg: "bg-[#FF4C00]/10 border border-[#FF4C00]/30",
  },
  {
    label: "Total Stream Views",
    value: "42.8k",
    growth: "+28.4% growth",
    icon: Eye,
    color: "text-[#38BDF8]",
    bg: "bg-[#38BDF8]/10 border border-[#38BDF8]/30",
  },
  {
    label: "Curated Playlists",
    value: "32",
    growth: "+4 new public",
    icon: ListVideo,
    color: "text-[#A855F7]",
    bg: "bg-[#A855F7]/10 border border-[#A855F7]/30",
  },
  {
    label: "Active Subscribers",
    value: "1,840",
    growth: "+140 this month",
    icon: Users,
    color: "text-[#10B981]",
    bg: "bg-[#10B981]/10 border border-[#10B981]/30",
  },
];

export default function Analytics() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'published' | 'draft'>('all');

  return (
    <div className="min-h-screen bg-[#08080A] text-white p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-[#1E1E28] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF4C00]/15 border border-[#FF4C00]/30 text-[#FF4C00] text-[10px] font-extrabold uppercase tracking-widest">
              Live Diagnostics
            </span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white"
          >
            Video <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4C00] to-[#FF7A00]">Analytics</span> & Performance
          </motion.h1>
          <p className="text-xs text-zinc-400 mt-1">
            Track engagement, stream quality, and distribution metrics.
          </p>
        </div>

        <Link
          href="/dashboard/my-list"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4C00] to-[#FF7A00] hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(255,76,0,0.3)] transition-all"
        >
          <Upload className="w-4 h-4 stroke-[2.5]" />
          <span>Manage Catalog</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="bg-[#0F0F14] border border-[#1E1E28] hover:border-[#FF4C00]/30 rounded-2xl p-5 flex flex-col justify-between gap-3 shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <p className="text-3xl font-black tracking-tight text-white">{stat.value}</p>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight size={12} /> {stat.growth}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Overview Banner */}
      <div className="bg-gradient-to-r from-[#0F0F14] via-[#14141E] to-[#0F0F14] border border-[#1E1E28] rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00] flex items-center justify-center shrink-0">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Global CDN Bandwidth & Streaming Health
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              US-East, EU-Central, and AP-South streaming endpoints operating at 100% capacity with sub-20ms latency.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono shrink-0">
          <div className="flex flex-col text-center">
            <span className="text-[9px] text-zinc-400 uppercase font-sans">Avg Bitrate</span>
            <span className="font-bold text-[#FF4C00]">18.4 Mbps (4K)</span>
          </div>
          <div className="w-px h-8 bg-[#1E1E28]" />
          <div className="flex flex-col text-center">
            <span className="text-[9px] text-zinc-400 uppercase font-sans">Buffer Rate</span>
            <span className="font-bold text-emerald-400">0.02%</span>
          </div>
        </div>
      </div>

      {/* Videos Catalog Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#0F0F14] border border-[#1E1E28] rounded-2xl overflow-hidden shadow-xl"
      >
        <div className="px-6 py-4 border-b border-[#1E1E28] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 size={18} className="text-[#FF4C00]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Catalog Performance Log
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase transition-all ${
                selectedFilter === 'all'
                  ? 'bg-[#FF4C00] text-black border-[#FF4C00]'
                  : 'bg-transparent text-zinc-400 border-[#1E1E28]'
              }`}
            >
              All Titles
            </button>
            <button
              onClick={() => setSelectedFilter('published')}
              className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase transition-all ${
                selectedFilter === 'published'
                  ? 'bg-[#FF4C00] text-black border-[#FF4C00]'
                  : 'bg-transparent text-zinc-400 border-[#1E1E28]'
              }`}
            >
              Published
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#1E1E28] text-xs text-zinc-400 font-extrabold uppercase tracking-wider">
          <div className="col-span-5">Video Title</div>
          <div className="col-span-2">Quality Tier</div>
          <div className="col-span-2">Publish Date</div>
          <div className="col-span-3 text-right">Total Streams</div>
        </div>

        {/* Catalog Items */}
        <div className="divide-y divide-[#1E1E28]">
          {[
            { id: 1, title: 'Inception (2010) — 4K Remastered', quality: '4K Ultra HD', date: '2026-08-15', streams: '14,280' },
            { id: 2, title: 'Interstellar (2014) — IMAX Cut', quality: '4K HDR10', date: '2026-08-20', streams: '11,940' },
            { id: 3, title: 'The Dark Knight — Special Edition', quality: '1080p FHD', date: '2026-08-28', streams: '8,450' },
            { id: 4, title: 'Blade Runner 2049 — Director Cut', quality: '4K Dolby Vision', date: '2026-09-02', streams: '6,120' },
          ].map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#14141E] transition-colors text-xs font-semibold">
              <div className="col-span-12 sm:col-span-5 text-white font-extrabold truncate">
                {item.title}
              </div>
              <div className="col-span-4 sm:col-span-2 text-zinc-400">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-mono font-bold">
                  {item.quality}
                </span>
              </div>
              <div className="col-span-4 sm:col-span-2 text-zinc-400 font-mono">
                {item.date}
              </div>
              <div className="col-span-4 sm:col-span-3 text-right font-mono font-black text-[#FF4C00]">
                {item.streams} views
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}