'use client';

import { useMemo, useState, useEffect, Suspense } from 'react';
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
  FiSearch,
  FiSmile,
  FiStar,
  FiTrendingUp,
  FiZap,
} from 'react-icons/fi';
import { useSearchParams } from 'next/navigation';
import Pagination from '@/components/common/Pagination';
import MediaCard from '@/components/ui/card';
import { getExploreMovies } from '@/data/explore/movies';

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

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
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

function ExploreContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [selectedGenre, setSelectedGenre] = useState('All');
  const [activeFilter, setActiveFilter] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [showAiFilter, setShowAiFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync search parameters from URL
  useEffect(() => {
    const genreParam = searchParams.get('genre');
    const filterParam = searchParams.get('filter');

    if (genreParam) {
      setSelectedGenre(genreParam);
    } else {
      setSelectedGenre('All');
    }

    if (filterParam) {
      setActiveFilter(filterParam);
    } else {
      setActiveFilter('');
    }

    setCurrentPage(1);
  }, [searchParams]);

  // Fetch movies from TMDB API on page/filter change
  useEffect(() => {
    setLoading(true);
    getExploreMovies(query, selectedGenre, currentPage, activeFilter)
      .then((data) => {
        // Map explore data and dynamic moods client side
        const mapped = data.movies.map((m) => {
          const moodsList: string[] = [];
          if (m.genres.includes('Action') || m.genres.includes('Adventure')) moodsList.push('adrenaline');
          if (m.genres.includes('Sci-Fi') || m.genres.includes('Mystery')) moodsList.push('mind-bending');
          if (m.genres.includes('Animation') || m.genres.includes('Comedy')) moodsList.push('cozy');
          if (m.genres.includes('Drama')) moodsList.push('emotional');
          if (m.genres.includes('Horror') || m.genres.includes('Thriller')) moodsList.push('dark-grim');
          
          if (moodsList.length === 0) moodsList.push('cozy');

          return { ...m, moods: moodsList };
        });
        setMovies(mapped);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching explore movies:', err);
        setLoading(false);
      });
  }, [query, selectedGenre, currentPage, activeFilter]);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesMood = !selectedMood || movie.moods.includes(selectedMood);
      const matchesAi = !showAiFilter || movie.isAiRecommended === true;
      return matchesMood && matchesAi;
    });
  }, [movies, selectedMood, showAiFilter]);

  const toggleSave = (movieId: string) => {
    setSavedIds((currentIds) =>
      currentIds.includes(movieId)
        ? currentIds.filter((id) => id !== movieId)
        : [...currentIds, movieId]
    );
  };

  const resetFilters = () => {
    setSelectedGenre('All');
    setSelectedMood(null);
    setShowAiFilter(false);
    setActiveFilter('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const hasActiveFilters =
    selectedGenre !== 'All' || selectedMood !== null || showAiFilter || query || activeFilter;

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
              {activeFilter === 'trending' && 'Discover the most popular movies trending across the globe today.'}
              {activeFilter === 'top-rated' && 'Browse critically acclaimed cinematic masterpieces loved by the community.'}
              {activeFilter === 'new-releases' && 'Explore the latest theater blockbusters and fresh digital releases.'}
              {!activeFilter && 'Discover movies tailored by AI algorithms and personal mood preferences.'}
            </p>
          </div>
        </section>

        {/* AI MOOD ENGINE */}
        <section className="mt-8 space-y-4">
          <div className="flex items-center gap-2">
            <FiSmile className="h-4 w-4 text-[#FF4C00]" />
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF4C00]">
              AI Mood Engine
            </h2>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {MOODS.map((mood) => {
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

        {/* GENRES & CONTROLS */}
        <section className="mt-8 rounded-2xl border border-[#1A1A1A] bg-[#0D0D0D] p-3 sm:p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto scrollbar-none">
              <div className="mr-1 hidden shrink-0 items-center text-zinc-600 sm:flex">
                <FiFilter className="h-3.5 w-3.5" />
              </div>

              {GENRES.map((genre) => {
                const isActive = selectedGenre === genre;

                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => {
                      setSelectedGenre(genre);
                      setActiveFilter('');
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
                  setShowAiFilter((current) => !current);
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
            {query && (
              <span className="mr-2">
                Search results for: <span className="font-semibold text-white">"{query}"</span>
              </span>
            )}
            <span className="font-semibold text-white">{filteredMovies.length}</span> titles found
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

        {/* LOADER / RESULTS */}
        {loading ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center">
            <span className="loading loading-spinner text-[#FF4C00] loading-lg"></span>
            <p className="text-[10px] text-zinc-500 mt-4 tracking-widest uppercase font-bold">Scanning database...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredMovies.length > 0 ? (
              <motion.div
                key={`${viewMode}-${selectedGenre}-${selectedMood}-${showAiFilter}-${currentPage}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="mt-6"
              >
                {viewMode === 'grid' ? (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
                  >
                    {filteredMovies.map((movie) => (
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
                    {filteredMovies.map((movie) => (
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
        )}

        {!loading && filteredMovies.length > 0 && (
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

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <section className="min-h-screen w-full bg-black flex flex-col items-center justify-center">
        <span className="loading loading-spinner text-[#FF4C00] loading-lg"></span>
      </section>
    }>
      <ExploreContent />
    </Suspense>
  );
}

interface MovieCardProps {
  movie: Movie;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

function MovieCard({ movie, isSaved, onToggleSave }: MovieCardProps) {
  return (
    <MediaCard
      title={movie.title}
      unsplash_url={movie.posterUrl}
      rating={movie.rating.toFixed(1)}
      year={movie.year.toString()}
      category={movie.genres[0] || 'Movie'}
      duration={movie.duration}
      isNew={movie.isAiRecommended}
    />
  );
}

function MovieListItem({ movie, isSaved, onToggleSave }: MovieCardProps) {
  return (
    <motion.article
      variants={itemVariants}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#1A1A1A] bg-[#0D0D0D] transition-all hover:border-[#FF4C00]/30 hover:bg-[#121212] sm:flex-row"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[2/3] sm:w-[140px] md:w-[160px] shrink-0">
        <img
          src={movie.posterUrl}
          alt={movie.title}
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
              {movie.rating.toFixed(1)}
            </span>
          </div>

          <h3 className="text-xl font-bold text-[#E5E5E5] transition-colors group-hover:text-[#FF6A2A]">
            {movie.title}
          </h3>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {movie.genres.map((genre) => (
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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
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
