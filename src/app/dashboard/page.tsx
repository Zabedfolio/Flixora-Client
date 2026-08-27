'use client';

import React, { useState, useEffect } from 'react';
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


export default function UserDashboardPage() {
  const { data: session } = authClient.useSession();
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [chartTab, setChartTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  useEffect(() => {
    setWatchlistCount(getWatchlistCount());
    setHistory(getHistory());

    const handleWatchlistUpdate = () => {
      setWatchlistCount(getWatchlistCount());
    };

    const handleHistoryUpdate = () => {
      setHistory(getHistory());
    };

    window.addEventListener('watchlist-updated', handleWatchlistUpdate);
    window.addEventListener('history-updated', handleHistoryUpdate);
    return () => {
      window.removeEventListener('watchlist-updated', handleWatchlistUpdate);
      window.removeEventListener('history-updated', handleHistoryUpdate);
    };
  }, []);

  const totalHours = history.reduce((sum, item) => sum + item.hoursWatched, 0);
  const continueWatchingCount = history.filter(item => item.progressPercent !== undefined).length;
  const completedCount = history.filter(item => item.progressPercent === undefined).length;

  const getGenrePercentages = () => {
    if (history.length === 0) {
      return [
        { label: 'Sci-Fi', percent: 0 },
        { label: 'Drama', percent: 0 },
        { label: 'Action', percent: 0 },
        { label: 'Other', percent: 0 }
      ];
    }
    const counts: Record<string, number> = {};
    let total = 0;
    history.forEach(item => {
      item.genres.forEach(g => {
        counts[g] = (counts[g] || 0) + 1;
        total++;
      });
    });
    
    const sorted = Object.entries(counts)
      .map(([label, count]) => ({
        label,
        percent: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.percent - a.percent);
      
    if (sorted.length <= 3) {
      return sorted;
    }
    const top3 = sorted.slice(0, 3);
    const otherPercent = 100 - top3.reduce((sum, item) => sum + item.percent, 0);
    return [...top3, { label: 'Other', percent: Math.max(0, otherPercent) }];
  };

  const getMostWatched = () => {
    return [...history]
      .sort((a, b) => b.hoursWatched - a.hoursWatched)
      .slice(0, 4);
  };

  const getChartData = () => {
    if (history.length === 0) {
      return [
        { label: 'Mon', value: 0, date: 'No Data' },
        { label: 'Tue', value: 0, date: 'No Data' },
        { label: 'Wed', value: 0, date: 'No Data' },
        { label: 'Thu', value: 0, date: 'No Data' },
        { label: 'Fri', value: 0, date: 'No Data' },
        { label: 'Sat', value: 0, date: 'No Data' },
        { label: 'Sun', value: 0, date: 'No Data' }
      ];
    }

    if (chartTab === 'daily') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days.map((day, idx) => {
        const dayItems = history.filter(item => {
          const date = new Date(item.watchedDate);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          return dayName === day;
        });
        const value = dayItems.reduce((sum, item) => sum + item.hoursWatched, 0);
        return {
          label: day,
          value: Number(value.toFixed(1)),
          date: `Total for ${day}`
        };
      });
    }

    if (chartTab === 'weekly') {
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      return weeks.map((week, idx) => {
        const weekItems = history.filter(item => {
          const date = new Date(item.watchedDate);
          const dayOfMonth = date.getDate();
          const weekIndex = Math.min(3, Math.floor((dayOfMonth - 1) / 7));
          return weekIndex === idx;
        });
        const value = weekItems.reduce((sum, item) => sum + item.hoursWatched, 0);
        return {
          label: week,
          value: Number(value.toFixed(1)),
          date: `Weekly stats`
        };
      });
    }

    // monthly
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const mIdx = (currentMonthIdx - 5 + i + 12) % 12;
      return months[mIdx];
    });
    return last6Months.map((month) => {
      const monthItems = history.filter(item => {
        const date = new Date(item.watchedDate);
        const mName = date.toLocaleDateString('en-US', { month: 'short' });
        return mName === month;
      });
      const value = monthItems.reduce((sum, item) => sum + item.hoursWatched, 0);
      return {
        label: month,
        value: Number(value.toFixed(1)),
        date: `Monthly stats`
      };
    });
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map(b => b.value));

  const genresData = getGenrePercentages();
  const topGenre = genresData[0] || { label: 'Sci-Fi', percent: 0 };
  let accumPercent = 0;
  const svgCircles = genresData.map((genre, idx) => {
    const colors = ['#FF4C00', '#cc3d00', '#8c2b00', '#3d1300'];
    const color = colors[idx] || '#262626';
    const strokeDasharray = `${genre.percent} ${100 - genre.percent}`;
    const strokeDashoffset = 25 - accumPercent;
    accumPercent += genre.percent;
    return {
      ...genre,
      color,
      strokeDasharray,
      strokeDashoffset
    };
  });

  const mostWatched = getMostWatched();
  const tasteTags = Array.from(new Set(history.flatMap(item => item.genres)));
  const longestBinge = history.length > 0 
    ? [...history].sort((a, b) => b.hoursWatched - a.hoursWatched)[0]
    : null;

  const statCardsData = [
    { 
      id: 'hours', 
      label: 'Total Hours This Month', 
      value: `${totalHours.toFixed(1)} hrs`, 
      icon: Clock, 
      iconBg: 'bg-[#FF4C00]/10 border border-[#FF4C00]/30', 
      iconColor: 'text-[#FF4C00]' 
    },
    { 
      id: 'watching', 
      label: 'Continue Watching', 
      value: `${continueWatchingCount} titles`, 
      icon: Play, 
      iconBg: 'bg-blue-500/10 border border-blue-500/20', 
      iconColor: 'text-blue-400' 
    },
    { 
      id: 'completed', 
      label: 'Completed This Month', 
      value: `${completedCount} titles`, 
      icon: Check, 
      iconBg: 'bg-emerald-500/10 border border-emerald-500/20', 
      iconColor: 'text-emerald-400' 
    },
    { 
      id: 'watchlist', 
      label: 'Watchlist Size', 
      value: `${watchlistCount} titles`, 
      icon: Bookmark, 
      iconBg: 'bg-purple-500/10 border border-purple-500/20', 
      iconColor: 'text-purple-400' 
    }
  ];

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
            <div className="w-8 h-8 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/30 overflow-hidden flex items-center justify-center font-bold text-white shadow-inner bg-zinc-950 shrink-0">
              {session?.user.image ? (
                <img
                  src={session.user.image}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                session?.user.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-white truncate max-w-[120px]">
                {session?.user.name || 'User Portal'}
              </span>
              <span className="text-[9px] text-[#FF4C00] font-bold uppercase tracking-wider">
                Premium Member
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 1: QUICK STAT CARDS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statCardsData.map((card) => {
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
                  
                  {svgCircles.map((circle, idx) => (
                    <circle 
                      key={idx}
                      cx="18" 
                      cy="18" 
                      r="15.915" 
                      fill="transparent" 
                      stroke={circle.color} 
                      strokeWidth="3" 
                      strokeDasharray={circle.strokeDasharray} 
                      strokeDashoffset={circle.strokeDashoffset} 
                    />
                  ))}
                </svg>

                <div className="absolute flex flex-col text-center gap-0.5">
                  <span className="text-xl font-black text-white">{topGenre.percent}%</span>
                  <span className="text-[7px] text-zinc-500 font-bold uppercase tracking-widest">{topGenre.label}</span>
                </div>
              </div>

              {/* Legends list */}
              <div className="flex-1 flex flex-col gap-3.5 w-full">
                {svgCircles.map((genre, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-md shrink-0" style={{ backgroundColor: genre.color }} />
                      <span className="text-zinc-400 font-medium">{genre.label}</span>
                    </div>
                    <span className="text-white font-bold">{genre.percent}%</span>
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
              {mostWatched.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="text-xs text-zinc-500 font-semibold">No watched titles yet</span>
                </div>
              ) : (
                mostWatched.map((item, idx) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between gap-4 p-2.5 rounded-xl border border-[#1A1A1A] bg-[#0E0E0E]/40 hover:bg-[#1A1A1A]/40 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Rank Badge */}
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                        idx === 0 
                          ? 'bg-[#FF4C00] text-black shadow-sm' 
                          : 'bg-[#141414] text-zinc-550 border border-zinc-900'
                      }`}>
                        {idx + 1}
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
                      {item.hoursWatched} hrs
                    </span>
                  </div>
                ))
              )}
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
            {tasteTags.length === 0 ? (
              <span className="text-xs text-zinc-500 font-semibold italic">
                No taste profile compiled yet. Watch movies and shows to discover your preferences.
              </span>
            ) : (
              tasteTags.map((tag, idx) => {
                const isFilled = idx % 2 === 0;

                return (
                  <span 
                    key={idx}
                    className={`inline-flex items-center justify-center px-4 py-2 rounded-full border transition-transform duration-200 hover:scale-103 cursor-default uppercase tracking-wider select-none leading-none text-xs font-semibold ${
                      isFilled
                        ? 'bg-[#FF4C00]/10 border-[#FF4C00]/30 text-[#FF4C00]'
                        : 'bg-transparent border-[#FF4C00]/20 text-zinc-300'
                    }`}
                  >
                    {tag}
                  </span>
                );
              })
            )}
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
                {longestBinge ? `${longestBinge.hoursWatched} hrs • ${longestBinge.title}` : '0.0 hrs • No Title'}
              </span>
              <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider">
                {longestBinge ? longestBinge.watchedDate : 'No watched titles'}
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
