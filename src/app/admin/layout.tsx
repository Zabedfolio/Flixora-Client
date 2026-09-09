'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { PanelLeftOpen, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();

  const getSubpageLabel = () => {
    if (pathname === '/admin/analytics') return 'Revenue & Analytics';
    if (pathname === '/admin/transactions') return 'Transactions & Invoices';
    if (pathname === '/admin/settings') return 'Plans & Promo Codes';
    if (pathname === '/admin/catalogue') return 'Catalogue';
    if (pathname === '/admin/users') return 'Users';
    if (pathname === '/admin/reviews') return 'Reviews';
    return 'Dashboard Overview';
  };

  const subpage = getSubpageLabel();

  return (
    <div className="flex h-screen bg-black text-white w-full overflow-hidden relative font-sans">
      {/* Sidebar navigation */}
      <AdminSidebar isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Main admin viewport */}
      <div className="flex-1 w-full min-w-0 flex flex-col h-full overflow-hidden bg-gradient-to-b from-[#0D0D0D] to-black">
        {/* Top Navbar Header */}
        <header className="h-16 border-b border-[#1A1A1A] px-6 flex items-center justify-between bg-zinc-950/40 backdrop-blur-md select-none shrink-0 z-20">
          <div className="flex items-center gap-4">
            {/* Mobile Drawer trigger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden w-9 h-9 rounded-lg border border-[#1A1A1A] bg-zinc-950/60 text-zinc-400 hover:text-[#FF4C00] hover:border-[#FF4C00]/40 flex items-center justify-center transition-colors cursor-pointer outline-none"
              aria-label="Open admin navigation menu"
            >
              <PanelLeftOpen size={16} />
            </button>

            {/* Breadcrumb path */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide">
              <Link href="/admin" className="text-zinc-400 hover:text-white transition-colors">
                Admin
              </Link>
              <span className="text-zinc-700">/</span>
              <span className="text-[#FF4C00] font-bold">{subpage}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Admin Live Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141414] border border-[#222222]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-widest">
                System Online
              </span>
            </div>

            {/* Switch to User Portal Link */}
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-[#FF4C00]/40 bg-zinc-950/40 transition-all font-semibold"
            >
              <span>User View</span>
              <ArrowUpRight size={13} className="text-[#FF4C00]" />
            </Link>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <div className="flex-grow w-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
