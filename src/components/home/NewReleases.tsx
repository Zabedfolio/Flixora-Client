'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, Star } from 'lucide-react';
import Link from 'next/link';

interface Movie {
  id: number;
  title: string;
  image: string;
  rating: string;
  year: string;
  genre: string;
  duration: string;
}

const NEW_RELEASES: Movie[] = [
  {
    id: 1,
    title: 'The Last Horizon',
    image:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    rating: '9.1',
    year: '2026',
    genre: 'Sci-Fi',
    duration: '2h 18m',
  },
  {
    id: 2,
    title: 'Dark Pursuit',
    image:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop',
    rating: '8.8',
    year: '2026',
    genre: 'Action',
    duration: '2h 06m',
  },
  {
    id: 3,
    title: 'Beyond The Stars',
    image:
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop',
    rating: '9.0',
    year: '2026',
    genre: 'Adventure',
    duration: '2h 24m',
  },
  {
    id: 4,
    title: 'Neon District',
    image:
      'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=800&auto=format&fit=crop',
    rating: '8.7',
    year: '2026',
    genre: 'Thriller',
    duration: '1h 58m',
  },
  {
    id: 5,
    title: 'Silent Kingdom',
    image:
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=800&auto=format&fit=crop',
    rating: '8.9',
    year: '2026',
    genre: 'Drama',
    duration: '2h 11m',
  },
  {
    id: 6,
    title: 'Final Mission',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop',
    rating: '8.6',
    year: '2026',
    genre: 'Action',
    duration: '2h 02m',
  },
  {
    id: 7,
    title: 'Midnight Signal',
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop',
    rating: '8.5',
    year: '2026',
    genre: 'Mystery',
    duration: '1h 52m',
  },
  {
    id: 8,
    title: 'The Forgotten World',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    rating: '9.2',
    year: '2026',
    genre: 'Fantasy',
    duration: '2h 31m',
  },
];

export default function NewReleases() {
  const sliderRef = useRef<HTMLDivElement>(null);

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
          {NEW_RELEASES.map((movie) => (
            <article
              key={movie.id}
              className="group relative min-w-[185px] snap-start sm:min-w-[210px] md:min-w-[225px] lg:min-w-[230px]"
            >
              {/* Poster */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Dark Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Top Rating */}
                <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-md border border-white/10 bg-black/70 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                  <Star
                    size={11}
                    fill="currentColor"
                    className="text-[#FF4C00]"
                  />
                  {movie.rating}
                </div>

                {/* New Badge */}
                <div className="absolute left-2.5 top-2.5 rounded-md bg-[#FF4C00] px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-lg shadow-[#FF4C00]/20">
                  NEW
                </div>

                {/* Add Button */}
                <button
                  type="button"
                  aria-label={`Add ${movie.title} to list`}
                  className="absolute right-2.5 top-12 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-[#FF4C00] group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <Plus size={15} />
                </button>

                {/* Hover Play */}
                <Link
                  href={`/movies/${movie.id}`}
                  className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-[40%] items-center justify-center rounded-full bg-[#FF4C00] text-white opacity-0 shadow-xl shadow-[#FF4C00]/20 transition-all duration-300 group-hover:-translate-y-1/2 group-hover:opacity-100"
                  aria-label={`Watch ${movie.title}`}
                >
                  <Play size={18} fill="currentColor" />
                </Link>

                {/* Bottom Content */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <h3 className="truncate text-sm font-bold text-white sm:text-base">
                    {movie.title}
                  </h3>

                  <div className="mt-1.5 flex items-center gap-2 text-[9px] font-medium uppercase tracking-wider text-zinc-400 sm:text-[10px]">
                    <span>{movie.year}</span>

                    <span className="h-1 w-1 rounded-full bg-[#FF4C00]" />

                    <span>{movie.genre}</span>

                    <span className="h-1 w-1 rounded-full bg-zinc-600" />

                    <span>{movie.duration}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Accent */}
              <div className="mt-2 h-px w-0 bg-[#FF4C00] transition-all duration-500 group-hover:w-full" />
            </article>
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