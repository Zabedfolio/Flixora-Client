'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, Star, Calendar, Play, Info } from 'lucide-react';
import MediaCard from '@/components/ui/card';
import { getWatchlist, WatchlistItem } from '@/data/watchlistStore';

import EmptyState from '@/components/common/EmptyState';

export default function DashboardMyListPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    setItems(getWatchlist());

    const handleUpdate = () => {
      setItems(getWatchlist());
    };

    window.addEventListener('watchlist-updated', handleUpdate);
    return () => {
      window.removeEventListener('watchlist-updated', handleUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black font-sans text-white overflow-x-hidden w-full relative flex flex-col justify-between">
      <main className="flex-grow pt-8 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full select-none">
        
        <div className="flex flex-col gap-2.5 mb-8">
          <div className="flex items-center gap-2.5">
            <Bookmark className="text-[#FF4C00] shrink-0" size={24} fill="currentColor" />
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
              My List
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-0.5 border-b border-[#1A1A1A] pb-5">
            <p className="text-xs md:text-sm text-zinc-555 font-medium max-w-2xl leading-relaxed">
              Your personalized collection of movies and shows. Saved to watch later.
            </p>
            
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider bg-zinc-950/80 border border-zinc-900 px-3.5 py-1.5 rounded-lg select-none">
              {items.length} Titles Saved
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-12">
          {items.length === 0 ? (
            <EmptyState 
              title="Your list is empty"
              description="Explore movies and shows to add them to your personalized collection."
              icon={Bookmark}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
              {items.map((item) => (
                <MediaCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  unsplash_url={item.unsplash_url}
                  rating="8.5"
                  year={item.year}
                  category={item.category}
                  duration={item.duration}
                  isNew={false}
                />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
