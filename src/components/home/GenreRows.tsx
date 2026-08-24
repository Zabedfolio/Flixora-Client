'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import MediaCard from '@/components/ui/card';

interface Movie {
  id: number;
  title: string;
  image: string;
  rating: string;
}

interface Genre {
  title: string;
  subtitle: string;
  movies: Movie[];
}

interface MovieRowProps {
  genre: Genre;
}

/* =========================
   ACTION IMAGES
========================= */

const ACTION_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=900&auto=format&fit=crop',
];

/* =========================
   SCI-FI IMAGES
========================= */

const SCIFI_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=900&auto=format&fit=crop',
];

/* =========================
   DRAMA IMAGES
========================= */

const DRAMA_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=900&auto=format&fit=crop',
];

/* =========================
   ACTION MOVIES
========================= */

const actionTitles: string[] = [
  'Fury',
  'Dark Mission',
  'Last Stand',
  'The Chase',
  'War Zone',
  'Final Strike',
  'Black Hawk',
  'Dead Reckoning',
  'Red Horizon',
  'Shadow Force',
  'Zero Hour',
  'Blood Run',
  'Iron Storm',
  'Night Hunter',
  'Rapid Fire',
  'Code Red',
  'Dark Pursuit',
  'The Outlaw',
  'Last Mission',
  'Broken Arrow',
  'Silent Warrior',
  'War Machine',
  'Deep Cover',
  'The Assassin',
  'Final Target',
  'Rogue Agent',
  'Cold Blood',
  'Firestorm',
  'Edge of War',
  'No Escape',
  'The Protector',
  'Dead Zone',
  'Strike Force',
  'Black Ops',
  'The Hitman',
  'Dangerous Ground',
  'Hard Target',
  'Operation Zero',
  'The Guardian',
  'Dark Enemy',
  'Fast Trigger',
  'Lost Soldier',
  'Final Battle',
  'Crimson Force',
  'The Invader',
  'War Path',
  'Last Enemy',
  'Steel Rain',
  'Code Warrior',
  'The Commander',
  'Final Countdown',
  'Shadow Strike',
  'Battle Line',
  'Aftermath',
];

/* =========================
   SCI-FI MOVIES
========================= */

const scifiTitles: string[] = [
  'The Cosmos',
  'Dark Planet',
  'Unknown Space',
  'Interstellar',
  'Lost Galaxy',
  'Beyond Earth',
  'Infinite Space',
  'Mars Rising',
  'The Last Planet',
  'Quantum',
  'Stellar',
  'Black Hole',
  'Future World',
  'Alien Dawn',
  'Deep Space',
  'Time Rift',
  'Cosmic Storm',
  'The Colony',
  'Star Walker',
  'Beyond Time',
  'Dark Universe',
  'Space Frontier',
  'The Signal',
  'Parallel',
  'Zero Gravity',
  'Neon Planet',
  'Lost Dimension',
  'The Machine',
  'Future Earth',
  'Gravity',
  'Solar Storm',
  'The Visitor',
  'Quantum War',
  'Unknown Planet',
  'Digital Soul',
  'Time Traveler',
  'Dark Matter',
  'The Explorer',
  'Space Raiders',
  'Artificial',
  'The Portal',
  'Galaxy Zero',
  'The Awakening',
  'Infinite',
  'Beyond Reality',
  'The Origin',
  'Starfall',
  'Cosmic Code',
  'The Void',
  'Future Shock',
  'Eclipse',
  'Alien World',
  'Last Horizon',
  'New Earth',
];

/* =========================
   DRAMA MOVIES
========================= */

const dramaTitles: string[] = [
  'The Journey',
  'The Memory',
  'Broken Silence',
  'After Rain',
  'The Last Letter',
  'Falling Apart',
  'Lost Dreams',
  'The Promise',
  'Before Goodbye',
  'A New Beginning',
  'The Secret',
  'Pieces of Life',
  'The Return',
  'Silent Hearts',
  'One Last Chance',
  'The Family',
  'Behind the Smile',
  'The Photograph',
  'Yesterday',
  'The Distance',
  'Home Again',
  'The Decision',
  'Unspoken',
  'The Truth',
  'Fading Memories',
  'A Better Day',
  'The Stranger',
  'Second Chance',
  'The Goodbye',
  'Lost & Found',
  'The Letter',
  'Our Story',
  'The Reunion',
  'Forever',
  'The Road Home',
  'Broken Dreams',
  'The Witness',
  'Without You',
  'The Beginning',
  'The Ending',
  'A Quiet Place',
  'Hidden Truth',
  'The Father',
  'The Mother',
  'The Son',
  'The Daughter',
  'One Beautiful Day',
  'The Story',
  'A Long Way',
  'The Last Goodbye',
  'Remember Me',
  'Until Tomorrow',
  'Life After',
  'The Final Chapter',
];

/* =========================
   CREATE MOVIE DATA
========================= */

const createMovies = (
  titles: string[],
  images: string[],
  startId: number,
): Movie[] => {
  return titles.map((title, index) => {
    const ratingValue = 7.5 + ((index * 7) % 16) / 10;

    return {
      id: startId + index,
      title,
      image: images[index % images.length],
      rating: ratingValue.toFixed(1),
    };
  });
};

/* =========================
   GENRES
========================= */

const GENRES: Genre[] = [
  {
    title: 'Action',
    subtitle: 'Adrenaline-fueled stories',
    movies: createMovies(
      actionTitles,
      ACTION_IMAGES,
      1,
    ),
  },
  {
    title: 'Sci-Fi',
    subtitle: 'Beyond the impossible',
    movies: createMovies(
      scifiTitles,
      SCIFI_IMAGES,
      100,
    ),
  },
  {
    title: 'Drama',
    subtitle: 'Stories that stay with you',
    movies: createMovies(
      dramaTitles,
      DRAMA_IMAGES,
      200,
    ),
  },
];

/* =========================
   MOVIE ROW
========================= */

const MovieRow = ({ genre }: MovieRowProps) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;

    const cardWidth = 215;
    const gap = 16;

    const scrollAmount = (cardWidth + gap) * 4;

    sliderRef.current.scrollBy({
      left:
        direction === 'left'
          ? -scrollAmount
          : scrollAmount,
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
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

/* =========================
   GENRE ROWS
========================= */

const GenreRows = () => {
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
          {GENRES.map((genre) => (
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