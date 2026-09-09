"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Film,
  Filter,
  Flame,
  FolderPlus,
  Layers,
  Link as LinkIcon,
  Play,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Star,
  Tags,
  Trash2,
  Tv,
  X,
  Check,
  Edit,
  BookmarkPlus,
  SlidersHorizontal,
  ExternalLink
} from "lucide-react";
import {
  getCatalogueMovies,
  updateMovieMetadata,
  addCustomMovie,
  createCustomCollection,
  deleteCatalogueMovie,
} from "@/services/catalogue/catalogueApi";
import { CatalogueMovie, CustomCollection, MaturityRating } from "@/types/catalogue";
import { toast } from "react-hot-toast";

const ALL_GENRES = "All genres";
const ALL_MATURITY = "All Ratings";
const MATURITY_OPTIONS: MaturityRating[] = ["G", "PG", "PG-13", "R", "NC-17", "TV-Y", "TV-PG", "TV-14", "TV-MA"];

export default function CatalogueClient() {
  const [movies, setMovies] = useState<CatalogueMovie[]>([]);
  const [collections, setCollections] = useState<CustomCollection[]>([]);
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(ALL_GENRES);
  const [selectedMaturity, setSelectedMaturity] = useState(ALL_MATURITY);
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"catalogue" | "hero" | "collections" | "maturity">("catalogue");
  
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [featuredCount, setFeaturedCount] = useState(0);
  const [hiddenCount, setHiddenCount] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<CatalogueMovie | null>(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form State for Add / Edit Movie
  const [formData, setFormData] = useState({
    title: "",
    type: "Movie" as "Movie" | "TV Series",
    rating: 8.5,
    year: 2026,
    genres: "Action, Sci-Fi",
    posterUrl: "",
    backdropUrl: "",
    streamUrl: "",
    trailerUrl: "",
    synopsis: "",
    maturityRating: "PG-13" as MaturityRating,
    isFeaturedHero: false,
    isHidden: false,
  });

  // Form State for Create Collection
  const [collectionFormData, setCollectionFormData] = useState({
    name: "Editor's Picks",
    tag: "Curated",
    description: "Hand-picked cinematic masterpieces chosen by Flixora editors.",
    selectedMovieIds: [] as string[],
  });

  const fetchCatalogue = async () => {
    try {
      setLoading(true);
      setError(null);

      const isHeroTab = activeTab === "hero";
      const isHiddenFilter = activeTab === "catalogue" && false;

      const { result, collections: colls } = await getCatalogueMovies(
        query,
        selectedGenre === ALL_GENRES ? "All" : selectedGenre,
        page,
        selectedMaturity === ALL_MATURITY ? "All" : selectedMaturity,
        selectedCollectionFilter,
        isHeroTab,
        isHiddenFilter
      );

      setMovies(result.movies);
      setTotalResults(result.totalResults);
      setTotalPages(result.totalPages);
      setFeaturedCount(result.featuredHeroCount);
      setHiddenCount(result.hiddenCount);
      setPublishedCount(result.publishedCount);
      setCollections(colls);
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "Unable to load catalogue.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogue();
  }, [page, query, selectedGenre, selectedMaturity, selectedCollectionFilter, activeTab]);

  const genres = useMemo(() => {
    const availableGenres = movies.flatMap((movie) => movie.genres || []);
    const selectedGenreOption = selectedGenre === ALL_GENRES ? [] : [selectedGenre];
    return [ALL_GENRES, ...selectedGenreOption, ...Array.from(new Set(availableGenres)).sort()]
      .filter((genre, index, options) => options.indexOf(genre) === index);
  }, [movies, selectedGenre]);

  // Quick Action Handlers
  const handleToggleHero = async (movie: CatalogueMovie) => {
    try {
      const nextFeatured = !movie.isFeaturedHero;
      setMovies(prev => prev.map(m => m.id === movie.id ? { ...m, isFeaturedHero: nextFeatured } : m));
      toast.success(nextFeatured ? `Featured "${movie.title}" on Hero Carousel!` : `Removed "${movie.title}" from Hero Carousel`);
      await updateMovieMetadata(movie.id, { isFeaturedHero: nextFeatured });
    } catch (err) {
      toast.error("Failed to update hero featured state");
    }
  };

  const handleToggleHidden = async (movie: CatalogueMovie) => {
    try {
      const nextHidden = !movie.isHidden;
      setMovies(prev => prev.map(m => m.id === movie.id ? { ...m, isHidden: nextHidden } : m));
      toast.success(nextHidden ? `Hidden "${movie.title}" from search results` : `Published "${movie.title}" to public search`);
      await updateMovieMetadata(movie.id, { isHidden: nextHidden });
    } catch (err) {
      toast.error("Failed to update visibility state");
    }
  };

  const handleDeleteMovie = async (movie: CatalogueMovie) => {
    if (!confirm(`Are you sure you want to remove "${movie.title}" from catalogue?`)) return;
    try {
      setMovies(prev => prev.filter(m => m.id !== movie.id));
      toast.success(`Removed "${movie.title}" from catalogue`);
      await deleteCatalogueMovie(movie.id);
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  const handleOpenEditModal = (movie: CatalogueMovie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      type: movie.type || "Movie",
      rating: movie.rating || 8.5,
      year: movie.year || 2026,
      genres: (movie.genres || []).join(", "),
      posterUrl: movie.posterUrl || "",
      backdropUrl: movie.backdropUrl || "",
      streamUrl: movie.streamUrl || "",
      trailerUrl: movie.trailerUrl || "",
      synopsis: movie.synopsis || "",
      maturityRating: movie.maturityRating || "PG-13",
      isFeaturedHero: !!movie.isFeaturedHero,
      isHidden: !!movie.isHidden,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingMovie(null);
    setFormData({
      title: "",
      type: "Movie",
      rating: 8.5,
      year: 2026,
      genres: "Action, Sci-Fi",
      posterUrl: "",
      backdropUrl: "",
      streamUrl: "",
      trailerUrl: "",
      synopsis: "",
      maturityRating: "PG-13",
      isFeaturedHero: false,
      isHidden: false,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Movie title is required");
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        ...formData,
        genres: formData.genres.split(",").map(g => g.trim()).filter(Boolean),
      };

      if (editingMovie) {
        await updateMovieMetadata(editingMovie.id, payload);
        toast.success(`Updated metadata for "${formData.title}"`);
      } else {
        await addCustomMovie(payload);
        toast.success(`Added "${formData.title}" to catalogue!`);
      }

      setIsAddModalOpen(false);
      fetchCatalogue();
    } catch (err) {
      toast.error("Failed to save media metadata");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectionFormData.name.trim()) {
      toast.error("Collection name is required");
      return;
    }

    try {
      setActionLoading(true);
      await createCustomCollection({
        name: collectionFormData.name,
        tag: collectionFormData.tag,
        description: collectionFormData.description,
        movieIds: collectionFormData.selectedMovieIds,
      });
      toast.success(`Created collection "${collectionFormData.name}"!`);
      setIsCollectionModalOpen(false);
      fetchCatalogue();
    } catch (err) {
      toast.error("Failed to create custom collection");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-[#070707] p-4 text-white sm:p-6 lg:p-8 font-sans select-none">
      <div className="mx-auto max-w-[1600px] space-y-6">
        
        {/* HEADER & TOP ACTIONS */}
        <header className="flex flex-col gap-4 border-b border-zinc-800/80 pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00] shadow-lg shadow-[#FF4C00]/10 shrink-0 mt-0.5">
              <Film className="h-6 w-6 text-[#FF4C00]" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-white">
                Catalogue Management
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-3xl">
                Control hero banner sliders, create custom collections, update stream/trailer links, edit genre tags, and assign maturity ratings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsCollectionModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs font-bold text-zinc-200 transition-all hover:border-[#FF4C00]/50 hover:bg-zinc-800 hover:text-white whitespace-nowrap cursor-pointer"
            >
              <FolderPlus className="h-4 w-4 text-[#FF4C00]" />
              <span>New Collection</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF4C00] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#FF4C00]/20 transition-all hover:bg-[#e04300] whitespace-nowrap cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Custom Media</span>
            </button>
          </div>
        </header>

        {/* TOP STATS CARDS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <span>Total Media Items</span>
              <Film className="h-4 w-4 text-blue-400" />
            </div>
            <p className="mt-3 text-2xl font-black text-white">{totalResults}</p>
            <p className="mt-1 text-[10px] text-zinc-500">Indexed in catalog (12 per page)</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <span>Hero Spotlight Banner</span>
              <Flame className="h-4 w-4 text-[#FF4C00]" />
            </div>
            <p className="mt-3 text-2xl font-black text-[#FF4C00]">{featuredCount}</p>
            <p className="mt-1 text-[10px] text-zinc-500">Active homepage hero items</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <span>Published Titles</span>
              <Eye className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="mt-3 text-2xl font-black text-emerald-400">{publishedCount}</p>
            <p className="mt-1 text-[10px] text-zinc-500">Visible to public search</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <span>Hidden / Drafts</span>
              <EyeOff className="h-4 w-4 text-rose-400" />
            </div>
            <p className="mt-3 text-2xl font-black text-rose-400">{hiddenCount}</p>
            <p className="mt-1 text-[10px] text-zinc-500">Hidden from user search</p>
          </div>
        </section>

        {/* SUB-NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => { setActiveTab("catalogue"); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "catalogue"
                ? "bg-[#FF4C00]/15 text-[#FF4C00] border border-[#FF4C00]/30 shadow-md"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Film className="h-4 w-4" />
            <span>Catalogue Cards Grid (12 / page, 4 / row)</span>
          </button>

          <button
            onClick={() => { setActiveTab("hero"); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "hero"
                ? "bg-[#FF4C00]/15 text-[#FF4C00] border border-[#FF4C00]/30 shadow-md"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Flame className="h-4 w-4 text-[#FF4C00]" />
            <span>Homepage Banner & Hero Carousel</span>
            <span className="ml-1 rounded-full bg-[#FF4C00] px-1.5 py-0.2 text-[9px] text-white">
              {featuredCount}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab("collections"); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "collections"
                ? "bg-[#FF4C00]/15 text-[#FF4C00] border border-[#FF4C00]/30 shadow-md"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <BookmarkPlus className="h-4 w-4 text-purple-400" />
            <span>Custom Collections & Categories</span>
            <span className="ml-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 px-1.5 py-0.2 text-[9px]">
              {collections.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab("maturity"); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "maturity"
                ? "bg-[#FF4C00]/15 text-[#FF4C00] border border-[#FF4C00]/30 shadow-md"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Shield className="h-4 w-4 text-cyan-400" />
            <span>Age & Content Rating Manager</span>
          </button>
        </div>

        {/* CONTROLS & SEARCH BAR */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Search catalogue</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="search"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search movies/shows by title..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-10 py-2.5 text-xs text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-[#FF4C00]"
              />
            </label>

            {/* Genre Filter */}
            <label className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 text-xs text-zinc-300 lg:w-52">
              <Filter className="h-4 w-4 shrink-0 text-[#FF4C00]" />
              <select
                value={selectedGenre}
                onChange={(e) => { setSelectedGenre(e.target.value); setPage(1); }}
                className="w-full bg-transparent py-2.5 outline-none"
              >
                {genres.map((g) => (
                  <option key={g} value={g} className="bg-zinc-900 text-white">
                    {g}
                  </option>
                ))}
              </select>
            </label>

            {/* Maturity Rating Filter */}
            <label className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 text-xs text-zinc-300 lg:w-48">
              <Shield className="h-4 w-4 shrink-0 text-cyan-400" />
              <select
                value={selectedMaturity}
                onChange={(e) => { setSelectedMaturity(e.target.value); setPage(1); }}
                className="w-full bg-transparent py-2.5 outline-none"
              >
                <option value="All" className="bg-zinc-900 text-white">All Ratings</option>
                {MATURITY_OPTIONS.map((m) => (
                  <option key={m} value={m} className="bg-zinc-900 text-white">
                    {m} Rating
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {/* REDESIGNED CARD GRID VIEW (FULL POSTER CARD, SHADER GRADIENT, 4 IN A ROW, 12 PER PAGE) */}
        {(activeTab === "catalogue" || activeTab === "hero") && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  {activeTab === "hero" ? (
                    <>
                      <Flame className="h-5 w-5 text-[#FF4C00]" />
                      <span>Featured Homepage Hero Carousel Titles</span>
                    </>
                  ) : (
                    <>
                      <Film className="h-5 w-5 text-[#FF4C00]" />
                      <span>Catalogue Media Cards ({totalResults} Total • 4 per row, 12 per page)</span>
                    </>
                  )}
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Full poster card background with bottom-to-top gradient shader overlay, maturity ratings, and action controls.
                </p>
              </div>

              <div className="text-xs font-mono font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
                Page {page} of {totalPages}
              </div>
            </div>

            {loading ? (
              <div className="p-16 text-center text-xs text-zinc-500 flex flex-col items-center justify-center gap-3 rounded-3xl border border-zinc-800 bg-zinc-950/70">
                <RefreshCw className="h-8 w-8 animate-spin text-[#FF4C00]" />
                <span className="font-mono text-zinc-400">Loading 12 wide media cards...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-3 px-6 py-16 text-center rounded-3xl border border-zinc-800 bg-zinc-950/70">
                <AlertCircle className="h-8 w-8 text-rose-400" />
                <p className="font-semibold text-white">Catalogue unavailable</p>
                <p className="max-w-md text-xs text-zinc-500">{error}</p>
              </div>
            ) : movies.length === 0 ? (
              <div className="px-6 py-16 text-center rounded-3xl border border-zinc-800 bg-zinc-950/70">
                <Search className="mx-auto h-8 w-8 text-zinc-600" />
                <p className="mt-3 font-semibold text-white">No media items match your search</p>
                <p className="mt-1 text-xs text-zinc-500">Try adjusting your search query or genre filter.</p>
              </div>
            ) : (
              /* 4-COLUMN WIDE CARD GRID (12 ITEMS PER PAGE, FULL POSTER BG & SHADER OVERLAY) */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="relative min-h-[460px] group rounded-3xl border border-zinc-800/80 bg-zinc-950 overflow-hidden flex flex-col justify-between hover:border-[#FF4C00]/60 transition-all duration-500 shadow-2xl hover:shadow-[#FF4C00]/15 hover:-translate-y-1.5"
                  >
                    {/* Full Card Poster Image Background */}
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95 group-hover:brightness-105"
                      loading="lazy"
                    />

                    {/* Gradient Shader (Fades out from bottom to top so artwork top is bright & clear) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 via-45% to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />

                    {/* TOP OVERLAY BADGES & ACTION TOGGLES */}
                    <div className="relative z-10 p-4 flex items-start justify-between gap-2">
                      {/* Top-Left Badges */}
                      <div className="flex flex-col gap-2">
                        {/* Maturity Rating Badge */}
                        <span className="inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold px-2.5 py-1 rounded-full shadow-lg">
                          <Shield className="h-3.5 w-3.5 text-cyan-400" />
                          {movie.maturityRating || "PG-13"}
                        </span>

                        {/* Media Type Badge */}
                        <span className="inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/20 text-zinc-300 text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                          <Film className="h-3.5 w-3.5 text-[#FF4C00]" />
                          {movie.type || "Movie"}
                        </span>
                      </div>

                      {/* Top-Right Action Toggles (Hero Spotlight & Visibility) */}
                      <div className="flex flex-col gap-2 items-end">
                        {/* Hero Spotlight Pill */}
                        <button
                          type="button"
                          onClick={() => handleToggleHero(movie)}
                          title={movie.isFeaturedHero ? "Remove from Hero Carousel" : "Feature on Hero Carousel"}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border shadow-lg transition-all cursor-pointer ${
                            movie.isFeaturedHero
                              ? "bg-[#FF4C00]/90 text-white border-[#FF4C00]"
                              : "bg-black/70 text-zinc-400 border-white/10 hover:text-white"
                          }`}
                        >
                          <Flame className={`h-3.5 w-3.5 ${movie.isFeaturedHero ? "text-amber-300 animate-pulse" : ""}`} />
                          <span>{movie.isFeaturedHero ? "Hero" : "Hero Off"}</span>
                        </button>

                        {/* Visibility Pill */}
                        <button
                          type="button"
                          onClick={() => handleToggleHidden(movie)}
                          title={movie.isHidden ? "Publish to search" : "Hide from search"}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border shadow-lg transition-all cursor-pointer ${
                            movie.isHidden
                              ? "bg-rose-500/90 text-white border-rose-400"
                              : "bg-emerald-500/90 text-white border-emerald-400"
                          }`}
                        >
                          {movie.isHidden ? (
                            <>
                              <EyeOff className="h-3.5 w-3.5 text-white" />
                              <span>Hidden</span>
                            </>
                          ) : (
                            <>
                              <Eye className="h-3.5 w-3.5 text-white" />
                              <span>Published</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* BOTTOM OVERLAY CONTENT (SITTING ON TOP OF GRADIENT SHADER) */}
                    <div className="relative z-10 p-5 space-y-3 mt-auto">
                      {/* Movie Title */}
                      <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-[#FF4C00] transition-colors leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] line-clamp-1">
                        {movie.title}
                      </h3>

                      {/* Year & Rating Row */}
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                        <span className="font-mono text-zinc-200">{movie.year || 2026}</span>
                        <span className="inline-flex items-center gap-1 text-amber-400 bg-black/60 border border-amber-500/30 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {movie.rating ? movie.rating.toFixed(1) : "8.5"}
                        </span>
                      </div>

                      {/* Genre Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {(movie.genres || []).slice(0, 3).map((g) => (
                          <span key={g} className="text-[10px] font-bold text-zinc-300 bg-black/60 border border-white/15 px-2.5 py-0.5 rounded-lg backdrop-blur-md">
                            {g}
                          </span>
                        ))}
                      </div>

                      {/* Card Bottom Buttons Bar */}
                      <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                        <Link
                          href={`/movie/${movie.id}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-200 hover:text-white transition-colors bg-black/50 border border-white/15 px-3 py-1.5 rounded-xl backdrop-blur-md"
                        >
                          <span>View</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>

                        <div className="flex items-center gap-2">
                          {/* Edit Metadata Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(movie)}
                            title="Edit Metadata & Stream Links"
                            className="p-2 rounded-xl border border-white/15 bg-black/60 text-zinc-200 hover:border-[#FF4C00] hover:text-[#FF8A5C] transition-all backdrop-blur-md cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteMovie(movie)}
                            title="Delete Media"
                            className="p-2 rounded-xl border border-white/15 bg-black/60 text-zinc-400 hover:border-rose-500 hover:text-rose-400 transition-all backdrop-blur-md cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* PAGINATION CONTROLS (12 ITEMS PER PAGE) */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-800/80 pt-6 px-2">
                <span className="text-xs text-zinc-400 font-mono">
                  Showing Page <span className="text-white font-bold">{page}</span> of <span className="text-white font-bold">{totalPages}</span> ({totalResults} Total Titles • 12 Per Page)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-200 transition-all hover:border-[#FF4C00] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-200 transition-all hover:border-[#FF4C00] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* VIEW 3: CUSTOM COLLECTIONS & CATEGORIES TAB */}
        {activeTab === "collections" && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Custom Collections & Curated Playlists</h2>
                <p className="text-xs text-zinc-400">
                  Organize custom playlists like &quot;Editor&apos;s Picks&quot;, &quot;Top 10 This Week&quot;, and &quot;Trending Action Movies&quot;.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCollectionModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF4C00] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#FF4C00]/20 hover:bg-[#e04300] cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Create Collection
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((col) => (
                <div key={col.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                      {col.tag}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">{(col.movieIds || []).length} Titles</span>
                  </div>

                  <h3 className="text-base font-black text-white">{col.name}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2">{col.description}</p>

                  <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500">
                    <span>Created on Flixora Admin</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCollectionFilter(col.name);
                        setActiveTab("catalogue");
                      }}
                      className="text-[#FF4C00] font-bold hover:underline cursor-pointer"
                    >
                      View Items →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VIEW 4: AGE & MATURITY RATING MANAGER TAB */}
        {activeTab === "maturity" && (
          <section className="space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-cyan-400" />
                <span>Age & Content Maturity Rating Overview</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Assign content ratings (G, PG, PG-13, R, TV-MA) to ensure proper maturity filtering for viewers.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {MATURITY_OPTIONS.map((mat) => {
                const count = movies.filter(m => m.maturityRating === mat).length;
                return (
                  <button
                    key={mat}
                    onClick={() => {
                      setSelectedMaturity(mat);
                      setActiveTab("catalogue");
                    }}
                    className="p-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 hover:border-cyan-500/50 text-left transition-all group cursor-pointer"
                  >
                    <span className="text-xs font-mono font-bold text-cyan-400 block mb-1">{mat}</span>
                    <span className="text-xl font-black text-white">{count}</span>
                    <span className="text-[10px] text-zinc-500 block mt-1">Titles assigned</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

      </div>

      {/* MODAL 1: ADD / EDIT MEDIA METADATA & STREAM LINKS */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <Film className="h-5 w-5 text-[#FF4C00]" />
                <h3 className="text-lg font-black text-white">
                  {editingMovie ? `Edit Metadata: ${editingMovie.title}` : "Add Custom Media to Catalogue"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Movie or Show Title"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-[#FF4C00]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Media Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-[#FF4C00]"
                  >
                    <option value="Movie">Movie</option>
                    <option value="TV Series">TV Series</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Release Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2026 })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-[#FF4C00]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Content Maturity Rating</label>
                  <select
                    value={formData.maturityRating}
                    onChange={(e) => setFormData({ ...formData, maturityRating: e.target.value as MaturityRating })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-[#FF4C00]"
                  >
                    {MATURITY_OPTIONS.map((m) => (
                      <option key={m} value={m}>{m} Rating</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Genre Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.genres}
                  onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                  placeholder="Action, Sci-Fi, Drama"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-[#FF4C00]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Poster Image URL</label>
                  <input
                    type="url"
                    value={formData.posterUrl}
                    onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                    placeholder="https://image.tmdb.org/..."
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-[#FF4C00]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Backdrop Image URL</label>
                  <input
                    type="url"
                    value={formData.backdropUrl}
                    onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })}
                    placeholder="https://image.tmdb.org/..."
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-[#FF4C00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Video Stream Link (HLS/MP4)</label>
                  <input
                    type="url"
                    value={formData.streamUrl}
                    onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                    placeholder="https://stream.flixora.com/..."
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-[#FF4C00]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">YouTube Trailer Link</label>
                  <input
                    type="url"
                    value={formData.trailerUrl}
                    onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-[#FF4C00]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Synopsis / Overview</label>
                <textarea
                  rows={3}
                  value={formData.synopsis}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  placeholder="Overview of the movie storyline..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-xs text-white outline-none focus:border-[#FF4C00]"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={formData.isFeaturedHero}
                    onChange={(e) => setFormData({ ...formData, isFeaturedHero: e.target.checked })}
                    className="accent-[#FF4C00]"
                  />
                  <span>Feature in Homepage Hero Carousel</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-rose-400">
                  <input
                    type="checkbox"
                    checked={formData.isHidden}
                    onChange={(e) => setFormData({ ...formData, isHidden: e.target.checked })}
                    className="accent-rose-500"
                  />
                  <span>Hide from Public Search Results</span>
                </label>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FF4C00] text-white hover:bg-[#e04300] cursor-pointer"
                >
                  {actionLoading ? "Saving..." : editingMovie ? "Update Metadata" : "Add to Catalogue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE CUSTOM COLLECTION */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-black text-white">Create Custom Collection</h3>
              <button
                type="button"
                onClick={() => setIsCollectionModalOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCollectionSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Collection Name *</label>
                <input
                  type="text"
                  required
                  value={collectionFormData.name}
                  onChange={(e) => setCollectionFormData({ ...collectionFormData, name: e.target.value })}
                  placeholder="e.g. Editor's Picks, Top 10 This Week"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-[#FF4C00]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Tag / Category Label</label>
                <input
                  type="text"
                  value={collectionFormData.tag}
                  onChange={(e) => setCollectionFormData({ ...collectionFormData, tag: e.target.value })}
                  placeholder="Curated, Trending, Action"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-[#FF4C00]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={collectionFormData.description}
                  onChange={(e) => setCollectionFormData({ ...collectionFormData, description: e.target.value })}
                  placeholder="Collection details..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-xs text-white outline-none focus:border-[#FF4C00]"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCollectionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FF4C00] text-white hover:bg-[#e04300] cursor-pointer"
                >
                  {actionLoading ? "Creating..." : "Save Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}