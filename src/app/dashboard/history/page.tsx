'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Trash2, 
  X, 
  Check, 
  ChevronDown, 
  Play, 
  Info, 
  Compass, 
  CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';

interface HistoryItem {
  id: string;
  title: string;
  type: 'movie' | 'tv';
  genres: string[];
  unsplash_url: string;
  watchedDate: string;
  progressPercent?: number; // if continue watching
  timeLeftMin?: number; // if continue watching
}

const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: '1',
    title: 'Wednesday',
    type: 'tv',
    genres: ['Mystery', 'Comedy'],
    unsplash_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=400&auto=format&fit=crop',
    watchedDate: '2026-08-20',
    progressPercent: 75,
    timeLeftMin: 12
  },
  {
    id: '2',
    title: 'Avatar: The Way of Water',
    type: 'movie',
    genres: ['Action', 'Adventure'],
    unsplash_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop',
    watchedDate: '2026-08-19',
    progressPercent: 40,
    timeLeftMin: 110
  },
  {
    id: '3',
    title: 'Stranger Things',
    type: 'tv',
    genres: ['Sci-Fi', 'Mystery'],
    unsplash_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop',
    watchedDate: '2026-08-18'
  },
  {
    id: '4',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    type: 'tv',
    genres: ['Animation', 'Anime'],
    unsplash_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop',
    watchedDate: '2026-08-17'
  },
  {
    id: '5',
    title: 'Oppenheimer',
    type: 'movie',
    genres: ['Drama', 'History'],
    unsplash_url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=400&auto=format&fit=crop',
    watchedDate: '2026-08-16',
    progressPercent: 85,
    timeLeftMin: 27
  },
  {
    id: '6',
    title: 'Attack on Titan',
    type: 'tv',
    genres: ['Animation', 'Anime'],
    unsplash_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=400&auto=format&fit=crop',
    watchedDate: '2026-08-15'
  }
];

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'continue' | 'completed'>('all');
  const [sortOption, setSortOption] = useState<string>('recent');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    // Simulate initial loading skeleton state
    const timer = setTimeout(() => {
      setHistory(INITIAL_HISTORY);
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRemoveItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
    setIsConfirmOpen(false);
  };

  // Get items matching active filter tabs
  const getFilteredItems = () => {
    let list = [...history];

    if (activeTab === 'continue') {
      list = list.filter(item => item.progressPercent !== undefined);
    } else if (activeTab === 'completed') {
      list = list.filter(item => item.progressPercent === undefined);
    }

    // Apply sorting
    if (sortOption === 'recent') {
      list.sort((a, b) => new Date(b.watchedDate).getTime() - new Date(a.watchedDate).getTime());
    } else if (sortOption === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'genre') {
      list.sort((a, b) => (a.genres[0] || '').localeCompare(b.genres[0] || ''));
    }

    return list;
  };

  const displayedItems = getFilteredItems();

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans relative">
      <main className="pt-28 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full select-none flex flex-col gap-10">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-0.5 border-b border-[#1A1A1A] pb-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <Clock className="text-[#FF4C00] shrink-0" size={24} fill="currentColor" />
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
                Watch History
              </h1>
            </div>
            <p className="text-xs md:text-sm text-zinc-550 font-medium max-w-2xl leading-relaxed">
              Manage fully-watched titles and pick up where you left off on continue-watching titles.
            </p>
          </div>
          
          {history.length > 0 && !isLoading && (
            <button 
              onClick={() => setIsConfirmOpen(true)}
              className="flex items-center gap-2 border border-zinc-700 hover:border-[#FF4C00] text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition-all cursor-pointer outline-none w-fit"
            >
              <Trash2 size={15} />
              Clear History
            </button>
          )}
        </div>

        {/* CONTROLS ROW: TABS & SORT */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-4">
          
          {/* Pill Toggle Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none -mx-2 px-2">
            {[
              { id: 'all', label: 'All History' },
              { id: 'continue', label: 'In Progress' },
              { id: 'completed', label: 'Completed' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4.5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shrink-0 outline-none cursor-pointer ${
                    isActive
                      ? 'bg-[#FF4C00] text-black shadow-md shadow-[#FF4C00]/25 font-extrabold'
                      : 'border border-[#262626] text-zinc-450 hover:text-white hover:border-zinc-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-full sm:w-auto shrink-0">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full sm:w-auto bg-[#141414] border border-[#262626] text-white rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold outline-none cursor-pointer focus:border-[#FF4C00]/50 transition-all appearance-none uppercase tracking-wider"
            >
              <option value="recent">Most Recent</option>
              <option value="title">Title A-Z</option>
              <option value="genre">By Genre</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#FF4C00]">
              <ChevronDown size={13} />
            </div>
          </div>

        </div>

        {/* MAIN HISTORY GRID CONTAINER */}
        <div className="flex flex-col gap-8">
          
          {isLoading ? (
            /* Skeleton Loading State Grid */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="flex flex-col gap-3 animate-pulse">
                  <div className="w-full aspect-[2/3] rounded-2xl bg-zinc-900" />
                  <div className="h-4 bg-zinc-900 rounded w-10/12" />
                  <div className="h-3 bg-zinc-900 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : history.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center p-16 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl max-w-md mx-auto my-16 w-full">
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 mb-4 border border-zinc-850">
                <Clock size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">No watch history yet</h3>
              <p className="text-xs text-zinc-550 leading-relaxed mb-6">
                Start watching movies and shows on Flixora to track progress here.
              </p>
              <Link 
                href="/"
                className="flex items-center gap-2 bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#FF4C00]/10"
              >
                <Compass size={15} />
                Browse Catalogue
              </Link>
            </div>
          ) : displayedItems.length === 0 ? (
            /* Matches Empty State */
            <div className="flex flex-col items-center justify-center text-center p-16 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl max-w-md mx-auto my-16 w-full">
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 mb-4 border border-zinc-850">
                <Info size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">No matches found</h3>
              <p className="text-xs text-zinc-550 leading-relaxed">
                There are no history entries matching the active filter.
              </p>
            </div>
          ) : (
            /* History Content Grid */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
              {displayedItems.map((item) => {
                const isCompleted = item.progressPercent === undefined;
                const releaseYear = item.watchedDate.split('-')[0];

                return (
                  <div 
                    key={item.id}
                    className="group relative flex flex-col gap-3 transition-transform duration-300 w-full animate-in fade-in duration-300"
                  >
                    
                    {/* Poster Element with overlays */}
                    <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-900 group-hover:border-[#FF4C00]/30 transition-all duration-300">
                      
                      <img 
                        src={item.unsplash_url} 
                        alt={item.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all"
                      />

                      {/* Remove Button (visible on hover) */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute top-2.5 right-2.5 z-20 w-7 h-7 bg-black/75 hover:bg-red-600 border border-zinc-850 hover:border-red-500 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white transition-all scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 cursor-pointer shadow-md"
                        title="Remove from history"
                      >
                        <X size={13} />
                      </button>

                      {/* Completed badge */}
                      {isCompleted && (
                        <div className="absolute top-2.5 left-2.5 z-20 flex items-center justify-center bg-[#FF4C00] text-black w-6 h-6 rounded-lg shadow-md" title="Completed">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}

                      {/* Continue Watching progress bar */}
                      {!isCompleted && (
                        <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/75 backdrop-blur-sm p-2 flex flex-col gap-1 border-t border-zinc-900">
                          <span className="text-[8px] font-black text-zinc-400 uppercase tracking-wider block">
                            {item.timeLeftMin} min left
                          </span>
                          
                          {/* Progress Track */}
                          <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#FF4C00] rounded-full"
                              style={{ width: `${item.progressPercent}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Hover Watch Trailer overlay */}
                      <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl flex flex-col justify-end p-4 z-10 border border-[#FF4C00]/20 select-none">
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-black text-white leading-tight block truncate pr-6">
                            {item.title}
                          </span>
                          <button className="mt-2 w-full bg-[#FF4C00] text-black font-black text-[10px] uppercase tracking-wider py-2 rounded-lg text-center flex items-center justify-center gap-1.5 hover:scale-102 transition-all outline-none">
                            <Play size={10} fill="currentColor" /> Resume
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Metadata under poster */}
                    <div className="flex flex-col gap-0.5 mt-1 min-w-0">
                      <span className="text-xs font-bold text-white truncate w-full group-hover:text-[#FF4C00] transition-colors" title={item.title}>
                        {item.title}
                      </span>
                      
                      <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider">
                        {isCompleted ? `Watched ${item.watchedDate}` : `In Progress • ${item.timeLeftMin}m left`}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </main>

      {/* CLEAR HISTORY CONFIRMATION MODAL */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl shadow-2xl p-6 flex flex-col gap-5 select-none animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-950/20 border border-red-900/50 flex items-center justify-center text-red-500 shrink-0">
                <Trash2 size={18} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Clear History?
              </h3>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
              This will permanently delete all watch progress and fully watched entries for the current profile. This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 border border-[#262626] hover:bg-zinc-950 text-zinc-400 hover:text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-red-600/10 outline-none"
              >
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
