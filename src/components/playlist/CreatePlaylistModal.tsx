'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Dices, Sparkles, Loader2 } from 'lucide-react';
import { getRandomPlaylistSuggestion } from '@/lib/playlistGenerator';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; tag: string; description?: string }) => Promise<void> | void;
  initialData?: { name?: string; tag?: string; description?: string } | null;
  isEditing?: boolean;
}

const PRESET_TAGS = [
  'Binge Night',
  'Action Marathon',
  'Weekend Vibes',
  'Late Night Cinema',
  'Chill Mood',
  'Classics Rewind',
  'Sci-Fi Universe',
  'Date Night',
];

export default function CreatePlaylistModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing = false,
}: CreatePlaylistModalProps) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setTag(initialData.tag || '');
        setDescription(initialData.description || '');
      } else {
        const suggestion = getRandomPlaylistSuggestion();
        setName(suggestion.name);
        setTag(suggestion.tag);
        setDescription('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen || !mounted) return null;

  const handleRandomize = () => {
    const suggestion = getRandomPlaylistSuggestion();
    setName(suggestion.name);
    setTag(suggestion.tag);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        tag: tag.trim() || 'Custom',
        description: description.trim(),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 gap-5 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-[#FF4C00]" size={18} />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              {isEditing ? 'Edit Playlist' : 'Create Playlist'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer outline-none"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Playlist Name Input + Randomizer */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Playlist Name
              </label>
              <button
                type="button"
                onClick={handleRandomize}
                className="flex items-center gap-1 text-[10px] font-black text-[#FF4C00] hover:text-[#ff6a26] transition-colors cursor-pointer uppercase tracking-wider"
              >
                <Dices size={13} />
                Randomize
              </button>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Midnight Marathon"
              required
              className="w-full bg-[#141414] border border-[#262626] focus:border-[#FF4C00] text-white rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all placeholder:text-zinc-600"
            />
          </div>

          {/* Playlist Tag Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Tag / Category
            </label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g. Binge Night"
              className="w-full bg-[#141414] border border-[#262626] focus:border-[#FF4C00] text-white rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all placeholder:text-zinc-600"
            />

            {/* Quick preset chips */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {PRESET_TAGS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTag(preset)}
                  className={`text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                    tag.toLowerCase() === preset.toLowerCase()
                      ? 'bg-[#FF4C00] text-black'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Description (Optional) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Description <span className="text-zinc-600 font-normal">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell friends what this collection is all about..."
              rows={2}
              className="w-full bg-[#141414] border border-[#262626] focus:border-[#FF4C00] text-white rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none transition-all placeholder:text-zinc-600 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-[#1A1A1A]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-zinc-800 hover:border-zinc-700 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#FF4C00]/10"
            >
              {isSubmitting ? (
                <Loader2 size={14} className="animate-spin text-black" />
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Playlist'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
