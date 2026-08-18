"use client";

import React, { useState, useRef } from "react";
import { Sparkles, Play, Plus, ChevronLeft, ChevronRight } from "lucide-react";

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

const INITIAL_TOP_PICK: TopPick = {
  title: "The Silent Cosmos",
  image: "/movies/cosmos.jpg",
  matchPercentage: 97,
  category: "Sci-Fi / Space",
  reason: "Matches your love for Sci-Fi",
  description: "Journey into the darkest corners of outer space. Discover cosmic secrets, supermassive black holes, and the beautiful stellar nurseries shaping our universe.",
  duration: "1h 42m",
  year: 2026
};

const ALTERNATE_TOP_PICK: TopPick = {
  title: "Fury: Born of War",
  image: "/movies/fury.jpg",
  matchPercentage: 99,
  category: "Action / War",
  reason: "Because you watched Project Zero: Genesis",
  description: "A grizzled tank commander makes tough decisions as he and his crew fight their way across Germany in April, 1945.",
  duration: "2h 15m",
  year: 2025
};

const INITIAL_SECONDARY: SecondaryPick[] = [
  {
    id: 1,
    title: "Shadows in the Neon",
    image: "/movies/neon.jpg",
    reasonTag: "Similar to My List",
    category: "Thriller / Cyberpunk",
    rating: 8.4,
    year: 2025
  },
  {
    id: 2,
    title: "Project Zero: Genesis",
    image: "/movies/fury.jpg",
    reasonTag: "Trending in Sci-Fi",
    category: "Sci-Fi / Action",
    rating: 8.9,
    year: 2026
  },
  {
    id: 3,
    title: "Tokyo Cyber-Run",
    image: "/movies/tokyo.jpg",
    reasonTag: "New in Anime",
    category: "Anime / Cyberpunk",
    rating: 8.7,
    year: 2026
  },
  {
    id: 4,
    title: "Chrono Drift",
    image: "/movies/chrono.jpg",
    reasonTag: "Popular Action",
    category: "Adventure / Fantasy",
    rating: 7.9,
    year: 2025
  },
  {
    id: 5,
    title: "Echoes of Eternity",
    image: "/movies/echoes.jpg",
    reasonTag: "Because you liked Drama",
    category: "Drama / Romance",
    rating: 8.2,
    year: 2024
  }
];

const ALTERNATE_SECONDARY: SecondaryPick[] = [
  {
    id: 6,
    title: "Project Zero: Genesis",
    image: "/movies/fury.jpg",
    reasonTag: "Top Recommendation",
    category: "Sci-Fi / Action",
    rating: 8.9,
    year: 2026
  },
  {
    id: 7,
    title: "The Silent Cosmos",
    image: "/movies/cosmos.jpg",
    reasonTag: "97% Match",
    category: "Documentary",
    rating: 9.1,
    year: 2026
  },
  {
    id: 8,
    title: "Shadows in the Neon",
    image: "/movies/neon.jpg",
    reasonTag: "Similar to My List",
    category: "Thriller / Cyberpunk",
    rating: 8.4,
    year: 2025
  },
  {
    id: 9,
    title: "Tokyo Cyber-Run",
    image: "/movies/tokyo.jpg",
    reasonTag: "Trending in Sci-Fi",
    category: "Anime / Cyberpunk",
    rating: 8.7,
    year: 2026
  },
  {
    id: 10,
    title: "Chrono Drift",
    image: "/movies/chrono.jpg",
    reasonTag: "Matches your taste",
    category: "Adventure / Fantasy",
    rating: 7.9,
    year: 2025
  }
];

export default function RecommendedSection() {
  const [topPick] = useState<TopPick>(INITIAL_TOP_PICK);
  const [secondaryPicks] = useState<SecondaryPick[]>(INITIAL_SECONDARY);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const offset = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: "smooth" });
    }
  };

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
        
        {/* ZONE 1: TOP PICK SPOTLIGHT (Left, ~35% on Desktop - 4 of 12 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="group relative w-full rounded-2xl overflow-hidden border border-[#FF4C00]/30 hover:border-[#FF4C00] shadow-[0_0_15px_rgba(255,76,0,0.05)] hover:shadow-[0_0_20px_rgba(255,76,0,0.18)] transition-all duration-500 aspect-video lg:aspect-[2/3] max-h-[460px] lg:max-h-none">
            {/* Poster Image */}
            <img 
              src={topPick.image} 
              alt={topPick.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Hover Actions Scrim */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-20">
              <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FF4C00] hover:bg-[#E04300] text-white hover:scale-110 transition-transform shadow-lg shadow-[#FF4C00]/20">
                <Play size={20} fill="currentColor" className="ml-0.5" />
              </button>
              <button className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:scale-110 transition-transform">
                <Plus size={20} />
              </button>
            </div>

            {/* Top Match Badge (Top-Left) */}
            <div className="absolute top-4 left-4 z-25 bg-[#FF4C00] text-black text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
              ✦ Top Match
            </div>

            {/* Match Percentage Badge (Top-Right) */}
            <div className="absolute top-4 right-4 z-25 bg-black border border-[#FF4C00] text-[#FF4C00] text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
              {topPick.matchPercentage}% Match
            </div>

            {/* Subtle Gradient Shadow under Poster Details on Mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent lg:hidden z-10" />
            <div className="absolute bottom-4 left-4 right-4 z-15 lg:hidden">
              <h3 className="text-xl font-bold text-white mb-0.5 leading-none">
                {topPick.title}
              </h3>
              <p className="text-[10px] font-medium text-zinc-400">
                {topPick.reason}
              </p>
            </div>
          </div>

          {/* Desktop Title & Details */}
          <div className="hidden lg:flex flex-col gap-2 mt-1">
            <h3 className="text-2xl font-black text-white leading-tight">
              {topPick.title}
            </h3>
            <p className="text-sm font-semibold text-zinc-300">
              {topPick.category} • <span className="text-zinc-500 font-medium">{topPick.duration} • {topPick.year}</span>
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
              {topPick.description}
            </p>
            <div className="inline-flex items-center gap-2 mt-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2 self-start text-xs font-semibold text-zinc-300">
              <span className="text-[#FF4C00]">★</span> {topPick.reason}
            </div>
          </div>
        </div>

        {/* ZONE 2: SECONDARY PICKS SCROLL (Right, ~65% on Desktop - 8 of 12 cols) */}
        <div className="lg:col-span-8 relative group/row w-full self-center">
          
          {/* Scroll Navigation Chevrons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-[#FF4C00] text-white hover:text-white rounded-full border border-white/10 hover:border-transparent opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-105"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-[#FF4C00] text-white hover:text-white rounded-full border border-white/10 hover:border-transparent opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-105"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pt-6 pb-6 px-3 scroll-smooth scrollbar-none snap-x snap-mandatory -mt-6 -mb-6"
          >
            {secondaryPicks.map((pick) => (
              <div
                key={pick.id}
                className="group/card flex-none w-[160px] sm:w-[200px] snap-start flex flex-col gap-2.5"
              >
                {/* Movie Card Media Container */}
                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden border border-white/5 hover:border-[#FF4C00]/50 hover:scale-[1.05] hover:shadow-[0_0_15px_rgba(255,76,0,0.12)] transition-all duration-300 ease-out z-10 cursor-pointer">
                  {/* Backdrop */}
                  <img
                    src={pick.image}
                    alt={pick.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Play Scrim on Hover */}
                  <div className="absolute inset-0 bg-black/55 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
                    <div className="w-10 h-10 rounded-full bg-[#FF4C00] flex items-center justify-center text-white scale-75 group-hover/card:scale-100 transition-all duration-300">
                      <Play size={16} fill="currentColor" className="ml-0.5" />
                    </div>
                  </div>

                  {/* AI Reason chip tag (appears on hover) */}
                  <div className="absolute bottom-3 left-3 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 max-w-[90%]">
                    <span className="inline-block bg-black text-[#FF4C00] text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-lg border border-[#FF4C00]/25 truncate w-full">
                      {pick.reasonTag}
                    </span>
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold text-white truncate w-full group-hover/card:text-[#FF4C00] transition-colors leading-tight">
                    {pick.title}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">
                    {pick.category} • <span className="text-zinc-600">{pick.year}</span>
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

    </section>
  );
}
