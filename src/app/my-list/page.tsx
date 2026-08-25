'use client';

import React from 'react';
import { Bookmark, Star, Calendar, Play, Info } from 'lucide-react';
import MediaCard from '@/components/ui/card';
import EmptyState from '@/components/common/EmptyState';

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

export default function MyListPage() {
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
            <EmptyState 
              title="Your list is empty"
              description="Explore movies and shows to add them to your personalized collection."
              icon={Bookmark}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12">
              {MY_LIST_CATALOG.map((item) => (
                <MediaCard
                  key={item.id}
                  title={item.title}
                  unsplash_url={item.unsplash_url}
                  rating={item.vote_average.toFixed(1)}
                  year={item.release_year}
                  category={item.type === 'tv' ? 'Series' : 'Movie'}
                  duration={item.genres[0] || 'Saved'}
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
