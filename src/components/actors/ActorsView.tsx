'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  Search,
  Star,
  Film,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  RefreshCw,
  User
} from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { getPopularActorsPage } from '@/data/home/featuredActors';

interface ActorItem {
  id: number;
  name: string;
  image: string;
  role: string;
  knownFor: string;
  rating: number;
  popularity?: number;
}

export default function ActorsView() {
  const [actors, setActors] = useState<ActorItem[]>([]);
  const [query, setQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'actor' | 'actress'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchActors = async () => {
    try {
      setLoading(true);
      const res = await getPopularActorsPage(page, genderFilter, query);
      setActors(res.actors);
      setTotalPages(res.totalPages);
      setTotalResults(res.totalResults);
    } catch (err) {
      console.error('Failed to load actors:', err);
      setActors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActors();
  }, [page, genderFilter, query]);

  return (
    <div className="min-h-screen bg-[#070707] text-white font-sans selection:bg-[#FF4C00] selection:text-white select-none">
      <Navbar />

      <main className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        {/* HEADER SECTION */}
        <section className="relative rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 sm:p-10 overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-[#FF4C00]/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-2 rounded-xl bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00]">
                    <Users className="w-6 h-6" />
                  </span>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF4C00]">
                    Hollywood & Global Cinema
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
                  Featured Actors &amp; Actresses
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-2xl">
                  Explore profile details, biographies, photo galleries, and complete filmographies of top cinema stars.
                </p>
              </div>

              <div className="text-xs font-mono font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-2xl shrink-0">
                {totalResults} Stars Listed
              </div>
            </div>

            {/* SEARCH AND GENDER FILTERS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Search Bar */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search actors & actresses by name..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#FF4C00] transition-colors"
                />
              </div>

              {/* Gender Filter Buttons */}
              <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-1 rounded-2xl">
                <button
                  onClick={() => {
                    setGenderFilter('all');
                    setPage(1);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    genderFilter === 'all'
                      ? 'bg-[#FF4C00] text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setGenderFilter('actor');
                    setPage(1);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    genderFilter === 'actor'
                      ? 'bg-[#FF4C00] text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Actors
                </button>
                <button
                  onClick={() => {
                    setGenderFilter('actress');
                    setPage(1);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    genderFilter === 'actress'
                      ? 'bg-[#FF4C00] text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Actresses
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ACTORS GRID */}
        <section className="space-y-8">
          {loading ? (
            <div className="py-24 text-center text-zinc-500 flex flex-col items-center justify-center gap-3 bg-zinc-950/50 rounded-3xl border border-zinc-800">
              <RefreshCw className="w-8 h-8 animate-spin text-[#FF4C00]" />
              <span className="font-mono text-xs text-zinc-400">Loading Cinema Stars...</span>
            </div>
          ) : actors.length === 0 ? (
            <div className="py-24 text-center bg-zinc-950/50 rounded-3xl border border-zinc-800">
              <Users className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
              <p className="font-bold text-white text-sm">No actors match your query</p>
              <p className="text-xs text-zinc-500 mt-1">Try adjusting your search terms or filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {actors.map((actor) => (
                <Link
                  key={actor.id}
                  href={`/person/${actor.id}`}
                  className="group relative flex flex-col items-center text-center p-5 rounded-3xl border border-zinc-800/80 bg-zinc-950/80 hover:border-[#FF4C00]/60 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-[#FF4C00]/10 cursor-pointer"
                >
                  {/* Portrait Avatar Image */}
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-zinc-800 group-hover:border-[#FF4C00] transition-all duration-300 shadow-xl mb-4 group-hover:scale-105">
                    {actor.image ? (
                      <Image
                        src={actor.image}
                        alt={actor.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700">
                        <User className="w-12 h-12" />
                      </div>
                    )}

                    {/* Rating Overlay */}
                    <div className="absolute bottom-0 inset-x-0 py-1 bg-black/80 backdrop-blur-md flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-black text-white">
                        {actor.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Text Details */}
                  <h3 className="text-sm sm:text-base font-black text-white group-hover:text-[#FF4C00] transition-colors line-clamp-1">
                    {actor.name}
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-[#FF4C00] bg-[#FF4C00]/10 border border-[#FF4C00]/20 px-2.5 py-0.5 rounded-full mt-1 uppercase tracking-wider">
                    {actor.role}
                  </span>
                  <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-2 line-clamp-1">
                    <Film className="w-3 h-3 text-zinc-500 shrink-0" />
                    <span>{actor.knownFor}</span>
                  </p>
                </Link>
              ))}
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-800/80 pt-6">
              <span className="text-xs text-zinc-400 font-mono">
                Page <span className="text-white font-bold">{page}</span> of <span className="text-white font-bold">{totalPages}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-200 transition-all hover:border-[#FF4C00] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-200 transition-all hover:border-[#FF4C00] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
