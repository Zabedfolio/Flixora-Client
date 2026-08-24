'use client';

import React, { useState } from "react";
import SideNavbar from "./Side-Navbar";
import { PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: RootLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Resolve breadcrumbs subpage
  const getSubpageLabel = () => {
    if (pathname === '/dashboard/setting') return 'Settings';
    if (pathname === '/dashboard/my-list') return 'My List';
    if (pathname === '/dashboard/my-playlist') return 'Playlists';
    if (pathname === '/dashboard/history') return 'History';
    if (pathname === '/dashboard/subscription') return 'Subscription';
    if (pathname === '/dashboard/analytics') return 'Analytics';
    return '';
  };

  const subpage = getSubpageLabel();

  return (
    <div className="flex min-h-screen bg-black text-white w-full relative">
      <SideNavbar isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      
      <div className="flex-1 w-full min-w-0 flex flex-col">
        {/* Sleek Breadcrumbs Header Bar */}
        <header className="h-16 border-b border-[#1A1A1A]/80 px-6 flex items-center gap-4 bg-zinc-950/20 backdrop-blur-sm select-none shrink-0">
          {/* Mobile Drawer Trigger (Square Button) */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="md:hidden w-9 h-9 rounded-lg border border-[#1A1A1A] bg-zinc-950/40 text-zinc-400 hover:text-[#FF4C00] hover:border-[#FF4C00]/40 flex items-center justify-center transition-colors cursor-pointer outline-none"
            aria-label="Open navigation menu"
          >
            <PanelLeftOpen size={16} />
          </button>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide">
            <span className="text-white">Dashboard</span>
            {subpage && (
              <>
                <span className="text-zinc-700">/</span>
                <span className="text-[#FF4C00]">{subpage}</span>
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-grow w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
