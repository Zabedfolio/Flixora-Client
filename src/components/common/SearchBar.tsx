"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpandedMobile, setIsSearchExpandedMobile] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when expanded on mobile
  useEffect(() => {
    if (isSearchExpandedMobile && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpandedMobile]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleMobileClose = () => {
    setIsSearchExpandedMobile(false);
    setSearchQuery("");
  };

  return (
    <>
      {/* Desktop/Tablet Search Pill (>= 768px) */}
      <div className="hidden md:relative md:flex items-center">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="bg-[#1A1A1A] text-[#E5E5E5] placeholder-zinc-500 text-sm pl-4 pr-10 py-2 rounded-full border border-transparent w-[200px] lg:w-[280px] focus:outline-none focus:border-[#FF4C00] focus:ring-1 focus:ring-[#FF4C00] transition-all duration-300"
        />
        <button className="absolute right-3 text-[#FF4C00] p-1 rounded-full outline-none" aria-label="Search">
          <FaSearch className="text-sm" />
        </button>
      </div>

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
          <div className="absolute inset-0 bg-[#000000] px-4 flex items-center gap-3 z-50">
            <div className="relative flex-1">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-[#1A1A1A] text-[#E5E5E5] placeholder-zinc-500 text-sm pl-4 pr-10 py-2 rounded-full border border-transparent focus:outline-none focus:border-[#FF4C00] focus:ring-1 focus:ring-[#FF4C00]"
              />
              <FaSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#FF4C00] text-sm" />
            </div>
            <button
              onClick={handleMobileClose}
              className="text-[#E5E5E5] hover:text-white"
              aria-label="Close search"
            >
              <FaTimes className="text-base" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
