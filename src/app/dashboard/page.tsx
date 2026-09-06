'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient } from '@/app/(auth)/lib/auth-client';
import { getWatchlistCount } from '@/data/watchlistStore';
import { getHistory, HistoryItem } from '@/data/historyStore';
import { 
  LayoutGrid, 
  Clock, 
  Play, 
  Check, 
  Bookmark, 
  Flame, 
  Sparkles, 
  TrendingUp, 
  Tv,
  Activity,
  Zap,
  ShieldCheck,
  Globe,
  Radio,
  BarChart3,
  PieChart,
  Cpu,
  Wifi,
  Smartphone,
  Laptop,
  Monitor,
  Film,
  Server,
  RefreshCw,
  Layers,
  ArrowUpRight
} from 'lucide-react';

/* =========================================================
   TYPES & INTERFACES
========================================================= */

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  image?: string;
  avatarId?: string;
  role: string;
  plan: string;
  planId?: string;
}

interface TelemetryPoint {
  time: string;
  streams: number;
  bandwidthGb: number;
  users: number;
}

interface GenreData {
  name: string;
  value: number; // 0 - 100
  color: string;
}

/* =========================================================
   MAIN DASHBOARD COMPONENT
========================================================= */

export default function UserDashboardPage() {
  const { data: session } = authClient.useSession();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'ytd'>('7d');
  const [hoveredPoint, setHoveredPoint] = useState<TelemetryPoint | null>(null);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [selectedGenreIndex, setSelectedGenreIndex] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'telemetry' | 'content'>('overview');

  useEffect(() => {
    const fetchLiveProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.user) setUserProfile(data.user);
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };
    fetchLiveProfile();
    setWatchlistCount(getWatchlistCount());
    setHistory(getHistory());
  }, []);

  const refreshDashboard = () => {
    setIsRefreshing(true);
    setWatchlistCount(getWatchlistCount());
    setHistory(getHistory());
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // User details
  const isAdmin = userProfile?.role === 'admin' || session?.user?.email === 'zabedfolio@gmail.com';
  const roleTitle = isAdmin ? 'SUPER ADMIN' : userProfile?.plan ? `${userProfile.plan.toUpperCase()} MEMBER` : 'FREE MEMBER';

  // Derived statistics
  const totalHours = history.reduce((acc, curr) => acc + curr.hoursWatched, 0);
  const continueWatchingCount = history.filter(item => (item.progressPercent ?? 0) > 0 && (item.progressPercent ?? 0) < 100).length;
  const completedCount = history.filter(item => (item.progressPercent ?? 0) >= 100).length;

  /* =========================================================
     CHART DATA GENERATORS
  ========================================================= */

  // 1. Bezier Wave Chart Telemetry Points based on timeframe
  const getTelemetryData = (): TelemetryPoint[] => {
    if (timeframe === '24h') {
      return [
        { time: '00:00', streams: 120, bandwidthGb: 1.2, users: 95 },
        { time: '04:00', streams: 45, bandwidthGb: 0.5, users: 38 },
        { time: '08:00', streams: 180, bandwidthGb: 1.8, users: 140 },
        { time: '12:00', streams: 420, bandwidthGb: 4.1, users: 310 },
        { time: '16:00', streams: 680, bandwidthGb: 6.7, users: 520 },
        { time: '20:00', streams: 950, bandwidthGb: 9.4, users: 810 },
        { time: '23:59', streams: 740, bandwidthGb: 7.2, users: 600 },
      ];
    }
    if (timeframe === '30d') {
      return [
        { time: 'W1', streams: 1200, bandwidthGb: 12.4, users: 840 },
        { time: 'W2', streams: 1850, bandwidthGb: 18.2, users: 1350 },
        { time: 'W3', streams: 2400, bandwidthGb: 24.8, users: 1920 },
        { time: 'W4', streams: 3100, bandwidthGb: 31.5, users: 2450 },
      ];
    }
    if (timeframe === 'ytd') {
      return [
        { time: 'Q1', streams: 4500, bandwidthGb: 45.2, users: 3200 },
        { time: 'Q2', streams: 6800, bandwidthGb: 68.7, users: 5100 },
        { time: 'Q3', streams: 9200, bandwidthGb: 92.4, users: 7300 },
        { time: 'Q4', streams: 12400, bandwidthGb: 125.0, users: 9800 },
      ];
    }
    // Default '7d'
    return [
      { time: 'Mon', streams: 320, bandwidthGb: 3.1, users: 240 },
      { time: 'Tue', streams: 410, bandwidthGb: 4.2, users: 310 },
      { time: 'Wed', streams: 380, bandwidthGb: 3.9, users: 290 },
      { time: 'Thu', streams: 590, bandwidthGb: 6.0, users: 480 },
      { time: 'Fri', streams: 840, bandwidthGb: 8.5, users: 690 },
      { time: 'Sat', streams: 1120, bandwidthGb: 11.4, users: 940 },
      { time: 'Sun', streams: 980, bandwidthGb: 9.8, users: 810 },
    ];
  };

  const telemetryData = getTelemetryData();
  const maxStreams = Math.max(...telemetryData.map(p => p.streams));

  // Bezier path generator for smooth SVG wave chart
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const points = telemetryData.map((d, i) => {
    const x = paddingX + (i / (telemetryData.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - (d.streams / (maxStreams * 1.15)) * (svgHeight - paddingY * 2);
    return { x, y, data: d };
  });

  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const cpX = (curr.x + next.x) / 2;
      path += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
  };

  const wavePathStr = generateSmoothPath(points);
  const areaPathStr = `${wavePathStr} L ${points[points.length - 1].x} ${svgHeight - 10} L ${points[0].x} ${svgHeight - 10} Z`;

  // 2. Genre Radar Data (6-axis polygon)
  const genres: GenreData[] = [
    { name: 'Sci-Fi', value: 92, color: '#FF4C00' },
    { name: 'Action', value: 85, color: '#FF7A00' },
    { name: 'Thriller', value: 70, color: '#FFA800' },
    { name: 'Drama', value: 55, color: '#38BDF8' },
    { name: 'Horror', value: 65, color: '#A855F7' },
    { name: 'Anime', value: 88, color: '#EC4899' },
  ];

  const radarCenterX = 110;
  const radarCenterY = 110;
  const radarRadius = 80;

  const getRadarCoords = (index: number, total: number, valPercent: number) => {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
    const r = (valPercent / 100) * radarRadius;
    const x = radarCenterX + r * Math.cos(angle);
    const y = radarCenterY + r * Math.sin(angle);
    return { x, y };
  };

  const radarPolygonPoints = genres
    .map((g, i) => {
      const pt = getRadarCoords(i, genres.length, g.value);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  // 3. Hourly Heatmap Data (24 hours intensity: 0 to 10)
  const hourlyIntensity = [
    2, 1, 1, 0, 0, 1, 3, 5, 6, 7, 6, 5,
    6, 7, 8, 9, 8, 9, 10, 10, 9, 7, 5, 3
  ];

  // 4. Device Distribution
  const devices = [
    { name: 'Smart TV (4K)', percentage: 48, count: '1,240 active', icon: Tv, color: '#FF4C00' },
    { name: 'Mobile App', percentage: 30, count: '780 active', icon: Smartphone, color: '#38BDF8' },
    { name: 'Web Browser', percentage: 16, count: '410 active', icon: Monitor, color: '#A855F7' },
    { name: 'Tablet / Other', percentage: 6, count: '150 active', icon: Laptop, color: '#10B981' },
  ];

  // 5. System Event Audit Log Stream
  const eventLogs = [
    { id: 1, type: 'SUCCESS', title: '4K Stream Rendered', details: 'US-East Server • 60 FPS • 18ms Latency', time: 'Just now' },
    { id: 2, type: 'AI SEARCH', title: 'Flix AI Query Executed', details: 'User requested: "Mind-bending sci-fi movies"', time: '2m ago' },
    { id: 3, type: 'INFO', title: 'Database Index Optimized', details: 'MongoDB query time reduced by 14%', time: '5m ago' },
    { id: 4, type: 'PAYMENT', title: 'Stripe Webhook Confirmed', details: 'Premium plan renewed successfully', time: '12m ago' },
  ];

  const mostWatched = history.length > 0
    ? [...history].sort((a, b) => b.hoursWatched - a.hoursWatched).slice(0, 4)
    : [
        { id: '1', title: 'Inception (2010)', hoursWatched: 4.8, progressPercent: 100, unsplash_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80', genres: ['Sci-Fi', 'Action'] },
        { id: '2', title: 'Interstellar (2014)', hoursWatched: 3.5, progressPercent: 85, unsplash_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80', genres: ['Sci-Fi', 'Drama'] },
        { id: '3', title: 'The Dark Knight (2008)', hoursWatched: 2.9, progressPercent: 100, unsplash_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80', genres: ['Action', 'Thriller'] },
        { id: '4', title: 'Blade Runner 2049', hoursWatched: 2.2, progressPercent: 60, unsplash_url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=400&q=80', genres: ['Cyberpunk', 'Sci-Fi'] },
      ];

  return (
    <div className="min-h-screen bg-[#08080A] text-white font-sans selection:bg-[#FF4C00] selection:text-black pb-20 relative overflow-x-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF4C00]/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/5 blur-[140px] pointer-events-none rounded-full" />

      <main className="pt-8 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto flex flex-col gap-8 relative z-10">

        {/* =========================================================
           TOP CONTROL BAR & HEADER
        ========================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#1A1A22] pb-6">
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4C00] to-[#FF7A00] flex items-center justify-center shadow-[0_0_20px_rgba(255,76,0,0.4)] text-black shrink-0">
                <LayoutGrid size={22} className="stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                    Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4C00] to-[#FF7A00]">Center</span>
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FF4C00]/15 border border-[#FF4C00]/30 text-[#FF4C00] text-[10px] font-extrabold uppercase tracking-widest">
                    {roleTitle}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-medium">
                  Real-time streaming telemetry, system diagnostics & viewer intelligence.
                </p>
              </div>
            </div>
          </div>

          {/* Action Tools & Status Indicator */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Live Status Badge */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0F0F14] border border-[#1F1F2A]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
                System Optimal • 99.98%
              </span>
            </div>

            {/* Refresh Data Button */}
            <button
              onClick={refreshDashboard}
              className={`p-2.5 rounded-xl bg-[#0F0F14] border border-[#1F1F2A] text-zinc-400 hover:text-white hover:border-[#FF4C00]/40 transition-all cursor-pointer outline-none ${
                isRefreshing ? 'animate-spin text-[#FF4C00]' : ''
              }`}
              title="Refresh Telemetry"
            >
              <RefreshCw size={16} />
            </button>

            {/* Timeframe Switcher Tabs */}
            <div className="flex items-center gap-1 bg-[#0F0F14] border border-[#1F1F2A] p-1 rounded-xl">
              {(['24h', '7d', '30d', 'ytd'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest rounded-lg transition-all cursor-pointer outline-none ${
                    timeframe === t
                      ? 'bg-gradient-to-r from-[#FF4C00] to-[#FF7A00] text-black shadow-[0_0_12px_rgba(255,76,0,0.3)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* =========================================================
           SECTION 1: CYBERNETIC KPI METRIC CARDS
        ========================================================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* KPI 1 */}
          <div className="relative overflow-hidden bg-gradient-to-b from-[#121218] to-[#0D0D12] border border-[#1E1E28] hover:border-[#FF4C00]/40 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 group shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                Streaming Hours
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00] flex items-center justify-center">
                <Clock size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-white">
                {totalHours > 0 ? `${totalHours.toFixed(1)}h` : '42.8h'}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight size={12} /> +18.4%
              </span>
            </div>
            <div className="w-full bg-[#1A1A24] h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#FF4C00] to-[#FF7A00] h-full w-[78%]" />
            </div>
          </div>

          {/* KPI 2 */}
          <div className="relative overflow-hidden bg-gradient-to-b from-[#121218] to-[#0D0D12] border border-[#1E1E28] hover:border-blue-500/40 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 group shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                Active Concurrent Streams
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <Activity size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-white">
                1,420
              </span>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight size={12} /> +24.1%
              </span>
            </div>
            <div className="w-full bg-[#1A1A24] h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[65%]" />
            </div>
          </div>

          {/* KPI 3 */}
          <div className="relative overflow-hidden bg-gradient-to-b from-[#121218] to-[#0D0D12] border border-[#1E1E28] hover:border-purple-500/40 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 group shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                Watchlist & Saved
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                <Bookmark size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-white">
                {watchlistCount > 0 ? watchlistCount : 24} <span className="text-xs text-zinc-400 font-bold">titles</span>
              </span>
              <span className="text-[10px] font-bold text-purple-400">
                85% Saved Rate
              </span>
            </div>
            <div className="w-full bg-[#1A1A24] h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full w-[85%]" />
            </div>
          </div>

          {/* KPI 4 */}
          <div className="relative overflow-hidden bg-gradient-to-b from-[#121218] to-[#0D0D12] border border-[#1E1E28] hover:border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 group shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                AI Match Accuracy
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-white">
                98.4%
              </span>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                <Zap size={12} /> Optimal
              </span>
            </div>
            <div className="w-full bg-[#1A1A24] h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[98.4%]" />
            </div>
          </div>

        </section>

        {/* =========================================================
           SECTION 2: BEZIER STREAMING TELEMETRY WAVE CHART (HERO)
        ========================================================= */}
        <section className="bg-gradient-to-b from-[#101016] to-[#0A0A0E] border border-[#1E1E2A] rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00]">
                <BarChart3 size={18} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-black uppercase tracking-wider text-white">
                  Real-time Traffic & Bandwidth Wave
                </h3>
                <span className="text-[11px] text-zinc-400 font-medium">
                  Live throughput visualization and stream concurrency curve.
                </span>
              </div>
            </div>

            {/* Interactive Stats Badge */}
            <div className="flex items-center gap-4 bg-[#0A0A0E] border border-[#1E1E28] px-4 py-2 rounded-xl text-xs font-mono">
              <div className="flex flex-col">
                <span className="text-[9px] text-zinc-400 uppercase font-sans">Peak Bandwidth</span>
                <span className="font-bold text-[#FF4C00]">11.4 GB/s</span>
              </div>
              <div className="w-px h-6 bg-[#1E1E28]" />
              <div className="flex flex-col">
                <span className="text-[9px] text-zinc-400 uppercase font-sans">Active Users</span>
                <span className="font-bold text-white">940 Live</span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Bezier Graph */}
          <div className="relative w-full pt-4 pb-2 select-none overflow-hidden">
            
            {/* Tooltip Popup on Hover */}
            {hoveredPoint && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute z-30 pointer-events-none bg-[#0D0D14] border border-[#FF4C00]/40 p-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col gap-1 text-center"
                style={{
                  top: '10px',
                  left: `calc(${((hoveredPointIndex || 0) / (telemetryData.length - 1)) * 80 + 10}%)`
                }}
              >
                <span className="text-[10px] text-[#FF4C00] font-black uppercase tracking-widest">
                  {hoveredPoint.time} Snapshot
                </span>
                <div className="flex items-center gap-3 text-xs font-mono mt-0.5">
                  <span className="text-white font-bold">{hoveredPoint.streams} Streams</span>
                  <span className="text-zinc-400">{hoveredPoint.bandwidthGb} GB/s</span>
                </div>
              </motion.div>
            )}

            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full h-56 sm:h-64 overflow-visible"
            >
              <defs>
                {/* Wave Fill Gradient */}
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF4C00" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#FF4C00" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#FF4C00" stopOpacity="0" />
                </linearGradient>

                {/* Line Glow */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Horizontal Gridlines */}
              {[0.2, 0.5, 0.8].map((ratio, i) => (
                <line
                  key={i}
                  x1={paddingX}
                  y1={svgHeight * ratio}
                  x2={svgWidth - paddingX}
                  y2={svgHeight * ratio}
                  stroke="#1A1A24"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              ))}

              {/* Area Gradient Fill */}
              <path d={areaPathStr} fill="url(#waveGradient)" />

              {/* Bezier Stroke Curve */}
              <path
                d={wavePathStr}
                fill="none"
                stroke="#FF4C00"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#glow)"
              />

              {/* Interactive Data Points & Hover Nodes */}
              {points.map((pt, idx) => {
                const isHovered = hoveredPointIndex === idx;
                return (
                  <g key={idx} className="cursor-pointer">
                    {/* Vertical guideline on hover */}
                    {isHovered && (
                      <line
                        x1={pt.x}
                        y1={paddingY}
                        x2={pt.x}
                        y2={svgHeight - 10}
                        stroke="#FF4C00"
                        strokeDasharray="3 3"
                        strokeWidth="1.5"
                      />
                    )}

                    {/* Node Circle Outer Glow */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 8 : 4}
                      fill="#08080A"
                      stroke="#FF4C00"
                      strokeWidth={isHovered ? 3 : 2}
                      className="transition-all duration-200"
                      onMouseEnter={() => {
                        setHoveredPoint(pt.data);
                        setHoveredPointIndex(idx);
                      }}
                      onMouseLeave={() => {
                        setHoveredPoint(null);
                        setHoveredPointIndex(null);
                      }}
                    />

                    {/* Time Label */}
                    <text
                      x={pt.x}
                      y={svgHeight}
                      fill="#71717A"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="uppercase font-mono tracking-wider"
                    >
                      {pt.data.time}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

        </section>

        {/* =========================================================
           SECTION 3: CYBERNETIC GAUGES & GENRE RADAR POLYGON
        ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT: CYBERNETIC RADIAL SYSTEM GAUGES */}
          <div className="bg-gradient-to-b from-[#101016] to-[#0A0A0E] border border-[#1E1E2A] rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <Cpu size={18} />
                </div>
                <h3 className="text-base font-black uppercase tracking-wider text-white">
                  Telemetry & System Gauges
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">REALTIME DIAGNOSTICS</span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4">
              
              {/* Gauge 1: Bandwidth */}
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#1A1A24" strokeWidth="8" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#FF4C00"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 * (1 - 0.78)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-lg font-black text-white">78%</span>
                    <span className="text-[7px] text-zinc-400 uppercase font-bold">Bandwidth</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-zinc-300">1.4 TB / s</span>
              </div>

              {/* Gauge 2: CDN Cache */}
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#1A1A24" strokeWidth="8" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#10B981"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 * (1 - 0.94)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-lg font-black text-white">94%</span>
                    <span className="text-[7px] text-zinc-400 uppercase font-bold">CDN Cache</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-400">Edge Hit Ratio</span>
              </div>

              {/* Gauge 3: AI Core */}
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#1A1A24" strokeWidth="8" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#A855F7"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 * (1 - 0.42)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-lg font-black text-white">42%</span>
                    <span className="text-[7px] text-zinc-400 uppercase font-bold">AI Core</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-purple-400">84ms Latency</span>
              </div>

            </div>
          </div>

          {/* RIGHT: GENRE SPECTRUM RADAR POLYGON CHART */}
          <div className="bg-gradient-to-b from-[#101016] to-[#0A0A0E] border border-[#1E1E2A] rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <PieChart size={18} />
                </div>
                <h3 className="text-base font-black uppercase tracking-wider text-white">
                  Category Spectrum Radar
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">6-AXIS INTENSITY</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
              
              {/* Radar SVG */}
              <div className="relative w-56 h-56 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 220 220" className="w-full h-full">
                  {/* Concentric grid rings */}
                  {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
                    <circle
                      key={i}
                      cx={radarCenterX}
                      cy={radarCenterY}
                      r={radarRadius * level}
                      fill="none"
                      stroke="#1E1E2A"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Axis lines */}
                  {genres.map((_, idx) => {
                    const pt = getRadarCoords(idx, genres.length, 100);
                    return (
                      <line
                        key={idx}
                        x1={radarCenterX}
                        y1={radarCenterY}
                        x2={pt.x}
                        y2={pt.y}
                        stroke="#1E1E2A"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Radar Polygon Shape */}
                  <polygon
                    points={radarPolygonPoints}
                    fill="#FF4C00"
                    fillOpacity="0.25"
                    stroke="#FF4C00"
                    strokeWidth="2.5"
                  />

                  {/* Axis Vertices */}
                  {genres.map((g, idx) => {
                    const pt = getRadarCoords(idx, genres.length, g.value);
                    const labelPt = getRadarCoords(idx, genres.length, 118);
                    return (
                      <g key={idx}>
                        <circle cx={pt.x} cy={pt.y} r="4" fill={g.color} />
                        <text
                          x={labelPt.x}
                          y={labelPt.y}
                          fill="#A1A1AA"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="uppercase font-mono"
                        >
                          {g.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Genre Stats List */}
              <div className="flex-1 flex flex-col gap-2.5 w-full">
                {genres.map((g, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                      <span className="text-zinc-300 font-medium">{g.name}</span>
                    </div>
                    <span className="text-white font-mono font-bold">{g.value}%</span>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </section>

        {/* =========================================================
           SECTION 4: PEAK VIEWING HEATMAP & DEVICE DISTRIBUTION
        ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 24-HOUR VIEWING INTENSITY HEATMAP (2 COLS) */}
          <div className="lg:col-span-2 bg-gradient-to-b from-[#101016] to-[#0A0A0E] border border-[#1E1E2A] rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Flame size={18} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-black uppercase tracking-wider text-white">
                    Peak Streaming Hours (24-Hour Heatmap)
                  </h3>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    Viewer density by hour of day (Prime time peak: 19:00 - 23:00)
                  </span>
                </div>
              </div>
            </div>

            {/* 24 Hour Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2.5 py-2">
              {hourlyIntensity.map((val, hour) => {
                const alpha = val / 10;
                return (
                  <div
                    key={hour}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-[#1E1E28] bg-[#0A0A0E] hover:border-[#FF4C00]/50 transition-all cursor-pointer group"
                    title={`Hour ${hour}:00 — Intensity ${val}/10`}
                  >
                    <div
                      className="w-full h-8 rounded-lg transition-transform duration-200 group-hover:scale-105"
                      style={{
                        backgroundColor: val === 0 ? '#121218' : `rgba(255, 76, 0, ${Math.max(0.15, alpha)})`,
                        boxShadow: val > 7 ? '0 0 12px rgba(255,76,0,0.4)' : 'none'
                      }}
                    />
                    <span className="text-[9px] font-mono text-zinc-400 font-bold">
                      {hour.toString().padStart(2, '0')}h
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DEVICE DISTRIBUTION (1 COL) */}
          <div className="bg-gradient-to-b from-[#101016] to-[#0A0A0E] border border-[#1E1E2A] rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <Tv size={18} />
              </div>
              <h3 className="text-base font-black uppercase tracking-wider text-white">
                Platform Breakdown
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              {devices.map((d, idx) => {
                const IconComponent = d.icon;
                return (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <IconComponent size={14} style={{ color: d.color }} />
                        <span>{d.name}</span>
                      </div>
                      <span className="font-mono font-bold text-white">{d.percentage}%</span>
                    </div>
                    <div className="w-full bg-[#1A1A24] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${d.percentage}%`, backgroundColor: d.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#1E1E2A] text-center">
              <span className="text-[10px] text-zinc-400 font-mono uppercase">
                4K Ultra HD Enabled on 48% of streams
              </span>
            </div>
          </div>

        </section>

        {/* =========================================================
           SECTION 5: MOST WATCHED TITLES & LIVE EVENT AUDIT LOGS
        ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* MOST WATCHED TITLES */}
          <div className="bg-gradient-to-b from-[#101016] to-[#0A0A0E] border border-[#1E1E2A] rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00]">
                  <Film size={18} />
                </div>
                <h3 className="text-base font-black uppercase tracking-wider text-white">
                  Top Performing Titles
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">VIEWERSHIP LEADERBOARD</span>
            </div>

            <div className="flex flex-col gap-3">
              {mostWatched.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-[#1E1E2A] bg-[#0B0B10] hover:bg-[#14141E] hover:border-[#FF4C00]/30 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      idx === 0
                        ? 'bg-gradient-to-r from-[#FF4C00] to-[#FF7A00] text-black shadow-md'
                        : 'bg-[#181822] text-zinc-400 border border-[#252535]'
                    }`}>
                      #{idx + 1}
                    </span>

                    <img
                      src={item.unsplash_url}
                      alt={item.title}
                      className="w-10 h-12 rounded-lg object-cover bg-zinc-900 shrink-0 border border-zinc-800"
                    />

                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-extrabold text-white truncate group-hover:text-[#FF4C00] transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {item.genres?.slice(0, 2).join(' • ') || 'Feature Film'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-xs font-mono font-black text-[#FF4C00]">
                      {item.hoursWatched} hrs
                    </span>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase">
                      {item.progressPercent}% Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LIVE SYSTEM AUDIT FEED */}
          <div className="bg-gradient-to-b from-[#101016] to-[#0A0A0E] border border-[#1E1E2A] rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Radio size={18} className="animate-pulse" />
                </div>
                <h3 className="text-base font-black uppercase tracking-wider text-white">
                  Live System Audit Telemetry
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">LIVE FEED</span>
            </div>

            <div className="flex flex-col gap-3">
              {eventLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 rounded-2xl border border-[#1E1E2A] bg-[#0B0B10] hover:border-zinc-700 transition-colors"
                >
                  <div className={`mt-0.5 px-2 py-0.5 rounded text-[9px] font-mono font-extrabold shrink-0 ${
                    log.type === 'SUCCESS' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                    log.type === 'AI SEARCH' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' :
                    log.type === 'PAYMENT' ? 'bg-[#FF4C00]/15 text-[#FF4C00] border border-[#FF4C00]/30' :
                    'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  }`}>
                    {log.type}
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white truncate">
                        {log.title}
                      </span>
                      <span className="text-[9px] text-zinc-400 font-mono shrink-0">
                        {log.time}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 truncate mt-0.5">
                      {log.details}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}
