'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import MediaCard from '@/components/ui/card';
import { getBrowseByGenre, GenreRowData } from '@/data/home/browseByGenre';

interface MovieRowProps {
  genre: GenreRowData;
}

const MovieRow = ({ genre }: MovieRowProps) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;

    const cardWidth = 215;
    const gap = 16;
    const scrollAmount = (cardWidth + gap) * 4;

    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="group/row relative">
      {/* Genre Header */}
      <div className="mb-5 flex items-end justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-[#FF4C00]" />
            <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
              {genre.title}
            </h2>
          </div>
          <p className="ml-3 text-xs text-zinc-500 sm:text-sm">
            {genre.subtitle}
          </p>
        </div>

        <Link
          href={`/explore?genre=${encodeURIComponent(genre.title)}`}
          className="hidden text-xs font-bold uppercase tracking-wider text-zinc-500 transition-colors hover:text-[#FF4C00] sm:block"
        >
          View All
        </Link>
      </div>

      {/* Movie Slider */}
      <div className="relative">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => scroll('left')}
          aria-label={`Previous ${genre.title} movies`}
          className="absolute left-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/80 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:border-[#FF4C00] hover:bg-[#FF4C00] group-hover/row:opacity-100 lg:flex"
        >
          <ChevronLeft size={21} />
        </button>

        {/* Movie Cards */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {genre.movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
                delay: Math.min(index * 0.03, 0.5),
              }}
              className="w-[145px] shrink-0 sm:w-[175px] md:w-[200px] lg:w-[215px]"
            >
              <MediaCard
                title={movie.title}
                unsplash_url={movie.image}
                rating={movie.rating}
                year="2026"
                category={genre.title}
                duration="2H 15M"
                isNew={index % 4 === 0}
              />
            </motion.div>
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => scroll('right')}
          aria-label={`Next ${genre.title} movies`}
          className="absolute right-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/80 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:border-[#FF4C00] hover:bg-[#FF4C00] group-hover/row:opacity-100 lg:flex"
        >
          <ChevronRight size={21} />
        </button>
      </div>
    </section>
  );
};

const GenreRows = () => {
  const [genres, setGenres] = useState<GenreRowData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBrowseByGenre()
      .then((data) => {
        setGenres(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching genre rows:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-black py-14 sm:py-16 lg:py-20">
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[400px]">
          <span className="loading loading-spinner text-[#FF4C00] loading-lg"></span>
          <p className="text-[10px] text-zinc-500 mt-4 tracking-widest uppercase font-bold">Cataloging Genres...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-black py-14 sm:py-16 lg:py-20">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[#FF4C00]/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      {/* Main Container */}
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-12">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF4C00]">
            Explore Collection
          </p>

          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Browse by{' '}
            <span className="text-[#FF4C00]">
              Genre
            </span>
          </h2>

          <div className="mt-4 h-px w-20 bg-[#FF4C00]" />
        </div>

        {/* Genre Rows */}
        <div className="space-y-14 sm:space-y-16">
          {genres.map((genre) => (
            <MovieRow
              key={genre.title}
              genre={genre}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenreRows;