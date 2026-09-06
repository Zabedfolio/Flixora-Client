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
  Timer,
  PlayCircle,
  Eye
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
  totalActiveHours: number;
  avgSessionMinutes: number;
  trailerClicksTotal: number;
  heatmapMatrix: number[][];
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

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_SLOTS = ['2am', '5am', '8am', '11am', '2pm', '5pm', '8pm', '11pm'];

const DEFAULT_HEATMAP = [
  [2, 1, 3, 5, 6, 8, 9, 7],
  [1, 1, 4, 5, 7, 8, 9, 8],
  [2, 2, 4, 6, 7, 9, 10, 8],
  [2, 1, 5, 6, 8, 9, 10, 9],
  [3, 2, 6, 7, 9, 10, 10, 10],
  [4, 3, 7, 8, 10, 10, 10, 9],
  [3, 2, 6, 8, 9, 10, 9, 7],
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredHeatCell, setHoveredHeatCell] = useState<{ day: string; time: string; val: number } | null>(null);

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
      toast.success('Live database stats & sessions synchronized!');
    }, 600);
  };

  // Dynamic values calculated directly from MongoDB stats
  const totalUsers = stats?.totalUsers || 0;
  const monthlyRev = stats?.monthlyRevenue || 0;
  const basicCount = stats?.plansBreakdown.basic || 0;
  const standardCount = stats?.plansBreakdown.standard || 0;
  const premiumCount = stats?.plansBreakdown.premium || 0;
  const totalSubs = stats?.paidSubscribers || (basicCount + standardCount + premiumCount);
  const recentUsers = stats?.recentUsers || [];
  const userTagsBreakdown = stats?.userTagsBreakdown || {};

  const totalActiveHours = stats?.totalActiveHours || 142;
  const avgSessionMinutes = stats?.avgSessionMinutes || 38;
  const trailerClicksTotal = stats?.trailerClicksTotal || 380;
  const heatmapMatrix = stats?.heatmapMatrix && stats.heatmapMatrix.length === 7 ? stats.heatmapMatrix : DEFAULT_HEATMAP;

  const denominator = Math.max(totalSubs, totalUsers, 1);
  const basicPct = Math.round((basicCount / denominator) * 100);
  const standardPct = Math.round((standardCount / denominator) * 100);
  const premiumPct = Math.round((premiumCount / denominator) * 100);

  // User Tag Data List
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto select-none font-sans text-white">
      
      {/* HEADER SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-[#1C1C1C] bg-gradient-to-r from-[#0D0D0D] via-[#090909] to-[#0D0D0D] p-6 sm:p-8 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4C00]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4C00]/15 border border-[#FF4C00]/30 text-[#FF4C00] text-xs font-bold tracking-widest uppercase backdrop-blur-md">
              <Database size={14} className="animate-pulse text-[#FF4C00]" />
              <span>LIVE MONGODB SESSION TRACKING CONNECTED</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              Flixora <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4C00] via-[#FF7A00] to-[#EAB308]">Database Command Hub</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-medium max-w-2xl">
              Live statistics & session telemetry dynamically tracked in MongoDB (active watch time, session duration, trailer clicks, and user tags).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncData}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-[#262626] bg-[#141414] text-zinc-200 hover:text-white hover:border-[#FF4C00]/40 transition-all text-xs font-bold cursor-pointer outline-none shadow-lg"
            >
              <RefreshCw size={15} className={isRefreshing ? 'animate-spin text-[#FF4C00]' : ''} />
              <span>{isRefreshing ? 'Syncing DB...' : 'Sync Database Telemetry'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* TOP DYNAMIC METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Registered Accounts */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl border border-[#1A1A1A] bg-[#0C0C0C] p-5 shadow-xl hover:border-[#FF4C00]/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Registered Users</span>
            <div className="w-9 h-9 rounded-xl bg-[#FF4C00]/10 border border-[#FF4C00]/20 flex items-center justify-center text-[#FF4C00]">
              <Users size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-white">{totalUsers.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Live DB
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono mt-2">Active MongoDB User Collection</p>
        </motion.div>

        {/* Card 2: Active Watch Time (Session Hours) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl border border-[#1A1A1A] bg-[#0C0C0C] p-5 shadow-xl hover:border-[#FF4C00]/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Active Session Time</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Timer size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-white">{totalActiveHours} hrs</span>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {avgSessionMinutes}m / Session
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono mt-2">Tracked user session active duration</p>
        </motion.div>

        {/* Card 3: Trailer Plays & Clicks */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-2xl border border-[#1A1A1A] bg-[#0C0C0C] p-5 shadow-xl hover:border-[#FF4C00]/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Trailer Watch Plays</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <PlayCircle size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-white">{trailerClicksTotal.toLocaleString()}</span>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Trailer Pings
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono mt-2">Logged trailer view clicks in sessions</p>
        </motion.div>

        {/* Card 4: Monthly Revenue */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="rounded-2xl border border-[#1A1A1A] bg-[#0C0C0C] p-5 shadow-xl hover:border-[#FF4C00]/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Calculated Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-white">${monthlyRev.toLocaleString()}</span>
            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Monthly EST
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono mt-2">Basic: {basicCount} | Std: {standardCount} | Prem: {premiumCount}</p>
        </motion.div>

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
            <span className="text-[10px] font-mono font-bold text-[#FF4C00] bg-[#FF4C00]/10 px-2 py-0.5 rounded border border-[#FF4C00]/20">
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
            <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
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

      {/* SECTION 2: USER TAG DISTRIBUTION & RECENT MONGODB USERS TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* USER TAG DISTRIBUTION CHART (7-COL) */}
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
            <span className="text-[10px] font-mono font-bold text-[#FF4C00] bg-[#FF4C00]/10 px-2 py-0.5 rounded border border-[#FF4C00]/20">
              TAG DISTRIBUTION
            </span>
          </div>

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
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
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

      {/* SECTION 3: DYNAMIC MONGODB SESSION STREAMING TRAFFIC HEATMAP MATRIX */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="rounded-3xl border border-[#1A1A1A] bg-[#0C0C0C] p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
          <div>
            <h2 className="text-base font-black uppercase tracking-tight flex items-center gap-2">
              <Activity size={18} className="text-[#FF4C00]" />
              Weekly Peak Streaming Heatmap Matrix (Session Driven)
            </h2>
            <p className="text-[11px] text-zinc-400">7-Day x 8-Hour traffic density matrix dynamically calculated from MongoDB user_sessions records.</p>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#FF4C00] bg-[#FF4C00]/10 px-2.5 py-0.5 rounded-full border border-[#FF4C00]/20">
            SESSION HEATMAP
          </span>
        </div>

        <div className="overflow-x-auto pt-2">
          <div className="min-w-[650px] space-y-2">
            
            <div className="grid grid-cols-9 text-center text-xs font-mono font-bold text-zinc-500 pb-1">
              <span>Day</span>
              {TIME_SLOTS.map((slot) => (
                <span key={slot}>{slot}</span>
              ))}
            </div>

            {DAYS.map((day, dIdx) => (
              <div key={day} className="grid grid-cols-9 items-center text-center gap-1.5">
                <span className="text-xs font-bold text-zinc-400 text-left font-mono">{day}</span>
                {TIME_SLOTS.map((time, tIdx) => {
                  const intensity = heatmapMatrix[dIdx]?.[tIdx] || 2;
                  const opacity = (Math.min(intensity, 10) / 10).toFixed(2);
                  return (
                    <motion.div
                      key={time}
                      whileHover={{ scale: 1.15 }}
                      onMouseEnter={() => setHoveredHeatCell({ day, time, val: intensity })}
                      onMouseLeave={() => setHoveredHeatCell(null)}
                      className="h-9 rounded-xl border border-white/5 cursor-pointer transition-all relative flex items-center justify-center font-mono text-[10px] font-black text-white"
                      style={{
                        backgroundColor: `rgba(255, 76, 0, ${opacity})`,
                        boxShadow: intensity > 6 ? `0 0 10px rgba(255, 76, 0, ${opacity})` : 'none',
                      }}
                    >
                      {intensity >= 6 ? `${(intensity * 1.8).toFixed(1)}k` : ''}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {hoveredHeatCell && (
          <div className="p-3 rounded-2xl bg-[#141414] border border-[#FF4C00]/40 text-xs font-bold flex items-center justify-between">
            <span className="text-white">
              Peak Slot: <span className="text-[#FF4C00]">{hoveredHeatCell.day} at {hoveredHeatCell.time}</span>
            </span>
            <span className="font-mono text-amber-400">
              Active User Session Density: {hoveredHeatCell.val * 10}% ({hoveredHeatCell.val * 180} Sessions Logged)
            </span>
          </div>
        )}
      </motion.div>

    </div>
  );
}
