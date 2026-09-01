'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Bookmark, Plus, Play } from 'lucide-react';
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

  useEffect(() => {
    fetchPlaylists();
    window.addEventListener('playlists-updated', fetchPlaylists);
    return () => {
      window.removeEventListener('playlists-updated', fetchPlaylists);
    };
  }, [fetchPlaylists]);

  const handleMyListToggle = () => {
    const itemKey = movie.id.toString();
    const exists = isInWatchlist(movie.title);

    if (exists) {
      removeFromWatchlist(movie.title);
      toast.success(`Removed "${movie.title}" from My List`, {
        icon: '🗑️',
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
        icon: '🔖',
        style: {
          background: '#141414',
          color: '#fff',
          border: '1px solid #1A1A1A',
        },
      });
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

      {/* PORTAL-BASED ADD TO PLAYLIST MODAL */}
      <AddToPlaylistModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchPlaylists();
        }}
        movie={movie}
      />
    </div>
  );
}
