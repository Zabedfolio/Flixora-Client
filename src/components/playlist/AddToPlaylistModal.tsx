'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Dices, Loader2, Check, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PlaylistItem } from './PlaylistCard';
import { getRandomPlaylistSuggestion } from '@/lib/playlistGenerator';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: {
    id: string | number;
    title: string;
    unsplash_url: string;
    year?: string;
    duration?: string;
    category?: string;
  };
}

export default function AddToPlaylistModal({
  isOpen,
  onClose,
  movie,
}: AddToPlaylistModalProps) {
  const [mounted, setMounted] = useState(false);
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Submodal for creating new playlist
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistTag, setNewPlaylistTag] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Restrict body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const fetchPlaylists = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/playlist');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.playlists)) {
          setPlaylists(data.playlists);
        }
      }
    } catch (err) {
      console.error('Failed to fetch playlists:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchPlaylists();
    }
  }, [isOpen, fetchPlaylists]);

  if (!isOpen || !mounted) return null;

  const isMovieInPlaylist = (pl: PlaylistItem) => {
    const list = pl.movies || [];
    const cleanId = String(movie.id);
    const cleanTitle = movie.title.toLowerCase();
    return list.some(
      (m) => String(m.movieId) === cleanId || m.title.toLowerCase() === cleanTitle
    );
  };

  const handleToggleMovie = async (playlist: PlaylistItem) => {
    const exists = isMovieInPlaylist(playlist);
    setTogglingId(playlist._id);

    try {
      if (exists) {
        const res = await fetch('/api/playlist', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'removeMovie',
            playlistId: playlist._id,
            movieId: movie.id,
            movieTitle: movie.title,
          }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success(`Removed from "${playlist.name}"`, { icon: '🗑️' });
          fetchPlaylists();
        } else {
          toast.error(data.message || 'Failed to remove movie');
        }
      } else {
        const res = await fetch('/api/playlist', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'addMovie',
            playlistId: playlist._id,
            movie: {
              movieId: movie.id,
              title: movie.title,
              unsplash_url: movie.unsplash_url,
              year: movie.year || '',
              duration: movie.duration || '',
              category: movie.category || 'Movie',
            },
          }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success(`Added to "${playlist.name}"`, { icon: '✨' });
          fetchPlaylists();
        } else {
          toast.error(data.message || 'Failed to add movie');
        }
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setTogglingId(null);
    }
  };

  const handleRandomizeNewPlaylist = () => {
    const suggestion = getRandomPlaylistSuggestion();
    setNewPlaylistName(suggestion.name);
    setNewPlaylistTag(suggestion.tag);
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      toast.error('Playlist name is required');
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch('/api/playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newPlaylistName.trim(),
          tag: newPlaylistTag.trim() || 'Custom',
          initialMovie: {
            movieId: movie.id,
            title: movie.title,
            unsplash_url: movie.unsplash_url,
            year: movie.year || '',
            duration: movie.duration || '',
            category: movie.category || 'Movie',
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Created & added to "${newPlaylistName}" ✨`);
        setNewPlaylistName('');
        setNewPlaylistTag('');
        setIsCreateOpen(false);
        fetchPlaylists();
      } else {
        toast.error(data.message || 'Failed to create playlist');
      }
    } catch (err) {
      toast.error('Failed to create playlist');
    } finally {
      setIsCreating(false);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div 
        className="w-full max-w-sm bg-[#0E0E0E] border border-[#262626] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col p-6 gap-4 relative animate-in zoom-in-95 duration-200 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3.5">
          <div className="flex flex-col min-w-0 pr-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Add to Playlists
            </h3>
            <span className="text-[10px] text-zinc-500 truncate font-semibold">
              {movie.title}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer outline-none"
          >
            <X size={16} />
          </button>
        </div>

        {/* Playlists List */}
        <div className="flex flex-col gap-2 max-h-[240px] overflow-y-auto pr-1 scrollbar-thin">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-zinc-500 gap-2 text-xs">
              <Loader2 size={20} className="animate-spin text-[#FF4C00]" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Loading Collections...</span>
            </div>
          ) : playlists.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs font-semibold flex flex-col gap-1">
              <span>No playlists found.</span>
              <span className="text-[10px] text-zinc-600">Create one below to start your collection!</span>
            </div>
          ) : (
            playlists.map((pl) => {
              const checked = isMovieInPlaylist(pl);
              const isToggling = togglingId === pl._id;

              return (
                <div 
                  key={pl._id}
                  onClick={() => !isToggling && handleToggleMovie(pl)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-950 border border-[#1A1A1A] hover:border-zinc-800 transition-all cursor-pointer select-none"
                >
                  <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider truncate">
                      {pl.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {pl.tag && (
                        <span className="text-[8px] text-[#FF4C00] font-black uppercase tracking-widest">
                          {pl.tag}
                        </span>
                      )}
                      <span className="text-[9px] text-zinc-500 font-mono">
                        {(pl.movies || []).length} items
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isToggling ? (
                      <Loader2 size={16} className="animate-spin text-[#FF4C00]" />
                    ) : (
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        checked ? 'bg-[#FF4C00] border-[#FF4C00] text-black' : 'border-zinc-700 bg-zinc-900'
                      }`}>
                        {checked && <Check size={12} strokeWidth={3} />}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-2 pt-3 border-t border-[#1A1A1A]">
          <button 
            onClick={() => {
              handleRandomizeNewPlaylist();
              setIsCreateOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#FF4C00]/10 hover:scale-[1.02]"
          >
            <Plus size={14} strokeWidth={3} />
            Create New Playlist
          </button>
        </div>

        {/* Submodal for New Playlist Overlay */}
        {isCreateOpen && (
          <div 
            className="absolute inset-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm flex items-center justify-center p-6 transition-all duration-200 animate-in fade-in"
            onClick={(e) => {
              e.stopPropagation();
              setIsCreateOpen(false);
            }}
          >
            <div 
              className="w-full flex flex-col gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#FF4C00]" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">
                    New Playlist
                  </h4>
                </div>
                <button 
                  onClick={() => setIsCreateOpen(false)}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-1"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                      Playlist Name
                    </label>
                    <button
                      type="button"
                      onClick={handleRandomizeNewPlaylist}
                      className="flex items-center gap-1 text-[9px] font-black text-[#FF4C00] uppercase tracking-wider cursor-pointer hover:underline"
                    >
                      <Dices size={12} /> Randomize
                    </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g. Midnight Marathon"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#FF4C00] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none transition-colors placeholder:text-zinc-600"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                    Tag / Label
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Binge Night"
                    value={newPlaylistTag}
                    onChange={(e) => setNewPlaylistTag(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#FF4C00] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none transition-colors placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 bg-[#141414] hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  disabled={isCreating || !newPlaylistName.trim()}
                  onClick={handleCreatePlaylist}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#FF4C00] hover:bg-[#e04300] disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#FF4C00]/10"
                >
                  {isCreating ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    'Create & Add'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
