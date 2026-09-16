'use client';

import React, { useState } from "react";
import SideNavbar from "./Side-Navbar";
import { Loader2, PanelLeftOpen } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/app/(auth)/lib/auth-client";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: RootLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  React.useEffect(() => {
    if (!isPending && !user) {
      router.replace(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [user, isPending, router, pathname]);

  // Resolve breadcrumbs subpage
  const getSubpageLabel = () => {
    if (pathname === '/dashboard/my-tickets' || pathname === '/dashboard/bookings') return 'Bookings';
    if (pathname === '/dashboard/setting') return 'Settings';
    if (pathname === '/dashboard/my-list') return 'My List';
    if (pathname === '/dashboard/my-playlist') return 'Playlists';
    if (pathname === '/dashboard/history') return 'History';
    if (pathname === '/dashboard/subscription') return 'Subscription';
    if (pathname === '/dashboard/analytics') return 'Analytics';
    return '';
  };

  const subpage = getSubpageLabel();

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#FF4C00]" />
          <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
            Loading Dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-black text-white w-full overflow-hidden relative font-sans">
      <SideNavbar isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      
      <div className="flex-1 w-full min-w-0 flex flex-col h-full overflow-hidden">
        {/* Sleek Breadcrumbs Header Bar */}
        <header className="h-16 border-b border-[#1A1A1A]/80 px-6 flex items-center gap-4 bg-zinc-950/20 backdrop-blur-sm select-none shrink-0 z-20">
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

        {/* Page Content - Independent Scroll */}
        <div className="flex-1 w-full overflow-y-auto bg-black scrollbar-thin scrollbar-thumb-zinc-800">
          {children}
        </div>
      </div>
    </div>
  );
}
