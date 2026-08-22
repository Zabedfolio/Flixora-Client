'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import type { IconType } from 'react-icons';
import {
  FiBookmark,
  FiCheck,
  FiCoffee,
  FiCpu,
  FiDroplet,
  FiFilter,
  FiGrid,
  FiList,
  FiMoon,
  FiPlay,
  FiPlus,
  FiSearch,
  FiSmile,
  FiStar,
  FiTrendingUp,
  FiZap,
} from 'react-icons/fi';
import Pagination from '@/components/common/Pagination';

interface Movie {
  id: string;
  title: string;
  rating: number;
  year: number;
  duration: string;
  matchScore: number;
  genres: string[];
  moods: string[];
  posterUrl: string;
  isAiRecommended?: boolean;
}

interface Mood {
  id: string;
  label: string;
  Icon: IconType;
}

const GENRES = [
  'All',
  'Action',
  'Sci-Fi',
  'Cyberpunk',
  'Drama',
  'Thriller',
  'Horror',
  'Anime',
  'Mystery',
];

const MOODS: Mood[] = [
  {
    id: 'mind-bending',
    label: 'Mind-Bending',
    Icon: FiCpu,
  },
  {
    id: 'adrenaline',
    label: 'Adrenaline Rush',
    Icon: FiZap,
  },
  {
    id: 'cozy',
    label: 'Cozy & Relaxed',
    Icon: FiCoffee,
  },
  {
    id: 'dark-grim',
    label: 'Dark & Gritty',
    Icon: FiMoon,
  },
  {
    id: 'emotional',
    label: 'Emotional Journey',
    Icon: FiDroplet,
  },
];

const SAMPLE_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'CyberPulse 2088',
    rating: 8.9,
    year: 2026,
    duration: '2h 14m',
    matchScore: 98,
    genres: ['Sci-Fi', 'Cyberpunk', 'Action'],
    moods: ['mind-bending', 'adrenaline'],
    posterUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop',
    isAiRecommended: true,
  },
  {
    id: '2',
    title: 'Echoes of Eternity',
    rating: 8.4,
    year: 2025,
    duration: '1h 58m',
    matchScore: 92,
    genres: ['Drama', 'Mystery'],
    moods: ['emotional', 'mind-bending'],
    posterUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop',
    isAiRecommended: true,
  },
  {
    id: '3',
    title: 'Neonate Drift',
    rating: 7.8,
    year: 2026,
    duration: '2h 05m',
    matchScore: 88,
    genres: ['Action', 'Thriller'],
    moods: ['adrenaline', 'dark-grim'],
    posterUrl:
      'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Shadows in the Void',
    rating: 9.1,
    year: 2025,
    duration: '2h 30m',
    matchScore: 95,
    genres: ['Sci-Fi', 'Horror'],
    moods: ['dark-grim', 'mind-bending'],
    posterUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop',
    isAiRecommended: true,
  },
  {
    id: '5',
    title: 'Midnight Horizon',
    rating: 8.7,
    year: 2026,
    duration: '2h 08m',
    matchScore: 94,
    genres: ['Action', 'Mystery', 'Thriller'],
    moods: ['adrenaline', 'dark-grim', 'emotional'],
    posterUrl:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop',
    isAiRecommended: true,
  },
  {
    id: '6',
    title: 'Quantum Rift',
    rating: 9.0,
    year: 2026,
    duration: '2h 21m',
    matchScore: 97,
    genres: ['Sci-Fi', 'Mystery', 'Thriller'],
    moods: ['mind-bending', 'emotional'],
    posterUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
    isAiRecommended: true,
  },
  {
    id: '7',
    title: 'Iron Neon',
    rating: 7.9,
    year: 2025,
    duration: '1h 49m',
    matchScore: 86,
    genres: ['Action', 'Cyberpunk'],
    moods: ['adrenaline', 'dark-grim'],
    posterUrl:
      'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&auto=format&fit=crop',
  },
  {
    id: '8',
    title: 'Moonlit Protocol',
    rating: 8.2,
    year: 2024,
    duration: '2h 03m',
    matchScore: 90,
    genres: ['Drama', 'Mystery', 'Sci-Fi'],
    moods: ['emotional', 'mind-bending'],
    posterUrl:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop',
  },
  {
    id: '9',
    title: 'Ashes of Tomorrow',
    rating: 8.5,
    year: 2026,
    duration: '2h 17m',
    matchScore: 93,
    genres: ['Action', 'Drama', 'Thriller'],
    moods: ['adrenaline', 'emotional'],
    posterUrl:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop',
    isAiRecommended: true,
  },
  {
    id: '10',
    title: 'Velvet Singularity',
    rating: 7.6,
    year: 2025,
    duration: '1h 55m',
    matchScore: 84,
    genres: ['Drama', 'Mystery'],
    moods: ['cozy', 'emotional'],
    posterUrl:
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&auto=format&fit=crop',
  },
  {
    id: '11',
    title: 'Ghost Signal',
    rating: 8.8,
    year: 2026,
    duration: '2h 11m',
    matchScore: 96,
    genres: ['Horror', 'Sci-Fi', 'Mystery'],
    moods: ['dark-grim', 'mind-bending'],
    posterUrl:
      'https://images.unsplash.com/photo-1511715282680-fbf93a50e721?w=800&auto=format&fit=crop',
    isAiRecommended: true,
  },
  {
    id: '12',
    title: 'Protocol Zero',
    rating: 8.1,
    year: 2024,
    duration: '1h 52m',
    matchScore: 89,
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    moods: ['adrenaline', 'mind-bending'],
    posterUrl:
      'https://images.unsplash.com/photo-1522120692538-7b6b14b2b0aa?w=800&auto=format&fit=crop',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut' as const,
    },
  },
};

const PAGE_SIZE = 8;

export default function ExplorePage() {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [showAiFilter, setShowAiFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMovies = useMemo(() => {
    return SAMPLE_MOVIES.filter(movie => {
      const matchesGenre =
        selectedGenre === 'All' || movie.genres.includes(selectedGenre);
      const matchesMood = !selectedMood || movie.moods.includes(selectedMood);
      const matchesAi = !showAiFilter || movie.isAiRecommended === true;

      return matchesGenre && matchesMood && matchesAi;
    });
  }, [selectedGenre, selectedMood, showAiFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / PAGE_SIZE));

  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return filteredMovies.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredMovies]);

  const toggleSave = (movieId: string) => {
    setSavedIds(currentIds =>
      currentIds.includes(movieId)
        ? currentIds.filter(id => id !== movieId)
        : [...currentIds, movieId],
    );
  };

  const resetFilters = () => {
    setSelectedGenre('All');
    setSelectedMood(null);
    setShowAiFilter(false);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedGenre !== 'All' || selectedMood !== null || showAiFilter;

  const startItem = filteredMovies.length
    ? (currentPage - 1) * PAGE_SIZE + 1
    : 0;
  const endItem = Math.min(currentPage * PAGE_SIZE, filteredMovies.length);
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <section className="min-h-screen w-full bg-black text-[#E5E5E5]">
      <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-24 sm:px-6 md:pt-28 lg:px-8">
        <section className="border-b border-[#1A1A1A] pb-7">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <FiTrendingUp className="h-4 w-4 text-[#FF4C00]" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF4C00]">
                Explore
              </span>
            </div>

            <h1 className="bg-linear-to-r from-[#FF4C00] via-[#FF6A2A] to-[#FF9A70] bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl md:text-5xl">
              Explore Universe
            </h1>

            <p className="max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
              Discover movies tailored by AI algorithms and personal mood
              preferences.
            </p>
          </div>
        </section>

        <section className="mt-8 space-y-4">
          <div className="flex items-center gap-2">
            <FiSmile className="h-4 w-4 text-[#FF4C00]" />

            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF4C00]">
              AI Mood Engine
            </h2>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {MOODS.map(mood => {
              const isActive = selectedMood === mood.id;
              const MoodIcon = mood.Icon;

              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => {
                    setSelectedMood(isActive ? null : mood.id);
                    setCurrentPage(1);
                  }}
                  className={`relative flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all sm:text-sm ${
                    isActive
                      ? 'border-[#FF4C00]/70 bg-[#FF4C00]/10 text-white shadow-lg shadow-[#FF4C00]/10'
                      : 'border-[#1A1A1A] bg-[#0D0D0D] text-zinc-400 hover:border-[#2A2A2A] hover:text-white'
                  }`}
                >
                  <MoodIcon
                    className={`h-4 w-4 ${
                      isActive ? 'text-[#FF4C00]' : 'text-zinc-500'
                    }`}
                  />

                  <span>{mood.label}</span>

                  {isActive && (
                    <motion.div
                      layoutId="activeMood"
                      className="pointer-events-none absolute inset-0 rounded-xl border border-[#FF4C00]"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[#1A1A1A] bg-[#0D0D0D] p-3 sm:p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto scrollbar-none">
              <div className="mr-1 hidden shrink-0 items-center text-zinc-600 sm:flex">
                <FiFilter className="h-3.5 w-3.5" />
              </div>

              {GENRES.map(genre => {
                const isActive = selectedGenre === genre;

                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => {
                      setSelectedGenre(genre);
                      setCurrentPage(1);
                    }}
                    className={`shrink-0 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#FF4C00] text-white shadow-md shadow-[#FF4C00]/20'
                        : 'text-zinc-500 hover:bg-[#1A1A1A] hover:text-white'
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-3 xl:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowAiFilter(current => !current);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                  showAiFilter
                    ? 'border-[#FF4C00]/50 bg-[#FF4C00]/10 text-[#FF6A2A]'
                    : 'border-[#1A1A1A] bg-black text-zinc-500 hover:text-white'
                }`}
              >
                <FiZap
                  className={`h-3.5 w-3.5 ${
                    showAiFilter ? 'text-[#FF4C00]' : 'text-zinc-600'
                  }`}
                />

                <span className="hidden sm:inline">90%+ AI Match</span>
                <span className="sm:hidden">AI</span>
              </button>

              <div className="flex items-center rounded-lg border border-[#1A1A1A] bg-black p-1">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('grid');
                    setCurrentPage(1);
                  }}
                  className={`rounded-md p-2 transition-all ${
                    viewMode === 'grid'
                      ? 'bg-[#1A1A1A] text-[#FF4C00]'
                      : 'text-zinc-600 hover:text-white'
                  }`}
                  aria-label="Grid view"
                >
                  <FiGrid className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setViewMode('list');
                    setCurrentPage(1);
                  }}
                  className={`rounded-md p-2 transition-all ${
                    viewMode === 'list'
                      ? 'bg-[#1A1A1A] text-[#FF4C00]'
                      : 'text-zinc-600 hover:text-white'
                  }`}
                  aria-label="List view"
                >
                  <FiList className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">
            <span className="font-semibold text-white">
              {filteredMovies.length}
            </span>{' '}
            {filteredMovies.length === 1 ? 'movie' : 'movies'} found
            {filteredMovies.length > 0 && (
              <>
                {' '}
                - showing {startItem}-{endItem} of {filteredMovies.length}
              </>
            )}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-[#FF4C00] underline underline-offset-4 transition-colors hover:text-[#FF6A2A]"
            >
              Reset filters
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {filteredMovies.length > 0 ? (
            <motion.div
              key={`${viewMode}-${selectedGenre}-${selectedMood}-${showAiFilter}-${currentPage}`}
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -12,
              }}
              transition={{
                duration: 0.25,
              }}
              className="mt-6"
            >
              {viewMode === 'grid' ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {paginatedMovies.map(movie => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      isSaved={savedIds.includes(movie.id)}
                      onToggleSave={toggleSave}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-4"
                >
                  {paginatedMovies.map(movie => (
                    <MovieListItem
                      key={movie.id}
                      movie={movie}
                      isSaved={savedIds.includes(movie.id)}
                      onToggleSave={toggleSave}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <EmptyState onReset={resetFilters} />
          )}
        </AnimatePresence>

        {filteredMovies.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            label="Explore results"
          />
        )}
      </div>
    </section>
  );
}

interface MovieCardProps {
  movie: Movie;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

function MovieCard({ movie, isSaved, onToggleSave }: MovieCardProps) {
  return (
    <motion.article
      variants={itemVariants}
      whileHover={{
        y: -6,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className="group relative overflow-hidden rounded-2xl border border-[#1A1A1A] bg-[#0D0D0D] transition-all hover:border-[#FF4C00]/40 hover:shadow-xl hover:shadow-[#FF4C00]/5"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#080808]">
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-linear-to-t from-[#0D0D0D] via-transparent to-black/50 opacity-90" />

        <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full border border-[#FF4C00]/30 bg-black/70 px-2 py-1 text-[9px] font-bold text-[#FF6A2A] backdrop-blur-md sm:left-3 sm:top-3 sm:px-2.5 sm:py-1.5 sm:text-[11px]">
          <FiZap className="h-3 w-3 text-[#FF4C00]" />
          {movie.matchScore}% Match
        </div>

        <button
          type="button"
          onClick={() => onToggleSave(movie.id)}
          className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-all sm:right-3 sm:top-3 sm:h-9 sm:w-9 ${
            isSaved
              ? 'border-[#FF4C00] bg-[#FF4C00] text-white'
              : 'border-[#1A1A1A] bg-black/60 text-zinc-300 hover:border-[#FF4C00]/50 hover:text-white'
          }`}
          aria-label={
            isSaved
              ? `Remove ${movie.title} from list`
              : `Add ${movie.title} to list`
          }
        >
          {isSaved ? (
            <FiCheck className="h-4 w-4" />
          ) : (
            <FiPlus className="h-4 w-4" />
          )}
        </button>

        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF4C00] text-white shadow-lg shadow-[#FF4C00]/30 transition-transform duration-300 group-hover:scale-110 hover:bg-[#FF6A2A] sm:h-14 sm:w-14"
            aria-label={`Play ${movie.title}`}
          >
            <FiPlay className="ml-0.5 h-5 w-5 fill-current sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>

      <div className="space-y-3 p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2 text-[10px] text-zinc-500 sm:text-xs">
          <span>
            {movie.year} - {movie.duration}
          </span>

          <span className="flex items-center gap-1 font-semibold text-amber-400">
            <FiStar className="h-3 w-3 fill-current sm:h-3.5 sm:w-3.5" />
            {movie.rating}
          </span>
        </div>

        <h3 className="line-clamp-1 text-sm font-bold text-[#E5E5E5] transition-colors group-hover:text-[#FF6A2A] sm:text-base">
          {movie.title}
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {movie.genres.slice(0, 2).map(genre => (
            <span
              key={genre}
              className="rounded-md bg-[#1A1A1A] px-2 py-1 text-[9px] font-medium text-zinc-500 sm:text-[10px]"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function MovieListItem({ movie, isSaved, onToggleSave }: MovieCardProps) {
  return (
    <motion.article
      variants={itemVariants}
      whileHover={{
        x: 4,
      }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#1A1A1A] bg-[#0D0D0D] transition-all hover:border-[#FF4C00]/40 sm:flex-row"
    >
      <div className="relative h-64 w-full shrink-0 overflow-hidden sm:h-44 sm:w-32">
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          fill
          sizes="128px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

        <div className="absolute left-3 top-3 rounded-full bg-black/70 px-2 py-1 text-[10px] font-bold text-[#FF6A2A] backdrop-blur-md">
          {movie.matchScore}% Match
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
            <span>
              {movie.year} - {movie.duration}
            </span>

            <span className="flex items-center gap-1 text-amber-400">
              <FiStar className="h-3.5 w-3.5 fill-current" />
              {movie.rating}
            </span>
          </div>

          <h3 className="text-xl font-bold text-[#E5E5E5] transition-colors group-hover:text-[#FF6A2A]">
            {movie.title}
          </h3>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {movie.genres.map(genre => (
              <span
                key={genre}
                className="rounded-md bg-[#1A1A1A] px-2 py-1 text-[10px] text-zinc-500"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleSave(movie.id)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
              isSaved
                ? 'border-[#FF4C00] bg-[#FF4C00] text-white'
                : 'border-[#1A1A1A] bg-black text-zinc-500 hover:border-[#FF4C00]/50 hover:text-white'
            }`}
            aria-label={
              isSaved
                ? `Remove ${movie.title} from list`
                : `Add ${movie.title} to list`
            }
          >
            {isSaved ? (
              <FiCheck className="h-4 w-4" />
            ) : (
              <FiBookmark className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-full bg-[#FF4C00] px-5 text-sm font-bold text-white transition-all hover:bg-[#FF6A2A] active:scale-95"
          >
            <FiPlay className="h-4 w-4 fill-current" />
            Play
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      className="mt-6 flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-[#1A1A1A] bg-[#0D0D0D] px-6 text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FF4C00]/10">
        <FiSearch className="h-6 w-6 text-[#FF4C00]" />
      </div>

      <h3 className="text-lg font-bold text-white">No movies found</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
        No movies match your current search and filter preferences.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-5 rounded-lg bg-[#FF4C00] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#FF6A2A] active:scale-95"
      >
        Reset All Filters
      </button>
    </motion.div>
  );
}
