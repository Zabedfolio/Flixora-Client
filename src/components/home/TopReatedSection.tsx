'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';
import MediaCard from '@/components/ui/card';
import { getTopRated } from '@/data/home/topRated';

interface TopRatedItem {
  id: number;
  title: string;
  image: string;
  category: string;
  year: number;
  rating: number;
  certified: boolean;
}

export default function TopRated() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<TopRatedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopRated()
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching top rated:', err);
        setLoading(false);
      });
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const offset =
        direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: scrollLeft + offset,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <section className="relative bg-black py-16 px-4 md:px-8 border-t border-[#121212]">
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[350px]">
          <span className="loading loading-spinner text-[#FF4C00] loading-lg"></span>
          <p className="text-[10px] text-zinc-500 mt-4 tracking-widest uppercase font-bold">
            Querying Critically Acclaimed...
          </p>
        </div>
      </section>
    );
  }

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
          onClick={() => scroll('left')}
          className="absolute -left-2 top-[42%] -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-[#FF4C00] text-white rounded-full border border-white/10 hover:border-transparent opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-105"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute -right-2 top-[42%] -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-[#FF4C00] text-white rounded-full border border-white/10 hover:border-transparent opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-105"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto overflow-y-hidden pt-6 pb-6 px-3 scroll-smooth scrollbar-none snap-x snap-mandatory -mt-6 -mb-6"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group/card flex-none w-[170px] sm:w-[210px] snap-start flex flex-col gap-2.5 animate-in fade-in"
            >
              <MediaCard
                title={item.title}
                unsplash_url={item.image}
                rating={item.rating.toFixed(1)}
                year={item.year.toString()}
                category={item.category}
                duration="2H 10M"
                isNew={item.certified}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
