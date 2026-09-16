'use client';

import React, { useEffect, useState } from 'react';
import { Bookmark, Info } from 'lucide-react';
import MediaCard from '@/components/ui/card';
import EmptyState from '@/components/common/EmptyState';
import { getWatchlist, fetchWatchlist, WatchlistItem } from '@/data/watchlistStore';

export default function DashboardMyListPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    setItems(getWatchlist());
    fetchWatchlist();

    const handleUpdate = () => {
      setItems(getWatchlist());
    };

    window.addEventListener('watchlist-updated', handleUpdate);
    window.addEventListener('list-updated', handleUpdate);
    return () => {
      window.removeEventListener('watchlist-updated', handleUpdate);
      window.removeEventListener('list-updated', handleUpdate);
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
            <p className="text-xs md:text-sm text-zinc-550 font-medium max-w-2xl leading-relaxed">
              Your personalized collection of movies and shows, synced live across your devices.
            </p>
            
            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider bg-zinc-950/80 border border-zinc-900 px-3.5 py-1.5 rounded-lg select-none">
              {items.length} {items.length === 1 ? 'Title' : 'Titles'} Saved
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-12">
          {items.length === 0 ? (
            <EmptyState
              title="Your list is empty"
              description="Explore movies and shows across Flixora to add them to your personalized collection."
              icon={Bookmark}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
              {items.map((item) => (
                <MediaCard
                  key={item.id || item.title}
                  id={item.id || item.movieId}
                  title={item.title}
                  unsplash_url={item.unsplash_url}
                  year={item.year}
                  duration={item.duration}
                  category={item.category}
                />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
