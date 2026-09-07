'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Calendar,
  MapPin,
  Film,
  Award,
  ExternalLink,
  ChevronRight,
  User,
  Tv,
  ArrowLeft,
  Sparkles,
  Camera,
  X,
  ChevronLeft,
  Info
} from 'lucide-react';
import { PersonFullData } from '@/data/person/personApi';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

interface PersonDetailsViewProps {
  data: PersonFullData;
}

export default function PersonDetailsView({ data }: PersonDetailsViewProps) {
  const { person, photos, credits } = data;

  const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'tv'>('all');
  const [filmPage, setFilmPage] = useState(1);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [showFullBio, setShowFullBio] = useState(false);

  // Calculate age if birthday is available
  const calculateAge = (birthday: string | null, deathday: string | null) => {
    if (!birthday) return null;
    const birthDate = new Date(birthday);
    const endDate = deathday ? new Date(deathday) : new Date();
    let age = endDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = endDate.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(person.birthday, person.deathday);
  const roleLabel = person.gender === 1 ? 'Actress' : 'Actor';

  // Filter credits
  const filteredCredits = credits.filter((item) => {
    if (activeTab === 'movie') return item.mediaType === 'movie';
    if (activeTab === 'tv') return item.mediaType === 'tv';
    return true;
  });

  const FILM_PAGE_SIZE = 12;
  const totalFilmPages = Math.max(1, Math.ceil(filteredCredits.length / FILM_PAGE_SIZE));
  const paginatedCredits = filteredCredits.slice((filmPage - 1) * FILM_PAGE_SIZE, filmPage * FILM_PAGE_SIZE);

  const mainPhoto = photos[0] || (person.profile_path ? `https://image.tmdb.org/t/p/original${person.profile_path}` : '');

  return (
    <div className="min-h-screen bg-[#070707] text-white font-sans selection:bg-[#FF4C00] selection:text-white">
      <Navbar />

      <main className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 select-none">
        {/* TOP NAVIGATION BACK BUTTON */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-[#FF4C00] transition-colors bg-zinc-900/80 border border-zinc-800 px-4 py-2 rounded-xl backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <span className="text-xs font-mono font-bold text-[#FF4C00] bg-[#FF4C00]/10 border border-[#FF4C00]/20 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4C00]" />
            Star Profile
          </span>
        </div>

        {/* HERO PERSON CARD & HEADER */}
        <section className="relative rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Ambient Background Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF4C00]/10 blur-[150px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start">
            {/* MAIN PROFILE PORTRAIT PHOTO */}
            <div className="relative shrink-0 group">
              <div className="relative w-52 h-72 sm:w-64 sm:h-88 rounded-2xl overflow-hidden border-2 border-zinc-800 group-hover:border-[#FF4C00]/60 transition-all duration-500 shadow-2xl shadow-black/80">
                {mainPhoto ? (
                  <Image
                    src={mainPhoto}
                    alt={person.name}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                    <User className="w-16 h-16 text-zinc-700" />
                  </div>
                )}
                {/* Gradient Shader */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Photos Badge counter if multiple photos */}
              {photos.length > 1 && (
                <button
                  onClick={() => setSelectedPhotoIndex(0)}
                  className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md border border-white/20 hover:border-[#FF4C00] text-xs font-bold text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-[#FF4C00]" />
                  <span>{photos.length} Photos</span>
                </button>
              )}
            </div>

            {/* PERSON DETAILS BLOCK */}
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="bg-[#FF4C00]/15 text-[#FF4C00] border border-[#FF4C00]/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {roleLabel}
                  </span>
                  {person.known_for_department && (
                    <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold px-3 py-1 rounded-full">
                      {person.known_for_department}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  {person.name}
                </h1>
              </div>

              {/* QUICK STATS METRICS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-zinc-800/80">
                {person.birthday && (
                  <div className="bg-zinc-900/60 border border-zinc-800/60 p-3 rounded-2xl">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Born</span>
                    <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
                      {person.birthday} {age !== null && <span className="text-zinc-400 font-mono">({age} yrs)</span>}
                    </p>
                  </div>
                )}

                {person.place_of_birth && (
                  <div className="bg-zinc-900/60 border border-zinc-800/60 p-3 rounded-2xl">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Origin</span>
                    <p className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate" title={person.place_of_birth}>
                      {person.place_of_birth}
                    </p>
                  </div>
                )}

                <div className="bg-zinc-900/60 border border-zinc-800/60 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Known Credits</span>
                  <p className="text-xs sm:text-sm font-bold text-[#FF4C00] mt-0.5">
                    {credits.length} Projects
                  </p>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800/60 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Popularity</span>
                  <p className="text-xs sm:text-sm font-bold text-amber-400 mt-0.5 flex items-center justify-center md:justify-start gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{person.popularity ? person.popularity.toFixed(1) : '8.5'}</span>
                  </p>
                </div>
              </div>

              {/* BIOGRAPHY SECTION */}
              {person.biography && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-center md:justify-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#FF4C00]" />
                    Biography
                  </h3>
                  <p className={`text-xs sm:text-sm text-zinc-300 leading-relaxed ${!showFullBio && person.biography.length > 350 ? 'line-clamp-4' : ''}`}>
                    {person.biography}
                  </p>
                  {person.biography.length > 350 && (
                    <button
                      onClick={() => setShowFullBio(!showFullBio)}
                      className="text-xs font-bold text-[#FF4C00] hover:underline cursor-pointer"
                    >
                      {showFullBio ? 'Show Less' : 'Read Full Bio'}
                    </button>
                  )}
                </div>
              )}

              {/* EXTERNAL LINKS */}
              {person.imdb_id && (
                <div className="pt-2">
                  <a
                    href={`https://www.imdb.com/name/${person.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl hover:bg-amber-500/20 transition-colors"
                  >
                    <span>View on IMDb</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* MULTIPLE PHOTOS GALLERY SECTION */}
        {photos.length > 1 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#FF4C00]" />
                <h2 className="text-xl font-black text-white uppercase tracking-wide">
                  Photo Gallery ({photos.length} Images)
                </h2>
              </div>
              <span className="text-xs text-zinc-500 font-mono">Click to expand</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {photos.slice(0, 12).map((photoUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className="group relative aspect-[2/3] rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900 cursor-pointer transition-all duration-300 hover:border-[#FF4C00]/60 hover:scale-[1.03] shadow-lg"
                >
                  <Image
                    src={photoUrl}
                    alt={`${person.name} photo ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white drop-shadow-md" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* KNOWN FOR / FILMOGRAPHY CREDITS GRID SECTION */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-[#FF4C00]" />
              <h2 className="text-xl font-black text-white uppercase tracking-wide">
                Filmography ({credits.length} Titles)
              </h2>
            </div>

            {/* TAB FILTERS */}
            <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 p-1 rounded-2xl">
              <button
                onClick={() => { setActiveTab('all'); setFilmPage(1); }}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#FF4C00] text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                All ({credits.length})
              </button>

              <button
                onClick={() => { setActiveTab('movie'); setFilmPage(1); }}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'movie'
                    ? 'bg-[#FF4C00] text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Movies ({credits.filter((c) => c.mediaType === 'movie').length})
              </button>

              <button
                onClick={() => { setActiveTab('tv'); setFilmPage(1); }}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'tv'
                    ? 'bg-[#FF4C00] text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                TV Series ({credits.filter((c) => c.mediaType === 'tv').length})
              </button>
            </div>
          </div>

          {/* CREDITS CARDS GRID (12 PER PAGE) */}
          {filteredCredits.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 bg-zinc-950/50 rounded-3xl border border-zinc-800">
              <Film className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
              <p className="font-semibold text-white text-sm">No titles found in this category.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                {paginatedCredits.map((item) => (
                  <Link
                    key={item.id}
                    href={`/movie/${item.id}`}
                    className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-950 overflow-hidden flex flex-col justify-between hover:border-[#FF4C00]/60 transition-all duration-300 hover:-translate-y-1.5 shadow-xl"
                  >
                    {/* Poster Image */}
                    <div className="relative aspect-[2/3] w-full bg-zinc-900 overflow-hidden">
                      {item.posterUrl ? (
                        <Image
                          src={item.posterUrl}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700">
                          <Film className="w-8 h-8" />
                        </div>
                      )}

                      {/* Media Type Badge */}
                      <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full text-zinc-300">
                        {item.mediaType === 'tv' ? 'TV' : 'Movie'}
                      </span>

                      {/* Rating Badge */}
                      <span className="absolute top-2 right-2 bg-black/80 backdrop-blur-md border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full text-amber-400 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {item.rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Info Content */}
                    <div className="p-3 space-y-1 bg-zinc-950">
                      <h3 className="text-xs font-bold text-white group-hover:text-[#FF4C00] transition-colors truncate">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between text-[10px] text-zinc-400">
                        <span className="truncate max-w-[100px]" title={item.character}>
                          as {item.character}
                        </span>
                        <span className="font-mono">{item.year}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* FILMOGRAPHY PAGINATION CONTROLS (12 ITEMS PER PAGE) */}
              {totalFilmPages > 1 && (
                <div className="flex items-center justify-between border-t border-zinc-800/80 pt-6 px-1">
                  <span className="text-xs text-zinc-400 font-mono">
                    Page <span className="text-white font-bold">{filmPage}</span> of <span className="text-white font-bold">{totalFilmPages}</span> ({filteredCredits.length} Total Projects • 12 Per Page)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFilmPage(Math.max(1, filmPage - 1))}
                      disabled={filmPage === 1}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-200 transition-all hover:border-[#FF4C00] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFilmPage(Math.min(totalFilmPages, filmPage + 1))}
                      disabled={filmPage === totalFilmPages}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-200 transition-all hover:border-[#FF4C00] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* FULLSCREEN PHOTO LIGHTBOX MODAL */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:text-[#FF4C00] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() => setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length)}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-900/80 border border-zinc-800 text-white hover:text-[#FF4C00] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <Image
              src={photos[selectedPhotoIndex]}
              alt={`${person.name} photo full`}
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={() => setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length)}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-900/80 border border-zinc-800 text-white hover:text-[#FF4C00] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-6 inset-x-0 text-center font-mono text-xs text-zinc-400">
            Image {selectedPhotoIndex + 1} of {photos.length}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
