'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Share2, 
  Check, 
  Film, 
  Clock, 
  Calendar, 
  Trash2, 
  ArrowLeft,
  Sparkles,
  User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PlaylistItem, PlaylistMovie } from './PlaylistCard';

interface ShareablePlaylistViewProps {
  playlist: PlaylistItem;
  isOwner?: boolean;
  onRemoveMovie?: (movieId: string) => Promise<void> | void;
}

export default function ShareablePlaylistView({
  playlist,
  isOwner = false,
  onRemoveMovie,
}: ShareablePlaylistViewProps) {
  const [copied, setCopied] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const movies = playlist.movies || [];
  const firstMovie = movies[0];

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/playlist/${playlist._id}`
    : `/playlist/${playlist._id}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Shareable playlist link copied to clipboard!', {
        icon: '🔗',
        style: {
          background: '#0E0E0E',
          color: '#fff',
          border: '1px solid #FF4C00',
        },
      });
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleRemove = async (movieId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!onRemoveMovie) return;

    setRemovingId(movieId);
    try {
      await onRemoveMovie(movieId);
      toast.success('Movie removed from playlist');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF4C00] selection:text-black">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#FF4C00]/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-zinc-900/30 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 pt-24 pb-20 relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard/my-playlist"
            className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Playlists
          </Link>
        </div>

        {/* MAIN LAYOUT: YouTube-style Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =========================================
              LEFT COLUMN: PLAYLIST HERO INFO CARD
          ========================================== */}
          <div className="lg:col-span-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl lg:sticky lg:top-24">
            {/* Playlist Collage / Poster Cover */}
            <div className="relative w-full aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-900 shadow-xl group">
              {firstMovie?.unsplash_url ? (
                <img
                  src={firstMovie.unsplash_url}
                  alt={playlist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 bg-zinc-950 gap-2">
                  <Film size={48} className="text-zinc-650" />
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-600">No Posters</span>
                </div>
              )}

              {/* Tag pill badge */}
              {playlist.tag && (
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-[#FF4C00]/40 text-[#FF4C00] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-lg">
                  {playlist.tag}
                </div>
              )}

              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-zinc-300">
                {movies.length} {movies.length === 1 ? 'Title' : 'Titles'}
              </div>
            </div>

            {/* Playlist Title & Meta */}
            <div className="flex flex-col gap-2">
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white leading-snug">
                {playlist.name}
              </h1>

              <div className="flex items-center gap-2 text-xs text-zinc-400 font-semibold">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <User size={13} className="text-[#FF4C00]" />
                  <span>{playlist.userName || 'Curator'}</span>
                </div>
                <span>•</span>
                <span className="text-zinc-500 font-mono text-[11px]">
                  {playlist.createdAt ? new Date(playlist.createdAt).toLocaleDateString() : 'Active'}
                </span>
              </div>

              {playlist.description && (
                <p className="text-xs text-zinc-400 font-medium leading-relaxed mt-2 border-t border-[#1A1A1A] pt-3">
                  {playlist.description}
                </p>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-2 border-t border-[#1A1A1A]">
              {firstMovie ? (
                <Link
                  href={`/movie/${firstMovie.movieId}`}
                  className="w-full flex items-center justify-center gap-2.5 bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-[#FF4C00]/20 cursor-pointer"
                >
                  <Play size={16} fill="currentColor" />
                  Play All
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-zinc-600 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl cursor-not-allowed"
                >
                  Playlist Empty
                </button>
              )}

              {/* Shareable Link Button */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 bg-[#141414] hover:bg-[#1A1A1A] border border-[#262626] hover:border-zinc-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer select-none"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-[#FF4C00]" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 size={16} className="text-[#FF4C00]" />
                    <span>Share Playlist Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* =========================================
              RIGHT COLUMN: PLAYLIST TRACKLIST / MOVIES
          ========================================== */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#FF4C00]" />
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  Tracks ({movies.length})
                </h2>
              </div>
            </div>

            {movies.length === 0 ? (
              <div className="bg-[#0A0A0A] border border-dashed border-[#1A1A1A] rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3 text-zinc-500">
                <Film size={36} className="text-zinc-650" />
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  No movies in this playlist yet
                </p>
                <p className="text-xs text-zinc-550 max-w-sm">
                  Browse movies across Flixora and click "Add to Playlist" to populate this collection.
                </p>
                <Link
                  href="/explore"
                  className="mt-2 text-xs font-black uppercase tracking-wider text-[#FF4C00] hover:underline"
                >
                  Explore Movies &rarr;
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {movies.map((movie, index) => (
                  <div
                    key={`${movie.movieId}-${index}`}
                    className="bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#FF4C00]/30 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-4 group transition-all duration-200"
                  >
                    {/* Index & Poster & Info */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      {/* Track Rank Number */}
                      <span className="text-xs font-mono font-bold text-zinc-600 w-5 text-center shrink-0">
                        {index + 1}
                      </span>

                      {/* Poster Thumbnail */}
                      <Link
                        href={`/movie/${movie.movieId}`}
                        className="relative w-14 sm:w-20 aspect-[2/3] rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-900 group-hover:border-[#FF4C00]/40 transition-colors"
                      >
                        <img
                          src={movie.unsplash_url || '/placeholder-movie.jpg'}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play size={16} fill="currentColor" className="text-[#FF4C00]" />
                        </div>
                      </Link>

                      {/* Title & Details */}
                      <div className="flex flex-col gap-1 min-w-0">
                        <Link
                          href={`/movie/${movie.movieId}`}
                          className="text-xs sm:text-sm font-black text-white truncate uppercase tracking-wider hover:text-[#FF4C00] transition-colors"
                        >
                          {movie.title}
                        </Link>
                        
                        <div className="flex items-center gap-2 sm:gap-3 text-[10px] text-zinc-400 font-semibold flex-wrap">
                          {movie.category && (
                            <span className="text-[#FF4C00] font-black uppercase tracking-wider">
                              {movie.category}
                            </span>
                          )}
                          {movie.year && (
                            <span className="flex items-center gap-1">
                              <Calendar size={11} /> {movie.year}
                            </span>
                          )}
                          {movie.duration && (
                            <span className="flex items-center gap-1">
                              <Clock size={11} /> {movie.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/movie/${movie.movieId}`}
                        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-[#FF4C00] text-zinc-300 hover:text-black text-[10px] font-black uppercase tracking-wider transition-all"
                      >
                        <Play size={11} fill="currentColor" /> Watch
                      </Link>

                      {/* Remove button if owner */}
                      {isOwner && onRemoveMovie && (
                        <button
                          onClick={(e) => handleRemove(movie.movieId, e)}
                          disabled={removingId === movie.movieId}
                          title="Remove from playlist"
                          className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-950/20 transition-all cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
