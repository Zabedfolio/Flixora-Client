'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  ChevronDown,
  Flame,
  Info,
  Play,
  Star,
} from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import MediaCard from '@/components/ui/card';

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

const TRENDING_CATALOG: TrendingItem[] = [
  {
    id: 1,
    title: 'Wednesday',
    type: 'tv',
    vote_average: 8.6,
    release_year: '2022',
    genres: ['Sci-Fi & Fantasy', 'Mystery', 'Comedy'],
    is_rising: true,
    unsplash_url:
      'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Avatar: The Way of Water',
    type: 'movie',
    vote_average: 7.7,
    release_year: '2022',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    is_rising: true,
    unsplash_url:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Stranger Things',
    type: 'tv',
    vote_average: 8.6,
    release_year: '2016',
    genres: ['Sci-Fi & Fantasy', 'Mystery', 'Drama'],
    is_rising: false,
    unsplash_url:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Demon Slayer: Kimetsu no Yaiba',
    type: 'tv',
    vote_average: 8.7,
    release_year: '2019',
    genres: ['Animation', 'Action & Adventure', 'Anime'],
    is_rising: true,
    unsplash_url:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Oppenheimer',
    type: 'movie',
    vote_average: 8.1,
    release_year: '2023',
    genres: ['Drama', 'History'],
    is_rising: false,
    unsplash_url:
      'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 6,
    title: 'Attack on Titan',
    type: 'tv',
    vote_average: 8.9,
    release_year: '2013',
    genres: ['Animation', 'Action & Adventure', 'Anime'],
    is_rising: true,
    unsplash_url:
      'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 7,
    title: 'Spider-Man: Across the Spider-Verse',
    type: 'movie',
    vote_average: 8.4,
    release_year: '2023',
    genres: ['Animation', 'Action', 'Adventure'],
    is_rising: false,
    unsplash_url:
      'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 8,
    title: 'The Last of Us',
    type: 'tv',
    vote_average: 8.6,
    release_year: '2023',
    genres: ['Drama', 'Sci-Fi & Fantasy', 'Action'],
    is_rising: false,
    unsplash_url:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 9,
    title: 'Jujutsu Kaisen',
    type: 'tv',
    vote_average: 8.6,
    release_year: '2020',
    genres: ['Animation', 'Action & Adventure', 'Anime'],
    is_rising: true,
    unsplash_url:
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 10,
    title: 'Barbie',
    type: 'movie',
    vote_average: 7.1,
    release_year: '2023',
    genres: ['Comedy', 'Adventure', 'Fantasy'],
    is_rising: false,
    unsplash_url:
      'https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=400&auto=format&fit=crop',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'movie', label: 'Movies' },
  { id: 'tv', label: 'TV Shows' },
  { id: 'anime', label: 'Anime' },
] as const;

const PAGE_SIZE = 6;

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

  const displayItems = useMemo(() => {
    let list = [...TRENDING_CATALOG];

    if (activeCategory === 'movie') {
      list = list.filter(item => item.type === 'movie');
    } else if (activeCategory === 'tv') {
      list = list.filter(item => item.type === 'tv' && !item.genres.includes('Anime'));
    } else if (activeCategory === 'anime') {
      list = list.filter(item => item.genres.includes('Anime'));
    }

    if (activeTimeRange === 'today') {
      list = list.filter(item => item.is_rising || item.vote_average >= 8);
    }

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
  }, [activeCategory, activeTimeRange, activeSort]);

  const totalPages = Math.max(1, Math.ceil(displayItems.length / PAGE_SIZE));

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return displayItems.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, displayItems]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const startItem = displayItems.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const endItem = Math.min(currentPage * PAGE_SIZE, displayItems.length);

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
              The most watched titles on Flixora right now. Updated dynamically
              from international streams.
            </p>

            <div className="flex w-fit items-center gap-2 rounded-lg border border-zinc-900 bg-zinc-950/80 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF4C00] animate-ping" />
              <span>Refreshed 15 mins ago</span>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] p-4 lg:flex-row lg:items-center">
          <div className="hidden items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex lg:pb-0">
            {CATEGORIES.map(tab => {
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
              onChange={e => {
                setActiveCategory(e.target.value as TrendingCategory);
                setCurrentPage(1);
              }}
              className="w-full cursor-pointer appearance-none rounded-xl border border-[#262626] bg-[#141414] py-2.5 pl-4 pr-10 text-xs font-bold uppercase tracking-wider text-white outline-none transition-all focus:border-[#FF4C00]/50"
            >
              {CATEGORIES.map(cat => (
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
                onChange={e => {
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
                onChange={e => {
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
            <span className="font-semibold text-white">{displayItems.length}</span>{' '}
            {displayItems.length === 1 ? 'title' : 'titles'} found
            {displayItems.length > 0 && (
              <>
                {' '}
                - showing {startItem}-{endItem} of {displayItems.length}
              </>
            )}
          </p>

          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">
            Filters stay on-theme, colors unchanged
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {paginatedItems.length === 0 ? (
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
                {paginatedItems.map((item, idx) => {
                  const rank = (currentPage - 1) * PAGE_SIZE + idx + 1;

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

        {displayItems.length > 0 && (
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
