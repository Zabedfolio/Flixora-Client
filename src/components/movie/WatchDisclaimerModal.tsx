'use client';

import React from 'react';
import { ShieldAlert, Scale, Film, Play, X, Lock } from 'lucide-react';

interface WatchDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWatchTrailer?: () => void;
  movieTitle?: string;
}

export default function WatchDisclaimerModal({
  isOpen,
  onClose,
  onWatchTrailer,
  movieTitle = 'this title',
}: WatchDisclaimerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-800 bg-[#0E0E10] p-6 sm:p-8 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF4C00] via-amber-500 to-[#FF4C00]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00] text-xs font-black uppercase tracking-widest">
            <Scale size={14} />
            <span>Copyright & Licensing Notice</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-2">
          Demonstration Mode Notice
        </h3>

        {/* Description Text */}
        <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
          <p>
            You requested to stream <strong className="text-white font-bold">"{movieTitle}"</strong>.
          </p>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-2">
            <div className="flex items-start gap-2.5">
              <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-300">
                <strong className="text-amber-400 font-semibold">Educational & Demo Platform:</strong> Flixora is built solely as an advanced full-stack web demonstration showcasing real-time UI/UX design, AI recommendation engines, and theatrical cinema ticket booking.
              </p>
            </div>
            <div className="flex items-start gap-2.5 pt-2 border-t border-zinc-900">
              <Lock size={18} className="text-[#FF4C00] shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-300">
                <strong className="text-[#FF4C00] font-semibold">Copyright Compliance:</strong> Full commercial movie playback requires explicit distribution licenses. To strictly obey digital copyright laws and protect intellectual property rights, full feature playback is disabled on this demo site.
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-400">
            You can preview the official promotional trailer or explore live cinema ticket availability below.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center gap-3">
          {onWatchTrailer && (
            <button
              onClick={() => {
                onClose();
                onWatchTrailer();
              }}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF4C00]/20 cursor-pointer"
            >
              <Play size={16} fill="currentColor" />
              <span>Watch Official Trailer</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Close Notice
          </button>
        </div>
      </div>
    </div>
  );
}
