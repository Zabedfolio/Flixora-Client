'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Bookmark, 
  Play, 
  Trash2, 
  Compass
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface WatchlistItem {
  id: string;
  title: string;
  year: string;
  duration: string;
  category: string;
  unsplash_url: string;
}

const INITIAL_WATCHLIST: WatchlistItem[] = [
  { 
    id: 'wl-1', 
    title: 'Wednesday', 
    year: '2022', 
    duration: 'Season 1', 
    category: 'TV Show',
    unsplash_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=200&auto=format&fit=crop' 
  },
  { 
    id: 'wl-2', 
    title: 'Stranger Things', 
    year: '2016', 
    duration: '4 Seasons', 
    category: 'TV Show',
    unsplash_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=200&auto=format&fit=crop' 
  },
  { 
    id: 'wl-3', 
    title: 'Oppenheimer', 
    year: '2023', 
    duration: '3h 0m', 
    category: 'Movie',
    unsplash_url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=200&auto=format&fit=crop' 
  }
];

interface MyListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyListModal({ isOpen, onClose }: MyListModalProps) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(INITIAL_WATCHLIST);

  const handleRemoveItem = (id: string, title: string) => {
    setWatchlist(prev => prev.filter(item => item.id !== id));
    toast.success(`Removed "${title}" from your list`, {
      icon: '🗑️',
      style: {
        background: '#141414',
        color: '#fff',
        border: '1px solid #1A1A1A'
      }
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh] z-10"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#1A1A1A]/80 bg-zinc-950/40">
            <div className="flex items-center gap-2.5">
              <Bookmark className="text-[#FF4C00]" size={18} fill="currentColor" />
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                My List
              </h2>
              <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold px-2 py-0.5 rounded-full font-mono">
                {watchlist.length} items
              </span>
            </div>
            
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all outline-none cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Content Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {watchlist.length > 0 ? (
              <div className="flex flex-col gap-4">
                {watchlist.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-xl border border-[#1A1A1A] bg-[#141414]/30 hover:bg-[#1A1A1A]/20 hover:border-zinc-800/80 transition-all group"
                  >
                    {/* Item Info */}
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Image Poster */}
                      <img 
                        src={item.unsplash_url} 
                        alt="" 
                        className="w-10 h-12 rounded object-cover bg-zinc-950 shrink-0 border border-zinc-900 shadow" 
                      />
                      
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-xs font-black text-white truncate block">
                          {item.title}
                        </span>
                        <div className="flex items-center gap-1.5 text-[9px] text-zinc-550 font-bold uppercase tracking-wider">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>{item.year}</span>
                          <span>•</span>
                          <span>{item.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      {/* Watch now */}
                      <Link
                        href={`/dashboard`}
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-[#FF4C00] hover:text-black hover:bg-[#FF4C00] flex items-center justify-center transition-all shadow-inner outline-none"
                        title="Watch Now"
                      >
                        <Play size={12} fill="currentColor" className="ml-0.5" />
                      </Link>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemoveItem(item.id, item.title)}
                        className="w-8 h-8 rounded-lg bg-zinc-900/40 hover:bg-red-950/20 border border-zinc-905 hover:border-red-900 text-zinc-550 hover:text-red-500 flex items-center justify-center transition-all outline-none cursor-pointer"
                        title="Remove from list"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="flex flex-col items-center justify-center text-center py-10 px-4 gap-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-zinc-800 flex items-center justify-center text-zinc-650 mb-2">
                  <Bookmark size={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Your List is Empty
                  </h3>
                  <p className="text-[11px] text-zinc-500 max-w-xs font-semibold leading-relaxed">
                    Explore our collection and add titles to your watchlist to see them here.
                  </p>
                </div>

                <Link
                  href="/explore"
                  onClick={onClose}
                  className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF4C00] hover:bg-[#ff6222] text-black font-black text-xs uppercase tracking-wider transition-all hover:scale-103 shadow-lg shadow-orange-600/10 outline-none"
                >
                  <Compass size={13} />
                  Discover Movies
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
