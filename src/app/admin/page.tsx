'use client';

import React, { useState } from 'react';
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
  Eye, 
  RefreshCw, 
  Sliders, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Cpu,
  Bookmark,
  BellRing,
  Filter,
  BarChart2,
  PieChart
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Data types
type TimeRange = '24h' | '7d' | '30d' | '1y';
type ActiveTab = 'revenue' | 'subscribers' | 'churn';

interface ChartPoint {
  date: string;
  revenue: number;
  subscribers: number;
  churn: number;
}

const PERFORMANCE_DATA: Record<TimeRange, ChartPoint[]> = {
  '24h': [
    { date: '00:00', revenue: 4200, subscribers: 320, churn: 12 },
    { date: '04:00', revenue: 2800, subscribers: 210, churn: 8 },
    { date: '08:00', revenue: 6100, subscribers: 450, churn: 15 },
    { date: '12:00', revenue: 9800, subscribers: 890, churn: 22 },
    { date: '16:00', revenue: 14200, subscribers: 1340, churn: 31 },
    { date: '20:00', revenue: 18900, subscribers: 1720, churn: 28 },
    { date: '23:59', revenue: 15400, subscribers: 1410, churn: 19 },
  ],
  '7d': [
    { date: 'Mon', revenue: 24500, subscribers: 1820, churn: 42 },
    { date: 'Tue', revenue: 28900, subscribers: 2140, churn: 38 },
    { date: 'Wed', revenue: 31200, subscribers: 2450, churn: 45 },
    { date: 'Thu', revenue: 36800, subscribers: 2890, churn: 31 },
    { date: 'Fri', revenue: 48900, subscribers: 3910, churn: 29 },
    { date: 'Sat', revenue: 56400, subscribers: 4520, churn: 24 },
    { date: 'Sun', revenue: 51200, subscribers: 4180, churn: 27 },
  ],
  '30d': [
    { date: 'Week 1', revenue: 112000, subscribers: 8900, churn: 140 },
    { date: 'Week 2', revenue: 138000, subscribers: 10400, churn: 165 },
    { date: 'Week 3', revenue: 162000, subscribers: 12800, churn: 132 },
    { date: 'Week 4', revenue: 184920, subscribers: 14890, churn: 118 },
  ],
  '1y': [
    { date: 'Q1', revenue: 420000, subscribers: 32000, churn: 620 },
    { date: 'Q2', revenue: 580000, subscribers: 44000, churn: 580 },
    { date: 'Q3', revenue: 790000, subscribers: 61000, churn: 510 },
    { date: 'Q4', revenue: 1150000, subscribers: 88000, churn: 440 },
  ],
};

const GENRE_DISTRIBUTION = [
  { name: 'Sci-Fi & Cyberpunk', percentage: 34.5, count: 18420, color: '#FF4C00', highlight: 'Dune: Part Two' },
  { name: 'Action & Thriller', percentage: 28.2, count: 14210, color: '#FF7A00', highlight: 'John Wick 4' },
  { name: 'Drama & Mystery', percentage: 18.6, count: 9450, color: '#EAB308', highlight: 'Oppenheimer' },
  { name: 'Horror & Supernatural', percentage: 12.1, count: 6100, color: '#A855F7', highlight: 'Alien: Romulus' },
  { name: 'Animation & Anime', percentage: 6.6, count: 3340, color: '#06B6D4', highlight: 'Arcane S2' },
];

const SERVER_NODES = [
  { id: 'us-east', name: 'US East (N. Virginia)', latency: '18ms', load: 42, status: 'Optimal', region: 'North America' },
  { id: 'eu-central', name: 'EU Central (Frankfurt)', latency: '24ms', load: 58, status: 'Optimal', region: 'Europe' },
  { id: 'ap-east', name: 'AP East (Tokyo)', latency: '38ms', load: 31, status: 'Stable', region: 'Asia-Pacific' },
  { id: 'ap-south', name: 'AP South (Singapore)', latency: '45ms', load: 49, status: 'Stable', region: 'Asia-Pacific' },
  { id: 'sa-east', name: 'SA East (São Paulo)', latency: '52ms', load: 67, status: 'Stable', region: 'South America' },
];

const LIVE_EVENTS = [
  { id: 1, type: 'subscription', title: 'New Premium Subscription ($14.99/mo)', user: 'alex_dev', time: '2 mins ago', icon: DollarSign, badge: 'REVENUE' },
  { id: 2, type: 'ai', title: 'AI Query Peak: "Mind-bending Sci-Fi like Inception"', user: 'Viewer #4829', time: '5 mins ago', icon: Sparkles, badge: 'AI ENGINE' },
  { id: 3, type: 'security', title: 'Blocked 3 suspicious login attempts', user: 'IP 185.220.101.4', time: '12 mins ago', icon: AlertTriangle, badge: 'SECURITY' },
  { id: 4, type: 'catalogue', title: 'Updated stream CDN manifest for Oppenheimer 4K', user: 'Admin ZM', time: '24 mins ago', icon: Film, badge: 'CATALOGUE' },
  { id: 5, type: 'subscription', title: 'New Standard Subscription ($11.99/mo)', user: 'sarah_m', time: '32 mins ago', icon: DollarSign, badge: 'REVENUE' },
];

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [activeMetric, setActiveMetric] = useState<ActiveTab>('revenue');
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentData = PERFORMANCE_DATA[timeRange];

  // SVG Chart calculation helpers
  const maxVal = Math.max(...currentData.map(d => d[activeMetric])) * 1.15;
  const chartHeight = 220;
  const chartWidth = 700;

  const points = currentData.map((d, index) => {
    const x = (index / (currentData.length - 1)) * chartWidth;
    const y = chartHeight - (d[activeMetric] / maxVal) * chartHeight;
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Live telemetry data synchronized!');
    }, 700);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto select-none">
      
      {/* 1. COMMAND CENTER HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-[#1A1A1A] bg-gradient-to-r from-[#0E0E0E] via-[#080808] to-[#0A0A0A] p-6 sm:p-8 shadow-2xl">
        {/* Glow ambient background mesh */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4C00]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4C00]/15 border border-[#FF4C00]/30 text-[#FF4C00] text-xs font-bold tracking-widest uppercase backdrop-blur-md">
              <Radio size={14} className="animate-pulse text-[#FF4C00]" />
              <span>COMMAND CENTER ACTIVE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-sans">
              Flixora <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4C00] via-[#FF7A00] to-[#EAB308]">Control Hub</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-medium max-w-2xl">
              Live telemetry monitoring stream throughput, financial velocity, subscriber churn, and global CDN node integrity.
            </p>
          </div>

          {/* Controls & Time Range Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-[#141414] border border-[#222] rounded-2xl p-1 shadow-inner">
              {(['24h', '7d', '30d', '1y'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all uppercase cursor-pointer ${
                    timeRange === range
                      ? 'bg-[#FF4C00] text-black shadow-[0_0_12px_rgba(255,76,0,0.4)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            <button
              onClick={handleRefreshData}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-[#222] bg-[#141414] text-zinc-300 hover:text-white hover:border-[#FF4C00]/40 transition-all text-xs font-bold cursor-pointer outline-none"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#FF4C00]' : ''} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Telemetry'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. UNIQUE METRIC CARDS & MICRO GAUGES (4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Monthly Recurring Revenue */}
        <div className="relative group overflow-hidden rounded-2xl border border-[#1A1A1A] bg-[#0C0C0C] p-5 hover:border-[#FF4C00]/40 transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Monthly Revenue (MRR)</span>
            <div className="w-9 h-9 rounded-xl bg-[#FF4C00]/10 border border-[#FF4C00]/20 flex items-center justify-center text-[#FF4C00]">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">$184,920</span>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <ArrowUpRight size={13} /> +14.8%
            </span>
          </div>
          {/* Micro Sparkline */}
          <div className="w-full h-8 mt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M0 25 Q 25 10, 50 18 T 100 5" fill="none" stroke="#FF4C00" strokeWidth="2.5" />
              <path d="M0 25 Q 25 10, 50 18 T 100 5 L 100 30 L 0 30 Z" fill="url(#sparkline-grad)" opacity="0.25" />
              <defs>
                <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF4C00" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Metric 2: Active Subscribers & Tier Split */}
        <div className="relative group overflow-hidden rounded-2xl border border-[#1A1A1A] bg-[#0C0C0C] p-5 hover:border-[#FF4C00]/40 transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Paid Subs</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Users size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">14,890</span>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <ArrowUpRight size={13} /> +8.2%
            </span>
          </div>
          {/* Tier Distribution Bar */}
          <div className="space-y-1 mt-2">
            <div className="flex h-2.5 w-full rounded-full bg-[#181818] overflow-hidden">
              <div className="bg-amber-500 h-full w-[30%]" title="Premium 30%" />
              <div className="bg-[#FF4C00] h-full w-[45%]" title="Standard 45%" />
              <div className="bg-zinc-600 h-full w-[25%]" title="Basic 25%" />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-400 font-bold uppercase pt-0.5">
              <span className="text-amber-400">Prem: 30%</span>
              <span className="text-[#FF4C00]">Std: 45%</span>
              <span className="text-zinc-500">Bsc: 25%</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Live Streaming Bandwidth */}
        <div className="relative group overflow-hidden rounded-2xl border border-[#1A1A1A] bg-[#0C0C0C] p-5 hover:border-[#FF4C00]/40 transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Live Stream Load</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Tv size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">1.42 TB/s</span>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
              4,120 4K Screens
            </span>
          </div>
          {/* Server Load Meter */}
          <div className="space-y-1 mt-2">
            <div className="flex justify-between text-[10px] font-bold text-zinc-400">
              <span>CDN Throughput Capacity</span>
              <span className="text-cyan-400">64% Load</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-[#181818] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-[#FF4C00] rounded-full transition-all duration-500" style={{ width: '64%' }} />
            </div>
          </div>
        </div>

        {/* Metric 4: AI Recommendation Precision */}
        <div className="relative group overflow-hidden rounded-2xl border border-[#1A1A1A] bg-[#0C0C0C] p-5 hover:border-[#FF4C00]/40 transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">AI Search Accuracy</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">94.2%</span>
            <span className="flex items-center gap-1 text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
              342.8K Queries
            </span>
          </div>
          {/* AI Mood Match Meter */}
          <div className="space-y-1 mt-2">
            <div className="flex justify-between text-[10px] font-bold text-zinc-400">
              <span>Mood Vector Precision</span>
              <span className="text-purple-400">High Confidence</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-[#181818] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-[#FF4C00] rounded-full" style={{ width: '94.2%' }} />
            </div>
          </div>
        </div>

      </div>

      {/* 3. DUAL INTERACTIVE MAIN CHARTS (ROW 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Chart: Interactive Revenue Velocity & Subscriber Curve (8-col) */}
        <div className="lg:col-span-8 rounded-3xl border border-[#1A1A1A] bg-[#0C0C0C] p-6 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A1A1A]">
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <BarChart2 size={18} className="text-[#FF4C00]" />
                Telemetry Velocity & Growth Graph
              </h2>
              <p className="text-xs text-zinc-400">Interactive telemetry curve displaying dynamic revenue & active subscription trends.</p>
            </div>

            {/* Metric Switcher Pills */}
            <div className="flex items-center bg-[#141414] border border-[#222] rounded-xl p-1">
              <button
                onClick={() => setActiveMetric('revenue')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeMetric === 'revenue' ? 'bg-[#FF4C00] text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Revenue ($)
              </button>
              <button
                onClick={() => setActiveMetric('subscribers')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeMetric === 'subscribers' ? 'bg-[#FF4C00] text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Subscribers
              </button>
              <button
                onClick={() => setActiveMetric('churn')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeMetric === 'churn' ? 'bg-[#FF4C00] text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Churn Rate
              </button>
            </div>
          </div>

          {/* SVG Vector Chart with Glow */}
          <div className="relative w-full overflow-x-auto pt-4 pb-2">
            <svg
              className="w-full h-[240px] overflow-visible"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF4C00" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#FF4C00" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={chartHeight * ratio}
                  x2={chartWidth}
                  y2={chartHeight * ratio}
                  stroke="#1F1F1F"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Area Gradient Fill */}
              <path d={areaD} fill="url(#areaGradient)" />

              {/* Smooth Main Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#FF4C00"
                strokeWidth="3.5"
                filter="url(#glow)"
              />

              {/* Interactive Hover Data Points */}
              {points.map((pt, i) => {
                const isHovered = hoveredPoint?.date === pt.data.date;
                return (
                  <g key={i} className="cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? "7" : "4.5"}
                      fill={isHovered ? "#FFFFFF" : "#FF4C00"}
                      stroke="#0C0C0C"
                      strokeWidth="2.5"
                      onMouseEnter={() => setHoveredPoint(pt.data)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="transition-all duration-150"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div className="absolute top-2 right-4 bg-[#141414] border border-[#FF4C00]/40 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs space-y-1 z-30 animate-in fade-in duration-200">
                <p className="font-mono text-zinc-400 font-bold uppercase">{hoveredPoint.date}</p>
                <p className="font-bold text-white">
                  Revenue: <span className="text-[#FF4C00]">${hoveredPoint.revenue.toLocaleString()}</span>
                </p>
                <p className="font-bold text-white">
                  Subscribers: <span className="text-amber-400">{hoveredPoint.subscribers.toLocaleString()}</span>
                </p>
                <p className="font-bold text-white">
                  Churn: <span className="text-rose-400">{hoveredPoint.churn} users</span>
                </p>
              </div>
            )}
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-between text-xs font-mono font-bold text-zinc-500 pt-2 border-t border-[#181818]">
            {currentData.map((d, i) => (
              <span key={i} className="hover:text-white transition-colors cursor-default">
                {d.date}
              </span>
            ))}
          </div>
        </div>

        {/* Right Chart: Genre Audience Radar & Distribution (4-col) */}
        <div className="lg:col-span-4 rounded-3xl border border-[#1A1A1A] bg-[#0C0C0C] p-6 space-y-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A] mb-4">
              <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <PieChart size={18} className="text-[#FF4C00]" />
                Audience Genre Share
              </h2>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                Live Streamed
              </span>
            </div>

            {/* Genre Progress Segment Bars */}
            <div className="space-y-4">
              {GENRE_DISTRIBUTION.map((genre) => (
                <div key={genre.name} className="space-y-1.5 group">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-200 group-hover:text-[#FF4C00] transition-colors">{genre.name}</span>
                    <span className="text-zinc-400 font-mono">{genre.percentage}% ({genre.count.toLocaleString()} viewers)</span>
                  </div>
                  <div className="h-2 w-full bg-[#181818] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 group-hover:brightness-125"
                      style={{
                        width: `${genre.percentage}%`,
                        backgroundColor: genre.color,
                        boxShadow: `0 0 10px ${genre.color}40`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400 font-mono">Top Streamed: <span className="text-white font-bold">{genre.highlight}</span></p>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Cinema Spotlight Box */}
          <div className="p-3.5 rounded-2xl border border-[#222] bg-[#141414]/60 backdrop-blur-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF4C00]/15 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00] shrink-0 font-bold">
              🎬
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Top Streaming Movie</p>
              <p className="text-xs font-black text-white truncate">Dune: Part Two (4K HDR)</p>
            </div>
          </div>
        </div>

      </div>

      {/* 4. SERVER HEALTH NODES & LIVE EVENT LOGS (ROW 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Global CDN Streaming Server Nodes (6-col) */}
        <div className="lg:col-span-6 rounded-3xl border border-[#1A1A1A] bg-[#0C0C0C] p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
            <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Globe size={18} className="text-cyan-400" />
              Global Streaming CDN Nodes
            </h2>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
              5 Nodes Online
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {SERVER_NODES.map((node) => (
              <div
                key={node.id}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-[#181818] bg-[#111111] hover:border-cyan-500/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">{node.name}</p>
                    <p className="text-[10px] text-zinc-400 font-mono">{node.region}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-white">{node.latency}</p>
                    <p className="text-[10px] font-bold text-zinc-400">{node.load}% Load</p>
                  </div>
                  <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                    {node.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Real-time Live Event & Audit Stream (6-col) */}
        <div className="lg:col-span-6 rounded-3xl border border-[#1A1A1A] bg-[#0C0C0C] p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
            <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Activity size={18} className="text-[#FF4C00]" />
              Live Platform Audit Logs
            </h2>
            <span className="text-xs font-bold text-[#FF4C00] bg-[#FF4C00]/10 px-2.5 py-0.5 rounded-full border border-[#FF4C00]/20">
              Live Stream Ticker
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {LIVE_EVENTS.map((event) => {
              const IconComponent = event.icon;
              return (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-[#181818] bg-[#111111] hover:border-[#FF4C00]/40 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#1A1A1A] border border-zinc-800 flex items-center justify-center text-[#FF4C00] shrink-0">
                      <IconComponent size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{event.title}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">{event.user} • {event.time}</p>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono font-bold text-zinc-300 bg-[#1A1A1A] px-2 py-1 rounded border border-zinc-800 uppercase shrink-0">
                    {event.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 5. QUICK ADMIN COMMAND HUB (ROW 4) */}
      <div className="rounded-3xl border border-[#1A1A1A] bg-gradient-to-r from-[#0E0E0E] via-[#0A0A0A] to-[#0E0E0E] p-6 shadow-2xl space-y-4">
        <h2 className="text-md font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Zap size={18} className="text-amber-500" />
          Quick Admin Action Hub
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => toast.success('Hero Banner updated with latest movie premiere!')}
            className="flex items-center gap-3 p-4 rounded-2xl border border-[#222] bg-[#141414] hover:bg-[#1A1A1A] hover:border-[#FF4C00]/40 transition-all text-left group cursor-pointer outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00] group-hover:scale-110 transition-transform">
              <Film size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-[#FF4C00] transition-colors">Pin Banner Movie</p>
              <p className="text-[10px] text-zinc-400">Update homepage carousel</p>
            </div>
          </button>

          <button
            onClick={() => toast.success('Redis CDN cache cleared successfully!')}
            className="flex items-center gap-3 p-4 rounded-2xl border border-[#222] bg-[#141414] hover:bg-[#1A1A1A] hover:border-cyan-500/40 transition-all text-left group cursor-pointer outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Cpu size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">Flush CDN Cache</p>
              <p className="text-[10px] text-zinc-400">Clear global edge memory</p>
            </div>
          </button>

          <button
            onClick={() => toast.success('Global sitewide notice broadcasted to viewers!')}
            className="flex items-center gap-3 p-4 rounded-2xl border border-[#222] bg-[#141414] hover:bg-[#1A1A1A] hover:border-purple-500/40 transition-all text-left group cursor-pointer outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <BellRing size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">Global Broadcast</p>
              <p className="text-[10px] text-zinc-400">Send sitewide alert banner</p>
            </div>
          </button>

          <button
            onClick={() => toast.success('Security Audit scan initiated!')}
            className="flex items-center gap-3 p-4 rounded-2xl border border-[#222] bg-[#141414] hover:bg-[#1A1A1A] hover:border-emerald-500/40 transition-all text-left group cursor-pointer outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Run Security Scan</p>
              <p className="text-[10px] text-zinc-400">Audit system security logs</p>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
}
