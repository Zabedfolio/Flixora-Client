'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  FaHome,
  FaCompass,
  FaFire,
  FaBookmark,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaShieldAlt,
} from 'react-icons/fa';
import SearchBar from './SearchBar';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';
import MyListModal from './MyListModal';
import { getWatchlistCount } from '@/data/watchlistStore';
import { authClient } from '@/app/(auth)/lib/auth-client';
import { useKidsStore } from '@/lib/store/kidsStore';
import { Shield, Sparkles, Lock, LogOut, Settings, LayoutDashboard } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: FaHome,
    path: '/',
  },
  {
    id: 'explore',
    label: 'Explore',
    icon: FaCompass,
    path: '/explore',
  },
  {
    id: 'trending',
    label: 'Trending',
    icon: FaFire,
    path: '/trending',
  },
  {
    id: 'mylist',
    label: 'My List',
    icon: FaBookmark,
    path: '/my-list',
  },
];

interface NavbarProps {
  myListCount?: number;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  logoSrc?: string;
  profileAvatarSrc?: string;
}

export default function Navbar({
  myListCount = 0,
  activeTab = '',
  onTabChange,
  logoSrc = '/logo.png',
  profileAvatarSrc = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMyListModalOpen, setIsMyListModalOpen] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);

  // Exit Kids Mode PIN Modal state
  const [isExitPinModalOpen, setIsExitPinModalOpen] = useState(false);
  const [exitPinInput, setExitPinInput] = useState('');

  const { isKidsMode, activeKidsProfile, exitKidsMode } = useKidsStore();

  const [liveProfile, setLiveProfile] = useState<{
    id: string;
    name: string;
    email: string;
    image?: string;
    avatarId?: string;
    role: string;
    plan: string;
    planId?: string;
  } | null>(null);

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const fetchLiveProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setLiveProfile(data.user);
          }
        }
      } catch (err) {
        console.error('Failed to fetch live profile in navbar:', err);
      }
    };
    fetchLiveProfile();
  }, [session]);

  useEffect(() => {
    const updateCount = () => {
      setWatchlistCount(getWatchlistCount());
    };

    updateCount();
    window.addEventListener('watchlist-updated', updateCount);
    return () => {
      window.removeEventListener('watchlist-updated', updateCount);
    };
  }, []);

  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Resolve current active tab from route pathname if activeTab prop is empty
  const currentActiveTab = activeTab || (
    pathname === '/' ? 'home' :
      pathname === '/trending' ? 'trending' :
        pathname === '/explore' ? 'explore' :
          pathname === '/my-list' ? 'mylist' : ''
  );

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu with navigation
  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }

    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const handleExitKidsModeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exitPinInput || !/^\d{4}$/.test(exitPinInput.trim())) {
      toast.error('Please enter a valid 4-digit PIN');
      return;
    }

    const success = exitKidsMode(exitPinInput.trim());
    if (success) {
      toast.success('Exited Kids Mode successfully!');
      setIsExitPinModalOpen(false);
      setExitPinInput('');
      setIsProfileDropdownOpen(false);
    } else {
      toast.error('Incorrect 4-digit Security PIN');
    }
  };

  // Hide Navbar on authentication, dashboard, and admin routes
  if (pathname?.startsWith('/auth') || pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
    return null;
  }

  // Display details for logged in user or Kids Profile
  const displayAvatar = isKidsMode
    ? activeKidsProfile?.avatar || 'https://i.ibb.co/ZRCZZjZY/77a32760a782.png'
    : (liveProfile?.image || session?.user?.image || '');

  const displayName = isKidsMode
    ? activeKidsProfile?.name || 'Kids Profile'
    : (liveProfile?.name || session?.user?.name || 'User');

  const displaySub = isKidsMode
    ? (activeKidsProfile?.username || '@kids_mode')
    : (liveProfile?.email || session?.user?.email || '');

  const isAuthenticated = !!session || isKidsMode;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-black/65 backdrop-blur-md border-b border-[#1A1A1A]/80 px-4 sm:px-6 lg:px-8 select-none transition-colors duration-300">
        <nav className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4 w-full">
          {/* LEFT SECTION */}
          <div className="flex items-center gap-4 lg:gap-8 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-2 lg:gap-3 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00] rounded"
            >
              <Image
                width={150}
                height={150}
                src={logoSrc}
                alt="Flixora"
                className="h-9 sm:h-10 w-auto object-contain"
              />
              {isKidsMode && (
                <span className="hidden sm:inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                  <Shield size={11} className="text-amber-400" />
                  Kids
                </span>
              )}
            </Link>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-6">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = currentActiveTab === item.id;
                const isMyList = item.id === 'mylist';

                const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (isMyList) {
                    e.preventDefault();
                    setIsMyListModalOpen(true);
                  } else {
                    handleTabClick(item.id);
                  }
                };

                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    onClick={handleClick}
                    className={`flex items-center gap-2 text-sm font-semibold tracking-wide transition-all duration-200 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00] rounded ${
                      isActive ? 'text-[#FF4C00]' : 'text-[#E5E5E5] hover:text-[#FF4C00]'
                    }`}
                  >
                    <Icon className="text-base shrink-0" />
                    <span>{item.label}</span>

                    {item.id === 'mylist' && (
                      <span className="bg-[#FF4C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-md">
                        {watchlistCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end max-w-full">
            <div className="flex items-center justify-end flex-1 max-w-full">
              <SearchBar />
            </div>

            {/* PROFILE DROPDOWN */}
            {isPending && !isKidsMode ? (
              <div className="w-8 h-8 rounded-full bg-zinc-900 animate-pulse hidden md:block" />
            ) : isAuthenticated ? (
              <div className="relative hidden md:block" ref={profileRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none group cursor-pointer"
                  aria-label="Profile"
                  aria-expanded={isProfileDropdownOpen}
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full overflow-hidden border transition-transform group-hover:scale-105 bg-zinc-950 flex items-center justify-center font-bold text-white text-xs ${
                      isKidsMode ? 'border-amber-400 ring-2 ring-amber-500/20' : 'border-[#FF4C00]'
                    }`}
                  >
                    {displayAvatar ? (
                      <Image
                        width={36}
                        height={36}
                        src={displayAvatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      displayName.charAt(0).toUpperCase()
                    )}
                  </div>

                  <FaChevronDown className="text-[10px] text-[#E5E5E5] group-hover:text-white transition-colors hidden sm:inline" />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-[#0E0E0E] border border-[#222222] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in duration-100">
                    <div className="px-3.5 py-2.5 border-b border-[#1A1A1A] mb-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-white truncate">{displayName}</p>
                        {isKidsMode && (
                          <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                            Kids
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-500 truncate mt-0.5 font-mono">{displaySub}</p>
                    </div>

                    {isKidsMode ? (
                      <>
                        <Link
                          href="/dashboard/kids-control"
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-zinc-300 hover:bg-[#1A1A1A] hover:text-amber-400 transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <Shield size={14} className="text-amber-400" />
                          <span>Kids Control Panel</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            setIsExitPinModalOpen(true);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                        >
                          <Lock size={14} />
                          <span>Exit Kids Mode</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/dashboard/setting"
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-[#E5E5E5] hover:bg-[#1A1A1A] hover:text-[#FF4C00] transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <Settings size={14} />
                          <span>Profile Settings</span>
                        </Link>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-[#E5E5E5] hover:bg-[#1A1A1A] hover:text-[#FF4C00] transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <LayoutDashboard size={14} />
                          <span>Dashboard</span>
                        </Link>
                      </>
                    )}

                    <div className="h-px bg-[#1A1A1A] my-1" />

                    <button
                      onClick={async () => {
                        setIsProfileDropdownOpen(false);
                        if (isKidsMode) {
                          useKidsStore.getState().setActiveKidsProfile(null);
                        }
                        await authClient.signOut({
                          callbackURL: '/auth/login',
                        });
                        toast.success('Logged out successfully!');
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden md:inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#FF4C00] hover:bg-[#e04300] text-white shadow-md shadow-[#FF4C00]/10 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Login
              </Link>
            )}

            {/* HAMBURGER BUTTON FOR MOBILE */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[#E5E5E5] hover:text-[#FF4C00] transition-colors outline-none rounded-full flex items-center justify-center cursor-pointer"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="text-[#FF4C00] text-xl" />
                ) : (
                  <FaBars className="text-xl" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-[280px] max-w-[85vw] h-full bg-black border-l border-[#1A1A1A] p-6 pt-20 flex flex-col gap-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 border-b border-[#1A1A1A] pb-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[#FF4C00] shrink-0 bg-zinc-950 flex items-center justify-center font-bold text-white">
                      {displayAvatar ? (
                        <Image
                          width={40}
                          height={40}
                          src={displayAvatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        displayName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white text-sm font-bold truncate">{displayName}</span>
                      <span className="text-zinc-550 text-[9px] font-bold uppercase tracking-wider truncate font-mono">
                        {displaySub}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    {isKidsMode ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsExitPinModalOpen(true);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm rounded-lg text-amber-400 hover:bg-amber-500/10 transition-colors font-bold"
                        >
                          Exit Kids Mode
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/profile"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full text-left px-4 py-2.5 text-sm rounded-lg text-[#E5E5E5] hover:bg-[#1A1A1A] hover:text-[#FF4C00] transition-colors"
                        >
                          Profile
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full text-left px-4 py-2.5 text-sm rounded-lg text-[#E5E5E5] hover:bg-[#1A1A1A] hover:text-[#FF4C00] transition-colors"
                        >
                          Dashboard
                        </Link>
                      </>
                    )}
                    <div className="h-px bg-[#1A1A1A] my-1" />
                    <button
                      onClick={async () => {
                        setIsMobileMenuOpen(false);
                        if (isKidsMode) {
                          useKidsStore.getState().setActiveKidsProfile(null);
                        }
                        await authClient.signOut({
                          callbackURL: '/auth/login',
                        });
                        toast.success('Logged out successfully!');
                      }}
                      className="block w-full text-left px-4 py-2.5 text-sm rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-4 py-2 flex flex-col gap-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[#FF4C00] hover:bg-[#e04300] text-white shadow-md shadow-[#FF4C00]/10 transition-colors duration-200"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>

            <div className="h-px bg-[#1A1A1A] w-full" />

            <div className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = currentActiveTab === item.id;
                const isMyList = item.id === 'mylist';

                const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (isMyList) {
                    e.preventDefault();
                    setIsMyListModalOpen(true);
                    setIsMobileMenuOpen(false);
                  } else {
                    handleTabClick(item.id);
                  }
                };

                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    onClick={handleClick}
                    className={`flex items-center justify-between text-lg font-bold py-3 px-4 rounded-xl transition-all min-h-[48px] w-full outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00] ${
                      isActive ? 'bg-[#FF4C00]/10 text-[#FF4C00]' : 'text-[#E5E5E5] hover:bg-[#1A1A1A]'
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <Icon className="text-xl" />
                      <span>{item.label}</span>
                    </span>

                    {item.id === 'mylist' && (
                      <span className="bg-[#FF4C00] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {watchlistCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* EXIT KIDS MODE PIN MODAL */}
      {isExitPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl border border-[#262626] bg-[#0A0A0A] p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Lock size={26} />
              </div>

              <div>
                <h3 className="text-lg font-black text-white">Exit Kids Mode</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Enter your 4-digit Security PIN to confirm exiting Kids Mode.
                </p>
              </div>

              <form onSubmit={handleExitKidsModeSubmit} className="w-full space-y-4">
                <input
                  type="password"
                  maxLength={4}
                  pattern="\d{4}"
                  inputMode="numeric"
                  placeholder="••••"
                  value={exitPinInput}
                  onChange={(e) => setExitPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  autoFocus
                  required
                  className="w-full h-12 rounded-xl bg-[#141414] border border-[#262626] text-center font-mono tracking-[0.6em] text-xl font-bold text-amber-400 focus:border-amber-500 focus:outline-none"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsExitPinModalOpen(false);
                      setExitPinInput('');
                    }}
                    className="w-1/2 py-3 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] text-xs font-bold text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Unlock & Exit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <MyListModal isOpen={isMyListModalOpen} onClose={() => setIsMyListModalOpen(false)} />
    </>
  );
}
