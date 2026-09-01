'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { 
  X, 
  Play, 
  Share2, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Film, 
  Check, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PlaylistItem, PlaylistMovie } from './PlaylistCard';

interface PlaylistDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: PlaylistItem | null;
  onPlaylistUpdated?: () => void;
}

export default function PlaylistDetailsModal({
  isOpen,
  onClose,
  playlist,
  onPlaylistUpdated,
}: PlaylistDetailsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [removingMovieId, setRemovingMovieId] = useState<string | null>(null);
  const [currentMovies, setCurrentMovies] = useState<PlaylistMovie[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (playlist?.movies) {
      setCurrentMovies(playlist.movies);
    } else {
      setCurrentMovies([]);
    }
  }, [playlist]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !mounted || !playlist) return null;

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/playlist/${playlist._id}`
    : `/playlist/${playlist._id}`;

  const handleCopyShare = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Shareable link copied to clipboard!', {
        icon: '🔗',
        style: {
          background: '#0E0E0E',
          color: '#fff',
          border: '1px solid #FF4C00',
        },
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRemoveMovie = async (movie: PlaylistMovie) => {
    setRemovingMovieId(movie.movieId);
    try {
      const res = await fetch('/api/playlist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'removeMovie',
          playlistId: playlist._id,
          movieId: movie.movieId,
          movieTitle: movie.title,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Removed "${movie.title}"`);
        setCurrentMovies((prev) =>
          prev.filter(
            (m) =>
              String(m.movieId) !== String(movie.movieId) &&
              m.title.toLowerCase() !== movie.title.toLowerCase()
          )
        );
        if (onPlaylistUpdated) {
          onPlaylistUpdated();
        }
      } else {
        toast.error(data.message || 'Failed to remove movie');
      }
    } catch (err) {
      toast.error('Network error removing movie');
    } finally {
      setRemovingMovieId(null);
    }
  };

  const firstMovie = currentMovies[0];

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[85vh] bg-[#0E0E0E] border border-[#222] rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP BANNER / HERO SUMMARY (Wide Layout, controlled height) */}
        <div className="p-6 pb-5 border-b border-[#1A1A1A] bg-gradient-to-r from-zinc-950 via-[#111] to-[#0E0E0E] relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer outline-none z-20"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-4 min-w-0 pr-8">
            {/* Collage or Single Cover Preview */}
            <div className="w-20 h-28 sm:w-24 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-zinc-900 border border-[#222] shadow-md relative group">
              {firstMovie?.unsplash_url ? (
                <img
                  src={firstMovie.unsplash_url}
                  alt={playlist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700">
                  <Film size={24} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles size={16} className="text-[#FF4C00]" />
              </div>
            </div>

            {/* Title & Info */}
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {playlist.tag && (
                  <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-[#FF4C00]/15 text-[#FF4C00] border border-[#FF4C00]/30">
                    {playlist.tag}
                  </span>
                )}
                <span className="text-[10px] font-semibold text-zinc-500 flex items-center gap-1">
                  <Film size={12} /> {currentMovies.length} {currentMovies.length === 1 ? 'Title' : 'Titles'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide truncate">
                {playlist.name}
              </h2>

              {playlist.description && (
                <p className="text-xs text-zinc-400 line-clamp-2 max-w-xl font-medium">
                  {playlist.description}
                </p>
              )}
            </div>
          </div>

          {/* Quick Primary Actions in Header */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 mt-2 md:mt-0">
            {firstMovie && (
              <Link
                href={`/movie/${firstMovie.movieId}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-[#FF4C00]/10 hover:scale-102 cursor-pointer"
              >
                <Play size={14} fill="currentColor" /> Play All
              </Link>
            )}

            <button
              onClick={handleCopyShare}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              {copied ? <Check size={14} className="text-[#FF4C00]" /> : <Share2 size={14} />}
              {copied ? 'Copied' : 'Share'}
            </button>

            <Link
              href={`/playlist/${playlist._id}`}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              title="Open full page view"
            >
              <ExternalLink size={14} /> Full Page
            </Link>
          </div>
        </div>

        {/* BODY: SCROLLABLE MOVIE TRACKLIST (Max Height Controlled) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-3.5 max-h-[380px] scrollbar-thin scrollbar-thumb-zinc-800">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
            <span className="text-xs font-black uppercase tracking-wider text-zinc-400">
              Playlist Queue
            </span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              {currentMovies.length} movies in list
            </span>
          </div>

          {currentMovies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-600 gap-2">
              <Film size={32} strokeWidth={1.5} />
              <span className="text-xs font-semibold">This playlist is currently empty.</span>
              <span className="text-[10px] text-zinc-500">
                Browse movies and click "+" to add them here!
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {currentMovies.map((movie, index) => {
                const isRemoving = removingMovieId === movie.movieId;

                return (
                  <div
                    key={`${movie.movieId}-${index}`}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-zinc-950/70 border border-[#1A1A1A] hover:border-zinc-800 hover:bg-zinc-900/40 transition-all group"
                  >
                    {/* Left: Index + Poster + Info */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="w-5 text-center text-xs font-black text-zinc-600 group-hover:text-[#FF4C00] transition-colors">
                        {index + 1}
                      </span>

                      <Link
                        href={`/movie/${movie.movieId}`}
                        className="w-12 h-16 rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800 group-hover:border-[#FF4C00]/40 transition-colors"
                      >
                        <img
                          src={movie.unsplash_url || '/placeholder-movie.jpg'}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      <div className="flex flex-col min-w-0">
                        <Link
                          href={`/movie/${movie.movieId}`}
                          className="text-xs sm:text-sm font-bold text-white group-hover:text-[#FF4C00] transition-colors truncate"
                        >
                          {movie.title}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-500 font-medium">
                          {movie.year && (
                            <span className="flex items-center gap-1">
                              <Calendar size={10} /> {movie.year}
                            </span>
                          )}
                          {movie.duration && (
                            <span className="flex items-center gap-1">
                              <Clock size={10} /> {movie.duration}
                            </span>
                          )}
                          {movie.category && (
                            <span className="px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 text-[9px] uppercase font-bold">
                              {movie.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0 pr-1">
                      <Link
                        href={`/movie/${movie.movieId}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-[#FF4C00] text-zinc-300 hover:text-black font-black text-[10px] uppercase tracking-wider transition-all"
                      >
                        <Play size={10} fill="currentColor" /> Watch
                      </Link>

                      <button
                        onClick={() => handleRemoveMovie(movie)}
                        disabled={isRemoving}
                        title="Remove from playlist"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* BOTTOM FOOTER */}
        <div className="p-4 px-6 border-t border-[#1A1A1A] bg-zinc-950/90 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-semibold">
            <span>Shareable with anyone:</span>
            <span className="font-mono text-zinc-400 text-[10px] truncate max-w-[200px] sm:max-w-xs">
              {shareUrl}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
