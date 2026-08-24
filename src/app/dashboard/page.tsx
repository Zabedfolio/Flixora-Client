'use client';

import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Clock, 
  Play, 
  Check, 
  Bookmark, 
  Flame, 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  Info,
  Tv
} from 'lucide-react';

// Mock data structures
interface StatCard {
  id: string;
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  iconBg: string;
  iconColor: string;
}

interface ChartBar {
  label: string;
  value: number;
  date: string;
}

const STAT_CARDS: StatCard[] = [
  { 
    id: 'hours', 
    label: 'Total Hours This Month', 
    value: '42.5 hrs', 
    icon: Clock, 
    iconBg: 'bg-[#FF4C00]/10 border border-[#FF4C00]/30', 
    iconColor: 'text-[#FF4C00]' 
  },
  { 
    id: 'watching', 
    label: 'Continue Watching', 
    value: '3 titles', 
    icon: Play, 
    iconBg: 'bg-blue-500/10 border border-blue-500/20', 
    iconColor: 'text-blue-400' 
  },
  { 
    id: 'completed', 
    label: 'Completed This Month', 
    value: '8 titles', 
    icon: Check, 
    iconBg: 'bg-emerald-500/10 border border-emerald-500/20', 
    iconColor: 'text-emerald-400' 
  },
  { 
    id: 'watchlist', 
    label: 'Watchlist Size', 
    value: '14 titles', 
    icon: Bookmark, 
    iconBg: 'bg-purple-500/10 border border-purple-500/20', 
    iconColor: 'text-purple-400' 
  }
];

const DAILY_DATA: ChartBar[] = [
  { label: 'Mon', value: 1.2, date: 'Aug 17' },
  { label: 'Tue', value: 2.5, date: 'Aug 18' },
  { label: 'Wed', value: 0.8, date: 'Aug 19' },
  { label: 'Thu', value: 3.2, date: 'Aug 20' },
  { label: 'Fri', value: 4.5, date: 'Aug 21' },
  { label: 'Sat', value: 6.2, date: 'Aug 22' },
  { label: 'Sun', value: 5.0, date: 'Aug 23' }
];

const WEEKLY_DATA: ChartBar[] = [
  { label: 'Week 1', value: 10.5, date: 'Aug 01 - Aug 07' },
  { label: 'Week 2', value: 14.2, date: 'Aug 08 - Aug 14' },
  { label: 'Week 3', value: 9.8, date: 'Aug 15 - Aug 21' },
  { label: 'Week 4', value: 8.0, date: 'Aug 22 - Aug 28' }
];

const MONTHLY_DATA: ChartBar[] = [
  { label: 'Mar', value: 28.0, date: 'March 2026' },
  { label: 'Apr', value: 35.5, date: 'April 2026' },
  { label: 'May', value: 48.2, date: 'May 2026' },
  { label: 'Jun', value: 31.0, date: 'June 2026' },
  { label: 'Jul', value: 52.0, date: 'July 2026' },
  { label: 'Aug', value: 42.5, date: 'August 2026' }
];

const TOP_WATCHED = [
  { rank: 1, title: 'Wednesday', hours: '12.4 hrs', unsplash_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=150&auto=format&fit=crop' },
  { rank: 2, title: 'Stranger Things', hours: '9.2 hrs', unsplash_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=150&auto=format&fit=crop' },
  { rank: 3, title: 'Oppenheimer', hours: '6.2 hrs', unsplash_url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=150&auto=format&fit=crop' },
  { rank: 4, title: 'The Last of Us', hours: '4.8 hrs', unsplash_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=150&auto=format&fit=crop' }
];

const TASTE_TAGS = [
  { label: 'Slow-burn', size: 'text-sm' },
  { label: 'Sci-Fi', size: 'text-lg font-bold' },
  { label: 'Morally Grey Characters', size: 'text-sm font-semibold' },
  { label: 'Anime', size: 'text-base font-bold' },
  { label: 'Plot Twists', size: 'text-sm' },
  { label: 'Cyberpunk Aesthetic', size: 'text-base font-semibold' },
  { label: 'Mystery Thriller', size: 'text-md font-bold' },
  { label: 'Dark Fantasy', size: 'text-xs font-semibold' }
];

export default function UserDashboardPage() {
  const [chartTab, setChartTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  const getChartData = () => {
    switch (chartTab) {
      case 'daily': return DAILY_DATA;
      case 'weekly': return WEEKLY_DATA;
      case 'monthly': return MONTHLY_DATA;
    }
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map(b => b.value));

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans relative">
      <main className="pt-8 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full select-none flex flex-col gap-8">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <LayoutGrid className="text-[#FF4C00] shrink-0" size={24} />
              <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase">
                <span className="text-white">User</span> <span className="text-[#FF4C00]">Dashboard</span>
              </h1>
            </div>
            <p className="text-xs md:text-sm text-zinc-400 font-medium max-w-2xl leading-relaxed">
              Welcome back. Here's your viewing activity and analytics at a glance.
            </p>
          </div>

          {/* Top-right Profile Mirror badge */}
          <div className="flex items-center gap-3 bg-[#0A0A0A] border border-[#1A1A1A] px-4 py-2 rounded-2xl w-fit shrink-0 self-start sm:self-center">
            <div className="w-8 h-8 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center font-bold text-white shadow-inner">
              U
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-white">User Portal</span>
              <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider">Premium Member</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: QUICK STAT CARDS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STAT_CARDS.map((card) => {
            const CardIcon = card.icon;
            return (
              <div 
                key={card.id} 
                className="bg-[#141414] border border-[#1A1A1A] rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:border-[#FF4C00]/25 transition-all"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg} ${card.iconColor} shrink-0`}>
                  <CardIcon size={18} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                    {card.label}
                  </span>
                  <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {card.value}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* SECTION 2: WATCH TIME CHART (MAIN HERO) */}
        <section className="bg-[#141414] border border-[#1A1A1A] rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Watch Time
            </h3>
            
            {/* Toggle pill tabs */}
            <div className="flex items-center gap-2 bg-[#0E0E0E] border border-[#1A1A1A] p-1.5 rounded-xl w-fit overflow-x-auto scrollbar-none shrink-0">
              {[
                { id: 'daily', label: 'Daily' },
                { id: 'weekly', label: 'Weekly' },
                { id: 'monthly', label: 'Monthly' }
              ].map((tab) => {
                const isActive = chartTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setChartTab(tab.id as any)}
                    className={`px-4.5 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all shrink-0 outline-none cursor-pointer ${
                      isActive
                        ? 'bg-[#FF4C00] text-black font-extrabold shadow-sm'
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bar Chart Rendering */}
          <div className="relative pt-6 pb-2 overflow-visible">
            
            {/* Custom SVG gridlines and Bars */}
            <div className="h-64 w-full flex items-end justify-between gap-4 md:gap-8 border-b border-zinc-800 pb-1 relative overflow-visible">
              
              {/* Tooltip Overlay */}
              {hoveredBarIndex !== null && (
                <div 
                  className="absolute bg-[#0E0E0E] border border-[#FF4C00]/30 shadow-2xl px-3.5 py-2.5 rounded-xl z-30 pointer-events-none flex flex-col gap-0.5 text-center animate-in fade-in zoom-in-95 duration-150"
                  style={{
                    bottom: '280px',
                    left: `${(hoveredBarIndex / chartData.length) * 90 + 5}%`
                  }}
                >
                  <span className="text-[9px] text-[#FF4C00] font-black uppercase tracking-wider">
                    {chartData[hoveredBarIndex].value.toFixed(1)} Hours
                  </span>
                  <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">
                    {chartData[hoveredBarIndex].date}
                  </span>
                </div>
              )}

              {chartData.map((bar, index) => {
                const heightPercent = `${(bar.value / maxValue) * 85 + 5}%`;
                
                return (
                  <div 
                    key={index} 
                    className="flex-grow flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                    onMouseEnter={() => setHoveredBarIndex(index)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                  >
                    {/* Bar filled in orange gradient */}
                    <div 
                      className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-orange-950/80 to-[#FF4C00] group-hover:to-[#ff6222] transition-all duration-300 relative"
                      style={{ height: heightPercent }}
                    />
                    
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 group-hover:text-white transition-colors">
                      {bar.label}
                    </span>
                  </div>
                );
              })}
            </div>
            
          </div>
        </section>

        {/* SECTION 3: FAVORITE GENRE & TOP WATCHED */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Favorite Genre Donut Chart */}
          <div className="bg-[#141414] border border-[#1A1A1A] rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Your Favorite Genres
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
              {/* Donut SVG */}
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center select-none">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Outer circle track */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#0E0E0E" strokeWidth="3" />
                  
                  {/* Sci-Fi (40%) */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#FF4C00" strokeWidth="3" 
                    strokeDasharray="40 60" strokeDashoffset="0" />
                  
                  {/* Drama (30%) */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#cc3d00" strokeWidth="3" 
                    strokeDasharray="30 70" strokeDashoffset="-40" />
                  
                  {/* Action (20%) */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#8c2b00" strokeWidth="3" 
                    strokeDasharray="20 80" strokeDashoffset="-70" />
                  
                  {/* Other (10%) */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3d1300" strokeWidth="3" 
                    strokeDasharray="10 90" strokeDashoffset="-90" />
                </svg>

                <div className="absolute flex flex-col text-center gap-0.5">
                  <span className="text-xl font-black text-white">40%</span>
                  <span className="text-[7px] text-zinc-500 font-bold uppercase tracking-widest">Sci-Fi</span>
                </div>
              </div>

              {/* Legends list */}
              <div className="flex-1 flex flex-col gap-3.5 w-full">
                {[
                  { name: 'Sci-Fi', percent: '40%', color: 'bg-[#FF4C00]' },
                  { name: 'Drama', percent: '30%', color: 'bg-[#cc3d00]' },
                  { name: 'Action', percent: '20%', color: 'bg-[#8c2b00]' },
                  { name: 'Other', percent: '10%', color: 'bg-[#3d1300]' }
                ].map((genre, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-md ${genre.color} shrink-0`} />
                      <span className="text-zinc-400 font-medium">{genre.name}</span>
                    </div>
                    <span className="text-white font-bold">{genre.percent}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Watched Titles */}
          <div className="bg-[#141414] border border-[#1A1A1A] rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Most Watched Titles
            </h3>

            <div className="flex flex-col gap-4">
              {TOP_WATCHED.map((item) => (
                <div 
                  key={item.rank}
                  className="flex items-center justify-between gap-4 p-2.5 rounded-xl border border-[#1A1A1A] bg-[#0E0E0E]/40 hover:bg-[#1A1A1A]/40 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Rank Badge */}
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                      item.rank === 1 
                        ? 'bg-[#FF4C00] text-black shadow-sm' 
                        : 'bg-[#141414] text-zinc-550 border border-zinc-900'
                    }`}>
                      {item.rank}
                    </span>

                    {/* Thumbnail Poster */}
                    <img 
                      src={item.unsplash_url} 
                      alt="" 
                      className="w-8 h-10 rounded object-cover bg-zinc-950 shrink-0 border border-zinc-900" 
                    />

                    <span className="text-xs font-bold text-white truncate min-w-0">
                      {item.title}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#FF4C00] shrink-0 font-mono">
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* SECTION 4: TASTE PROFILE (TAG CLOUD) */}
        <section className="bg-[#141414] border border-[#1A1A1A] rounded-2xl p-6 md:p-8 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#FF4C00]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Your Taste Profile
            </h3>
          </div>
          <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide">
            What Flixora AI has learned about your catalog preferences
          </p>

          <div className="flex flex-wrap gap-3 py-4 max-w-4xl">
            {TASTE_TAGS.map((tag, idx) => {
              const isFilled = idx % 2 === 0;

              return (
                <span 
                  key={idx}
                  className={`inline-flex items-center justify-center px-4 py-2 rounded-full border transition-transform duration-200 hover:scale-103 cursor-default uppercase tracking-wider select-none leading-none ${tag.size} ${
                    isFilled
                      ? 'bg-[#FF4C00]/10 border-[#FF4C00]/30 text-[#FF4C00]'
                      : 'bg-transparent border-[#FF4C00]/20 text-zinc-300'
                  }`}
                >
                  {tag.label}
                </span>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: ACTIVITY EXTRAS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Longest Binge */}
          <div className="bg-[#141414] border border-[#1A1A1A] rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:border-[#FF4C00]/25 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00] shrink-0">
              <Flame size={18} fill="currentColor" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                Longest Binge Session
              </span>
              <span className="text-sm font-black text-white truncate block mt-0.5">
                3h 20m • The Silent Cosmos
              </span>
              <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider">
                August 14, 2026
              </span>
            </div>
          </div>

          {/* AI assistant usage */}
          <div className="bg-[#141414] border border-[#1A1A1A] rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:border-[#FF4C00]/25 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00] shrink-0">
              <Sparkles size={18} fill="currentColor" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                AI Assistant Interactions
              </span>
              <span className="text-sm font-black text-white truncate block mt-0.5">
                12 queries asked this month
              </span>
              <span className="text-[9px] text-zinc-555 font-bold uppercase tracking-wider">
                3 active chats remaining
              </span>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}
