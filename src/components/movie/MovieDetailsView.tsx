'use client';

import React from 'react';
import { Star, User, Calendar, Clock, DollarSign, Globe, TrendingUp, Film } from 'lucide-react';
import MovieActions from '@/components/movie/MovieActions';
import MovieReviewsSection from '@/components/movie/MovieReviewsSection';

export interface MovieDetailsProps {
  id: string | number;
  movie: {
    title: string;
    tagline?: string;
    poster: string;
    backdrop: string;
    rating: number;
    releaseDate: string;
    runtime: string;
    genres: string[];
    overview: string;
  };
  movieData?: {
    status?: string;
    release_date?: string;
    budget?: number;
    revenue?: number;
    original_language?: string;
    popularity?: number;
    imdb_id?: string;
    production_companies?: Array<{
      id: number;
      name: string;
      logo_path?: string | null;
    }>;
    production_countries?: Array<{
      name: string;
    }>;
  };
  cast?: Array<{
    name: string;
    character: string;
    profile: string | null;
  }>;
  trailerEmbedUrl?: string | null;
}

export default function MovieDetailsView({
  id,
  movie,
  movieData = {},
  cast = [],
  trailerEmbedUrl,
}: MovieDetailsProps) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF4C00] selection:text-black">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative min-h-[600px] md:min-h-[680px] pt-24 md:pt-32 overflow-hidden">
        {/* Background Backdrop Image with Ambient Blurs */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 md:opacity-100 animate-in fade-in duration-700"
          style={{
            backgroundImage: `url(${movie.backdrop})`,
          }}
        />

        {/* Dynamic Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

        {/* Content Container */}
        <div className="relative z-10 mx-auto flex min-h-[500px] max-w-7xl items-end gap-8 px-6 pb-16 md:px-10">
          {/* Poster */}
          <div className="hidden w-56 shrink-0 overflow-hidden rounded-2xl border border-[#FF4C00]/30 shadow-[0_0_40px_rgba(0,0,0,0.8)] md:block group">
            <img
              src={movie.poster}
              alt={movie.title}
              className="h-auto w-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
          </div>

          {/* Movie Details Main Info */}
          <div className="max-w-2xl">
            <p className="mb-3 text-xs md:text-sm font-black uppercase tracking-[0.25em] text-[#FF4C00]">
              Featured Cinema
            </p>

            <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-6xl tracking-tight text-white">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="mt-3 text-base md:text-lg italic text-zinc-400 font-medium">
                "{movie.tagline}"
              </p>
            )}

            {/* Movie Meta (Rating, Year, Duration) */}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-zinc-300 font-bold">
              <span className="flex items-center gap-1.5 font-bold text-[#FF4C00] bg-[#FF4C00]/10 border border-[#FF4C00]/30 px-2.5 py-0.5 rounded-lg">
                <Star size={15} fill="currentColor" /> {movie.rating}
              </span>

              <span className="flex items-center gap-1 text-zinc-400">
                <Calendar size={14} /> {movie.releaseDate}
              </span>

              <span className="flex items-center gap-1 text-zinc-400">
                <Clock size={14} /> {movie.runtime}
              </span>
            </div>

            {/* Genres */}
            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map((genre: string) => (
                <span
                  key={genre}
                  className="rounded-full border border-[#FF4C00]/30 bg-[#FF4C00]/10 px-3 py-1 text-xs text-[#FF8A5C] font-black uppercase tracking-wider"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p className="mt-5 max-w-xl leading-relaxed text-zinc-300 font-medium text-sm md:text-base">
              {movie.overview}
            </p>

            {/* Interactive Playlist & Watchlist buttons */}
            <MovieActions
              movie={{
                id: id,
                title: movie.title,
                unsplash_url: movie.poster,
                year: movie.releaseDate,
                duration: movie.runtime,
                category: movie.genres[0] || 'Movie',
              }}
            />
          </div>
        </div>
      </section>

      {/* 2. OVERVIEW & PRODUCTION SECTION */}
      <section className="border-t border-white/10 bg-black px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-[2fr_1fr]">
            {/* Overview & Production Details */}
            <div className="flex flex-col gap-8">
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#FF4C00]">
                  Storyline
                </p>

                <h2 className="mb-4 text-2xl md:text-3xl font-black uppercase tracking-wide">
                  Synopsis
                </h2>

                <p className="max-w-3xl text-sm md:text-base leading-8 text-zinc-400 font-medium">
                  {movie.overview}
                </p>
              </div>

              {movieData.production_companies && movieData.production_companies.length > 0 && (
                <div>
                  <h3 className="mb-3 text-base font-bold text-white uppercase tracking-wider">
                    Production Companies
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {movieData.production_companies.map((company: any) => (
                      <div
                        key={company.id}
                        className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-xs font-bold text-zinc-300"
                      >
                        {company.logo_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                            alt={company.name}
                            className="h-5 max-w-[70px] object-contain filter invert brightness-200 opacity-80"
                            loading="lazy"
                          />
                        )}
                        <span>{company.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {movieData.production_countries && movieData.production_countries.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-bold text-white uppercase tracking-wider">
                    Production Countries
                  </h3>
                  <p className="text-sm font-semibold text-zinc-400">
                    {movieData.production_countries.map((c: any) => c.name).join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Extended Movie Information Card */}
            <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-6 h-fit shadow-xl">
              <h3 className="mb-5 text-base font-black uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
                Movie Intelligence
              </h3>

              <div className="space-y-3.5 text-xs font-semibold">
                <div className="flex justify-between items-center gap-4 border-b border-zinc-900 pb-2.5">
                  <span className="text-zinc-500">Rating</span>
                  <span className="flex items-center gap-1 font-bold text-[#FF4C00]">
                    <Star size={13} fill="currentColor" /> {movie.rating}
                  </span>
                </div>

                <div className="flex justify-between items-center gap-4 border-b border-zinc-900 pb-2.5">
                  <span className="text-zinc-500">Status</span>
                  <span className="text-zinc-300">{movieData.status || 'Released'}</span>
                </div>

                <div className="flex justify-between items-center gap-4 border-b border-zinc-900 pb-2.5">
                  <span className="text-zinc-500">Release Date</span>
                  <span className="text-zinc-300">{movieData.release_date || movie.releaseDate}</span>
                </div>

                <div className="flex justify-between items-center gap-4 border-b border-zinc-900 pb-2.5">
                  <span className="text-zinc-500">Runtime</span>
                  <span className="text-zinc-300">{movie.runtime}</span>
                </div>

                <div className="flex justify-between items-center gap-4 border-b border-zinc-900 pb-2.5">
                  <span className="text-zinc-500">Budget</span>
                  <span className="text-zinc-300">
                    {movieData.budget && movieData.budget > 0
                      ? new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0,
                        }).format(movieData.budget)
                      : 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center gap-4 border-b border-zinc-900 pb-2.5">
                  <span className="text-zinc-500">Revenue</span>
                  <span className="text-zinc-300">
                    {movieData.revenue && movieData.revenue > 0
                      ? new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0,
                        }).format(movieData.revenue)
                      : 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center gap-4 border-b border-zinc-900 pb-2.5">
                  <span className="text-zinc-500">Language</span>
                  <span className="text-zinc-300">
                    {movieData.original_language?.toUpperCase() || 'EN'}
                  </span>
                </div>

                {movieData.imdb_id && (
                  <div className="flex justify-between items-center gap-4 border-b border-zinc-900 pb-2.5">
                    <span className="text-zinc-500">IMDb Reference</span>
                    <a
                      href={`https://www.imdb.com/title/${movieData.imdb_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF4C00] hover:underline font-bold"
                    >
                      View on IMDb ↗
                    </a>
                  </div>
                )}

                <div className="pt-1">
                  <p className="mb-2 text-zinc-500 font-bold uppercase text-[10px]">Genres</p>
                  <div className="flex flex-wrap gap-1.5">
                    {movie.genres.map((genre: string) => (
                      <span
                        key={genre}
                        className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-300 font-bold"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OFFICIAL TRAILER SECTION */}
      <section className="bg-black px-6 py-16 md:px-10 border-t border-zinc-900">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#FF4C00]">
              Watch Trailer
            </p>

            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-wide">
              Official Media Preview
            </h2>
          </div>

          <div className="aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            {trailerEmbedUrl ? (
              <iframe
                className="h-full w-full rounded-2xl border-0"
                src={trailerEmbedUrl}
                title={`${movie.title} Official Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-zinc-500 font-bold uppercase tracking-wider bg-zinc-950 gap-2">
                <Film size={32} className="text-zinc-700" />
                <span>No official trailer embed available</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. CAST & CREW SECTION */}
      <section className="bg-black px-6 py-16 md:px-10 border-t border-zinc-900">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#FF4C00]">
              Cast & Characters
            </p>

            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-wide">
              Featured Actors
            </h2>
          </div>

          {cast.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {cast.map((actor: any, idx: number) => (
                <div
                  key={idx}
                  className="group overflow-hidden rounded-2xl border border-zinc-800 bg-[#0A0A0A] transition duration-300 hover:-translate-y-1 hover:border-[#FF4C00]/50 hover:shadow-[0_8px_24px_rgba(255,76,0,0.15)]"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-zinc-900 relative">
                    {actor.profile ? (
                      <img
                        src={actor.profile}
                        alt={actor.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-zinc-950">
                        <User size={32} className="text-zinc-700" />
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 flex flex-col gap-0.5">
                    <h3 className="font-bold text-xs text-white truncate group-hover:text-[#FF4C00] transition-colors">
                      {actor.name}
                    </h3>
                    <p className="text-[10px] text-zinc-500 truncate font-semibold">
                      {actor.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-xs font-semibold">
              Cast details unavailable for this movie.
            </p>
          )}
        </div>
      </section>

      {/* 5. AUDIENCE REVIEWS & RATINGS SECTION */}
      <MovieReviewsSection movieId={id} movieTitle={movie.title} />
    </div>
  );
}
