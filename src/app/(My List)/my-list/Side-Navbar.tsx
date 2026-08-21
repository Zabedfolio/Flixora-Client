"use client";

import { BarChart3, Heart, History, Home, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SideNavbar = () => {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, name: "Home", href: "/my-list" },
    { icon: Heart, name: "My likes", href: "/my-list/likes-video" },
    { icon: BarChart3, name: "Analytics", href: "/my-list/analytics" },
    { icon: User, name: "My Channel", href: "/my-list/my-channel" },
    { icon: History, name: "History", href: "/my-list/history" },
    { icon: Settings, name: "Setting", href: "/my-list/setting" },
  ];

  return (
    <div className="hidden md:block h-screen sticky top-0">
      <aside className="w-64 h-full bg-[#16161d] border-r border-base-300 flex flex-col py-6">
        {/* Logo */}
        <div className="px-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg text-white">Flexora</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/my-list" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
};

export default SideNavbar;