'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
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

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
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
    href: '/profile',
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Sign Out',
    onClick: () => alert('Sign out clicked'),
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

  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Resolve current active tab from route pathname if activeTab prop is empty
  const currentActiveTab = activeTab || (
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
    <header className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-black border-b border-[#1A1A1A] px-4 sm:px-6 lg:px-8 select-none">
      {/* =========================================
          MAIN NAVBAR
      ========================================== */}
      <nav className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4 ">
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

              return (
                <Link
                  key={item.id}
                  href={item.path}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 text-sm font-semibold tracking-wide transition-all duration-200 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00] rounded ${
                    isActive
                      ? 'text-[#FF4C00]'
                      : 'text-[#E5E5E5] hover:text-[#FF4C00]'
                  }`}
                >
                  <Icon className="text-base shrink-0" />

                  <span>{item.label}</span>

                  {item.id === 'mylist' && (
                    <span className="bg-[#FF4C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-md">
                      {myListCount}
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
          <div className="relative hidden md:block" ref={profileRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-1.5 focus:outline-none group"
              aria-label="Profile"
              aria-expanded={isProfileDropdownOpen}
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#FF4C00] transition-transform group-hover:scale-105">
                <Image
                  width={32}
                  height={32}
                  src={profileAvatarSrc}
                  alt="Avatar"
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>

              {/* Chevron */}
              <FaChevronDown className="text-[10px] text-[#E5E5E5] group-hover:text-white transition-colors hidden sm:inline" />
            </button>

            {/* Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-48 bg-black border border-[#1A1A1A] rounded-xl shadow-2xl p-2 z-50">
                {PROFILE_ITEMS.map((item, index) => {
                  const classNames = `block w-full text-left px-4 py-2.5 text-sm rounded-lg transition-colors ${
                    item.isDanger
                      ? 'text-red-500 hover:bg-red-500/10'
                      : 'text-[#E5E5E5] hover:bg-[#1A1A1A] hover:text-[#FF4C00]'
                  }`;

                  return (
                    <React.Fragment key={index}>
                      {/* Divider */}
                      {item.isDividerBefore && (
                        <div className="h-px bg-[#1A1A1A] my-1" />
                      )}

                      {/* Link */}
                      {item.href ? (
                        <Link
                          href={item.href}
                          className={classNames}
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            if (item.onClick) {
                              item.onClick();
                            }

                            setIsProfileDropdownOpen(false);
                          }}
                          className={classNames}
                        >
                          {item.label}
                        </button>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>

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

                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center justify-between text-base font-semibold tracking-wide py-3 px-4 rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00] ${
                      isActive
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
                        {myListCount}
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
              {/* Profile Info */}
              <div className="flex items-center gap-3 px-4 py-2 border-b border-[#1A1A1A] pb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#FF4C00] shrink-0">
                  <Image
                    width={40}
                    height={40}
                    src={profileAvatarSrc}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-white text-sm font-bold">
                    My Account
                  </span>

                  <span className="text-zinc-500 text-[10px]">
                    Premium Member
                  </span>
                </div>
              </div>

              {/* Profile Menu */}
              <div className="flex flex-col gap-1.5">
                {PROFILE_ITEMS.map((item, idx) => {
                  const classNames = `block w-full text-left px-4 py-2.5 text-sm rounded-lg transition-colors ${
                    item.isDanger
                      ? 'text-red-500 hover:bg-red-500/10'
                      : 'text-[#E5E5E5] hover:bg-[#1A1A1A] hover:text-[#FF4C00]'
                  }`;

                  return (
                    <React.Fragment key={idx}>
                      {item.isDividerBefore && (
                        <div className="h-px bg-[#1A1A1A] my-1" />
                      )}

                      {item.href ? (
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={classNames}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            if (item.onClick) {
                              item.onClick();
                            }

                            setIsMobileMenuOpen(false);
                          }}
                          className={classNames}
                        >
                          {item.label}
                        </button>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
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

                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center justify-between text-lg font-bold py-3 px-4 rounded-xl transition-all min-h-[48px] w-full outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00] ${
                      isActive
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
                        {myListCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
