'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Film, 
  Share2, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Play, 
  Check 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export interface PlaylistMovie {
  movieId: string;
  title: string;
  unsplash_url: string;
  category?: string;
  year?: string;
  duration?: string;
  addedAt?: string;
}

export interface PlaylistItem {
  _id: string;
  name: string;
  tag?: string;
  description?: string;
  movies?: PlaylistMovie[];
  userId?: string;
  userName?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PlaylistCardProps {
  playlist: PlaylistItem;
  onDelete?: (id: string) => void;
  onEdit?: (playlist: PlaylistItem) => void;
}

export default function PlaylistCard({
  playlist,
  onDelete,
  onEdit,
}: PlaylistCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const movies = playlist.movies || [];
  const collages = movies.slice(0, 4);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/playlist/${playlist._id}` 
    : `/playlist/${playlist._id}`;

  const handleCopyShareLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
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
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-4 flex flex-col gap-3.5 relative group hover:border-[#FF4C00]/40 transition-all duration-300 shadow-sm hover:shadow-[0_0_25px_rgba(255,76,0,0.08)]">
      {/* Visual Poster Collage */}
      <Link 
        href={`/playlist/${playlist._id}`}
        className="aspect-[2/3] md:aspect-video rounded-xl overflow-hidden bg-zinc-950 grid grid-cols-2 gap-0.5 relative group/img cursor-pointer"
      >
        {collages.map((m, i) => (
          <div key={i} className="relative w-full h-full overflow-hidden bg-zinc-900">
            <img 
              src={m.unsplash_url || '/placeholder-movie.jpg'} 
              alt={m.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
            />
          </div>
        ))}

        {collages.length === 0 && (
          <div className="col-span-2 absolute inset-0 flex flex-col items-center justify-center text-zinc-700 bg-zinc-950 gap-2">
            <Film size={28} className="text-zinc-650" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Empty Playlist</span>
          </div>
        )}

        {/* Hover Overlay with Play Button */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-[#FF4C00] text-black flex items-center justify-center shadow-lg transform scale-90 group-hover/img:scale-100 transition-transform">
            <Play size={18} fill="currentColor" className="ml-0.5" />
          </div>
        </div>

        {/* Tag Overlay Badge */}
        {playlist.tag && (
          <div className="absolute top-2 left-2 z-10 bg-black/80 backdrop-blur-md border border-[#FF4C00]/40 text-[#FF4C00] text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shadow">
            {playlist.tag}
          </div>
        )}
      </Link>

      {/* Playlist Meta Header */}
      <div className="flex items-start justify-between gap-2 min-w-0">
        <div className="flex flex-col min-w-0 gap-1">
          <Link 
            href={`/playlist/${playlist._id}`}
            className="text-xs font-black text-white truncate uppercase tracking-wider hover:text-[#FF4C00] transition-colors"
          >
            {playlist.name}
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              {movies.length} {movies.length === 1 ? 'Movie' : 'Movies'}
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Quick Share Trigger */}
          <button
            onClick={handleCopyShareLink}
            title="Copy Shareable Link"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check size={14} className="text-[#FF4C00]" />
            ) : (
              <Share2 size={14} />
            )}
          </button>

          {/* More Options Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
              title="Playlist Options"
            >
              <MoreVertical size={14} />
            </button>

            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setIsMenuOpen(false)} 
                />
                <div className="absolute right-0 mt-1.5 bg-[#0E0E0E] border border-[#1A1A1A] rounded-xl shadow-2xl p-1.5 w-36 z-40 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={(e) => {
                      handleCopyShareLink(e);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900 w-full text-left transition-colors cursor-pointer"
                  >
                    <Share2 size={12} className="text-[#FF4C00]" />
                    Share Link
                  </button>
                  {onEdit && (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onEdit(playlist);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900 w-full text-left transition-colors cursor-pointer"
                    >
                      <Edit3 size={12} className="text-[#FF4C00]" />
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onDelete(playlist._id);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg text-red-500 hover:text-red-400 hover:bg-red-950/20 w-full text-left transition-colors cursor-pointer"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
