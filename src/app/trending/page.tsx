'use client';

import { useMemo, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Flame,
  Info,
} from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import MediaCard from '@/components/ui/card';
import { getTrendingMovies } from '@/data/trending/movies';

type TrendingCategory = 'all' | 'movie' | 'tv' | 'anime';
type TrendingSort = 'popular' | 'rating' | 'discussed';
type TrendingTimeRange = 'today' | 'week';

interface TrendingItem {
  id: number;
  title: string;
  type: 'movie' | 'tv';
  vote_average: number;
  release_year: string;
  genres: string[];
  is_rising: boolean;
  unsplash_url: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'movie', label: 'Movies' },
  { id: 'tv', label: 'TV Shows' },
  { id: 'anime', label: 'Anime' },
] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut' as const,
    },
  },
};

export default function TrendingPage() {
  const [activeCategory, setActiveCategory] =
    useState<TrendingCategory>('all');
  const [activeTimeRange, setActiveTimeRange] =
    useState<TrendingTimeRange>('today');
  const [activeSort, setActiveSort] = useState<TrendingSort>('popular');
  const [currentPage, setCurrentPage] = useState(1);

  const [movies, setMovies] = useState<TrendingItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch trending movies dynamically from TMDB API
  useEffect(() => {
    setLoading(true);
    getTrendingMovies(activeTimeRange, activeCategory, currentPage)
      .then((data) => {
        setMovies(data.movies);
        setTotalPages(data.totalPages);
        setTotalResults(data.totalResults);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching trending movies:', err);
        setLoading(false);
      });
  }, [activeTimeRange, activeCategory, currentPage]);

  const sortedMovies = useMemo(() => {
    const list = [...movies];
    const sorters: Record<TrendingSort, (a: TrendingItem, b: TrendingItem) => number> = {
      popular: (a, b) =>
        Number(b.is_rising) - Number(a.is_rising) ||
        b.vote_average - a.vote_average,
      rating: (a, b) => b.vote_average - a.vote_average,
      discussed: (a, b) =>
        b.genres.length - a.genres.length ||
        Number(b.is_rising) - Number(a.is_rising) ||
        b.vote_average - a.vote_average,
    };
    list.sort(sorters[activeSort]);
    return list;
  }, [movies, activeSort]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const startItem = sortedMovies.length ? (currentPage - 1) * 20 + 1 : 0;
  const endItem = (currentPage - 1) * 20 + sortedMovies.length;

  return (
    <section className="min-h-screen w-full bg-black font-sans text-white overflow-x-hidden relative">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-6 pb-16 pt-28 md:px-12">
        <div className="mb-8 flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <Flame
              className="shrink-0 animate-pulse text-[#FF4C00]"
              size={24}
              fill="currentColor"
            />
            <h1 className="text-2xl font-black tracking-tight text-white uppercase md:text-3xl">
              Trending Now
            </h1>
          </div>

          <div className="mt-0.5 flex flex-col justify-between gap-3 border-b border-[#1A1A1A] pb-5 sm:flex-row sm:items-center">
            <p className="max-w-2xl text-xs font-medium leading-relaxed text-zinc-500 md:text-sm">
              The most watched titles on Flixora right now. Updated dynamically from international streams.
            </p>

            <div className="flex w-fit items-center gap-2 rounded-lg border border-zinc-900 bg-zinc-950/80 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF4C00] animate-ping" />
              <span>Real-time Sync Active</span>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] p-4 lg:flex-row lg:items-center">
          <div className="hidden items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex lg:pb-0">
            {CATEGORIES.map((tab) => {
              const isActive = activeCategory === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-[#FF4C00] text-black shadow-md shadow-[#FF4C00]/20 font-extrabold'
                      : 'border border-[#262626] bg-transparent text-[#B3B3B3] hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:hidden">
            <select
              value={activeCategory}
              onChange={(e) => {
                setActiveCategory(e.target.value as TrendingCategory);
                setCurrentPage(1);
              }}
              className="w-full cursor-pointer appearance-none rounded-xl border border-[#262626] bg-[#141414] py-2.5 pl-4 pr-10 text-xs font-bold uppercase tracking-wider text-white outline-none transition-all focus:border-[#FF4C00]/50"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#FF4C00]">
              <ChevronDown size={13} />
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
            <div className="relative w-full sm:w-auto">
              <select
                value={activeTimeRange}
                onChange={(e) => {
                  setActiveTimeRange(e.target.value as TrendingTimeRange);
                  setCurrentPage(1);
                }}
                className="w-full cursor-pointer appearance-none rounded-xl border border-[#262626] bg-[#141414] py-2.5 pl-4 pr-10 text-xs font-bold text-white outline-none transition-all focus:border-[#FF4C00]/50 sm:w-auto"
              >
                <option value="today">Trending Today</option>
                <option value="week">Trending This Week</option>
              </select>

              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#FF4C00]">
                <ChevronDown size={13} />
              </div>
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                value={activeSort}
                onChange={(e) => {
                  setActiveSort(e.target.value as TrendingSort);
                  setCurrentPage(1);
                }}
                className="w-full cursor-pointer appearance-none rounded-xl border border-[#262626] bg-[#141414] py-2.5 pl-4 pr-10 text-xs font-bold text-white outline-none transition-all focus:border-[#FF4C00]/50 sm:w-auto"
              >
                <option value="popular">Sort: Most Watched</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="discussed">Sort: Most Discussed</option>
              </select>

              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#FF4C00]">
                <ChevronDown size={13} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">
            <span className="font-semibold text-white">{totalResults}</span>{' '}
            {totalResults === 1 ? 'title' : 'titles'} found
            {!loading && sortedMovies.length > 0 && (
              <>
                {' '}
                - showing {startItem}-{endItem} of {totalResults}
              </>
            )}
          </p>

          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">
            Filters stay on-theme, colors unchanged
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {loading ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center">
              <span className="loading loading-spinner text-[#FF4C00] loading-lg"></span>
              <p className="text-[10px] text-zinc-500 mt-4 tracking-widest uppercase font-bold">Querying TMDB logs...</p>
            </div>
          ) : sortedMovies.length === 0 ? (
            <div className="mx-auto my-16 flex max-w-md flex-col items-center justify-center rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] p-16 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-900 bg-zinc-900 text-zinc-500">
                <Info size={20} />
              </div>

              <h3 className="mb-1 text-base font-bold text-white">
                No matches found
              </h3>

              <p className="text-xs leading-relaxed text-zinc-500">
                No trending titles fit the selected filter options right now.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${activeTimeRange}-${activeSort}-${currentPage}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6"
              >
                {sortedMovies.map((item, idx) => {
                  const rank = (currentPage - 1) * 20 + idx + 1;

                  return (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      className="relative flex w-full flex-col gap-3 transition-transform duration-300"
                    >
                      <div className="pl-6 relative">
                        {/* Big rank number for trending */}
                        <div
                          className="absolute bottom-16 left-[-22px] z-35 select-none text-6xl font-black italic leading-none tracking-tighter drop-shadow-2xl md:text-7xl"
                          style={{
                            WebkitTextStroke: '2px #FF4C00',
                            color: '#000000',
                          }}
                        >
                          {rank}
                        </div>

                        <MediaCard
                          id={item.id}
                          title={item.title}
                          unsplash_url={item.unsplash_url}
                          rating={item.vote_average.toFixed(1)}
                          year={item.release_year}
                          category={item.type === 'tv' ? 'Series' : 'Movie'}
                          duration={item.genres[0] || 'Popular'}
                          isNew={item.is_rising}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {!loading && sortedMovies.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            label="Trending results"
          />
        )}
      </div>
    </section>
  );
}
