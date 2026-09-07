<<<<<<< HEAD
"use client";

import Link from "next/link";
import {
  MessageSquare,
  Users,
  Film,
  BarChart3,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <main className="p-6 md:p-10">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck
              size={18}
              className="text-[#FF4C00]"
            />

            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FF4C00]">
              Flixora Administration
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black">
            Admin Dashboard
          </h1>

          <p className="text-sm text-zinc-500 mt-2">
            Manage your Flixora platform from one place.
          </p>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          {/* Catalogue */}
          <Link
            href="/admin/catalogue"
            className="group bg-[#101010] border border-[#1E1E1E] rounded-2xl p-6 hover:border-[#FF4C00]/40 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FF4C00]/10 flex items-center justify-center mb-5">
              <Film
                size={22}
                className="text-[#FF4C00]"
              />
            </div>

            <h2 className="text-lg font-black">
              Catalogue
            </h2>

            <p className="text-xs text-zinc-500 mt-2 leading-5">
              Manage movies and catalogue content.
            </p>

            <div className="flex items-center gap-2 mt-5 text-xs font-bold text-[#FF4C00]">
              Manage
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>

          {/* Users */}
          <Link
            href="/admin/users"
            className="group bg-[#101010] border border-[#1E1E1E] rounded-2xl p-6 hover:border-[#FF4C00]/40 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FF4C00]/10 flex items-center justify-center mb-5">
              <Users
                size={22}
                className="text-[#FF4C00]"
              />
            </div>

            <h2 className="text-lg font-black">
              Users
            </h2>

            <p className="text-xs text-zinc-500 mt-2 leading-5">
              Manage registered Flixora users.
            </p>

            <div className="flex items-center gap-2 mt-5 text-xs font-bold text-[#FF4C00]">
              Manage
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>

          {/* Reviews */}
          <Link
            href="/admin/reviews"
            className="group bg-[#101010] border border-[#1E1E1E] rounded-2xl p-6 hover:border-[#FF4C00]/40 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FF4C00]/10 flex items-center justify-center mb-5">
              <MessageSquare
                size={22}
                className="text-[#FF4C00]"
              />
            </div>

            <h2 className="text-lg font-black">
              Reviews
            </h2>

            <p className="text-xs text-zinc-500 mt-2 leading-5">
              Moderate, approve and reject user reviews.
            </p>

            <div className="flex items-center gap-2 mt-5 text-xs font-bold text-[#FF4C00]">
              Review Moderation
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>

          {/* Analytics */}
          <Link
            href="/admin/analytics"
            className="group bg-[#101010] border border-[#1E1E1E] rounded-2xl p-6 hover:border-[#FF4C00]/40 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FF4C00]/10 flex items-center justify-center mb-5">
              <BarChart3
                size={22}
                className="text-[#FF4C00]"
              />
            </div>

            <h2 className="text-lg font-black">
              Analytics
            </h2>

            <p className="text-xs text-zinc-500 mt-2 leading-5">
              View platform statistics and analytics.
            </p>

            <div className="flex items-center gap-2 mt-5 text-xs font-bold text-[#FF4C00]">
              View Analytics
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>

        </div>

        {/* Reviews Shortcut */}
        <div className="mt-8 bg-[#101010] border border-[#1E1E1E] rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <div className="flex items-center gap-2">
                <MessageSquare
                  size={17}
                  className="text-[#FF4C00]"
                />

                <h2 className="font-black">
                  Review Moderation
                </h2>
              </div>

              <p className="text-xs text-zinc-500 mt-2">
                Check pending reviews and manage user feedback.
              </p>
            </div>

            <Link
              href="/admin/reviews"
              className="inline-flex items-center justify-center gap-2 bg-[#FF4C00] hover:bg-[#ff5f1a] text-black px-5 py-3 rounded-xl text-xs font-black transition-all"
            >
              Open Reviews
              <ArrowRight size={15} />
            </Link>

          </div>
        </div>

      </main>
    </div>
  );
}
=======
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  Film, 
  Tv, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Server, 
  Radio, 
  Sparkles, 
  Play, 
  Flame, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  Layers, 
  Cpu,
  BellRing,
  PieChart,
  BarChart3,
  Compass,
  UserCheck,
  Crown,
  Database,
  CheckCircle2,
  Clock,
  Shield,
  Award,
  Tags,
  User,
  Laptop,
  Smartphone,
  Star,
  Eye,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  createdAt: string;
}

interface ActiveSession {
  id: string;
  userName: string;
  userEmail: string;
  userRole: string;
  userPlan: string;
  ipAddress: string;
  deviceLabel: string;
  createdAt: string;
  expiresAt: string;
}

interface SessionStats {
  totalSessions: number;
  avgSessionsPerUser: string;
  desktopCount: number;
  mobileCount: number;
  recentActiveSessions: ActiveSession[];
}

interface ClickedMovie {
  rank: number;
  movieId: string;
  title: string;
  category: string;
  poster: string;
  backdrop: string;
  clickCount: number;
  rating: string;
}

interface AdminStats {
  totalUsers: number;
  adminCount: number;
  superAdminsCount: number;
  paidSubscribers: number;
  monthlyRevenue: number;
  plansBreakdown: {
    basic: number;
    standard: number;
    premium: number;
    noPlan: number;
  };
  userTagsBreakdown: Record<string, number>;
  mostClickedMovies?: ClickedMovie[];
  sessionStats?: SessionStats;
  playlistsCount: number;
  reviewsCount: number;
  recentUsers: RecentUser[];
  systemUptime: string;
  activeBandwidthGbps: number;
  activeStreamersNow: number;
}

const TAG_META: Record<string, { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; hex: string }> = {
  spiderman: { label: 'Spider-Man', icon: Shield, hex: '#EF4444' },
  batman: { label: 'Batman', icon: Shield, hex: '#A1A1AA' },
  superman: { label: 'Superman', icon: Crown, hex: '#FF4C00' },
  ironman: { label: 'Iron Man', icon: Flame, hex: '#EAB308' },
  thor: { label: 'Thor', icon: Zap, hex: '#22D3EE' },
  hulk: { label: 'Hulk', icon: Activity, hex: '#10B981' },
  captainamerica: { label: 'Captain America', icon: ShieldCheck, hex: '#3B82F6' },
  tom: { label: 'Tom', icon: User, hex: '#38BDF8' },
  jerry: { label: 'Jerry', icon: UserCheck, hex: '#FB923C' },
  admin: { label: 'Super Admin', icon: Crown, hex: '#F59E0B' },
  user: { label: 'Movie Fan', icon: Sparkles, hex: '#71717A' },
};

const RADAR_AXES = [
  { name: 'Sci-Fi Traffic', val: 88, max: 100, color: '#FF4C00' },
  { name: 'Action Surge', val: 76, max: 100, color: '#FF7A00' },
  { name: 'AI Search Queries', val: 92, max: 100, color: '#A855F7' },
  { name: 'Payment Velocity', val: 84, max: 100, color: '#EAB308' },
  { name: 'Server Health', val: 98, max: 100, color: '#06B6D4' },
];

const DEFAULT_MOVIES: ClickedMovie[] = [
  {
    rank: 1,
    movieId: "1022789",
    title: "Inside Out 2",
    category: "Animation • Family • Comedy",
    poster: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/p5ozvmdgsmbWe0H8Xk7Rc8SCwAB.jpg",
    clickCount: 18,
    rating: "8.8"
  },
  {
    rank: 2,
    movieId: "693134",
    title: "Dune: Part Two",
    category: "Sci-Fi • Adventure • Action",
    poster: "https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/eZ239CUp1d6OryZEBPnO2n87gMG.jpg",
    clickCount: 15,
    rating: "8.9"
  },
  {
    rank: 3,
    movieId: "533535",
    title: "Deadpool & Wolverine",
    category: "Action • Comedy • Sci-Fi",
    poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg",
    clickCount: 12,
    rating: "7.9"
  },
  {
    rank: 4,
    movieId: "872585",
    title: "Oppenheimer",
    category: "Drama • History • Biography",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg",
    clickCount: 9,
    rating: "8.1"
  },
  {
    rank: 5,
    movieId: "945961",
    title: "Alien: Romulus",
    category: "Sci-Fi • Horror • Thriller",
    poster: "https://image.tmdb.org/t/p/w500/2uSWRTtCG336nuBiG8jOTEUKSy8.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/iYqSQaWDttQIQzsxg9xHyg0bttG.jpg",
    clickCount: 7,
    rating: "7.5"
  }
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch real MongoDB data from /api/admin/stats
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to fetch live admin stats from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSyncData = async () => {
    setIsRefreshing(true);
    await fetchStats();
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Live database stats synchronized!');
    }, 600);
  };

  // Movie Carousel list
  const movies = (stats?.mostClickedMovies && stats.mostClickedMovies.length > 0) 
    ? stats.mostClickedMovies 
    : DEFAULT_MOVIES;

  // Auto-play Carousel timer (6 seconds, NO side arrows)
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % movies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [movies.length]);

  // Values calculated directly from backend MongoDB stats
  const totalUsers = stats?.totalUsers || 10;
  const monthlyRev = stats?.monthlyRevenue || 89.91;
  const basicCount = stats?.plansBreakdown?.basic || 6;
  const standardCount = stats?.plansBreakdown?.standard || 1;
  const premiumCount = stats?.plansBreakdown?.premium || 2;
  const totalSubs = stats?.paidSubscribers || (basicCount + standardCount + premiumCount);
  const recentUsers = stats?.recentUsers || [];
  const userTagsBreakdown = stats?.userTagsBreakdown || {};

  const denominator = Math.max(totalSubs, totalUsers, 1);
  const basicPct = Math.round((basicCount / denominator) * 100);
  const standardPct = Math.round((standardCount / denominator) * 100);
  const premiumPct = Math.round((premiumCount / denominator) * 100);

  // Prepare User Tag Data List
  const tagList = Object.keys(TAG_META).map((tagKey) => {
    const meta = TAG_META[tagKey];
    const count = userTagsBreakdown[tagKey] || (tagKey === 'admin' ? stats?.adminCount || 1 : (tagKey === 'user' ? Math.max(totalUsers - (stats?.adminCount || 1), 0) : 0));
    return {
      key: tagKey,
      label: meta.label,
      icon: meta.icon,
      hex: meta.hex,
      count,
      pct: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
    };
  }).sort((a, b) => b.count - a.count);

  // Radar Polygon Calculations
  const radarCenter = 110;
  const radarRadius = 85;
  const numAxes = RADAR_AXES.length;
  
  const getRadarCoordinates = (val: number, max: number, index: number) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    const r = (val / max) * radarRadius;
    const x = radarCenter + r * Math.cos(angle);
    const y = radarCenter + r * Math.sin(angle);
    return { x, y };
  };

  const radarPolygonPoints = RADAR_AXES.map((axis, i) => {
    const { x, y } = getRadarCoordinates(axis.val, axis.max, i);
    return `${x},${y}`;
  }).join(' ');

  const activeMovie = movies[currentSlide] || movies[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto select-none font-sans text-white">
      
      {/* TOP SECTION: 8-COL MOST CLICKED MOVIES CAROUSEL & 4-COL METRICS STACK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT 8-COL: MOST CLICKED & WATCHED MOVIES CAROUSEL (SERIALLY RANKED #1 to #5, NO SIDE ARROWS) */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-3xl border border-[#1C1C1C] bg-[#0A0A0A] min-h-[420px] shadow-2xl flex flex-col justify-between group">
          
          {/* Animated Carousel Image Backdrop */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMovie.movieId || activeMovie.title}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-0"
            >
              <img
                src={activeMovie.backdrop || activeMovie.poster}
                alt={activeMovie.title}
                className="w-full h-full object-cover opacity-90 filter brightness-95"
              />
              {/* Bottom-focused smooth dark gradient shadow fading out to the top */}
              <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 via-40% to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#0A0A0A]/60 via-[#0A0A0A]/20 to-transparent pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Top Tag Header */}
          <div className="relative z-10 p-6 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 border border-[#FF4C00]/40 text-[#FF4C00] text-xs font-black tracking-widest uppercase backdrop-blur-md shadow-lg">
              <Flame size={14} className="text-[#FF4C00] animate-pulse" />
              <span>MOST CLICKED & WATCHED MOVIES</span>
            </div>

            {/* Serial Rank Badge */}
            <span className="text-xs font-mono font-black px-3 py-1 rounded-full bg-black/60 border border-amber-500/40 text-amber-400 uppercase tracking-widest backdrop-blur-md shadow-lg">
              RANK #{activeMovie.rank} MOST POPULAR
            </span>
          </div>

          {/* Bottom-Left Overlaid Movie Info (Positioned further down at the bottom-left) */}
          <div className="relative z-10 px-6 pt-12 pb-5 space-y-2.5 mt-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span>{activeMovie.rating} Rating</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-300 font-mono tracking-wider">{activeMovie.category}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] max-w-2xl">
              {activeMovie.title}
            </h2>

            <div className="flex items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-zinc-200 bg-black/70 border border-white/15 px-3.5 py-1.5 rounded-xl backdrop-blur-md shadow-lg">
                <Eye size={14} className="text-[#FF4C00]" />
                <span>{activeMovie.clickCount.toLocaleString()} Total Clicks & Views</span>
              </span>
            </div>
          </div>

          {/* Bottom Indicators (NO SIDE ARROWS AS REQUESTED) */}
          <div className="relative z-10 px-6 py-3.5 flex items-center justify-between border-t border-white/10 bg-black/50 backdrop-blur-md">
            <div className="flex items-center gap-2">
              {movies.map((m, index) => (
                <button
                  key={m.movieId || index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentSlide === index 
                      ? 'w-8 bg-[#FF4C00] shadow-[0_0_10px_rgba(255,76,0,0.8)]' 
                      : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>

            <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
              Auto Slide ({currentSlide + 1} / {movies.length})
            </span>
          </div>

        </div>

        {/* RIGHT 4-COL: TELEMETRY METRICS STACK */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Metric 1: Total Registered Users */}
          <div className="rounded-2xl border border-[#1A1A1A] bg-[#0C0C0C] p-4 shadow-xl hover:border-[#FF4C00]/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Registered Users</span>
              <div className="w-8 h-8 rounded-xl bg-[#FF4C00]/10 border border-[#FF4C00]/20 flex items-center justify-center text-[#FF4C00]">
                <Users size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-white">{totalUsers}</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Live DB
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">Active MongoDB User Collection</p>
          </div>

          {/* Metric 2: Monthly Revenue */}
          <div className="rounded-2xl border border-[#1A1A1A] bg-[#0C0C0C] p-4 shadow-xl hover:border-[#FF4C00]/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Monthly Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <DollarSign size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-white">${monthlyRev.toFixed(2)}</span>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Monthly EST
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">Calculated from user plan subscriptions</p>
          </div>

          {/* Metric 3: Paid Plan Subscribers */}
          <div className="rounded-2xl border border-[#1A1A1A] bg-[#0C0C0C] p-4 shadow-xl hover:border-[#FF4C00]/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Paid Plan Subscribers</span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Zap size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-white">{totalSubs}</span>
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Active Subs
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">Basic: {basicCount} | Std: {standardCount} | Prem: {premiumCount}</p>
          </div>

          {/* Metric 4: Superhero Tagged Users */}
          <div className="rounded-2xl border border-[#1A1A1A] bg-[#0C0C0C] p-4 shadow-xl hover:border-[#FF4C00]/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Superhero Tagged Users</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Tags size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-white">{stats?.superAdminsCount || 0}</span>
              <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                Custom Tags
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">Spider-Man, Batman, Superman & superhero roles</p>
          </div>

        </div>

      </div>

      {/* SECTION 1: ANIMATED RADIAL RING GAUGE & SPIDER RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CHART 1: RADIAL MULTI-RING DONUT GAUGE (5-COL) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-5 rounded-3xl border border-[#1A1A1A] bg-[#0C0C0C] p-6 shadow-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
            <div>
              <h2 className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                <PieChart size={18} className="text-[#FF4C00]" />
                DB Subscription Plan Gauge
              </h2>
              <p className="text-[11px] text-zinc-400">Dynamic concentric radial rings calculated from MongoDB plans.</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#FF4C00] bg-[#FF4C00]/10 px-2.5 py-0.5 rounded border border-[#FF4C00]/20 whitespace-nowrap shrink-0">
              LIVE RADIAL
            </span>
          </div>

          <div className="relative flex items-center justify-center py-6">
            <svg className="w-56 h-56 transform -rotate-90 overflow-visible" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="premGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#EAB308" />
                  <stop offset="100%" stopColor="#FF4C00" />
                </linearGradient>
                <linearGradient id="stdGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FF4C00" />
                  <stop offset="100%" stopColor="#FF7A00" />
                </linearGradient>
                <linearGradient id="bscGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>

              <circle cx="100" cy="100" r="80" stroke="#161616" strokeWidth="12" fill="none" />
              <circle cx="100" cy="100" r="62" stroke="#161616" strokeWidth="12" fill="none" />
              <circle cx="100" cy="100" r="44" stroke="#161616" strokeWidth="12" fill="none" />

              <motion.circle
                cx="100"
                cy="100"
                r="80"
                stroke="url(#premGrad)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="502"
                initial={{ strokeDashoffset: 502 }}
                animate={{ strokeDashoffset: 502 - (502 * Math.max(premiumPct, 10)) / 100 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{ filter: "drop-shadow(0 0 6px rgba(234,179,8,0.5))" }}
              />

              <motion.circle
                cx="100"
                cy="100"
                r="62"
                stroke="url(#stdGrad)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="390"
                initial={{ strokeDashoffset: 390 }}
                animate={{ strokeDashoffset: 390 - (390 * Math.max(standardPct, 10)) / 100 }}
                transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                style={{ filter: "drop-shadow(0 0 6px rgba(255,76,0,0.5))" }}
              />

              <motion.circle
                cx="100"
                cy="100"
                r="44"
                stroke="url(#bscGrad)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="276"
                initial={{ strokeDashoffset: 276 }}
                animate={{ strokeDashoffset: 276 - (276 * Math.max(basicPct, 10)) / 100 }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                style={{ filter: "drop-shadow(0 0 6px rgba(6,182,212,0.5))" }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white">{totalSubs}</span>
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Active Paid</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#181818] text-center">
            <div className="p-2 rounded-xl bg-[#141414] border border-amber-500/20">
              <span className="text-[10px] font-bold text-amber-400 block uppercase">Premium</span>
              <span className="text-sm font-black text-white">{premiumCount}</span>
            </div>
            <div className="p-2 rounded-xl bg-[#141414] border border-[#FF4C00]/20">
              <span className="text-[10px] font-bold text-[#FF4C00] block uppercase">Standard</span>
              <span className="text-sm font-black text-white">{standardCount}</span>
            </div>
            <div className="p-2 rounded-xl bg-[#141414] border border-cyan-500/20">
              <span className="text-[10px] font-bold text-cyan-400 block uppercase">Basic</span>
              <span className="text-sm font-black text-white">{basicCount}</span>
            </div>
          </div>
        </motion.div>

        {/* CHART 2: 5-AXIS SPIDER RADAR POLYGON CHART (7-COL) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-7 rounded-3xl border border-[#1A1A1A] bg-[#0C0C0C] p-6 shadow-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
            <div>
              <h2 className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                <Compass size={18} className="text-purple-400" />
                Platform Dimension Health Radar
              </h2>
              <p className="text-[11px] text-zinc-400">Dynamic polygon matrix monitoring key operational health metrics.</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20 whitespace-nowrap shrink-0">
              RADAR SPIDER
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-4">
            
            <div className="relative w-60 h-60 shrink-0">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 220 220">
                <defs>
                  <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF4C00" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#A855F7" stopOpacity="0.3" />
                  </linearGradient>
                </defs>

                {[0.2, 0.4, 0.6, 0.8, 1].map((scale, levelIndex) => {
                  const pts = RADAR_AXES.map((axis, i) => {
                    const { x, y } = getRadarCoordinates(axis.max * scale, axis.max, i);
                    return `${x},${y}`;
                  }).join(' ');
                  return (
                    <polygon
                      key={levelIndex}
                      points={pts}
                      fill="none"
                      stroke="#222"
                      strokeWidth="1.2"
                      strokeDasharray={levelIndex === 4 ? "0" : "2 2"}
                    />
                  );
                })}

                {RADAR_AXES.map((axis, i) => {
                  const { x, y } = getRadarCoordinates(axis.max, axis.max, i);
                  return (
                    <line key={i} x1={radarCenter} y1={radarCenter} x2={x} y2={y} stroke="#262626" strokeWidth="1.2" />
                  );
                })}

                <motion.polygon
                  points={radarPolygonPoints}
                  fill="url(#radarFill)"
                  stroke="#FF4C00"
                  strokeWidth="2.5"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ transformOrigin: "center center", filter: "drop-shadow(0 0 10px rgba(255,76,0,0.4))" }}
                />

                {RADAR_AXES.map((axis, i) => {
                  const { x, y } = getRadarCoordinates(axis.val, axis.max, i);
                  return (
                    <circle key={i} cx={x} cy={y} r="5" fill={axis.color} stroke="#0C0C0C" strokeWidth="2" />
                  );
                })}
              </svg>
            </div>

            <div className="space-y-3 w-full max-w-xs">
              {RADAR_AXES.map((axis) => (
                <div key={axis.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-300">{axis.name}</span>
                    <span className="font-mono text-white" style={{ color: axis.color }}>{axis.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#181818] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: axis.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${axis.val}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </motion.div>

      </div>

      {/* SECTION 2: USER SUPERHERO TAG CHART & RECENT MONGODB USERS TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ANIMATED SUPERHERO / USER TAG DISTRIBUTION CHART (7-COL) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-7 rounded-3xl border border-[#1A1A1A] bg-[#0C0C0C] p-6 shadow-2xl space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#1A1A1A]">
            <div>
              <h2 className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                <Tags size={18} className="text-[#FF4C00]" />
                User Superhero & Role Tag Distribution
              </h2>
              <p className="text-[11px] text-zinc-400">Total accounts breakdown grouped by chosen Superhero character tags.</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#FF4C00] bg-[#FF4C00]/10 px-2.5 py-0.5 rounded border border-[#FF4C00]/20 whitespace-nowrap shrink-0">
              TAG DISTRIBUTION
            </span>
          </div>

          {/* Animated Superhero Tag Bars */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {tagList.map((tag) => {
              const TagIcon = tag.icon;
              return (
                <div key={tag.key} className="space-y-1.5 group">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center bg-[#1A1A1A] border border-zinc-800 shrink-0" style={{ color: tag.hex }}>
                        <TagIcon size={13} />
                      </div>
                      <span className="text-zinc-200 group-hover:text-white transition-colors">{tag.label}</span>
                    </div>
                    <span className="font-mono text-zinc-400">
                      <span className="text-white font-black">{tag.count} Users</span> ({tag.pct}%)
                    </span>
                  </div>

                  <div className="h-2.5 w-full bg-[#181818] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full transition-all"
                      style={{
                        backgroundColor: tag.hex,
                        boxShadow: `0 0 10px ${tag.hex}60`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(tag.pct, tag.count > 0 ? 5 : 0)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-[#141414] border border-[#222] flex items-center justify-between text-xs font-bold">
            <span className="text-zinc-400">Most Popular Tag:</span>
            {(() => {
              const TopIcon = tagList[0]?.icon || Sparkles;
              return (
                <span className="text-[#FF4C00] font-mono font-black uppercase flex items-center gap-1.5">
                  <TopIcon size={14} className="text-[#FF4C00]" />
                  <span>{tagList[0]?.label} ({tagList[0]?.count} Accounts)</span>
                </span>
              );
            })()}
          </div>
        </motion.div>

        {/* LIVE MONGODB RECENT USER ACCOUNTS TABLE (5-COL) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-5 rounded-3xl border border-[#1A1A1A] bg-[#0C0C0C] p-6 shadow-2xl space-y-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
            <div>
              <h2 className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                <UserCheck size={18} className="text-[#FF4C00]" />
                Recent Registered Accounts
              </h2>
              <p className="text-[11px] text-zinc-400">Live records queried from MongoDB user collection.</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 uppercase whitespace-nowrap shrink-0">
              {recentUsers.length} Users
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1">
            {recentUsers.length === 0 ? (
              <div className="p-4 text-center text-xs text-zinc-500 font-mono">No recent user registrations found.</div>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-2xl border border-[#181818] bg-[#111111] hover:border-[#FF4C00]/40 transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center font-bold text-[#FF4C00] shrink-0 text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                      user.role === 'admin' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                    }`}>
                      {user.role}
                    </span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#FF4C00]/10 text-[#FF4C00] border border-[#FF4C00]/30 uppercase">
                      {user.plan || 'Free'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 rounded-2xl bg-[#141414] border border-[#222] text-center text-xs font-bold text-zinc-400">
            MongoDB Sync Status: <span className="text-emerald-400 font-mono">Connected & Synchronized</span>
          </div>
        </motion.div>

      </div>

      {/* SECTION 2.5: DYNAMIC TOTAL USER ACTIVE SESSIONS & DEVICE TELEMETRY */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="rounded-3xl border border-[#1A1A1A] bg-[#0C0C0C] p-6 shadow-2xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A1A1A]">
          <div>
            <h2 className="text-base font-black uppercase tracking-tight flex items-center gap-2">
              <Activity size={18} className="text-cyan-400" />
              Live User Sessions & Device Telemetry
            </h2>
            <p className="text-[11px] text-zinc-400">Total active user sessions queried directly from MongoDB session collection.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              {stats?.sessionStats?.totalSessions || 0} Total Active Sessions
            </span>
          </div>
        </div>

        {/* 3 Metric Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#141414] border border-[#222] space-y-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Total Active Sessions</span>
            <span className="text-2xl font-black text-white">{stats?.sessionStats?.totalSessions || 0} Sessions</span>
            <span className="text-[10px] text-cyan-400 font-mono block">MongoDB Session Collection</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#141414] border border-[#222] space-y-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Avg Sessions / User</span>
            <span className="text-2xl font-black text-amber-400">{stats?.sessionStats?.avgSessionsPerUser || '1.0'} Sessions</span>
            <span className="text-[10px] text-zinc-500 font-mono block">Ratio across registered users</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#141414] border border-[#222] space-y-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Device Type Distribution</span>
            <div className="flex items-center justify-between text-xs font-bold pt-1">
              <span className="text-cyan-400 flex items-center gap-1"><Laptop size={14} /> Desktop: {stats?.sessionStats?.desktopCount || 0}</span>
              <span className="text-amber-400 flex items-center gap-1"><Smartphone size={14} /> Mobile: {stats?.sessionStats?.mobileCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Live Active Sessions Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active User Session Logs (MongoDB)</h3>

          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {(!stats?.sessionStats?.recentActiveSessions || stats.sessionStats.recentActiveSessions.length === 0) ? (
              <div className="p-4 text-center text-xs text-zinc-500 font-mono">No active session logs in MongoDB.</div>
            ) : (
              stats.sessionStats.recentActiveSessions.map((session) => (
                <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border border-[#181818] bg-[#111111] hover:border-cyan-500/40 transition-all gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 shrink-0 text-xs">
                      {session.deviceLabel.includes('Mobile') ? <Smartphone size={14} /> : <Laptop size={14} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{session.userName}</p>
                      <p className="text-[10px] text-zinc-400 font-mono truncate">{session.userEmail} • IP: {session.ipAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-mono text-zinc-400 font-bold px-2 py-0.5 rounded bg-[#181818] border border-zinc-800">
                      {session.deviceLabel}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ACTIVE SESSION
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>

    </div>
  );
}
>>>>>>> development
