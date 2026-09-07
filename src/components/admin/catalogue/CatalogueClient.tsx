"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Film,
  Filter,
  Plus,
  Search,
  Star,
  Tv,
} from "lucide-react";
import { getCatalogueMovies } from "@/services/catalogue/catalogueApi";
import { CatalogueMovie } from "@/types/catalogue";

const ALL_GENRES = "All genres";

function LoadingRows() {
  return (
    <div className="divide-y divide-zinc-900">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-4 animate-pulse">
          <div className="h-16 w-11 shrink-0 rounded-lg bg-zinc-800" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-2/5 rounded bg-zinc-800" />
            <div className="h-3 w-1/4 rounded bg-zinc-900" />
          </div>
          <div className="hidden h-4 w-20 rounded bg-zinc-900 sm:block" />
          <div className="h-8 w-20 rounded bg-zinc-900" />
        </div>
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: typeof Film;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          {label}
        </span>
        <Icon className={`h-5 w-5 ${accent}`} />
      </div>
      <p className="mt-5 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function MovieRow({ movie }: { movie: CatalogueMovie }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-zinc-900 p-4 last:border-b-0 sm:grid-cols-[auto_minmax(0,1.8fr)_minmax(100px,0.8fr)_minmax(90px,0.5fr)_auto]">
      <img
        src={movie.posterUrl}
        alt={`${movie.title} poster`}
        className="h-16 w-11 rounded-lg border border-zinc-800 object-cover"
        loading="lazy"
      />

      <div className="min-w-0">
        <h3 className="truncate text-sm font-bold text-white">{movie.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1 text-[#FF8A5C]">
            <Film className="h-3.5 w-3.5" /> Movie
          </span>
          {movie.genres.slice(0, 2).map((genre) => (
            <span key={genre} className="rounded bg-zinc-900 px-1.5 py-0.5">
              {genre}
            </span>
          ))}
        </div>
      </div>

      <div className="hidden items-center gap-2 text-sm text-zinc-300 sm:flex">
        <CalendarDays className="h-4 w-4 text-zinc-500" />
        {movie.year || "Unknown"}
      </div>

      <div className="hidden items-center gap-1.5 text-sm font-semibold text-zinc-200 sm:flex">
        <Star className="h-4 w-4 text-[#FF4C00]" fill="currentColor" />
        {movie.rating.toFixed(1)}
      </div>

      <Link
        href={`/movie/${movie.id}`}
        className="rounded-lg border border-zinc-700 px-3 py-2 text-center text-xs font-bold text-zinc-200 transition-colors hover:border-[#FF4C00] hover:text-[#FF8A5C]"
      >
        View Details
      </Link>
    </div>
  );
}

export default function CatalogueClient() {
  const [movies, setMovies] = useState<CatalogueMovie[]>([]);
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(ALL_GENRES);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getCatalogueMovies(query, selectedGenre === ALL_GENRES ? "All" : selectedGenre, page)
      .then((result) => {
        if (!controller.signal.aborted) {
          setMovies(result.movies);
          setTotalResults(result.totalResults);
          setTotalPages(result.totalPages);
        }
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : "Unable to load catalogue.");
          setMovies([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [page, query, selectedGenre]);

  const genres = useMemo(() => {
    const availableGenres = movies.flatMap((movie) => movie.genres);
    const selectedGenreOption = selectedGenre === ALL_GENRES ? [] : [selectedGenre];
    return [ALL_GENRES, ...selectedGenreOption, ...Array.from(new Set(availableGenres)).sort()]
      .filter((genre, index, options) => options.indexOf(genre) === index);
  }, [movies, selectedGenre]);

  const updateQuery = (value: string) => {
    setLoading(true);
    setError(null);
    setQuery(value);
    setPage(1);
  };

  const updateGenre = (value: string) => {
    setLoading(true);
    setError(null);
    setSelectedGenre(value);
    setPage(1);
  };

  const updatePage = (nextPage: number) => {
    setLoading(true);
    setError(null);
    setPage(nextPage);
  };

  return (
    <div className="min-h-full bg-[#070707] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <header className="flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Film className="h-7 w-7 text-[#FF4C00]" />
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Catalogue Management</h1>
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              Manage your movies, TV shows, genres, and streaming content metadata.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF4C00] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#FF4C00]/20 transition-colors hover:bg-[#e04300]"
          >
            <Plus className="h-4 w-4" />
            Add New Content
          </button>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Movies" value={totalResults.toString()} icon={Film} accent="text-blue-400" />
          <StatCard label="TV Shows" value="0" icon={Tv} accent="text-purple-400" />
          <StatCard label="Published" value="Not tracked" icon={Film} accent="text-emerald-400" />
          <StatCard label="Hidden / Draft" value="Not tracked" icon={EyeOff} accent="text-rose-400" />
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Search catalogue</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="search"
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder="Search movies by title..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-10 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-[#FF4C00]"
              />
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 text-sm text-zinc-300 lg:w-56">
              <Filter className="h-4 w-4 shrink-0 text-[#FF4C00]" />
              <span className="sr-only">Filter by genre</span>
              <select
                value={selectedGenre}
                onChange={(event) => updateGenre(event.target.value)}
                className="w-full bg-transparent py-2.5 outline-none"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre} className="bg-zinc-900">
                    {genre}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/70">
          <div className="flex flex-col gap-2 border-b border-zinc-800 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="text-base font-bold text-white">Movie Catalogue</h2>
              <p className="mt-1 text-xs text-zinc-500">Showing the existing TMDB movie feed.</p>
            </div>
            <span className="text-xs font-semibold text-zinc-500">
              {loading ? "Loading..." : `${movies.length} visible on this page`}
            </span>
          </div>

          {loading ? (
            <LoadingRows />
          ) : error ? (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <AlertCircle className="h-8 w-8 text-rose-400" />
              <p className="font-semibold text-white">Catalogue unavailable</p>
              <p className="max-w-md text-sm text-zinc-500">{error}</p>
            </div>
          ) : movies.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Search className="mx-auto h-8 w-8 text-zinc-600" />
              <p className="mt-3 font-semibold text-white">No movies found</p>
              <p className="mt-1 text-sm text-zinc-500">Try a different title or genre.</p>
            </div>
          ) : (
            <div>
              <div className="hidden grid-cols-[auto_minmax(0,1.8fr)_minmax(100px,0.8fr)_minmax(90px,0.5fr)_auto] gap-4 border-b border-zinc-800 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-600 sm:grid">
                <span>Poster</span>
                <span>Title</span>
                <span>Release Year</span>
                <span>Rating</span>
                <span>Action</span>
              </div>
              {movies.map((movie) => <MovieRow key={movie.id} movie={movie} />)}
            </div>
          )}

          {!loading && !error && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-4">
              <span className="text-xs text-zinc-500">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updatePage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                  className="rounded-lg border border-zinc-800 p-2 text-zinc-300 transition-colors hover:border-[#FF4C00] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => updatePage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  aria-label="Next page"
                  className="rounded-lg border border-zinc-800 p-2 text-zinc-300 transition-colors hover:border-[#FF4C00] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}