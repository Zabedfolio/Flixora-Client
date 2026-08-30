'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, Plus, Star, Play, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  isInWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from '@/data/watchlistStore';
import { getPlaylists, createPlaylist, addTitleToPlaylist, removeTitleFromPlaylist, isTitleInPlaylist, Playlist } from '@/data/playlistStore';

interface CardProps {
  id?: string | number;
  title: string;
  unsplash_url: string;
  rating?: string;
  year?: string;
  category?: string;
  duration?: string;
  isNew?: boolean;
}

const getColorFromTitle = (title: string): string => {
  const hash = title
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    'rgba(255, 76, 0, 0.35)', // Orange
    'rgba(168, 85, 247, 0.35)', // Purple
    'rgba(0, 229, 255, 0.35)', // Cyan
    'rgba(255, 215, 0, 0.35)', // Gold
    'rgba(236, 72, 153, 0.35)', // Pink
    'rgba(59, 130, 246, 0.35)', // Blue
    'rgba(14, 165, 233, 0.35)', // Light Blue
    'rgba(244, 63, 94, 0.35)', // Rose
  ];
  return colors[hash % colors.length];
};

export default function MediaCard({
  id,
  title,
  unsplash_url,
  rating = '9.0',
  year = '2026',
  category = 'Adventure',
  duration = '2H 24M',
  isNew = false,
}: CardProps) {
  const router = useRouter();
  const [inMyList, setInMyList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistTag, setNewPlaylistTag] = useState('');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    setInMyList(isInWatchlist(title));
    const handleUpdate = () => {
      setInMyList(isInWatchlist(title));
    };
    window.addEventListener('watchlist-updated', handleUpdate);
    return () => {
      window.removeEventListener('watchlist-updated', handleUpdate);
    };
  }, [title]);

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

  const handleMyListToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    const itemKey = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const exists = isInWatchlist(title);

    if (exists) {
      removeFromWatchlist(title);
      toast.success(`Removed "${title}" from My List`, {
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
        title,
        year,
        duration,
        category,
        unsplash_url,
      });
      toast.success(`Added "${title}" to My List`, {
        icon: '🔖',
        style: {
          background: '#141414',
          color: '#fff',
          border: '1px solid #1A1A1A',
        },
      });
    }
  };

  const handlePlaylistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleCardClick = () => {
    if (id) {
      router.push(`/movie/${id}`);
    }
  };

  const inAnyPlaylist = playlists.some(pl => isTitleInPlaylist(pl.id, title));

  return (
    <div 
      onClick={handleCardClick}
      className="group relative flex flex-col gap-3.5 transition-all duration-300 w-full max-w-[280px] select-none rounded-2xl overflow-visible cursor-pointer"
    >
      {/* Blurred Poster-Colored Glow behind the Card */}
      <div
        className="absolute inset-x-[-50px] inset-y-[-50px] rounded-[50px] opacity-0 group-hover:opacity-100 blur-[50px] pointer-events-none transition-all duration-500 z-0"
        style={{
          background: `radial-gradient(circle, ${getColorFromTitle(title)} 0%, transparent 70%)`,
        }}
      />

      {/* CARD POSTER WRAPPER */}
      <div className="relative z-10 aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-900 group-hover:border-[#FF4C00]/40 group-hover:shadow-[0_0_20px_rgba(255,76,0,0.15)] transition-all duration-300">
        {/* Poster Image */}
        <img
          src={unsplash_url}
          alt={title}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-103 transition-all duration-500 ease-out"
          loading="lazy"
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top-Left: "NEW" Badge */}
        {isNew && (
          <div className="absolute top-4 left-4 bg-[#FF4C00] text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
            New
          </div>
        )}

        {/* Top-Right: Rating Badge */}
        {rating && (
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/60 border border-zinc-800 px-2.5 py-1.5 rounded-xl backdrop-blur-sm shadow-md">
            <Star size={10} className="text-[#FF4C00]" fill="currentColor" />
            <span className="text-[10px] font-extrabold text-white leading-none font-mono">
              {rating}
            </span>
          </div>
        )}

        {/* Middle: Floating Play Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="w-12 h-12 rounded-full bg-[#FF4C00] hover:bg-[#ff6222] hover:scale-108 text-black flex items-center justify-center transition-all shadow-lg shadow-orange-600/35">
            <Play size={16} fill="currentColor" className="ml-1" />
          </div>
        </div>

        {/* Bottom-Right Actions Stack (Always visible but highlighted on hover) */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
          {/* Add/Remove My List */}
          <button
            onClick={handleMyListToggle}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-sm border outline-none cursor-pointer ${
              inMyList
                ? 'bg-[#FF4C00] border-[#FF4C00] text-black hover:scale-105'
                : 'bg-black/60 border-zinc-800 text-zinc-350 hover:text-white hover:border-[#FF4C00]'
            }`}
            title={inMyList ? 'Remove from My List' : 'Add to My List'}
          >
            <Bookmark size={12} fill={inMyList ? 'currentColor' : 'none'} />
          </button>

          {/* Add/Remove Playlist */}
          <button
            onClick={handlePlaylistToggle}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-sm border outline-none cursor-pointer ${
              inAnyPlaylist
                ? 'bg-[#FF4C00] border-[#FF4C00] text-black hover:scale-105'
                : 'bg-black/60 border-zinc-800 text-zinc-350 hover:text-white hover:border-[#FF4C00]'
            }`}
            title={inAnyPlaylist ? 'Manage Playlists (Added)' : 'Add to Playlist'}
          >
            <Plus
              size={14}
              className={inAnyPlaylist ? 'rotate-45 transition-transform' : ''}
            />
          </button>
        </div>
      </div>

      {/* METADATA CONTENT AREA */}
      <div className="relative z-10 flex flex-col gap-1 px-1">
        <h4 className="text-sm font-extrabold text-white group-hover:text-[#FF4C00] transition-colors truncate">
          {title}
        </h4>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-zinc-450 font-bold uppercase tracking-wider">
          <span className="text-zinc-500">{year}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4C00] shrink-0" />
          <span>{category}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700 shrink-0" />
          <span className="text-zinc-500">{duration}</span>
        </div>
      </div>

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
                  const checked = isTitleInPlaylist(pl.id, title);
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
                            removeTitleFromPlaylist(pl.id, title);
                            toast.success(`Removed from "${pl.name}"`, { icon: '🗑️' });
                          } else {
                            addTitleToPlaylist(pl.id, {
                              title,
                              unsplash_url,
                              category,
                              year,
                              duration
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
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-full max-w-xs bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl shadow-2xl flex flex-col p-5 gap-4">
                  <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-white">
                      Create New Playlist
                    </h4>
                    <button 
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        setNewPlaylistName('');
                        setNewPlaylistTag('');
                      }}
                      className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer outline-none"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-bold text-zinc-450 uppercase tracking-widest">
                        Playlist Name
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. Chill Vibes"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        className="w-full bg-[#141414] border border-[#262626] text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#FF4C00] transition-all placeholder:text-zinc-650"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-bold text-zinc-450 uppercase tracking-widest">
                        Tag (Optional)
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. Romance"
                        value={newPlaylistTag}
                        onChange={(e) => setNewPlaylistTag(e.target.value)}
                        className="w-full bg-[#141414] border border-[#262626] text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#FF4C00] transition-all placeholder:text-zinc-650"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#1A1A1A]">
                    <button 
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        setNewPlaylistName('');
                        setNewPlaylistTag('');
                      }}
                      className="flex-1 bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white font-black text-[9px] uppercase tracking-wider py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        if (!newPlaylistName.trim()) {
                          toast.error('Playlist name is required');
                          return;
                        }
                        const newPl = createPlaylist(newPlaylistName.trim(), newPlaylistTag.trim());
                        addTitleToPlaylist(newPl.id, {
                          title,
                          unsplash_url,
                          category,
                          year,
                          duration
                        });
                        toast.success(`Created "${newPlaylistName}" & Added Title!`, { icon: '🎉' });
                        setIsCreateModalOpen(false);
                        setNewPlaylistName('');
                        setNewPlaylistTag('');
                      }}
                      className="flex-1 bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-[9px] uppercase tracking-wider py-2 rounded-lg transition-colors cursor-pointer"
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
