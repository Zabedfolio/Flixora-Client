"use client";

import React, { useState, useRef, useEffect } from "react";
import { Filter, ChevronDown, Check } from "lucide-react";

const genres = [
  "All Genres",
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
];

const CatalogueFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-48" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/80 transition-all"
      >
        <div className="flex items-center gap-2 truncate">
          <Filter className="h-4 w-4 text-[#FF4C00]" />
          <span className="truncate">{selectedGenre}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-full origin-top-right rounded-xl border border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
          <div className="max-h-60 overflow-y-auto space-y-0.5 custom-scrollbar">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => {
                  setSelectedGenre(genre);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  selectedGenre === genre
                    ? "bg-[#FF4C00]/10 text-[#FF4C00]"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <span>{genre}</span>
                {selectedGenre === genre && <Check className="h-3.5 w-3.5 text-[#FF4C00]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogueFilter;