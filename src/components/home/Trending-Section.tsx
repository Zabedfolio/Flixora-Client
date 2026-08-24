"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";
import MediaCard from "@/components/ui/card";
import { getTrendingNow } from "@/data/home/trendingNow";

interface TrendingItem {
  id: number;
  rank: number;
  title: string;
  image: string;
  category: string;
  year: number;
  views: string;
}

export default function TrendingNow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendingNow()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading trending:", err);
        setLoading(false);
      });
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const offset = direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <section className="relative bg-black py-16 px-4 md:px-8 border-t border-[#121212]">
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[350px]">
          <span className="loading loading-spinner text-[#FF4C00] loading-lg"></span>
          <p className="text-[10px] text-zinc-500 mt-4 tracking-widest uppercase font-bold">Calculating Trends...</p>
        </div>
      </section>
    );
  }

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
          className="flex gap-6 overflow-x-auto overflow-y-hidden pt-6 pb-6 px-3 scroll-smooth scrollbar-none snap-x snap-mandatory -mt-6 -mb-6"
        >
          {items.map((item, index) => (
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
                  category={item.category}
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