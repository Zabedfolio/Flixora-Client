"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Play, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import MediaCard from "@/components/ui/card";
import { fetchFromTMDB, getTMDBImageUrl } from "@/data/tmdb";
import { getGenreName, formatDuration } from "@/data/home/newReleases";

interface TopPick {
  title: string;
  image: string;
  matchPercentage: number;
  category: string;
  reason: string;
  description: string;
  duration: string;
  year: number;
}

interface SecondaryPick {
  id: number;
  title: string;
  image: string;
  reasonTag: string;
  category: string;
  rating: number;
  year: number;
}

export default function RecommendedSection() {
  const [topPick, setTopPick] = useState<TopPick | null>(null);
  const [secondaryPicks, setSecondaryPicks] = useState<SecondaryPick[]>([]);
  const [loading, setLoading] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFromTMDB<{ results: any[] }>('/movie/popular?language=en-US&page=3')
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const first = data.results[0];
          setTopPick({
            title: first.title,
            image: getTMDBImageUrl(first.poster_path, 'w500'),
            matchPercentage: 95 + (first.id % 5),
            category: getGenreName(first.genre_ids),
            reason: "Top Pick for you this week",
            description: first.overview || "A special cinematic selection curated based on your favorite movies.",
            duration: formatDuration(first.id),
            year: first.release_date ? new Date(first.release_date).getFullYear() : 2026
          });

          setSecondaryPicks(data.results.slice(1, 10).map((movie) => ({
            id: movie.id,
            title: movie.title,
            image: getTMDBImageUrl(movie.poster_path, 'w500'),
            reasonTag: `${90 + (movie.id % 10)}% Match`,
            category: getGenreName(movie.genre_ids),
            rating: movie.vote_average || 8.0,
            year: movie.release_date ? new Date(movie.release_date).getFullYear() : 2026
          })));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading recommendations:", err);
        setLoading(false);
      });
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const offset = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: "smooth" });
    }
  };

  if (loading || !topPick) {
    return (
      <section className="relative bg-[#000000] py-16 px-4 md:px-8 border-t border-[#121212]">
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[350px]">
          <span className="loading loading-spinner text-[#FF4C00] loading-lg"></span>
          <p className="text-[10px] text-zinc-500 mt-4 tracking-widest uppercase font-bold">Predicting Taste Matrix...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-[#000000] py-16 px-4 md:px-8 select-none overflow-hidden z-10 border-t border-[#121212]">
      {/* Dynamic low-opacity radial highlight glow behind Spotlight Card */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#FF4C00]/5 blur-[130px] rounded-full pointer-events-none z-0 hidden lg:block" />

      {/* HEADER SECTION */}
      <div className="relative z-10 max-w-7xl mx-auto mb-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF4C00] flex-shrink-0 animate-pulse" />
            <h2 className="text-xl xs:text-2xl md:text-3xl font-black tracking-tight text-white uppercase leading-tight">
              Recommended for You
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs md:text-sm text-zinc-400 font-medium leading-normal">
            Curated by Flixora AI based on your taste
          </p>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ZONE 1: TOP PICK SPOTLIGHT */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="group relative w-full rounded-2xl overflow-hidden border border-[#FF4C00]/30 hover:border-[#FF4C00] shadow-[0_0_15px_rgba(255,76,0,0.05)] hover:shadow-[0_0_20px_rgba(255,76,0,0.18)] transition-all duration-500 aspect-[4/5] xs:aspect-video lg:aspect-[2/3] max-h-[460px] lg:max-h-none">
            {/* Poster Image */}
            <img 
              src={topPick.image} 
              alt={topPick.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Dark Scrim overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

            {/* Spotlight Content Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-20 flex flex-col gap-2.5">
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4C00] animate-pulse" />
                  <span className="text-[9px] font-black tracking-widest text-[#FF4C00] uppercase">
                    {topPick.matchPercentage}% AI MATCH
                  </span>
                </div>
                <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                  {topPick.reason}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight truncate">
                {topPick.title}
              </h3>
              <p className="text-xs text-zinc-350 font-medium leading-relaxed line-clamp-2 hidden sm:block">
                {topPick.description}
              </p>
              
              <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-semibold mt-1">
                <span>{topPick.year}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <span>{topPick.category}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <span>{topPick.duration}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-3">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#FF4C00] hover:bg-[#E04300] active:scale-98 text-black text-xs font-black uppercase rounded-lg transition-all shadow-lg shadow-[#FF4C00]/20">
                  <Play size={12} fill="currentColor" /> Play Now
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ZONE 2: CAROUSEL ROW */}
        <div className="lg:col-span-8 flex flex-col gap-4 group/row relative w-full overflow-hidden">
          <button 
            onClick={() => scroll("left")}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-[#FF4C00] text-white hover:text-white rounded-full border border-white/10 hover:border-transparent opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-105"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-[#FF4C00] text-white hover:text-white rounded-full border border-white/10 hover:border-transparent opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-105"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto overflow-y-hidden pt-6 pb-6 px-3 scroll-smooth scrollbar-none snap-x snap-mandatory -mt-6 -mb-6"
          >
            {secondaryPicks.map((pick) => (
              <div
                key={pick.id}
                className="group/card flex-none w-[160px] sm:w-[200px] snap-start flex flex-col gap-2.5 animate-in fade-in"
              >
                <MediaCard
                  title={pick.title}
                  unsplash_url={pick.image}
                  rating={pick.rating.toFixed(1)}
                  year={pick.year.toString()}
                  category={pick.category.split(" / ")[0]}
                  duration={pick.reasonTag}
                  isNew={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
