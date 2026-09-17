'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { PanelLeftOpen, ShieldCheck, ArrowUpRight, Bell, Loader2, Home } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/app/(auth)/lib/auth-client';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const role = (user as any)?.role;

  // Client-side fallback guard
  React.useEffect(() => {
    if (!isPending) {
      if (!user) {
        router.replace(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
      } else if (role !== 'admin') {
        router.replace('/dashboard');
      }
    }
  }, [user, role, isPending, router, pathname]);

  const getSubpageLabel = () => {
    if (pathname === '/admin/bookings') return 'Cinema Bookings';
    if (pathname === '/admin/analytics') return 'Revenue & Analytics';
    if (pathname === '/admin/transactions') return 'Transactions & Invoices';
    if (pathname === '/admin/settings') return 'Plans & Promo Codes';
    if (pathname === '/admin/catalogue') return 'Catalogue';
    if (pathname === '/admin/users') return 'Users';
    if (pathname === '/admin/applications') return 'Job Applications';
    if (pathname === '/admin/messages') return 'Contact Messages';
    if (pathname === '/admin/reviews') return 'Reviews';
    return 'Dashboard Overview';
  };

  const subpage = getSubpageLabel();

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'AD';

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#FF4C00]" />
          <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
            Verifying Admin Credentials...
          </span>
        </div>
      </div>
    );
  }

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

            {/* Breadcrumb path */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide">
              <Link href="/admin" className="text-white flex items-center gap-1.5 font-bold hover:text-[#FF4C00] transition-colors">
                <ShieldCheck size={16} className="text-[#FF4C00]" />
                Admin
              </Link>
              <span className="text-zinc-600">/</span>
              <span className="text-[#FF4C00] font-bold">{subpage}</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
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

            {/* Highlighted Home Navigation Link with ZM Gradient */}
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FF4C00] to-amber-500 shadow-[0_0_14px_rgba(255,76,0,0.45)] hover:shadow-[0_0_20px_rgba(255,76,0,0.65)] hover:brightness-110 active:scale-95 transition-all border border-amber-300/30"
            >
              <Home size={14} className="text-black stroke-[2.5]" />
              <span>Home</span>
            </Link>

            {/* Admin Profile Chip */}
            <div className="hidden md:flex items-center gap-2.5 pl-3 border-l border-[#1A1A1A]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF4C00] to-amber-500 flex items-center justify-center text-xs font-black text-black shadow-[0_0_12px_rgba(255,76,0,0.4)]">
                {userInitials}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">{user?.name || 'Admin User'}</span>
                <span className="text-[10px] text-[#FF4C00] font-mono font-bold tracking-widest uppercase">
                  {role === 'admin' ? 'SUPER ADMIN' : 'ADMIN'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <div className="flex-grow w-full overflow-y-auto bg-[#070707] scrollbar-thin scrollbar-thumb-zinc-800">
          {children}
        </div>
      </div>
    </div>
  );
}
