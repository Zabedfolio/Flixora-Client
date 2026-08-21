'use client';

import React from 'react';
import { Bookmark, Star, Calendar, Play, Info } from 'lucide-react';

const MY_LIST_CATALOG = [
  {
    id: 1,
    title: "Wednesday",
    type: "tv",
    vote_average: 8.6,
    release_year: "2022",
    genres: ["Sci-Fi & Fantasy", "Mystery", "Comedy"],
    unsplash_url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Demon Slayer: Kimetsu no Yaiba",
    type: "tv",
    vote_average: 8.7,
    release_year: "2019",
    genres: ["Animation", "Action & Adventure", "Anime"],
    unsplash_url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Attack on Titan",
    type: "tv",
    vote_average: 8.9,
    release_year: "2013",
    genres: ["Animation", "Action & Adventure", "Anime"],
    unsplash_url: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 8,
    title: "The Last of Us",
    type: "tv",
    vote_average: 8.6,
    release_year: "2023",
    genres: ["Drama", "Sci-Fi & Fantasy", "Action"],
    unsplash_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop"
  }
];

export default function DashboardMyListPage() {
  return (
    <div className="min-h-screen bg-black font-sans text-white overflow-x-hidden w-full relative flex flex-col justify-between">
      <main className="flex-grow pt-28 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full select-none">
        
        <div className="flex flex-col gap-2.5 mb-8">
          <div className="flex items-center gap-2.5">
            <Bookmark className="text-[#FF4C00] shrink-0" size={24} fill="currentColor" />
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
              My List
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-0.5 border-b border-[#1A1A1A] pb-5">
            <p className="text-xs md:text-sm text-zinc-550 font-medium max-w-2xl leading-relaxed">
              Your personalized collection of movies and shows. Saved to watch later.
            </p>
            
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider bg-zinc-950/80 border border-zinc-900 px-3.5 py-1.5 rounded-lg select-none">
              {MY_LIST_CATALOG.length} Titles Saved
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-12">
          {MY_LIST_CATALOG.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-16 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl max-w-md mx-auto my-16">
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 mb-4 border border-zinc-850">
                <Info size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Your list is empty</h3>
              <p className="text-xs text-zinc-555 leading-relaxed">
                Explore movies and shows to add them to your personalized collection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
              {MY_LIST_CATALOG.map((item) => {
                const titleStr = item.title;
                const rating = item.vote_average;
                const releaseYear = item.release_year;

                return (
                  <div 
                    key={item.id}
                    className="group relative flex flex-col gap-3 transition-transform duration-300 w-full animate-in fade-in duration-300"
                  >
                    <div className="relative w-full aspect-[2/3] rounded-2xl overflow-visible">
                      <div className="absolute inset-0 rounded-2xl border border-zinc-900 group-hover:border-[#FF4C00]/30 group-hover:scale-103 transition-all duration-300" />

                      <div className="w-full h-full rounded-2xl overflow-hidden bg-zinc-950">
                        <img 
                          src={item.unsplash_url} 
                          alt={titleStr}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-300"
                          loading="lazy"
                        />
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
                            <Play size={10} fill="currentColor" /> Watch Now
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 mt-1 min-w-0">
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
