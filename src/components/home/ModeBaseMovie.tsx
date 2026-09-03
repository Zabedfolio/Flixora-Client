'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Play, Plus, ChevronLeft, ChevronRight, RefreshCw, Wand2 } from 'lucide-react';
import MediaCard from '@/components/ui/card';
import { getTMDBImageUrl, fetchFromTMDB } from '@/data/tmdb';
import { getHistory } from '@/data/historyStore';

interface TopPick {
  id?: number;
  title: string;
  image: string;
  matchPercentage: number;
  category: string;
  reason: string;
  description: string;
  duration: string;
  year: number;
}

interface SecondaryPick {
  id: number;
  title: string;
  image: string;
  reasonTag: string;
  category: string;
  rating: number;
  year: number;
}

const GENRE_NAME_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export default function ModeBaseMovie() {
  const [topPick, setTopPick] = useState<TopPick | null>(null);
  const [secondaryPicks, setSecondaryPicks] = useState<SecondaryPick[]>([]);
  const [reasonTitle, setReasonTitle] = useState<string>('AI suggestions curated based on user watch history');
  const [suggestedGenres, setSuggestedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Helper to extract watched genres from client store
  const getWatchedGenres = (): string[] => {
    const history = getHistory();
    const genresSet = new Set<string>();
    history.forEach((item) => {
      if (Array.isArray(item.genres)) {
        item.genres.forEach((g) => genresSet.add(g));
      }
    });
    return Array.from(genresSet);
  };

  const loadModeRecommendations = async () => {
    try {
      setRefreshing(true);
      const watched = getWatchedGenres();

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

      // 1. Fetch AI recommendations endpoint from backend
      const res = await fetch(`${serverUrl}/api/ai/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'current_user',
          genres: watched.length > 0 ? watched : ['Action', 'Sci-Fi', 'Thriller'],
        }),
      });

      if (res.ok) {
        const body = await res.json();
        if (body.success && body.data && Array.isArray(body.data.movies) && body.data.movies.length > 0) {
          const { reason, suggestedGenres: genresResult, movies } = body.data;

          setReasonTitle(reason || 'Curated by Flixora AI based on your watch history');
          setSuggestedGenres(genresResult || watched);

          const firstMovie = movies[0];
          setTopPick({
            id: firstMovie.id,
            title: firstMovie.title || firstMovie.name || 'Featured AI Pick',
            image: getTMDBImageUrl(firstMovie.poster_path, 'w500'),
            matchPercentage: Math.floor(90 + Math.random() * 9),
            category: firstMovie.genre_ids?.[0] ? GENRE_NAME_MAP[firstMovie.genre_ids[0]] || 'Featured' : 'Featured',
            reason: reason || 'Top Pick for You',
            description: firstMovie.overview || 'Handpicked based on your watch history genres and AI taste matching.',
            duration: '2h 10m',
            year: firstMovie.release_date ? new Date(firstMovie.release_date).getFullYear() : 2025,
          });

          setSecondaryPicks(
            movies.slice(1).map((m: any) => ({
              id: m.id,
              title: m.title || m.name,
              image: getTMDBImageUrl(m.poster_path, 'w500'),
              reasonTag: `${Math.floor(86 + Math.random() * 13)}% Match`,
              category: m.genre_ids?.[0] ? GENRE_NAME_MAP[m.genre_ids[0]] || 'Popular' : 'Popular',
              rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : 8.2,
              year: m.release_date ? new Date(m.release_date).getFullYear() : 2025,
            }))
          );
          setLoading(false);
          setRefreshing(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend fetch /api/ai/recommendations failed, using fallback:', err);
    }

    // Direct TMDB fallback if server is offline
    try {
      const tmdbData = await fetchFromTMDB<{ results: any[] }>(
        '/discover/movie?language=en-US&sort_by=popularity.desc&include_adult=false&page=1&vote_count.gte=50'
      );
      const movies = tmdbData.results || [];
      if (movies.length > 0) {
        const first = movies[0];
        setTopPick({
          id: first.id,
          title: first.title,
          image: getTMDBImageUrl(first.poster_path, 'w500'),
          matchPercentage: 96,
          category: GENRE_NAME_MAP[first.genre_ids?.[0]] || 'Action',
          reason: 'AI Recommendation',
          description: first.overview || 'Recommended based on your watch history.',
          duration: '2h 15m',
          year: first.release_date ? new Date(first.release_date).getFullYear() : 2025,
        });

        setSecondaryPicks(
          movies.slice(1, 10).map((m) => ({
            id: m.id,
            title: m.title,
            image: getTMDBImageUrl(m.poster_path, 'w500'),
            reasonTag: `${Math.floor(88 + Math.random() * 10)}% Match`,
            category: GENRE_NAME_MAP[m.genre_ids?.[0]] || 'Movie',
            rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : 8.1,
            year: m.release_date ? new Date(m.release_date).getFullYear() : 2025,
          }))
        );
      }
    } catch (err) {
      console.error('Error fetching fallback movies:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      loadModeRecommendations();
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const offset = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
    }
  };

  if (loading || !topPick) {
    return (
      <section className="relative bg-black py-16 px-4 md:px-8 border-t border-[#121212]">
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[350px]">
          <span className="loading loading-spinner text-[#FF4C00] loading-lg"></span>
          <p className="text-[10px] text-zinc-500 mt-4 tracking-widest uppercase font-bold">
            Analyzing Watch History & AI Recommendations...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-black py-16 px-4 md:px-8 select-none overflow-hidden z-10 border-t border-[#121212]">
      {/* Ambient Radial Glow */}
      <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF4C00]/5 blur-[140px] rounded-full pointer-events-none z-0 hidden lg:block" />

      {/* HEADER SECTION */}
      <div className="relative z-10 max-w-7xl mx-auto mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1.5">
            <Wand2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF4C00] flex-shrink-0 animate-pulse" />
            <h2 className="text-xl xs:text-2xl md:text-3xl font-black tracking-tight text-white uppercase leading-tight">
              Mode Based Movies
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs md:text-sm text-zinc-400 font-medium leading-normal">
            {reasonTitle}
          </p>

          {suggestedGenres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest self-center mr-1">
                AI Suggested Genres:
              </span>
              {suggestedGenres.map((g, idx) => (
                <span
                  key={idx}
                  className="text-[9px] font-extrabold text-[#FF4C00] bg-[#FF4C00]/10 border border-[#FF4C00]/25 px-2.5 py-0.5 rounded-full uppercase"
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={loadModeRecommendations}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl border border-zinc-800 hover:border-[#FF4C00]/40 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 self-start sm:self-auto shadow-md"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin text-[#FF4C00]' : 'text-[#FF4C00]'} />
          <span>{refreshing ? 'Processing AI...' : 'Refresh AI Mode'}</span>
        </button>
      </div>

      {/* MAIN GRID CONTENT AREA */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SPOTLIGHT CARD */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="group relative w-full rounded-2xl overflow-hidden border border-[#FF4C00]/30 hover:border-[#FF4C00] shadow-[0_0_15px_rgba(255,76,0,0.05)] hover:shadow-[0_0_20px_rgba(255,76,0,0.18)] transition-all duration-500 aspect-[4/5] xs:aspect-video lg:aspect-[2/3] max-h-[460px] lg:max-h-none">
            <img
              src={topPick.image}
              alt={topPick.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-20 flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4C00] animate-pulse" />
                  <span className="text-[9px] font-black tracking-widest text-[#FF4C00] uppercase">
                    {topPick.matchPercentage}% AI MATCH
                  </span>
                </div>
                <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                  {topPick.reason}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight truncate">
                {topPick.title}
              </h3>
              <p className="text-xs text-zinc-350 font-medium leading-relaxed line-clamp-2 hidden sm:block">
                {topPick.description}
              </p>

              <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-semibold mt-1">
                <span>{topPick.year}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <span>{topPick.category}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <span>{topPick.duration}</span>
              </div>

              <div className="flex items-center gap-[#FF4C00] gap-3 mt-3">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#FF4C00] hover:bg-[#E04300] active:scale-98 text-black text-xs font-black uppercase rounded-lg transition-all shadow-lg shadow-[#FF4C00]/20 cursor-pointer">
                  <Play size={12} fill="currentColor" /> Play Now
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10 cursor-pointer">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CAROUSEL ROW */}
        <div className="lg:col-span-8 flex flex-col gap-4 group/row relative w-full overflow-hidden">
          <button
            onClick={() => scroll('left')}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-[#FF4C00] text-white rounded-full border border-white/10 hover:border-transparent opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => scroll('right')}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-[#FF4C00] text-white rounded-full border border-white/10 hover:border-transparent opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto overflow-y-hidden pt-6 pb-6 px-3 scroll-smooth scrollbar-none snap-x snap-mandatory -mt-6 -mb-6"
          >
            {secondaryPicks.map((pick) => (
              <div
                key={pick.id}
                className="group/card flex-none w-[160px] sm:w-[200px] snap-start flex flex-col gap-2.5 animate-in fade-in"
              >
                <MediaCard
                  id={pick.id}
                  title={pick.title}
                  unsplash_url={pick.image}
                  rating={pick.rating.toFixed(1)}
                  year={pick.year.toString()}
                  category={pick.category.split(' / ')[0]}
                  duration={pick.reasonTag}
                  isNew={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
