'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { PanelLeftOpen, ShieldCheck, Bell, Search, Sparkles, Circle } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();

  const getSubpageLabel = () => {
    if (pathname === '/admin/catalogue') return 'Catalogue';
    if (pathname === '/admin/users') return 'Users';
    if (pathname === '/admin/reviews') return 'Reviews';
    if (pathname === '/admin/analytics') return 'Analytics';
    if (pathname === '/admin/settings') return 'Settings';
    return '';
  };

  const subpage = getSubpageLabel();

  return (
    <div className="flex h-screen bg-[#050505] text-white w-full overflow-hidden relative font-sans">
      {/* Admin Sidebar */}
      <AdminSidebar isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0 flex flex-col h-full overflow-hidden">
        {/* Futuristic Admin Header Bar */}
        <header className="h-16 border-b border-[#1A1A1A] px-6 flex items-center justify-between bg-[#0A0A0A]/80 backdrop-blur-xl select-none shrink-0 z-20">
          <div className="flex items-center gap-4">
            {/* Mobile Drawer Trigger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden w-9 h-9 rounded-lg border border-[#1A1A1A] bg-zinc-950/40 text-zinc-400 hover:text-[#FF4C00] hover:border-[#FF4C00]/40 flex items-center justify-center transition-colors cursor-pointer outline-none"
              aria-label="Open admin menu"
            >
              <PanelLeftOpen size={16} />
            </button>

            {/* Breadcrumb Trail */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide">
              <span className="text-white flex items-center gap-1.5 font-bold">
                <ShieldCheck size={16} className="text-[#FF4C00]" />
                Admin Dashboard
              </span>
              {subpage && (
                <>
                  <span className="text-zinc-600">/</span>
                  <span className="text-[#FF4C00] font-bold">{subpage}</span>
                </>
              )}
            </div>
          </div>

          {/* Right Header Status Bar */}
          <div className="flex items-center gap-4">
            {/* Live Streaming Engine Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>STREAM ENGINE 99.98%</span>
            </div>

            {/* System Notification Bell */}
            <div className="relative">
              <button className="w-9 h-9 rounded-xl border border-[#1A1A1A] bg-[#0E0E0E] text-zinc-400 hover:text-white hover:border-zinc-800 flex items-center justify-center transition-all cursor-pointer">
                <Bell size={16} />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF4C00]"></span>
              </button>
            </div>

            {/* Admin Profile Chip */}
            <div className="hidden md:flex items-center gap-2.5 pl-3 border-l border-[#1A1A1A]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF4C00] to-amber-500 flex items-center justify-center text-xs font-black text-black shadow-[0_0_12px_rgba(255,76,0,0.4)]">
                ZM
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Zabed Mahmud</span>
                <span className="text-[10px] text-[#FF4C00] font-mono font-bold tracking-widest uppercase">SUPER ADMIN</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-grow w-full overflow-y-auto bg-[#070707] scrollbar-thin scrollbar-thumb-zinc-800">
          {children}
        </div>
      </div>
    </div>
  );
}
