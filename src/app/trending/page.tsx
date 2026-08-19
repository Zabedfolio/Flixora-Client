'use client';

import React, { useState } from 'react';
import { 
  Flame, 
  ChevronDown, 
  Star, 
  Calendar,
  Play,
  Info
} from 'lucide-react';
import Link from 'next/link';

const TRENDING_CATALOG = [
  {
    id: 1,
    title: "Wednesday",
    type: "tv",
    vote_average: 8.6,
    release_year: "2022",
    genres: ["Sci-Fi & Fantasy", "Mystery", "Comedy"],
    is_rising: true,
    unsplash_url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Avatar: The Way of Water",
    type: "movie",
    vote_average: 7.7,
    release_year: "2022",
    genres: ["Action", "Adventure", "Sci-Fi"],
    is_rising: true,
    unsplash_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Stranger Things",
    type: "tv",
    vote_average: 8.6,
    release_year: "2016",
    genres: ["Sci-Fi & Fantasy", "Mystery", "Drama"],
    is_rising: false,
    unsplash_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Demon Slayer: Kimetsu no Yaiba",
    type: "tv",
    vote_average: 8.7,
    release_year: "2019",
    genres: ["Animation", "Action & Adventure", "Anime"],
    is_rising: true,
    unsplash_url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Oppenheimer",
    type: "movie",
    vote_average: 8.1,
    release_year: "2023",
    genres: ["Drama", "History"],
    is_rising: false,
    unsplash_url: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Attack on Titan",
    type: "tv",
    vote_average: 8.9,
    release_year: "2013",
    genres: ["Animation", "Action & Adventure", "Anime"],
    is_rising: true,
    unsplash_url: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 7,
    title: "Spider-Man: Across the Spider-Verse",
    type: "movie",
    vote_average: 8.4,
    release_year: "2023",
    genres: ["Animation", "Action", "Adventure"],
    is_rising: false,
    unsplash_url: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 8,
    title: "The Last of Us",
    type: "tv",
    vote_average: 8.6,
    release_year: "2023",
    genres: ["Drama", "Sci-Fi & Fantasy", "Action"],
    is_rising: false,
    unsplash_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 9,
    title: "Jujutsu Kaisen",
    type: "tv",
    vote_average: 8.6,
    release_year: "2020",
    genres: ["Animation", "Action & Adventure", "Anime"],
    is_rising: true,
    unsplash_url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 10,
    title: "Barbie",
    type: "movie",
    vote_average: 7.1,
    release_year: "2023",
    genres: ["Comedy", "Adventure", "Fantasy"],
    is_rising: false,
    unsplash_url: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=400&auto=format&fit=crop"
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'movie', label: 'Movies' },
  { id: 'tv', label: 'TV Shows' },
  { id: 'anime', label: 'Anime' }
] as const;

export default function TrendingPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'movie' | 'tv' | 'anime'>('all');
  const [activeTimeRange, setActiveTimeRange] = useState('today');
  const [activeSort, setActiveSort] = useState('popular');

  const getFilteredItems = () => {
    let list = [...TRENDING_CATALOG];
    if (activeCategory === 'movie') {
      list = list.filter(item => item.type === 'movie');
    } else if (activeCategory === 'tv') {
      list = list.filter(item => item.type === 'tv' && !item.genres.includes('Anime'));
    } else if (activeCategory === 'anime') {
      list = list.filter(item => item.genres.includes('Anime'));
    }
    return list;
  };

  const displayItems = getFilteredItems();

  return (
    <div className="min-h-screen bg-black font-sans text-white overflow-x-hidden w-full relative flex flex-col justify-between">
      <main className="flex-grow pt-28 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full select-none">
        
        <div className="flex flex-col gap-2.5 mb-8">
          <div className="flex items-center gap-2.5">
            <Flame className="text-[#FF4C00] animate-pulse shrink-0" size={24} fill="currentColor" />
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
              Trending Now
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-0.5 border-b border-[#1A1A1A] pb-5">
            <p className="text-xs md:text-sm text-zinc-500 font-medium max-w-2xl leading-relaxed">
              The most watched titles on Flixora right now. Updated dynamically from international streams.
            </p>
            
            <div className="flex items-center gap-2 text-[9px] text-zinc-450 font-bold uppercase tracking-wider shrink-0 select-none bg-zinc-950/80 border border-zinc-900 px-3 py-1.5 rounded-lg w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4C00] animate-ping shrink-0" />
              <span>Refreshed 15 mins ago</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-4 mb-8">
          
          <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none scroll-smooth -mx-2 px-2">
            {CATEGORIES.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 shrink-0 outline-none ${
                    isActive
                      ? 'bg-[#FF4C00] text-black shadow-md shadow-[#FF4C00]/20 font-extrabold'
                      : 'border border-[#262626] text-[#B3B3B3] hover:text-white hover:border-zinc-700 bg-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:hidden">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value as any)}
              className="w-full bg-[#141414] border border-[#262626] text-white rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold uppercase tracking-wider outline-none cursor-pointer focus:border-[#FF4C00]/50 transition-all appearance-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#FF4C00]">
              <ChevronDown size={13} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
            
            <div className="relative w-full sm:w-auto">
              <select
                value={activeTimeRange}
                onChange={(e) => setActiveTimeRange(e.target.value)}
                className="w-full sm:w-auto bg-[#141414] border border-[#262626] text-white rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold outline-none cursor-pointer focus:border-[#FF4C00]/50 transition-all appearance-none"
              >
                <option value="today">Trending Today</option>
                <option value="week">Trending This Week</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#FF4C00]">
                <ChevronDown size={13} />
              </div>
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="w-full sm:w-auto bg-[#141414] border border-[#262626] text-white rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold outline-none cursor-pointer focus:border-[#FF4C00]/50 transition-all appearance-none"
              >
                <option value="popular">Sort: Most Watched</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="discussed">Sort: Most Discussed</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#FF4C00]">
                <ChevronDown size={13} />
              </div>
            </div>

          </div>

        </div>

        <div className="flex flex-col gap-12">
          
          {displayItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-16 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl max-w-md mx-auto my-16">
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 mb-4 border border-zinc-850">
                <Info size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">No matches found</h3>
              <p className="text-xs text-zinc-555 leading-relaxed">
                No trending titles fit the selected filter options right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
              {displayItems.map((item, idx) => {
                const rank = idx + 1;
                const isTop3 = rank <= 3;
                const titleStr = item.title;
                const rating = item.vote_average;
                const releaseYear = item.release_year;

                return (
                  <div 
                    key={item.id}
                    className="group relative flex flex-col gap-3 transition-transform duration-300 w-full animate-in fade-in duration-300"
                  >
                    
                    <div className="relative w-full aspect-[2/3] rounded-2xl overflow-visible">
                      
                      <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                        isTop3 
                          ? 'border border-[#FF4C00]/40 shadow-lg shadow-[#FF4C00]/5 scale-[1.02] group-hover:scale-105 group-hover:border-[#FF4C00]/80 group-hover:shadow-[#FF4C00]/15'
                          : 'border border-zinc-900 group-hover:border-[#FF4C00]/30 group-hover:scale-103'
                      }`} />

                      <div className="w-full h-full rounded-2xl overflow-hidden bg-zinc-950">
                        <img 
                          src={item.unsplash_url} 
                          alt={titleStr}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-300"
                          loading="lazy"
                        />
                      </div>

                      {item.is_rising && (
                        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-black/75 border border-[#FF4C00]/30 backdrop-blur-md px-2 py-1 rounded-lg text-[#FF4C00] shadow-sm select-none">
                          <Flame size={10} fill="currentColor" className="animate-pulse" />
                          <span className="text-[8px] font-black uppercase tracking-wider">Hot</span>
                        </div>
                      )}

                      <div 
                        className="absolute left-[-16px] bottom-[-24px] z-20 text-7xl md:text-8xl font-black italic tracking-tighter leading-none select-none drop-shadow-2xl"
                        style={{
                          WebkitTextStroke: "2.5px #FF4C00",
                          color: "#000000",
                        }}
                      >
                        {rank}
                      </div>

                      <div className="absolute inset-0 bg-black/95 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl flex flex-col justify-end p-4 z-10 border border-[#FF4C00]/20 select-none">
                        
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-black text-white leading-tight block truncate pr-6" title={titleStr}>
                            {titleStr}
                          </span>
                          
                          <div className="flex items-center gap-2 text-[10px] text-zinc-550 font-bold">
                            <span className="flex items-center gap-0.5 text-[#FF4C00]">
                              <Star size={10} fill="currentColor" /> {rating.toFixed(1)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <Calendar size={10} /> {releaseYear}
                            </span>
                          </div>

                          {item.genres.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.genres.map((g: string, i: number) => (
                                <span 
                                  key={i} 
                                  className="text-[8px] font-black uppercase bg-[#FF4C00]/10 border border-[#FF4C00]/25 px-1.5 py-0.5 rounded-md text-[#FF4C00]"
                                >
                                  {g}
                                </span>
                              ))}
                            </div>
                          )}

                          <button className="mt-3 w-full bg-[#FF4C00] text-black font-black text-[10px] uppercase tracking-wider py-2 rounded-lg text-center flex items-center justify-center gap-1.5 hover:scale-102 transition-all outline-none">
                            <Play size={10} fill="currentColor" /> Watch Trailer
                          </button>

                        </div>
                      </div>

                    </div>

                    <div className="flex flex-col gap-1 pl-12 mt-1 min-w-0">
                      <span className="text-xs font-bold text-white truncate w-full group-hover:text-[#FF4C00] transition-colors" title={titleStr}>
                        {titleStr}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-555 font-bold">
                        <span className="flex items-center gap-0.5 text-zinc-450">
                          <Star size={10} className="text-[#FF4C00]" fill="currentColor" /> {rating.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span className="uppercase text-[9px]">{item.type === 'tv' ? 'Series' : 'Movie'}</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
