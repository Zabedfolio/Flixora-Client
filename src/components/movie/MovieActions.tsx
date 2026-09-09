'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Bookmark, Plus, Play, Trash2, BookmarkCheck, Shield, Ban, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  isInWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from '@/data/watchlistStore';
import { PlaylistItem } from '@/components/playlist/PlaylistCard';
import AddToPlaylistModal from '@/components/playlist/AddToPlaylistModal';

interface MovieActionsProps {
  movie: {
    id: string | number;
    title: string;
    unsplash_url: string;
    year: string;
    duration: string;
    category: string;
  };
}

export default function MovieActions({ movie }: MovieActionsProps) {
  const [inMyList, setInMyList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);

  // Kids Mode & Parental Block State
  const [hasKidsProfiles, setHasKidsProfiles] = useState(false);
  const [isBlockedForKids, setIsBlockedForKids] = useState(false);
  const [isKidsBlockModalOpen, setIsKidsBlockModalOpen] = useState(false);
  const [blockingLoading, setBlockingLoading] = useState(false);

  useEffect(() => {
    setInMyList(isInWatchlist(movie.title));
    const handleUpdate = () => {
      setInMyList(isInWatchlist(movie.title));
    };
    window.addEventListener('watchlist-updated', handleUpdate);
    return () => {
      window.removeEventListener('watchlist-updated', handleUpdate);
    };
  }, [movie.title]);

  const fetchPlaylists = useCallback(async () => {
    try {
      const res = await fetch('/api/playlist');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.playlists)) {
          setPlaylists(data.playlists);
        }
      }
    } catch (err) {
      // silent
    }
  }, []);

  const checkKidsProfilesAndBlockStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/kids');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.profiles) && data.profiles.length > 0) {
          setHasKidsProfiles(true);
          const strMovieId = String(movie.id);
          const isBlocked = data.profiles.some(
            (p: any) =>
              Array.isArray(p.blockedMovieIds) && p.blockedMovieIds.includes(strMovieId)
          );
          setIsBlockedForKids(isBlocked);
        } else {
          setHasKidsProfiles(false);
        }
      }
    } catch (err) {
      // silent
    }
  }, [movie.id]);

  useEffect(() => {
    fetchPlaylists();
    checkKidsProfilesAndBlockStatus();
    window.addEventListener('playlists-updated', fetchPlaylists);
    return () => {
      window.removeEventListener('playlists-updated', fetchPlaylists);
    };
  }, [fetchPlaylists, checkKidsProfilesAndBlockStatus]);

  const handleMyListToggle = () => {
    const itemKey = movie.id.toString();
    const exists = isInWatchlist(movie.title);

    if (exists) {
      removeFromWatchlist(movie.title);
      toast.success(`Removed "${movie.title}" from My List`, {
        icon: <Trash2 size={16} className="text-[#FF4C00]" />,
        style: {
          background: '#141414',
          color: '#fff',
          border: '1px solid #1A1A1A',
        },
      });
    } else {
      addToWatchlist({
        id: itemKey,
        title: movie.title,
        year: movie.year,
        duration: movie.duration,
        category: movie.category,
        unsplash_url: movie.unsplash_url,
      });
      toast.success(`Added "${movie.title}" to My List`, {
        icon: <BookmarkCheck size={16} className="text-[#FF4C00]" />,
        style: {
          background: '#141414',
          color: '#fff',
          border: '1px solid #1A1A1A',
        },
      });
    }
  };

  const handleToggleKidsBlock = async () => {
    try {
      setBlockingLoading(true);
      const action = isBlockedForKids ? 'unblock' : 'block';
      const res = await fetch('/api/kids/block-movie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: String(movie.id),
          movieTitle: movie.title,
          action,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsBlockedForKids(data.isBlocked);
        toast.success(data.message, {
          icon: <Shield size={16} className="text-[#FF4C00]" />,
          style: {
            background: '#0E0E0E',
            color: '#fff',
            border: '1px solid #FF4C00',
          },
        });
        setIsKidsBlockModalOpen(false);
      } else {
        toast.error(data.message || 'Failed to update content block');
      }
    } catch (err) {
      toast.error('Network error toggling Kids Block');
    } finally {
      setBlockingLoading(false);
    }
  };

  const isMovieInPlaylist = (pl: PlaylistItem) => {
    const list = pl.movies || [];
    const cleanId = String(movie.id);
    const cleanTitle = movie.title.toLowerCase();
    return list.some(
      (m) => String(m.movieId) === cleanId || m.title.toLowerCase() === cleanTitle
    );
  };

  const inAnyPlaylist = playlists.some((pl) => isMovieInPlaylist(pl));

  return (
    <div className="mt-7 flex flex-wrap gap-3 relative">
      <button className="flex items-center gap-2 rounded-lg bg-[#FF4C00] hover:bg-[#e64500] px-6 py-3 font-semibold text-white transition cursor-pointer">
        <Play size={16} fill="currentColor" /> Watch Now
      </button>

      <button
        onClick={handleMyListToggle}
        className={`flex items-center gap-2 rounded-lg border px-6 py-3 font-semibold transition cursor-pointer ${
          inMyList
            ? 'bg-[#FF4C00] border-[#FF4C00] text-black'
            : 'border-zinc-800 bg-zinc-950/60 text-white hover:bg-zinc-900/60'
        }`}
      >
        <Bookmark size={16} fill={inMyList ? 'currentColor' : 'none'} />
        {inMyList ? 'In My List' : 'Add to List'}
      </button>

      <button
        onClick={() => {
          fetchPlaylists();
          setIsModalOpen(true);
        }}
        className={`flex items-center gap-2 rounded-lg border px-6 py-3 font-semibold transition cursor-pointer ${
          inAnyPlaylist
            ? 'bg-[#FF4C00] border-[#FF4C00] text-black'
            : 'border-zinc-800 bg-zinc-950/60 text-white hover:bg-zinc-900/60'
        }`}
      >
        <Plus size={16} className={inAnyPlaylist ? 'rotate-45 transition-transform' : ''} />
        {inAnyPlaylist ? 'In Playlist' : 'Add to Playlist'}
      </button>

      {/* PARENTAL BLOCK BUTTON (Only rendered if parent user has Kids Profiles) */}
      {hasKidsProfiles && (
        <button
          onClick={() => setIsKidsBlockModalOpen(true)}
          className={`flex items-center gap-2 rounded-lg border px-6 py-3 font-semibold transition cursor-pointer ${
            isBlockedForKids
              ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30'
              : 'border-zinc-800 bg-zinc-950/60 text-zinc-300 hover:bg-zinc-900/60 hover:text-white'
          }`}
        >
          <Ban size={16} className={isBlockedForKids ? 'text-red-400' : 'text-[#FF4C00]'} />
          {isBlockedForKids ? 'Blocked for Kids' : 'Block for Kids'}
        </button>
      )}

      {/* PORTAL-BASED ADD TO PLAYLIST MODAL */}
      <AddToPlaylistModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchPlaylists();
        }}
        movie={movie}
      />

      {/* PARENT PERMISSION BLOCK MODAL */}
      {isKidsBlockModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div
            onClick={() => !blockingLoading && setIsKidsBlockModalOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md animate-in fade-in"
          />

          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-[#0E0E0E] p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-wider text-white">
                    Parental Content Control
                  </h3>
                  <p className="text-xs text-zinc-500">Kids Profile Content Restriction</p>
                </div>
              </div>

              <button
                onClick={() => !blockingLoading && setIsKidsBlockModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
                {isBlockedForKids ? (
                  <>
                    Are you sure you want to <strong className="text-emerald-400">UNBLOCK</strong> "{movie.title}" for your Kids Profiles? It will become visible again in Kids Mode.
                  </>
                ) : (
                  <>
                    Are you sure you want to <strong className="text-red-400">BLOCK</strong> "{movie.title}" for your Kids Profiles? This title will be hidden from search results and feeds in Kids Mode.
                  </>
                )}
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-850">
                <button
                  onClick={() => setIsKidsBlockModalOpen(false)}
                  disabled={blockingLoading}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={handleToggleKidsBlock}
                  disabled={blockingLoading}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                    isBlockedForKids
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20'
                      : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
                  }`}
                >
                  {blockingLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Ban size={14} />
                  )}
                  <span>{isBlockedForKids ? 'Unblock for Kids' : 'Confirm Block'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
