'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  MoreVertical,
  Info,
  X,
  Film,
  Edit2,
  Save,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const PRESET_KIDS_AVATARS = [
  { id: 'tom', name: 'Tom', url: 'https://i.ibb.co/ZRCZZjZY/77a32760a782.png' },
  { id: 'jerry', name: 'Jerry', url: 'https://i.ibb.co/chCxgVC0/e7ba688df62e.png' },
  { id: 'spiderman', name: 'Spider-Man', url: 'https://i.ibb.co/Cs0Z14TD/857476df6e87.jpg' },
  { id: 'batman', name: 'Batman', url: 'https://i.ibb.co/fzQdvy33/c5005c8f408c.jpg' },
  { id: 'robot', name: 'Robot', url: 'https://i.ibb.co/99BwLZ1f/df4b1e66aac1.png' },
  { id: 'vector1', name: 'Star Hero', url: 'https://i.ibb.co/T94VNG1/feca82718a3f.png' },
  { id: 'vector2', name: 'Cool Kid', url: 'https://i.ibb.co/hRfpJsBz/77c8ff018f5a.png' },
  { id: 'vector3', name: 'Gamer', url: 'https://i.ibb.co/XxyLdGR6/3dc0753b83ec.png' },
];

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

  // Details Modal and Dropdown State
  const [selectedDetailProfile, setSelectedDetailProfile] = useState<AdminKidProfile | null>(null);
  const [menuState, setMenuState] = useState<{ kid: AdminKidProfile; top: number; right: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Edit Modal State
  const [editingProfile, setEditingProfile] = useState<AdminKidProfile | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editUsername, setEditUsername] = useState<string>('');
  const [editPin, setEditPin] = useState<string>('');
  const [editAvatar, setEditAvatar] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 8;

  const handleToggleMenu = (e: React.MouseEvent<HTMLButtonElement>, kid: AdminKidProfile) => {
    e.stopPropagation();
    if (menuState?.kid.id === kid.id) {
      setMenuState(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const menuHeight = 122; // Exact height of 3-item menu
    const spaceBelow = window.innerHeight - rect.bottom;

    // Flip upwards only if close to bottom of window viewport
    let top = rect.bottom + 4;
    if (spaceBelow < 130 && rect.top > menuHeight) {
      top = rect.top - menuHeight - 4;
    }

    setMenuState({
      kid,
      top: Math.max(8, top),
      right: Math.max(12, window.innerWidth - rect.right),
    });
  };

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

  const handleOpenEditModal = (kid: AdminKidProfile) => {
    setEditingProfile(kid);
    setEditName(kid.name);
    setEditUsername(kid.username.replace(/^@/, ''));
    setEditPin(kid.pin);
    setEditAvatar(kid.avatar);
    setMenuState(null);
  };

  const handleSaveAdminEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;
    if (!editName.trim()) {
      toast.error('Please enter a profile name');
      return;
    }
    if (!/^\d{4}$/.test(editPin.trim())) {
      toast.error('PIN must be a 4-digit numeric code');
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetch('/api/admin/kids', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProfile.id,
          name: editName.trim(),
          username: editUsername.trim(),
          pin: editPin.trim(),
          avatar: editAvatar,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Kids Profile "${editName.trim()}" updated successfully!`);
        setEditingProfile(null);
        if (selectedDetailProfile && selectedDetailProfile.id === editingProfile.id) {
          setSelectedDetailProfile({
            ...selectedDetailProfile,
            name: editName.trim(),
            username: editUsername.trim().startsWith('@') ? editUsername.trim() : `@${editUsername.trim()}`,
            pin: editPin.trim(),
            avatar: editAvatar,
          });
        }
        fetchProfiles();
      } else {
        toast.error(data.message || 'Failed to update Kids Profile');
      }
    } catch (err) {
      console.error('Error updating Kids Profile by Admin:', err);
      toast.error('Network error saving Kids Profile changes');
    } finally {
      setIsSaving(false);
    }
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
          <div className="rounded-2xl border border-[#1E1E1E] bg-[#101010]">
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
              <div className="overflow-x-auto pb-12">
                <table className="w-full min-w-[850px] text-left">
                  <thead>
                    <tr className="border-b border-[#1E1E1E] text-[11px] font-bold uppercase tracking-wider text-zinc-500 bg-[#0C0C0C]">
                      <th className="px-6 py-4">Kid Profile</th>
                      <th className="px-6 py-4">Parent Account</th>
                      <th className="px-6 py-4">Security PIN</th>
                      <th className="px-6 py-4">Restrictions</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProfiles.map((kid) => {
                      const isPinShown = !!revealedPins[kid.id];
                      const isMenuOpen = menuState?.kid.id === kid.id;
                      return (
                        <tr
                          key={kid.id}
                          className={`border-b border-[#181818] transition-colors hover:bg-[#141414] ${
                            isMenuOpen ? 'relative z-50' : 'relative z-1'
                          }`}
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

                          {/* RESTRICTIONS SUMMARY */}
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1.5">
                                <Film size={12} />
                                {kid.blockedMovieTitles.length} Blocked Titles
                              </span>
                              {kid.blockedGenres.length > 0 && (
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  {kid.blockedGenres.length} Categories
                                </span>
                              )}
                            </div>
                          </td>

                          {/* CREATED */}
                          <td className="px-6 py-5">
                            <span className="text-xs text-zinc-500 whitespace-nowrap">{kid.createdAt}</span>
                          </td>

                          {/* ACTIONS WITH THREE DOTS DROPDOWN & DETAILS BUTTON */}
                          <td className="px-6 py-5 text-right relative">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedDetailProfile(kid)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-bold text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white cursor-pointer"
                                title="View Details"
                              >
                                <Info size={14} className="text-[#FF4C00]" />
                                <span>Details</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => handleToggleMenu(e, kid)}
                                className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-all cursor-pointer"
                                title="More Options"
                              >
                                <MoreVertical size={15} />
                              </button>
                            </div>
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

      {/* KIDS PROFILE FULL DETAILS MODAL */}
      {selectedDetailProfile && mounted && createPortal(
        <div
          style={{ zIndex: 999999 }}
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-800 bg-[#0E0E0E] shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-900 p-6 bg-zinc-950/80 shrink-0">
              <div className="flex items-center gap-4">
                <img
                  src={selectedDetailProfile.avatar}
                  alt={selectedDetailProfile.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#FF4C00]/40 shadow-lg"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">{selectedDetailProfile.name}</h3>
                    <span className="text-xs font-mono font-bold text-[#FF4C00] bg-[#FF4C00]/10 border border-[#FF4C00]/20 px-2 py-0.5 rounded-md">
                      {selectedDetailProfile.username}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Parent: <strong className="text-white">{selectedDetailProfile.parentName}</strong> ({selectedDetailProfile.parentEmail})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDetailProfile(null)}
                className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-zinc-800">
              {/* Overview Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#141414] border border-zinc-800/80 rounded-2xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Security PIN</p>
                  <p className="text-base font-mono font-bold text-emerald-400 mt-1">{selectedDetailProfile.pin}</p>
                </div>
                <div className="bg-[#141414] border border-zinc-800/80 rounded-2xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Parent Subscription</p>
                  <p className="text-base font-bold text-amber-400 mt-1">{selectedDetailProfile.parentPlan} Plan</p>
                </div>
                <div className="bg-[#141414] border border-zinc-800/80 rounded-2xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Created Date</p>
                  <p className="text-xs font-semibold text-zinc-300 mt-1.5">{selectedDetailProfile.createdAt}</p>
                </div>
              </div>

              {/* Blocked Categories / Genres */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Ban size={14} className="text-[#FF4C00]" />
                  Blocked Categories / Genres ({selectedDetailProfile.blockedGenres?.length || 0})
                </h4>

                {(!selectedDetailProfile.blockedGenres || selectedDetailProfile.blockedGenres.length === 0) ? (
                  <p className="text-xs text-zinc-600 italic bg-[#141414] border border-zinc-900 rounded-xl p-3">
                    No category restrictions set for this profile.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedDetailProfile.blockedGenres.map((g) => (
                      <span
                        key={g}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Ban size={12} />
                        <span>{g}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Blocked Movies & Shows List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Film size={14} className="text-[#FF4C00]" />
                  Blocked Movies & Shows ({selectedDetailProfile.blockedMovieTitles?.length || 0})
                </h4>

                {(!selectedDetailProfile.blockedMovieTitles || selectedDetailProfile.blockedMovieTitles.length === 0) ? (
                  <p className="text-xs text-zinc-600 italic bg-[#141414] border border-zinc-900 rounded-xl p-3">
                    No specific movie titles blocked yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                    {selectedDetailProfile.blockedMovieTitles.map((title, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-[#141414] border border-zinc-800/80 text-zinc-200 text-xs font-bold"
                      >
                        <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center shrink-0">
                          <Film size={14} />
                        </div>
                        <span className="truncate">{title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-zinc-900 p-6 bg-zinc-950/80 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const kidToEdit = selectedDetailProfile;
                    setSelectedDetailProfile(null);
                    handleOpenEditModal(kidToEdit);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold transition-all cursor-pointer"
                >
                  <Edit2 size={14} />
                  <span>Edit Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const kidToDel = selectedDetailProfile;
                    setSelectedDetailProfile(null);
                    handleDeleteProfile(kidToDel.id, kidToDel.name);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold transition-all cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Delete Profile</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDetailProfile(null)}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ADMIN EDIT KIDS PROFILE MODAL */}
      {editingProfile && mounted && createPortal(
        <div
          style={{ zIndex: 999999 }}
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-800 bg-[#0E0E0E] shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-900 p-6 bg-zinc-950/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Edit2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    Admin Edit Kids Profile
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Modify profile name, security PIN, handle, and avatar icon.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingProfile(null)}
                className="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveAdminEdit} className="p-6 space-y-5">
              {/* Avatar Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Select Avatar Icon
                </label>
                <div className="grid grid-cols-4 gap-3 pt-1">
                  {PRESET_KIDS_AVATARS.map((av) => {
                    const isSelected = editAvatar === av.url;
                    return (
                      <div
                        key={av.id}
                        onClick={() => setEditAvatar(av.url)}
                        className={`relative rounded-2xl p-1 border cursor-pointer transition-all flex items-center justify-center ${
                          isSelected
                            ? 'border-2 border-[#FF4C00] scale-105 shadow-[0_0_12px_rgba(255,76,0,0.5)]'
                            : 'border-zinc-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={av.url}
                          alt={av.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        {isSelected && (
                          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF4C00] text-black flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Profile Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Kids Profile Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Alex, Junior, Sam"
                  className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs sm:text-sm text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none"
                  required
                />
              </div>

              {/* Username Handle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Username Handle
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#FF4C00] font-mono font-bold">
                    @
                  </span>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.replace(/^@/, ''))}
                    placeholder="alex_kids"
                    className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 pl-8 pr-4 text-xs sm:text-sm text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* 4-Digit Security PIN Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                  <span>Parent Security PIN Code (4 Digits)</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Current: {editPin}</span>
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={editPin}
                  onChange={(e) => setEditPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 0987"
                  className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs sm:text-sm text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none font-mono tracking-widest text-center"
                  required
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#FF4C00]/20"
                >
                  {isSaving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* PORTAL DROPDOWN MENU */}
      {menuState && mounted && createPortal(
        <>
          <div
            style={{ zIndex: 999998 }}
            className="fixed inset-0"
            onClick={() => setMenuState(null)}
          />
          <div
            style={{
              position: 'fixed',
              top: `${menuState.top}px`,
              right: `${menuState.right}px`,
              zIndex: 999999,
            }}
            className="w-48 rounded-xl border border-zinc-800 bg-[#121212] p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-left"
          >
            <button
              type="button"
              onClick={() => {
                setSelectedDetailProfile(menuState.kid);
                setMenuState(null);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <Info size={14} className="text-[#FF4C00]" />
              <span>View Full Details</span>
            </button>
            <button
              type="button"
              onClick={() => {
                handleOpenEditModal(menuState.kid);
                setMenuState(null);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <Edit2 size={14} className="text-amber-400" />
              <span>Edit Profile</span>
            </button>
            <div className="my-1 h-px bg-zinc-800" />
            <button
              type="button"
              onClick={() => {
                handleDeleteProfile(menuState.kid.id, menuState.kid.name);
                setMenuState(null);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={14} />
              <span>Delete Profile</span>
            </button>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

