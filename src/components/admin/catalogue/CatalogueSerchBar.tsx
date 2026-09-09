"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";

const CatalogueSearchBar = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        <Search className="h-4 w-4 text-zinc-400" />
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search movies, series, cast, or tags..."
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 pl-10 pr-10 py-2.5 text-sm text-white placeholder-zinc-500 transition-all duration-200 outline-none focus:border-[#FF4C00] focus:bg-zinc-900 focus:ring-1 focus:ring-[#FF4C00]"
      />

      {search && (
        <button
          onClick={() => setSearch("")}
          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default CatalogueSearchBar;