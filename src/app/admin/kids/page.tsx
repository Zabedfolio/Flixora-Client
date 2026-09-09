'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  Shield,
  Search,
  Trash2,
  Lock,
  RefreshCw,
  Loader2,
  Users,
  Eye,
  EyeOff,
  Filter,
  Ban,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminKidProfile {
  id: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  parentPlan: string;
  name: string;
  username: string;
  pin: string;
  avatar: string;
  blockedGenres: string[];
  blockedMovieIds: string[];
  blockedMovieTitles: string[];
  createdAt: string;
}

export default function AdminKidsPage() {
  const [profiles, setProfiles] = useState<AdminKidProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 8;

  const fetchProfiles = async () => {
    try {
      const res = await fetch('/api/admin/kids');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.profiles)) {
          setProfiles(data.profiles);
        }
      } else {
        toast.error('Failed to load Kids Profiles from database');
      }
    } catch (err) {
      console.error('Error fetching admin kids profiles:', err);
      toast.error('Network error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSyncData = async () => {
    setIsRefreshing(true);
    await fetchProfiles();
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Live database Kids Profiles synchronized!');
    }, 400);
  };

  const togglePinVisibility = (id: string) => {
    setRevealedPins((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteProfile = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete Kids Profile "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    // Optimistic delete
    setProfiles((prev) => prev.filter((p) => p.id !== id));

    try {
      const res = await fetch(`/api/admin/kids?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Kids Profile "${name}" deleted from database!`);
      } else {
        toast.error(data.message || 'Failed to delete Kids Profile');
        fetchProfiles();
      }
    } catch (err) {
      console.error('Error deleting kids profile:', err);
      toast.error('Network error deleting profile');
      fetchProfiles();
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProfiles = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return profiles;
    return profiles.filter((p) => {
      return (
        p.name.toLowerCase().includes(query) ||
        p.username.toLowerCase().includes(query) ||
        p.parentName.toLowerCase().includes(query) ||
        p.parentEmail.toLowerCase().includes(query) ||
        p.blockedGenres.some((g) => g.toLowerCase().includes(query)) ||
        p.blockedMovieTitles.some((m) => m.toLowerCase().includes(query))
      );
    });
  }, [profiles, search]);

  // Stats calculation
  const totalProfilesCount = profiles.length;
  const uniqueParentsCount = new Set(profiles.map((p) => p.parentId)).size;
  const totalRestrictions = profiles.reduce(
    (acc, p) => acc + p.blockedGenres.length + p.blockedMovieTitles.length,
    0
  );

  // Pagination
  const totalPages = Math.max(Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE), 1);
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const currentProfiles = filteredProfiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans">
      <main className="min-w-0 flex-1">
        {/* HEADER */}
        <div className="border-b border-[#1A1A1A] bg-[#0A0A0A]">
          <div className="px-6 py-7 md:px-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Shield size={18} className="text-[#FF4C00]" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF4C00]">
                    Parental & Safety Management
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight md:text-3xl">
                  Kids Profiles Moderation
                </h1>
                <p className="mt-2 text-sm text-zinc-500">
                  Manage and monitor all Kids Mode profiles, security PINs, and restricted genres/titles across Flixora.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSyncData}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 rounded-xl border border-[#222222] bg-[#111111] px-4 py-3 text-xs font-bold text-zinc-300 transition-all hover:border-[#FF4C00]/40 hover:text-white disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw
                    size={15}
                    className={`text-[#FF4C00] ${isRefreshing ? 'animate-spin' : ''}`}
                  />
                  <span>Sync DB</span>
                </button>

                <div className="flex items-center gap-3 rounded-xl border border-[#222222] bg-[#111111] px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF4C00]/10">
                    <Shield size={18} className="text-[#FF4C00]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Total Kids
                    </p>
                    <p className="text-lg font-black">{totalProfilesCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="p-6 md:p-10">
          {/* STAT CARDS */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#1E1E1E] bg-[#101010] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-zinc-500">Total Kids Profiles</p>
                  <h2 className="mt-2 text-2xl font-black text-white">{totalProfilesCount}</h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF4C00]/10">
                  <Shield size={19} className="text-[#FF4C00]" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#1E1E1E] bg-[#101010] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-zinc-500">Active Parent Accounts</p>
                  <h2 className="mt-2 text-2xl font-black text-amber-400">{uniqueParentsCount}</h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                  <Users size={19} className="text-amber-400" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#1E1E1E] bg-[#101010] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-zinc-500">Total Restrictions Enforced</p>
                  <h2 className="mt-2 text-2xl font-black text-purple-400">{totalRestrictions}</h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                  <Ban size={19} className="text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="overflow-hidden rounded-2xl border border-[#1E1E1E] bg-[#101010]">
            {/* SEARCH HEADER */}
            <div className="border-b border-[#1E1E1E] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-[360px]">
                  <Search
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by kid handle, parent email, genre, title..."
                    className="h-11 w-full rounded-xl border border-[#242424] bg-[#080808] pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-[#FF4C00]/60"
                  />
                </div>
                <p className="text-xs text-zinc-500">
                  Showing <span className="font-bold text-white">{filteredProfiles.length}</span> profile(s)
                </p>
              </div>
            </div>

            {/* MAIN CONTENT / TABLE */}
            {loading ? (
              <div className="py-24 text-center">
                <Loader2 size={32} className="mx-auto animate-spin text-[#FF4C00] mb-3" />
                <p className="text-xs font-mono text-zinc-500">Fetching live Kids Profiles from MongoDB...</p>
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="py-20 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#181818]">
                  <ShieldAlert size={24} className="text-zinc-600" />
                </div>
                <h3 className="text-sm font-bold text-white">No Kids Profiles Found</h3>
                <p className="mt-1 text-xs text-zinc-600">
                  {search ? 'Try clearing your search query.' : 'No users have created a Kids Profile yet.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] text-left">
                  <thead>
                    <tr className="border-b border-[#1E1E1E] text-[11px] font-bold uppercase tracking-wider text-zinc-500 bg-[#0C0C0C]">
                      <th className="px-6 py-4">Kid Profile</th>
                      <th className="px-6 py-4">Parent Account</th>
                      <th className="px-6 py-4">Security PIN</th>
                      <th className="px-6 py-4">Blocked Genres</th>
                      <th className="px-6 py-4">Blocked Movies</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProfiles.map((kid) => {
                      const isPinShown = !!revealedPins[kid.id];
                      return (
                        <tr
                          key={kid.id}
                          className="border-b border-[#181818] transition-colors hover:bg-[#141414]"
                        >
                          {/* KID PROFILE */}
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <img
                                src={kid.avatar}
                                alt={kid.name}
                                className="h-10 w-10 rounded-full border border-[#FF4C00]/30 object-cover bg-zinc-900 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-black text-white truncate">{kid.name}</p>
                                <p className="text-[11px] font-mono text-[#FF4C00] truncate">{kid.username}</p>
                              </div>
                            </div>
                          </td>

                          {/* PARENT ACCOUNT */}
                          <td className="px-6 py-5">
                            <div>
                              <p className="text-xs font-bold text-white">{kid.parentName}</p>
                              <p className="text-[11px] text-zinc-500">{kid.parentEmail}</p>
                              <span className="mt-1 inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-400">
                                {kid.parentPlan} Plan
                              </span>
                            </div>
                          </td>

                          {/* SECURITY PIN */}
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold tracking-wider bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-md text-emerald-400">
                                {isPinShown ? kid.pin : '••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => togglePinVisibility(kid.id)}
                                className="p-1 rounded text-zinc-500 hover:text-white transition-colors cursor-pointer"
                                title={isPinShown ? 'Hide PIN' : 'Show PIN'}
                              >
                                {isPinShown ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                            </div>
                          </td>

                          {/* BLOCKED GENRES */}
                          <td className="px-6 py-5">
                            {kid.blockedGenres.length === 0 ? (
                              <span className="text-[11px] text-zinc-600 font-mono">None</span>
                            ) : (
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {kid.blockedGenres.map((g) => (
                                  <span
                                    key={g}
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"
                                  >
                                    {g}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* BLOCKED MOVIES */}
                          <td className="px-6 py-5">
                            {kid.blockedMovieTitles.length === 0 ? (
                              <span className="text-[11px] text-zinc-600 font-mono">None</span>
                            ) : (
                              <div className="flex flex-wrap gap-1 max-w-[220px]">
                                {kid.blockedMovieTitles.map((t) => (
                                  <span
                                    key={t}
                                    className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 truncate max-w-[140px]"
                                    title={t}
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* CREATED */}
                          <td className="px-6 py-5">
                            <span className="text-xs text-zinc-500 whitespace-nowrap">{kid.createdAt}</span>
                          </td>

                          {/* ACTIONS */}
                          <td className="px-6 py-5 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteProfile(kid.id, kid.name)}
                              disabled={deletingId === kid.id}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 transition-all hover:bg-red-500 hover:text-white disabled:opacity-50 cursor-pointer"
                              title="Delete Kids Profile"
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* PAGINATION */}
            {!loading && filteredProfiles.length > 0 && (
              <div className="flex items-center justify-between border-t border-[#1E1E1E] px-6 py-4">
                <p className="text-xs text-zinc-600">
                  Showing{' '}
                  <span className="font-bold text-zinc-400">{startIndex + 1}</span> -{' '}
                  <span className="font-bold text-zinc-400">
                    {Math.min(startIndex + ITEMS_PER_PAGE, filteredProfiles.length)}
                  </span>{' '}
                  of <span className="font-bold text-zinc-400">{filteredProfiles.length}</span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={safeCurrentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#242424] bg-[#181818] text-zinc-400 transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="px-3 text-xs font-bold text-zinc-400">
                    {safeCurrentPage} / {totalPages}
                  </div>
                  <button
                    type="button"
                    disabled={safeCurrentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#242424] bg-[#181818] text-zinc-400 transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
