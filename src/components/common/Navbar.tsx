"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  FaCompass, 
  FaFire, 
  FaBookmark, 
  FaBars, 
  FaTimes, 
  FaChevronDown 
} from "react-icons/fa";
import SearchBar from "./SearchBar";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "explore", label: "Explore", icon: FaCompass, path: "/explore" },
  { id: "trending", label: "Trending", icon: FaFire, path: "/trending" },
  { id: "mylist", label: "My List", icon: FaBookmark, path: "/my-list" }
];

interface DropdownItem {
  label: string;
  href?: string;
  onClick?: () => void;
  isDividerBefore?: boolean;
  isDanger?: boolean;
}

const PROFILE_ITEMS: DropdownItem[] = [
  { label: "Switch Profile", href: "/profile" },
  { label: "Account", href: "/account" },
  { label: "Sign Out", onClick: () => alert("Sign out clicked"), isDividerBefore: true, isDanger: true }
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
  activeTab = "",
  onTabChange,
  logoSrc = "/logo.png",
  profileAvatarSrc = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTabClick = (tab: string) => {
    if (onTabChange) onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-[#000000] border-b border-[#1A1A1A] flex items-center justify-between px-4 md:px-8 select-none transition-all duration-200">
        
        {/* LEFT SECTION: Logo and Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00] rounded">
            <img src={logoSrc} alt="Flixora" className="h-10 object-contain" />
            <span className="text-white font-black text-3xl tracking-wider hidden xs:inline">FLIXORA</span>
          </Link>

          {/* Desktop Navigation Link Items (>= 1024px) */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 text-sm font-semibold tracking-wide transition-all duration-200 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00] rounded ${
                    isActive ? "text-[#FF4C00]" : "text-[#E5E5E5] hover:text-[#FF4C00]"
                  }`}
                >
                  <Icon className="text-base" /> {item.label}
                  {item.id === "mylist" && (
                    <span className="bg-[#FF4C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-md">
                      {myListCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* RIGHT SECTION: Search & Profile Options */}
        <div className="flex items-center gap-4">
          
          {/* Modular Reusable SearchBar Component */}
          <SearchBar />

          {/* Hamburger Menu Toggle (< 1024px) */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#E5E5E5] hover:text-[#FF4C00] transition-colors outline-none rounded-full flex items-center justify-center"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <FaTimes className="text-[#FF4C00] text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-1.5 focus:outline-none group"
              aria-label="Profile"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#FF4C00] transition-transform group-hover:scale-105">
                <img
                  src={profileAvatarSrc}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <FaChevronDown className="text-[10px] text-[#E5E5E5] group-hover:text-white transition-colors hidden sm:inline" />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-[#000000] border border-[#1A1A1A] rounded-xl shadow-2xl p-2 z-50">
                {PROFILE_ITEMS.map((item, index) => {
                  const classNames = `block w-full text-left px-4 py-2.5 text-sm rounded-lg transition-colors ${
                    item.isDanger 
                      ? "text-red-500 hover:bg-red-500/10" 
                      : "text-[#E5E5E5] hover:bg-[#1A1A1A] hover:text-[#FF4C00]"
                  }`;

                  return (
                    <React.Fragment key={index}>
                      {item.isDividerBefore && <div className="h-[1px] bg-[#1A1A1A] my-1" />}
                      {item.href ? (
                        <Link href={item.href} className={classNames}>
                          {item.label}
                        </Link>
                      ) : (
                        <button onClick={item.onClick} className={classNames}>
                          {item.label}
                        </button>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* TABLET SLIDE-DOWN PANEL (>= 768px and < 1024px) */}
      {isMobileMenuOpen && (
        <div className="fixed top-[72px] left-0 right-0 z-40 bg-[#000000] border-b border-[#1A1A1A] py-4 px-6 flex flex-col gap-4 shadow-2xl hidden md:flex lg:hidden animate-in slide-in-from-top duration-200">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center justify-between text-base font-semibold tracking-wide py-2.5 px-4 rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00] ${
                  isActive ? "bg-[#1A1A1A] text-[#FF4C00]" : "text-[#E5E5E5] hover:text-[#FF4C00] hover:bg-[#1A1A1A]/50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="text-lg" /> {item.label}
                </span>
                {item.id === "mylist" && (
                  <span className="bg-[#FF4C00] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {myListCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* MOBILE SLIDE-IN DRAWER (< 768px) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-[280px] h-full bg-[#000000] border-l border-[#1A1A1A] p-6 pt-24 flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center justify-between text-lg font-bold py-3 px-4 rounded-xl transition-all min-h-[48px] w-full outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00] ${
                      isActive ? "bg-[#FF4C00]/10 text-[#FF4C00]" : "text-[#E5E5E5] hover:bg-[#1A1A1A]"
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <Icon className="text-xl" /> {item.label}
                    </span>
                    {item.id === "mylist" && (
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
    </>
  );
}
