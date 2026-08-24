'use client';

import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import MediaCard from '@/components/ui/card';
import { getNewReleases } from '@/data/home/newReleases';

interface Movie {
  id: number;
  title: string;
  image: string;
  rating: string;
  year: string;
  genre: string;
  duration: string;
}

export default function NewReleases() {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewReleases()
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching new releases:', err);
        setLoading(false);
      });
  }, []);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -900,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 900,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-black py-20 sm:py-24">
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[350px]">
          <span className="loading loading-spinner text-[#FF4C00] loading-lg"></span>
          <p className="text-[10px] text-zinc-500 mt-4 tracking-widest uppercase font-bold">Initializing Catalog...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-24">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#FF4C00]/5 blur-[130px]" />

      {/* Subtle Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            {/* Small Label */}
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF4C00]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF4C00] sm:text-xs">
                Fresh From The Reel
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
              New <span className="text-[#FF4C00]">Releases</span>
            </h2>

            {/* Underline */}
            <div className="mt-4 h-[2px] w-16 bg-[#FF4C00]" />

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-500 sm:text-base">
              The latest stories, biggest premieres, and fresh cinematic
              experiences waiting for you.
            </p>
          </div>

          {/* View All + Navigation */}
          <div className="hidden items-center gap-5 sm:flex">
            <Link
              href="/explore"
              className="text-xs font-bold uppercase tracking-wider text-zinc-500 transition-colors hover:text-[#FF4C00]"
            >
              View All
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={scrollLeft}
                aria-label="Previous movies"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-all duration-300 hover:border-[#FF4C00]/50 hover:bg-[#FF4C00] hover:text-white"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={scrollRight}
                aria-label="Next movies"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-all duration-300 hover:border-[#FF4C00]/50 hover:bg-[#FF4C00] hover:text-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile View All */}
        <div className="mb-6 flex items-center justify-between sm:hidden">
          <span className="text-[10px] uppercase tracking-widest text-zinc-600">
            Latest Collection
          </span>

          <Link
            href="/explore"
            className="text-[10px] font-bold uppercase tracking-widest text-[#FF4C00]"
          >
            View All
          </Link>
        </div>

        {/* Movie Slider */}
        <div
          ref={sliderRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="min-w-[185px] snap-start sm:min-w-[210px] md:min-w-[225px] lg:min-w-[230px]"
            >
              <MediaCard
                title={movie.title}
                unsplash_url={movie.image}
                rating={movie.rating}
                year={movie.year}
                category={movie.genre}
                duration={movie.duration}
                isNew={true}
              />
            </div>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="mt-5 flex justify-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Previous movies"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:border-[#FF4C00] hover:bg-[#FF4C00] hover:text-white"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={scrollRight}
            aria-label="Next movies"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:border-[#FF4C00] hover:bg-[#FF4C00] hover:text-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Bottom Line */}
        <div className="mt-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-[#FF4C00]/30 to-transparent" />

          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-700">
            New stories. New worlds.
          </span>

          <div className="h-px flex-1 bg-gradient-to-l from-[#FF4C00]/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}