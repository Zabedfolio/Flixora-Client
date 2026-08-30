'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, Plus, X, Play } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  isInWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from '@/data/watchlistStore';
import {
  getPlaylists,
  createPlaylist,
  addTitleToPlaylist,
  removeTitleFromPlaylist,
  isTitleInPlaylist,
  Playlist,
} from '@/data/playlistStore';

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistTag, setNewPlaylistTag] = useState('');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

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

  useEffect(() => {
    setPlaylists(getPlaylists());
    const handleUpdate = () => {
      setPlaylists(getPlaylists());
    };
    window.addEventListener('playlists-updated', handleUpdate);
    return () => {
      window.removeEventListener('playlists-updated', handleUpdate);
    };
  }, []);

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

  const handlePlaylistToggle = () => {
    setIsModalOpen(true);
  };

  const inAnyPlaylist = playlists.some(pl => isTitleInPlaylist(pl.id, movie.title));

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
        onClick={handlePlaylistToggle}
        className={`flex items-center gap-2 rounded-lg border px-6 py-3 font-semibold transition cursor-pointer ${
          inAnyPlaylist
            ? 'bg-[#FF4C00] border-[#FF4C00] text-black'
            : 'border-zinc-800 bg-zinc-950/60 text-white hover:bg-zinc-900/60'
        }`}
      >
        <Plus size={16} className={inAnyPlaylist ? 'rotate-45 transition-transform' : ''} />
        {inAnyPlaylist ? 'In Playlist' : 'Add to Playlist'}
      </button>

      {/* DUAL LAYER PLAYLIST SELECTOR MODAL */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(false);
          }}
        >
          <div 
            className="w-full max-w-sm bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 gap-5 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                Add to Playlists
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer outline-none"
              >
                <X size={16} />
              </button>
            </div>

            {/* List of playlists */}
            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
              {playlists.length === 0 ? (
                <div className="text-center py-8 text-zinc-550 text-xs font-semibold">
                  No custom playlists found
                </div>
              ) : (
                playlists.map((pl) => {
                  const checked = isTitleInPlaylist(pl.id, movie.title);
                  return (
                    <label 
                      key={pl.id}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-950/60 border border-transparent hover:border-zinc-900 transition-all cursor-pointer select-none"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{pl.name}</span>
                        {pl.tag && (
                          <span className="text-[8px] text-[#FF4C00] font-black uppercase tracking-widest">{pl.tag}</span>
                        )}
                      </div>
                      <input 
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (checked) {
                            removeTitleFromPlaylist(pl.id, movie.title);
                            toast.success(`Removed from "${pl.name}"`, { icon: '🗑️' });
                          } else {
                            addTitleToPlaylist(pl.id, {
                              title: movie.title,
                              unsplash_url: movie.unsplash_url,
                              category: movie.category,
                              year: movie.year,
                              duration: movie.duration
                            });
                            toast.success(`Added to "${pl.name}"`, { icon: '✨' });
                          }
                        }}
                        className="checkbox checkbox-xs border-zinc-700 checked:bg-[#FF4C00] checked:border-[#FF4C00] rounded accent-[#FF4C00]"
                      />
                    </label>
                  );
                })
              )}
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-[#1A1A1A]">
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-[10px] uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#FF4C00]/10"
              >
                <Plus size={12} strokeWidth={3} />
                Create New Playlist
              </button>
            </div>

            {/* NESTED CREATE PLAYLIST OVERLAY */}
            {isCreateModalOpen && (
              <div 
                className="absolute inset-0 z-50 bg-[#0A0A0A]/95 flex items-center justify-center p-6 transition-all duration-300 animate-in fade-in duration-150"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCreateModalOpen(false);
                }}
              >
                <div 
                  className="w-full flex flex-col gap-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4C00]">
                      Create Playlist
                    </h4>
                    <button 
                      onClick={() => setIsCreateModalOpen(false)}
                      className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Playlist Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Cyberpunk Vibe"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#FF4C00] transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Tag/Label (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Sci-Fi, Dark"
                        value={newPlaylistTag}
                        onChange={(e) => setNewPlaylistTag(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#FF4C00] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => setIsCreateModalOpen(false)}
                      className="flex-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-zinc-400 hover:text-white font-bold text-[9px] uppercase tracking-wider py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        if (!newPlaylistName.trim()) {
                          toast.error('Playlist name is required');
                          return;
                        }
                        createPlaylist(newPlaylistName.trim(), newPlaylistTag.trim() || undefined);
                        setNewPlaylistName('');
                        setNewPlaylistTag('');
                        setIsCreateModalOpen(false);
                        toast.success('Playlist created successfully! ✨');
                      }}
                      className="flex-1 bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-[9px] uppercase tracking-wider py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
