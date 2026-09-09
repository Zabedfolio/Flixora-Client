"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Shield,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Search,
  Check,
  X,
  Sparkles,
  AlertCircle,
  Crown,
  Eye,
  EyeOff,
  Film,
  Tv,
  Loader2,
  CheckCircle2,
  Ban,
  UserCheck,
  RefreshCw,
  Zap,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useKidsStore, KidsProfile } from "@/lib/store/kidsStore";

const PRESET_KIDS_AVATARS = [
  { id: "tom", name: "Tom", url: "https://i.ibb.co/ZRCZZjZY/77a32760a782.png" },
  { id: "jerry", name: "Jerry", url: "https://i.ibb.co/chCxgVC0/e7ba688df62e.png" },
  { id: "spiderman", name: "Spider-Man", url: "https://i.ibb.co/Cs0Z14TD/857476df6e87.jpg" },
  { id: "batman", name: "Batman", url: "https://i.ibb.co/fzQdvy33/c5005c8f408c.jpg" },
  { id: "robot", name: "Robot", url: "https://i.ibb.co/99BwLZ1f/df4b1e66aac1.png" },
  { id: "vector1", name: "Star Hero", url: "https://i.ibb.co/T94VNG1/feca82718a3f.png" },
  { id: "vector2", name: "Cool Kid", url: "https://i.ibb.co/hRfpJsBz/77c8ff018f5a.png" },
  { id: "vector3", name: "Gamer", url: "https://i.ibb.co/XxyLdGR6/3dc0753b83ec.png" },
];

const GENRE_CATEGORIES = [
  { id: "all_movies", label: "Block All Movies", icon: "🎬", desc: "Restrict all feature films" },
  { id: "all_anime", label: "Block All Anime", icon: "⛩️", desc: "Restrict all anime shows & films" },
  { id: "Horror", label: "Horror & Gore", icon: "👻", desc: "Block scary or horror titles" },
  { id: "Thriller", label: "Thriller & Crime", icon: "🔪", desc: "Block intense psychological or crime thrillers" },
  { id: "Action", label: "Action & Violence", icon: "💥", desc: "Block heavy combat action movies" },
  { id: "Romance", label: "Romance & Mature", icon: "❤️", desc: "Block romantic and mature themes" },
];

export default function KidsControlPage() {
  const [profiles, setProfiles] = useState<KidsProfile[]>([]);
  const [planInfo, setPlanInfo] = useState<{
    name: string;
    currentCount: number;
    maxAllowed: number;
    canCreateMore: boolean;
    hasPaidPlan: boolean;
  }>({
    name: "Free",
    currentCount: 0,
    maxAllowed: 0,
    canCreateMore: false,
    hasPaidPlan: false,
  });
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [pinInput, setPinInput] = useState("1234");
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_KIDS_AVATARS[0].url);
  const [submitting, setSubmitting] = useState(false);

  // Movie Block Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const { enterKidsMode, isKidsMode, activeKidsProfile } = useKidsStore();

  const fetchKidsData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/kids");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setProfiles(data.profiles || []);
          if (data.planInfo) setPlanInfo(data.planInfo);
          if (data.profiles && data.profiles.length > 0 && !selectedProfileId) {
            setSelectedProfileId(data.profiles[0]._id);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load kids data:", err);
      toast.error("Failed to load Kids Profiles");
    } finally {
      setLoading(false);
    }
  }, [selectedProfileId]);

  useEffect(() => {
    fetchKidsData();
  }, [fetchKidsData]);

  // Open modal for creating new Kids Profile
  const handleOpenAddModal = () => {
    if (!planInfo.hasPaidPlan) {
      toast.error("You need an active subscription plan (Basic, Standard, or Premium) to create Kids Profiles.");
      return;
    }
    if (!planInfo.canCreateMore) {
      toast.error(`Your ${planInfo.name} plan allows a maximum of ${planInfo.maxAllowed} Kids Profile(s). Please upgrade your plan.`);
      return;
    }
    setEditingProfileId(null);
    setNameInput("");
    setUsernameInput("");
    setPinInput("1234");
    setSelectedAvatar(PRESET_KIDS_AVATARS[0].url);
    setIsAddModalOpen(true);
  };

  // Open modal for editing existing Kids Profile
  const handleOpenEditModal = (p: KidsProfile) => {
    setEditingProfileId(p._id);
    setNameInput(p.name);
    setUsernameInput(p.username.replace(/^@/, ''));
    setPinInput(p.pin);
    setSelectedAvatar(p.avatar);
    setIsAddModalOpen(true);
  };

  // Create or Update Kids Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      toast.error("Please enter a name for the Kids Profile");
      return;
    }
    if (!/^\d{4}$/.test(pinInput.trim())) {
      toast.error("PIN must be a 4-digit code");
      return;
    }

    try {
      setSubmitting(true);
      const endpoint = "/api/kids";
      const method = editingProfileId ? "PATCH" : "POST";
      const payload: any = {
        name: nameInput.trim(),
        username: usernameInput.trim(),
        pin: pinInput.trim(),
        avatar: selectedAvatar,
      };

      if (editingProfileId) {
        payload.id = editingProfileId;
      }

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(editingProfileId ? "Kids Profile updated!" : "Kids Profile created successfully!");
        setIsAddModalOpen(false);
        fetchKidsData();
      } else {
        toast.error(data.message || "Failed to save Kids Profile");
      }
    } catch (err) {
      toast.error("Error saving Kids Profile");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Kids Profile
  const handleDeleteProfile = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the Kids Profile "${name}"?`)) return;

    try {
      const res = await fetch(`/api/kids?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Kids Profile "${name}" deleted.`);
        fetchKidsData();
      } else {
        toast.error(data.message || "Failed to delete Kids Profile");
      }
    } catch (err) {
      toast.error("Network error deleting Kids Profile");
    }
  };

  // Toggle Genre Block
  const handleToggleGenre = async (profileId: string, genreId: string) => {
    const targetProfile = profiles.find((p) => p._id === profileId);
    if (!targetProfile) return;

    const currentBlocked = targetProfile.blockedGenres || [];
    const isBlocked = currentBlocked.includes(genreId);
    const newBlocked = isBlocked
      ? currentBlocked.filter((g) => g !== genreId)
      : [...currentBlocked, genreId];

    // Optimistic UI update
    setProfiles((prev) =>
      prev.map((p) => (p._id === profileId ? { ...p, blockedGenres: newBlocked } : p))
    );

    try {
      const res = await fetch("/api/kids", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: profileId,
          blockedGenres: newBlocked,
        }),
      });
      if (!res.ok) fetchKidsData();
      else toast.success(isBlocked ? `Unblocked category for ${targetProfile.name}` : `Blocked category for ${targetProfile.name}`);
    } catch {
      fetchKidsData();
    }
  };

  // Search Movies for Blocking
  const handleSearchMovies = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const apiKey = "5e2a3ee409a77e9a41a9f41b2a05735e";
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.results) {
          setSearchResults(data.results.slice(0, 6));
        }
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearching(false);
    }
  };

  // Toggle Movie Block directly via API
  const handleToggleMovieBlock = async (movie: any, action: "block" | "unblock") => {
    if (!selectedProfileId && profiles.length === 0) {
      toast.error("Please create a Kids Profile first!");
      return;
    }

    try {
      const res = await fetch("/api/kids/block-movie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: String(movie.id || movie.movieId),
          movieTitle: movie.title || movie.name || movie.movieTitle,
          action,
          kidsProfileId: selectedProfileId || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
        fetchKidsData();
      } else {
        toast.error(data.message || "Failed to update block status");
      }
    } catch {
      toast.error("Error updating content block");
    }
  };

  const activeProfile = profiles.find((p) => p._id === selectedProfileId) || profiles[0];

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-900 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/20 text-[#FF4C00] text-xs font-black uppercase tracking-widest">
                <Shield size={14} />
                <span>Parental Control Center</span>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Kids Mode & Content Restriction
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl font-medium">
              Create Kids Profiles, set 4-digit security PINs, and customize restricted genres or specific movie blocks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchKidsData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 transition-all cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-[#FF4C00]" : ""} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all shadow-lg shadow-[#FF4C00]/20 cursor-pointer select-none"
            >
              <Plus size={16} />
              <span>Add Kids Profile</span>
            </button>
          </div>
        </div>

        {/* ================= PLAN LIMIT BANNER ================= */}
        <div className="rounded-3xl border border-zinc-850 bg-gradient-to-r from-zinc-950 via-[#101010] to-zinc-950 p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF4C00]/10 border border-[#FF4C00]/20 flex items-center justify-center text-[#FF4C00] shrink-0">
              <Crown size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black uppercase tracking-wide text-white">
                  {planInfo.name} Plan Membership
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FF4C00]/10 text-[#FF4C00] border border-[#FF4C00]/30">
                  {planInfo.hasPaidPlan ? "Active Quota" : "Free Plan"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                {planInfo.hasPaidPlan ? (
                  <>
                    Kids Profiles Used: <strong className="text-white">{planInfo.currentCount}</strong> /{" "}
                    <strong className="text-[#FF4C00]">{planInfo.maxAllowed === 99 ? "Unlimited" : planInfo.maxAllowed}</strong>
                  </>
                ) : (
                  "Upgrade your plan to unlock Kids Profiles and Parental Content Control features."
                )}
              </p>
            </div>
          </div>

          {!planInfo.hasPaidPlan || !planInfo.canCreateMore ? (
            <Link
              href="/dashboard/subscription"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4C00] to-amber-500 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-transform shrink-0"
            >
              <Zap size={15} />
              <span>Upgrade Subscription Plan</span>
            </Link>
          ) : null}
        </div>

        {/* ================= KIDS PROFILES GRID ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black uppercase tracking-wide flex items-center gap-2 text-white">
              <UserCheck size={18} className="text-[#FF4C00]" />
              Active Kids Profiles ({profiles.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 size={32} className="animate-spin text-[#FF4C00]" />
              <span className="text-xs font-mono text-zinc-500">Loading Kids Profiles...</span>
            </div>
          ) : profiles.length === 0 ? (
            <div className="bg-[#0A0A0A] border border-dashed border-zinc-800 rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                <Shield size={28} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                No Kids Profiles Created Yet
              </h3>
              <p className="text-xs text-zinc-500 max-w-md">
                Click "+ Add Kids Profile" to create a child profile with custom PIN and title restrictions.
              </p>
              <button
                onClick={handleOpenAddModal}
                className="mt-2 flex items-center gap-2 bg-[#FF4C00]/10 hover:bg-[#FF4C00] text-[#FF4C00] hover:text-black border border-[#FF4C00]/30 font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Create Kids Profile</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((p) => {
                const isCurrentActive = isKidsMode && activeKidsProfile?._id === p._id;
                const isSelected = selectedProfileId === p._id;

                return (
                  <div
                    key={p._id}
                    onClick={() => setSelectedProfileId(p._id)}
                    className={`relative rounded-3xl border p-6 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-[#FF4C00] bg-[#0E0E0E] shadow-[0_0_20px_rgba(255,76,0,0.15)]"
                        : "border-zinc-850 bg-[#0A0A0A] hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-[#FF4C00]/40 shadow-md"
                        />
                        <div>
                          <h3 className="text-base font-black text-white">{p.name}</h3>
                          <p className="text-xs text-[#FF4C00] font-mono font-semibold">{p.username}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(p);
                          }}
                          className="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                          title="Edit Profile"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProfile(p._id, p.name);
                          }}
                          className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-400 transition-colors"
                          title="Delete Profile"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-3 border-t border-zinc-900">
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>Security PIN Code:</span>
                        <span className="font-mono font-bold text-white bg-zinc-900 px-2.5 py-0.5 rounded border border-zinc-800">
                          •••• ({p.pin})
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>Blocked Categories:</span>
                        <span className="font-bold text-[#FF4C00]">
                          {(p.blockedGenres || []).length} Categories
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>Blocked Movies:</span>
                        <span className="font-bold text-[#FF4C00]">
                          {(p.blockedMovieIds || []).length} Titles
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-zinc-900 flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          enterKidsMode(p);
                          toast.success(`Switched to Kids Mode for ${p.name}!`);
                        }}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                          isCurrentActive
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-[#FF4C00]/10 hover:bg-[#FF4C00] text-[#FF4C00] hover:text-black border border-[#FF4C00]/30"
                        }`}
                      >
                        <Shield size={14} />
                        <span>{isCurrentActive ? "Active Kids Mode" : `Switch to ${p.name} Mode`}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= CONTENT RESTRICTION CONTROLS ================= */}
        {activeProfile && (
          <div className="space-y-8 pt-4">
            
            {/* Category Toggles */}
            <div className="rounded-3xl border border-zinc-850 bg-[#0C0C0C] p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wide text-white flex items-center gap-2">
                    <Ban size={18} className="text-[#FF4C00]" />
                    Category Restrictions for <span className="text-[#FF4C00]">{activeProfile.name}</span>
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Toggle category blocks to automatically filter out genres from {activeProfile.name}'s feed.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {GENRE_CATEGORIES.map((cat) => {
                  const isBlocked = (activeProfile.blockedGenres || []).includes(cat.id);

                  return (
                    <div
                      key={cat.id}
                      onClick={() => handleToggleGenre(activeProfile._id, cat.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isBlocked
                          ? "bg-red-500/10 border-red-500/40 text-red-400"
                          : "bg-[#121212] border-zinc-850 hover:border-zinc-700 text-zinc-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cat.icon}</span>
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-white">
                            {cat.label}
                          </h4>
                          <p className="text-[10px] text-zinc-500 mt-0.5">{cat.desc}</p>
                        </div>
                      </div>

                      <div
                        className={`w-10 h-6 rounded-full transition-colors p-1 flex items-center ${
                          isBlocked ? "bg-red-500 justify-end" : "bg-zinc-800 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Specific Movie Block Search */}
            <div className="rounded-3xl border border-zinc-850 bg-[#0C0C0C] p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wide text-white flex items-center gap-2">
                    <Search size={18} className="text-[#FF4C00]" />
                    Block Specific Movies or Shows
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Search any film or series title to block it specifically for {activeProfile.name}.
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-xl">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchMovies(e.target.value)}
                  placeholder="Search movie or anime title to block (e.g. Deadpool, Joker, Attack on Titan)..."
                  className="w-full h-12 rounded-2xl border border-zinc-800 bg-zinc-950 pl-12 pr-4 text-xs sm:text-sm text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none transition-colors"
                />
              </div>

              {/* Search Results Grid */}
              {searchResults.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {searchResults.map((item) => {
                    const titleStr = item.title || item.name || "Untitled";
                    const isBlocked = (activeProfile.blockedMovieIds || []).includes(String(item.id));

                    return (
                      <div
                        key={item.id}
                        className="bg-[#121212] border border-zinc-850 rounded-2xl p-3 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {item.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                              alt={titleStr}
                              className="w-10 h-14 rounded-lg object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-14 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0 text-zinc-600">
                              <Film size={18} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{titleStr}</p>
                            <p className="text-[10px] text-zinc-500 uppercase">{item.media_type || "Movie"}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleMovieBlock(item, isBlocked ? "unblock" : "block")}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0 transition-all ${
                            isBlocked
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black"
                              : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white"
                          }`}
                        >
                          {isBlocked ? "Unblock" : "Block Title"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Blocked Titles List */}
              <div className="pt-4 border-t border-zinc-900 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Currently Blocked Movies ({activeProfile.blockedMovieTitles?.length || 0})
                </h4>

                {(!activeProfile.blockedMovieTitles || activeProfile.blockedMovieTitles.length === 0) ? (
                  <p className="text-xs text-zinc-600 italic">No specific movies blocked yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {activeProfile.blockedMovieTitles.map((title, idx) => {
                      const movieId = activeProfile.blockedMovieIds[idx] || title;

                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold"
                        >
                          <span>{title}</span>
                          <button
                            onClick={() =>
                              handleToggleMovieBlock(
                                { id: movieId, title },
                                "unblock"
                              )
                            }
                            className="text-red-400 hover:text-white transition-colors"
                            title="Unblock Title"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ================= ADD/EDIT PROFILE MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md animate-in fade-in"
          />

          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-800 bg-[#0E0E0E] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-850 p-6 bg-zinc-950/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF4C00]/10 border border-[#FF4C00]/20 flex items-center justify-center text-[#FF4C00]">
                  <Shield size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-wider text-white">
                    {editingProfileId ? "Edit Kids Profile" : "Create Kids Profile"}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Set Kids Profile credentials & PIN code
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
              {/* Avatar Picker */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-300">
                  Select Avatar
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {PRESET_KIDS_AVATARS.map((av) => (
                    <img
                      key={av.id}
                      src={av.url}
                      alt={av.name}
                      onClick={() => setSelectedAvatar(av.url)}
                      className={`w-12 h-12 rounded-2xl object-cover cursor-pointer transition-transform shrink-0 ${
                        selectedAvatar === av.url
                          ? "border-2 border-[#FF4C00] scale-110 shadow-[0_0_12px_rgba(255,76,0,0.5)]"
                          : "border border-zinc-800 opacity-60 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-300">
                  Kids Profile Name
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Alex"
                  required
                  className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs sm:text-sm text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none"
                />
              </div>

              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-300">
                  Username Handle
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono">@</span>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="alex_kids"
                    className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 pl-8 pr-4 text-xs sm:text-sm text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* PIN Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-300">
                  4-Digit Parental PIN Code
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="1234"
                  required
                  className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs sm:text-sm text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none font-mono tracking-widest text-center"
                />
                <p className="text-[10px] text-zinc-500">
                  This 4-digit PIN will be required to exit Kids Mode back to Parent Mode.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-850">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider transition-all hover:scale-[1.02] shadow-lg shadow-[#FF4C00]/20 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>{editingProfileId ? "Update Profile" : "Create Profile"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
