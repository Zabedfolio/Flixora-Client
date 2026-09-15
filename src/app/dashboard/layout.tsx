'use client';

import React, { useState, useEffect } from "react";
import SideNavbar from "./Side-Navbar";
import { PanelLeftOpen } from "lucide-react";
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

  useEffect(() => {
    // If user is currently logging out, do not redirect to login!
    // The logout handler will redirect to the home page ('/').
    if (typeof window !== "undefined" && sessionStorage.getItem("is_logging_out")) {
      return;
    }

    if (!isPending && !session?.user) {
      router.replace("/auth/login");
    }
  }, [isPending, session, router]);

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

  // Show a full-screen loading state while session is being resolved
  // or while redirecting unauthenticated users / logging out
  if (isPending || !session?.user) {
    const isLoggingOut =
      typeof window !== "undefined" &&
      Boolean(sessionStorage.getItem("is_logging_out"));

    return (
      <div className="flex h-screen bg-black items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#FF4C00] border-t-transparent animate-spin" />
          <p className="text-zinc-500 text-xs font-semibold tracking-widest uppercase">
            {isLoggingOut
              ? "Signing out..."
              : isPending
                ? "Loading..."
                : "Redirecting..."}
          </p>
        </div>
      </div>
    );
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
