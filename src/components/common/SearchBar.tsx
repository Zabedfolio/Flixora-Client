"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Movie Data Structure Interface
interface Movie {
  _id?: string;
  id?: string | number;
  title: string;
  poster: string;
  description: string;
}

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpandedMobile, setIsSearchExpandedMobile] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Autocomplete state & references
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Focus search input when expanded on mobile
  useEffect(() => {
    if (isSearchExpandedMobile && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpandedMobile]);

  // Debounce API Call 
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        fetchSearchResults(searchQuery.trim());
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Outside Click 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Movies Data Function
  const fetchSearchResults = async (query: string) => {
    setIsLoading(true);
    try {
      //  Backend Route অনুযায়ী লিঙ্ক পরিবর্তন হবে
      const res = await fetch(`/api/movies/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.movies || data || []);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleMobileClose = () => {
    setIsSearchExpandedMobile(false);
    setSearchQuery("");
    setShowDropdown(false);
  };

  // Movie Item Click Handler
  const handleMovieClick = (movieId: string | number) => {
    setShowDropdown(false);
    setSearchQuery("");
    setIsSearchExpandedMobile(false);
    router.push(`/movies/${movieId}`);
  };

  // Dropdown UI Component
  const renderDropdown = () => {
    if (!showDropdown) return null;

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[380px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-4 text-[#FF4C00] gap-2 text-sm">
            <FaSpinner className="animate-spin" /> Loading...
          </div>
        ) : searchResults.length > 0 ? (
          <div className="divide-y divide-zinc-800/50">
            {searchResults.map((movie) => {
              const movieId = movie._id || movie.id;
              return (
                <div
                  key={movieId}
                  onClick={() => movieId && handleMovieClick(movieId)}
                  className="flex items-center gap-3 p-3 hover:bg-[#262626] cursor-pointer transition-colors"
                >
                  <img
                    src={movie.poster || "/placeholder.jpg"}
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded bg-zinc-800 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#E5E5E5] text-sm font-semibold truncate">
                      {movie.title}
                    </h4>
                    <p className="text-zinc-400 text-xs line-clamp-2 mt-0.5">
                      {movie.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-center text-zinc-500 text-sm">
            No movies found
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Desktop/Tablet Search Pill (>= 768px) */}
      <form onSubmit={handleSearchSubmit} className="hidden md:relative md:flex items-center">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery.trim().length > 1 && setShowDropdown(true)}
          className="bg-[#1A1A1A] text-[#E5E5E5] placeholder-zinc-500 text-sm pl-4 pr-10 py-2 rounded-full border border-transparent w-[200px] lg:w-[280px] focus:outline-none focus:border-[#FF4C00] focus:ring-1 focus:ring-[#FF4C00] transition-all duration-300"
        />
        <button type="submit" className="absolute right-3 text-[#FF4C00] p-1 rounded-full outline-none" aria-label="Search">
          {isLoading ? <FaSpinner className="animate-spin text-sm" /> : <FaSearch className="text-sm" />}
        </button>
        {renderDropdown()}
      </form>

      {/* Mobile Search Overlay (< 768px) */}
      <div className="md:hidden">
        {!isSearchExpandedMobile ? (
          <button
            onClick={() => setIsSearchExpandedMobile(true)}
            className="p-2 text-[#E5E5E5] hover:text-[#FF4C00] transition-colors outline-none rounded-full"
            aria-label="Expand search"
          >
            <FaSearch className="text-lg" />
          </button>
        ) : (
          <form onSubmit={handleSearchSubmit} className="absolute inset-0 bg-[#000000] px-4 flex items-center gap-3 z-50">
            <div className="relative flex-1">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={() => searchQuery.trim().length > 1 && setShowDropdown(true)}
                className="w-full bg-[#1A1A1A] text-[#E5E5E5] placeholder-zinc-500 text-sm pl-4 pr-10 py-2 rounded-full border border-transparent focus:outline-none focus:border-[#FF4C00] focus:ring-1 focus:ring-[#FF4C00]"
              />
              <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#FF4C00] text-sm bg-transparent border-none p-0 outline-none">
                {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
              </button>
              {renderDropdown()}
            </div>
            <button
              type="button"
              onClick={handleMobileClose}
              className="text-[#E5E5E5] hover:text-white"
              aria-label="Close search"
            >
              <FaTimes className="text-base" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}