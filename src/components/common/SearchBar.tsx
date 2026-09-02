"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2, Star, Film } from "lucide-react";
import { useRouter } from "next/navigation";

export interface MovieSuggestion {
  id: string;
  _id?: string;
  title: string;
  poster: string;
  rating: string;
  year: string;
  category: string;
  overview?: string;
}

interface SearchBarProps {
  onExpandChange?: (expanded: boolean) => void;
}

export default function SearchBar({ onExpandChange }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-complete & Async state
  const [searchResults, setSearchResults] = useState<MovieSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Production References
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Production Method 1: AbortController Ref for cancelling stale in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Production Method 2: SWR / LRU Cache Map for 0ms instant cached suggestions
  const searchCacheRef = useRef<Map<string, MovieSuggestion[]>>(new Map());

  const router = useRouter();

  // Notify parent component when full-width search mode changes
  const updateExpandState = useCallback(
    (expanded: boolean) => {
      setIsExpanded(expanded);
      if (onExpandChange) {
        onExpandChange(expanded);
      }
    },
    [onExpandChange]
  );

  // Production Method 3: Async Typeahead Fetcher with AbortController & Cache
  const fetchSearchResults = useCallback(async (query: string) => {
    const cleanKey = query.trim().toLowerCase();
    if (!cleanKey) return;

    // Check SWR Cache first for instant 0ms result
    if (searchCacheRef.current.has(cleanKey)) {
      const cachedData = searchCacheRef.current.get(cleanKey)!;
      setSearchResults(cachedData);
      setShowDropdown(true);
      setIsLoading(false);
      return;
    }

    // Cancel previous pending HTTP request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/movies/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      });

      if (res.ok) {
        const data = await res.json();
        const results: MovieSuggestion[] = data.movies || [];

        // Save to cache map
        searchCacheRef.current.set(cleanKey, results);

        setSearchResults(results);
        setShowDropdown(true);
        setSelectedIndex(-1);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Search API error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Production Method 4: Keystroke Debounce (250ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 1) {
        fetchSearchResults(searchQuery.trim());
      } else {
        setSearchResults([]);
        setShowDropdown(false);
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchSearchResults]);

  // Click Outside Listener to dismiss dropdown & collapse search bar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setIsFocused(false);
        if (!searchQuery.trim()) {
          updateExpandState(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchQuery, updateExpandState]);

  // Handle Focus & Full-Width expansion
  const handleFocus = () => {
    setIsFocused(true);
    updateExpandState(true);
    if (searchQuery.trim().length >= 1) {
      setShowDropdown(true);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleCloseExpanded = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
    setIsFocused(false);
    updateExpandState(false);
  };

  const handleSelectMovie = (movieId: string) => {
    setShowDropdown(false);
    setIsFocused(false);
    updateExpandState(false);
    router.push(`/movie/${movieId}`);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (selectedIndex >= 0 && searchResults[selectedIndex]) {
      handleSelectMovie(searchResults[selectedIndex].id);
    } else if (searchQuery.trim()) {
      setShowDropdown(false);
      updateExpandState(false);
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Keyboard Navigation (WAI-ARIA Combobox Standard)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (searchResults.length > 0) {
        setShowDropdown(true);
        setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (searchResults.length > 0) {
        setShowDropdown(true);
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setIsFocused(false);
      updateExpandState(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative transition-all duration-300 ease-out z-50 ${
        isExpanded
          ? "w-full max-w-2xl"
          : "w-[180px] sm:w-[220px] md:w-[260px] lg:w-[320px]"
      }`}
    >
      {/* Search Bar Input Container */}
      <form
        onSubmit={handleSearchSubmit}
        className={`relative flex items-center w-full rounded-full transition-all duration-300 border ${
          isFocused || isExpanded
            ? "bg-[#0A0A0A] border-[#FF4C00] shadow-[0_0_20px_rgba(255,76,0,0.2)]"
            : "bg-[#141414] border-zinc-800 hover:border-zinc-700"
        }`}
      >
        {/* Left Search Icon */}
        <div className="pl-4 pr-2 text-zinc-400 flex items-center justify-center">
          {isLoading ? (
            <Loader2 size={16} className="animate-spin text-[#FF4C00]" />
          ) : (
            <Search
              size={16}
              className={`transition-colors ${
                isFocused ? "text-[#FF4C00]" : "text-zinc-400"
              }`}
            />
          )}
        </div>

        {/* Search Input Field */}
        <input
          ref={searchInputRef}
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          placeholder="Search movies, action, sci-fi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent py-2.5 pr-10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
        />

        {/* Right Action Icons (Clear / Close) */}
        <div className="absolute right-3 flex items-center gap-1.5 text-zinc-400">
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}

          {isExpanded && !searchQuery && (
            <button
              type="button"
              onClick={handleCloseExpanded}
              className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Close full-width search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </form>

      {/* =========================================================
          SUGGESTIONS DROPDOWN (Minimum 5 rich items with Posters & Rating Icons)
      ========================================================= */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-[#0E0E0E]/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-[99999] animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {isLoading && searchResults.length === 0 ? (
            <div className="flex items-center justify-center p-6 text-zinc-400 gap-2.5 text-xs font-bold uppercase tracking-wider">
              <Loader2 size={18} className="animate-spin text-[#FF4C00]" />
              <span>Searching Movies...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2 max-h-[420px] overflow-y-auto divide-y divide-zinc-900/60 custom-scrollbar">
              <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#FF4C00] flex items-center justify-between">
                <span>Top Search Suggestions</span>
                <span className="text-zinc-600 font-mono text-[9px]">
                  {searchResults.length} Results
                </span>
              </div>

              {searchResults.map((movie, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={movie.id || idx}
                    onClick={() => handleSelectMovie(movie.id)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center gap-3.5 px-4 py-3 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-[#FF4C00]/15 border-l-2 border-[#FF4C00]"
                        : "hover:bg-zinc-900/80"
                    }`}
                  >
                    {/* Poster Image (2:3 Aspect Thumbnail) */}
                    <div className="relative w-11 h-16 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 shadow-md">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Movie Info */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#FF4C00] transition-colors">
                        {movie.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 text-[10px]">
                        {/* Rating Badge with Lucide SVG Star Icon (Zero Emojis) */}
                        <span className="inline-flex items-center gap-1 font-black text-white px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800">
                          <Star
                            size={12}
                            fill="currentColor"
                            className="text-[#FF4C00]"
                          />
                          <span>{movie.rating}</span>
                        </span>

                        {/* Release Year */}
                        <span className="text-zinc-400 font-semibold">
                          {movie.year}
                        </span>

                        <span className="w-1 h-1 rounded-full bg-zinc-700" />

                        {/* Category Badge */}
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-900/60 border border-zinc-800">
                          {movie.category}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center flex flex-col items-center justify-center gap-2 text-zinc-500">
              <Film size={24} className="text-zinc-700" />
              <p className="text-xs font-semibold text-zinc-400">
                No matching movies found for "{searchQuery}"
              </p>
              <p className="text-[10px] text-zinc-600">
                Try searching for a title, genre, or release year.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}