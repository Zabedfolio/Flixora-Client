"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Flame, Play, Plus, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import MediaCard from "@/components/ui/card";

interface TrendingItem {
  id: number;
  rank: number;
  title: string;
  image: string;
  category: string;
  year: number;
  views: string;
}

const TRENDING_ITEMS: TrendingItem[] = [
  { id: 1, rank: 1, title: "Project Zero: Genesis", image: "/movies/fury.jpg", category: "Sci-Fi / Action", year: 2026, views: "4.2M" },
  { id: 2, rank: 2, title: "Tokyo Cyber-Run", image: "/movies/tokyo.jpg", category: "Anime / Cyberpunk", year: 2026, views: "3.8M" },
  { id: 3, rank: 3, title: "The Silent Cosmos", image: "/movies/cosmos.jpg", category: "Documentary", year: 2026, views: "3.1M" },
  { id: 4, rank: 4, title: "Shadows in the Neon", image: "/movies/neon.jpg", category: "Thriller / Cyberpunk", year: 2025, views: "2.7M" },
  { id: 5, rank: 5, title: "Chrono Drift", image: "/movies/chrono.jpg", category: "Adventure / Fantasy", year: 2025, views: "2.3M" },
  { id: 6, rank: 6, title: "Echoes of Eternity", image: "/movies/echoes.jpg", category: "Drama / Romance", year: 2024, views: "1.9M" },
  { id: 7, rank: 7, title: "Fury: Born of War", image: "/movies/fury.jpg", category: "Action / War", year: 2025, views: "1.6M" },
  { id: 8, rank: 8, title: "The Silent Cosmos II", image: "/movies/cosmos.jpg", category: "Sci-Fi / Space", year: 2026, views: "1.2M" },
];

export default function TrendingNow() {
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
      {/* Ambient glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-[550px] h-[550px] bg-[#FF4C00]/5 blur-[130px] rounded-full pointer-events-none z-0 hidden lg:block" />

      {/* HEADER */}
      <div className="relative z-10 max-w-7xl mx-auto mb-10 flex items-end justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1.5">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF4C00] flex-shrink-0" />
            <h2 className="text-xl xs:text-2xl md:text-3xl font-black tracking-tight text-white uppercase leading-tight">
              Trending Now
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs md:text-sm text-zinc-400 font-medium leading-normal">
            What everyone&apos;s watching on Flixora this week
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
          className="flex gap-6 overflow-x-auto pt-6 pb-6 px-3 scroll-smooth scrollbar-none snap-x snap-mandatory -mt-6 -mb-6"
        >
          {TRENDING_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group/card relative flex-none w-[190px] sm:w-[230px] snap-start flex items-end animate-in fade-in"
            >
              {/* Big rank numeral behind the poster */}
              <span
                className="absolute -left-4 sm:-left-6 bottom-4 text-[7rem] sm:text-[9rem] font-black leading-none text-transparent select-none pointer-events-none z-0"
                style={{ WebkitTextStroke: "2px rgba(255,255,255,0.12)" }}
              >
                {item.rank}
              </span>

              <div className="relative z-10 ml-10 sm:ml-14 w-full">
                <MediaCard
                  title={item.title}
                  unsplash_url={item.image}
                  rating="9.0"
                  year={item.year.toString()}
                  category={item.category.split(" / ")[0]}
                  duration={item.views}
                  isNew={item.rank <= 3}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}