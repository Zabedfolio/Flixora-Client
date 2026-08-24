'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Star, ChevronLeft, ChevronRight, Film } from 'lucide-react';
import { getFeaturedActors } from '@/data/home/featuredActors';
import Image from 'next/image';

interface Actor {
  id: number;
  name: string;
  image: string;
  role: string;
  knownFor: string;
  rating: number;
}

export default function FeaturedActors() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedActors()
      .then(data => {
        setActors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading actors:', err);
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
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[300px]">
          <span className="loading loading-spinner text-[#FF4C00] loading-lg"></span>
          <p className="text-[10px] text-zinc-500 mt-4 tracking-widest uppercase font-bold">
            Summoning Stars...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-black py-16 px-4 md:px-8 select-none overflow-hidden z-10 border-t border-[#121212]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#FF4C00]/5 blur-[130px] rounded-full pointer-events-none z-0 hidden lg:block" />

      {/* HEADER */}
      <div className="relative z-10 max-w-7xl mx-auto mb-10 flex items-end justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1.5">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF4C00] flex-shrink-0" />
            <h2 className="text-xl xs:text-2xl md:text-3xl font-black tracking-tight text-white uppercase leading-tight">
              Featured Actors &amp; Actresses
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs md:text-sm text-zinc-400 font-medium leading-normal">
            The faces behind this week&apos;s biggest titles
          </p>
        </div>
        <button className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-[#FF4C00] transition-colors whitespace-nowrap">
          View All
        </button>
      </div>

      {/* SCROLL ROW */}
      <div className="relative z-10 max-w-7xl mx-auto group/row">
        <button
          onClick={() => scroll('left')}
          className="absolute -left-2 top-[38%] -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-[#FF4C00] text-white rounded-full border border-white/10 hover:border-transparent opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-105"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute -right-2 top-[38%] -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-[#FF4C00] text-white rounded-full border border-white/10 hover:border-transparent opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-105"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto overflow-y-hidden pt-6 pb-6 px-3 scroll-smooth scrollbar-none snap-x snap-mandatory -mt-6 -mb-6"
        >
          {actors.map((actor, index) => (
            <motion.div
              key={actor.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group/card flex-none w-[140px] sm:w-[160px] snap-start flex flex-col items-center text-center gap-3 cursor-pointer"
            >
              {/* Circular avatar (DaisyUI avatar) */}
              <div className="avatar">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-2 ring-white/10 group-hover/card:ring-[#FF4C00] ring-offset-2 ring-offset-black overflow-hidden transition-all duration-300 group-hover/card:scale-105 group-hover/card:shadow-[0_0_20px_rgba(255,76,0,0.25)]">
                  <Image
                    width={50}
                    height={50}
                    src={actor.image}
                    alt={actor.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Rating chip overlay */}
                  <div className="absolute bottom-0 inset-x-0 py-1 bg-black/70 backdrop-blur-sm flex items-center justify-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                    <Star
                      size={10}
                      className="text-[#FF4C00]"
                      fill="currentColor"
                    />
                    <span className="text-[10px] font-black text-white">
                      {actor.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <h4 className="text-sm font-bold text-white leading-tight group-hover/card:text-[#FF4C00] transition-colors">
                  {actor.name}
                </h4>
                <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide">
                  {actor.role}
                </p>
                <p className="text-[10px] text-zinc-600 flex items-center justify-center gap-1 mt-0.5 truncate max-w-[140px]">
                  <Film size={10} className="flex-shrink-0" /> {actor.knownFor}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
