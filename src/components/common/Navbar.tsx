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
} from 'react-icons/fa';
import SearchBar from './SearchBar';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';
import MyListModal from './MyListModal';
import { getWatchlistCount } from '@/data/watchlistStore';
import { authClient } from '@/app/(auth)/lib/auth-client';

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

interface DropdownItem {
  label: string;
  href?: string;
  onClick?: () => void;
  isDividerBefore?: boolean;
  isDanger?: boolean;
}

const PROFILE_ITEMS: DropdownItem[] = [
  {
    label: 'Profile',
    href: '/dashboard/setting',
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Sign Out',
    onClick: () => toast.success('Logged out successfully!'),
    isDividerBefore: true,
    isDanger: true,
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

  const { data: session, isPending } = authClient.useSession();

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

  // Hide Navbar on authentication, dashboard, and admin routes
  if (pathname?.startsWith('/auth') || pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-black/65 backdrop-blur-md border-b border-[#1A1A1A]/80 px-4 sm:px-6 lg:px-8 select-none transition-colors duration-300">
        {/* =========================================
          MAIN NAVBAR
      ========================================== */}
        <nav className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4 w-full">
          {/* =========================================
            LEFT SECTION
        ========================================== */}
          <div className="flex items-center gap-4 lg:gap-8 min-w-0">
            {/* Logo */}
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
            </Link>

            {/* =========================================
              DESKTOP NAVIGATION
              >= 1024px
          ========================================== */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-6">
              {NAV_ITEMS.map(item => {
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
                    className={`flex items-center gap-2 text-sm font-semibold tracking-wide transition-all duration-200 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00] rounded ${isActive
                        ? 'text-[#FF4C00]'
                        : 'text-[#E5E5E5] hover:text-[#FF4C00]'
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

          {/* =========================================
            RIGHT SECTION
        ========================================== */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Search */}
            <div className="hidden sm:block">
              <SearchBar />
            </div>

            {/* =========================================
              PROFILE DROPDOWN
              >= 768px
          ========================================== */}
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-zinc-900 animate-pulse hidden md:block" />
            ) : session ? (
              <div className="relative hidden md:block" ref={profileRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-1.5 focus:outline-none group"
                  aria-label="Profile"
                  aria-expanded={isProfileDropdownOpen}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#FF4C00] transition-transform group-hover:scale-105 bg-zinc-950 flex items-center justify-center font-bold text-white text-xs">
                    {session?.user?.image ? (
                      <Image
                        width={32}
                        height={32}
                        src={session?.user?.image}
                        alt="Avatar"
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    ) : (
                      session.user.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>

                  {/* Chevron */}
                  <FaChevronDown className="text-[10px] text-[#E5E5E5] group-hover:text-white transition-colors hidden sm:inline" />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-48 bg-black border border-[#1A1A1A] rounded-xl shadow-2xl p-2 z-50">
                    <div className="px-4 py-2 border-b border-[#1A1A1A] mb-1">
                      <p className="text-xs font-bold text-white truncate">{session.user.name}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{session.user.email}</p>
                    </div>
                    <Link
                      href="/dashboard/setting"
                      className="block w-full text-left px-4 py-2.5 text-sm rounded-lg text-[#E5E5E5] hover:bg-[#1A1A1A] hover:text-[#FF4C00] transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block w-full text-left px-4 py-2.5 text-sm rounded-lg text-[#E5E5E5] hover:bg-[#1A1A1A] hover:text-[#FF4C00] transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <div className="h-px bg-[#1A1A1A] my-1" />
                    <button
                      onClick={async () => {
                        setIsProfileDropdownOpen(false);
                        await authClient.signOut({
                          callbackURL: '/login',
                        });
                        toast.success('Logged out successfully!');
                      }}
                      className="block w-full text-left px-4 py-2.5 text-sm rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      Sign Out
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

            {/* =========================================
              MOBILE SEARCH
              < 640px
          ========================================== */}
            <div className="sm:hidden">
              <SearchBar />
            </div>

            {/* =========================================
              HAMBURGER
              < 1024px
          ========================================== */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[#E5E5E5] hover:text-[#FF4C00] transition-colors outline-none rounded-full flex items-center justify-center"
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

      {/* =========================================
          TABLET SLIDE DOWN MENU
          >= 768px && < 1024px
      ========================================== */}
      {isMobileMenuOpen && (
        <div className="fixed top-[72px] left-0 right-0 z-40 bg-black border-b border-[#1A1A1A] shadow-2xl hidden md:flex lg:hidden">
          <div className="max-w-7xl mx-auto w-full px-6 py-5">
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map(item => {
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
                    className={`flex items-center justify-between text-base font-semibold tracking-wide py-3 px-4 rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00] ${isActive
                        ? 'bg-[#1A1A1A] text-[#FF4C00]'
                        : 'text-[#E5E5E5] hover:text-[#FF4C00] hover:bg-[#1A1A1A]/50'
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="text-lg" />

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

      {/* =========================================
          MOBILE DRAWER
          < 768px
      ========================================== */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-[280px] max-w-[85vw] h-full bg-black border-l border-[#1A1A1A] p-6 pt-20 flex flex-col gap-6 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* =========================================
                MOBILE PROFILE
            ========================================== */}
            <div className="flex flex-col gap-4">
              {isPending ? (
                <div className="h-14 bg-zinc-900 rounded-xl animate-pulse w-full" />
              ) : session ? (
                <>
                  {/* Profile Info */}
                  <div className="flex items-center gap-3 px-4 py-2 border-b border-[#1A1A1A] pb-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[#FF4C00] shrink-0 bg-zinc-950 flex items-center justify-center font-bold text-white">
                      {session.user.image ? (
                        <Image
                          width={40}
                          height={40}
                          src={session.user.image}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        session.user.name?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-white text-sm font-bold truncate">
                        {session.user.name}
                      </span>
                      <span className="text-zinc-550 text-[9px] font-bold uppercase tracking-wider truncate">
                        {session.user.email}
                      </span>
                    </div>
                  </div>

                  {/* Profile Menu */}
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/dashboard/setting"
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
                    <div className="h-px bg-[#1A1A1A] my-1" />
                    <button
                      onClick={async () => {
                        setIsMobileMenuOpen(false);
                        await authClient.signOut({
                          callbackURL: '/login',
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
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-bold border border-zinc-800 bg-[#0A0A0A] hover:bg-[#121212] hover:border-zinc-700 text-white transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="h-px bg-[#1A1A1A] w-full" />

            {/* =========================================
                MOBILE NAVIGATION
            ========================================== */}
            <div className="flex flex-col gap-3">
              {NAV_ITEMS.map(item => {
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
                    className={`flex items-center justify-between text-lg font-bold py-3 px-4 rounded-xl transition-all min-h-[48px] w-full outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00] ${isActive
                        ? 'bg-[#FF4C00]/10 text-[#FF4C00]'
                        : 'text-[#E5E5E5] hover:bg-[#1A1A1A]'
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

      <MyListModal isOpen={isMyListModalOpen} onClose={() => setIsMyListModalOpen(false)} />
    </>
  );
}
