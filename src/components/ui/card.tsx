'use client';

import React, { useState } from 'react';
import { Bookmark, Plus, Star, Play } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CardProps {
  title: string;
  unsplash_url: string;
  rating?: string;
  year?: string;
  category?: string;
  duration?: string;
  isNew?: boolean;
}

const getColorFromTitle = (title: string): string => {
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    'rgba(255, 76, 0, 0.35)',   // Orange
    'rgba(168, 85, 247, 0.35)', // Purple
    'rgba(0, 229, 255, 0.35)',  // Cyan
    'rgba(255, 215, 0, 0.35)',  // Gold
    'rgba(236, 72, 153, 0.35)',  // Pink
    'rgba(59, 130, 246, 0.35)',  // Blue
    'rgba(14, 165, 233, 0.35)',  // Light Blue
    'rgba(244, 63, 94, 0.35)',   // Rose
  ];
  return colors[hash % colors.length];
};

export default function MediaCard({
  title,
  unsplash_url,
  rating = '9.0',
  year = '2026',
  category = 'Adventure',
  duration = '2H 24M',
  isNew = false
}: CardProps) {
  const [inMyList, setInMyList] = useState(false);
  const [inPlaylist, setInPlaylist] = useState(false);

  const handleMyListToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInMyList(!inMyList);
    if (!inMyList) {
      toast.success(`Added "${title}" to My List`, {
        icon: '🔖',
        style: {
          background: '#141414',
          color: '#fff',
          border: '1px solid #1A1A1A'
        }
      });
    } else {
      toast.success(`Removed "${title}" from My List`, {
        icon: '🗑️',
        style: {
          background: '#141414',
          color: '#fff',
          border: '1px solid #1A1A1A'
        }
      });
    }
  };

  const handlePlaylistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInPlaylist(!inPlaylist);
    if (!inPlaylist) {
      toast.success(`Added "${title}" to your playlist`, {
        icon: '➕',
        style: {
          background: '#141414',
          color: '#fff',
          border: '1px solid #1A1A1A'
        }
      });
    } else {
      toast.success(`Removed "${title}" from your playlist`, {
        icon: '➖',
        style: {
          background: '#141414',
          color: '#fff',
          border: '1px solid #1A1A1A'
        }
      });
    }
  };

  return (
    <div className="group relative flex flex-col gap-3.5 transition-all duration-300 w-full max-w-[280px] select-none rounded-2xl overflow-visible cursor-pointer">
      {/* Blurred Poster-Colored Glow behind the Card */}
      <div 
        className="absolute inset-x-[-50px] inset-y-[-50px] rounded-[50px] opacity-0 group-hover:opacity-100 blur-[50px] pointer-events-none transition-all duration-500 z-0"
        style={{
          background: `radial-gradient(circle, ${getColorFromTitle(title)} 0%, transparent 70%)`
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
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

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
              inPlaylist 
                ? 'bg-[#FF4C00] border-[#FF4C00] text-black hover:scale-105' 
                : 'bg-black/60 border-zinc-800 text-zinc-350 hover:text-white hover:border-[#FF4C00]'
            }`}
            title={inPlaylist ? 'Remove from Playlist' : 'Add to Playlist'}
          >
            <Plus size={14} className={inPlaylist ? 'rotate-45 transition-transform' : ''} />
          </button>
        </div>

      </div>

      {/* METADATA CONTENT AREA */}
      <div className="relative z-10 flex flex-col gap-1 px-1">
        <h4 className="text-sm font-extrabold text-white group-hover:text-[#FF4C00] transition-colors truncate">
          {title}
        </h4>
        <div className="flex items-center gap-2 text-[10px] text-zinc-450 font-bold uppercase tracking-wider">
          <span className="text-zinc-500">{year}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4C00] shrink-0" />
          <span>{category}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700 shrink-0" />
          <span className="text-zinc-500">{duration}</span>
        </div>
      </div>

    </div>
  );
}
