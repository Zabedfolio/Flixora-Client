"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Award, Star, Play, Plus, ChevronLeft, ChevronRight } from "lucide-react";

interface TopRatedItem {
  id: number;
  title: string;
  image: string;
  category: string;
  year: number;
  rating: number;
  certified: boolean;
}

const TOP_RATED: TopRatedItem[] = [
  { id: 1, title: "The Silent Cosmos", image: "/movies/cosmos.jpg", category: "Documentary", year: 2026, rating: 9.4, certified: true },
  { id: 2, title: "Project Zero: Genesis", image: "/movies/fury.jpg", category: "Sci-Fi / Action", year: 2026, rating: 9.1, certified: true },
  { id: 3, title: "Tokyo Cyber-Run", image: "/movies/tokyo.jpg", category: "Anime / Cyberpunk", year: 2026, rating: 8.9, certified: true },
  { id: 4, title: "Shadows in the Neon", image: "/movies/neon.jpg", category: "Thriller / Cyberpunk", year: 2025, rating: 8.7, certified: false },
  { id: 5, title: "Echoes of Eternity", image: "/movies/echoes.jpg", category: "Drama / Romance", year: 2024, rating: 8.5, certified: false },
  { id: 6, title: "Fury: Born of War", image: "/movies/fury.jpg", category: "Action / War", year: 2025, rating: 8.3, certified: false },
  { id: 7, title: "Chrono Drift", image: "/movies/chrono.jpg", category: "Adventure / Fantasy", year: 2025, rating: 8.0, certified: false },
];

const RANK_COLORS: Record<number, string> = {
  1: "text-[#FFD700] border-[#FFD700]/40",
  2: "text-[#C0C0C0] border-[#C0C0C0]/40",
  3: "text-[#CD7F32] border-[#CD7F32]/40",
};

export default function TopRated() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const offset = direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: "smooth" });
    }
  };

  return (
    <section className="relative bg-black py-16 px-4 md:px-8 select-none overflow-hidden z-10 border-t border-[#121212]">
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#FF4C00]/5 blur-[130px] rounded-full pointer-events-none z-0 hidden lg:block" />

      {/* HEADER */}
      <div className="relative z-10 max-w-7xl mx-auto mb-10 flex items-end justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1.5">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF4C00] flex-shrink-0" />
            <h2 className="text-xl xs:text-2xl md:text-3xl font-black tracking-tight text-white uppercase leading-tight">
              Top Rated
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs md:text-sm text-zinc-400 font-medium leading-normal">
            Critically acclaimed titles, loved by the Flixora community
          </p>
        </div>
        <button className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-[#FF4C00] transition-colors whitespace-nowrap">
          See All
        </button>
      </div>

      {/* SCROLL ROW */}
      <div className="relative z-10 max-w-7xl mx-auto group/row">
        <button
          onClick={() => scroll("left")}
          className="absolute -left-2 top-[42%] -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-[#FF4C00] text-white rounded-full border border-white/10 hover:border-transparent opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-105"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute -right-2 top-[42%] -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-[#FF4C00] text-white rounded-full border border-white/10 hover:border-transparent opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-105"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pt-6 pb-6 px-3 scroll-smooth scrollbar-none snap-x snap-mandatory -mt-6 -mb-6"
        >
          {TOP_RATED.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group/card flex-none w-[170px] sm:w-[210px] snap-start flex flex-col gap-2.5"
            >
              <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden border border-white/5 hover:border-[#FF4C00]/50 hover:scale-[1.05] hover:shadow-[0_0_15px_rgba(255,76,0,0.12)] transition-all duration-300 ease-out cursor-pointer">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />

                <div className="absolute inset-0 bg-black/55 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 z-10">
                  <button className="w-10 h-10 rounded-full bg-[#FF4C00] flex items-center justify-center text-white scale-75 group-hover/card:scale-100 transition-all duration-300">
                    <Play size={16} fill="currentColor" className="ml-0.5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white scale-75 group-hover/card:scale-100 transition-all duration-300 delay-[50ms]">
                    <Plus size={16} />
                  </button>
                </div>

                {/* Rank badge (top 3 get medal colors) */}
                <div
                  className={`absolute top-3 left-3 z-20 w-7 h-7 rounded-full flex items-center justify-center bg-black/80 border text-[11px] font-black ${
                    RANK_COLORS[index + 1] ?? "text-zinc-300 border-white/20"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Rating badge */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black border border-[#FF4C00] text-[#FF4C00] text-[10px] font-black px-2 py-1 rounded-full shadow-lg">
                  <Star size={10} fill="currentColor" /> {item.rating.toFixed(1)}
                </div>

                {item.certified && (
                  <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 bg-[#FF4C00] text-black text-[9px] font-black uppercase px-2 py-1 rounded-full shadow-lg">
                    <Award size={10} /> Certified
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-white truncate w-full group-hover/card:text-[#FF4C00] transition-colors leading-tight">
                  {item.title}
                </h4>
                <p className="text-[10px] text-zinc-500 font-semibold mt-0.5 truncate">
                  {item.category} • <span className="text-zinc-600">{item.year}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}