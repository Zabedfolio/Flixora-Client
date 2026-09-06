"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { PanelLeftOpen } from "lucide-react";

import SideNavbar from "@/components/common/Sidebar";

interface AdminDashBoardLayoutProps {
  children: React.ReactNode;
}

const AdminDashBoardLayout = ({
  children,
}: AdminDashBoardLayoutProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();

 
  const getSubpage = () => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length <= 1) return "";

    const currentPage = segments[segments.length - 1];

    return currentPage
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const subpage = getSubpage();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black text-white">
      
      {/* ================= SIDEBAR ================= */}
      <SideNavbar
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* ================= MAIN AREA ================= */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        
        {/* ================= HEADER ================= */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-[#1A1A1A]/80 bg-zinc-950/20 px-6 backdrop-blur-sm">
          
          {/* Mobile Sidebar Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#1A1A1A] bg-zinc-950/40 text-zinc-400 transition-colors hover:border-[#FF4C00]/40 hover:text-[#FF4C00] md:hidden"
            aria-label="Open navigation menu"
          >
            <PanelLeftOpen size={16} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide sm:text-sm">
            <span className="text-white">
              Dashboard
            </span>

            {subpage && (
              <>
                <span className="text-zinc-700">
                  /
                </span>

                <span className="text-[#FF4C00]">
                  {subpage}
                </span>
              </>
            )}
          </div>
        </header>

        {/* ================= PAGE CONTENT ================= */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default AdminDashBoardLayout;