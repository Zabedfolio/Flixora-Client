'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Film, 
  Users, 
  Flag, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  User, 
  LogOut, 
  ShieldAlert,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { id: 'catalogue', label: 'Catalogue', icon: Film, href: '/admin/catalogue' },
  { id: 'users', label: 'Users', icon: Users, href: '/admin/users' },
  { id: 'reviews', label: 'Reviews', icon: Flag, href: '/admin/reviews' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
  { id: 'home', label: 'Home Page', icon: Home, href: '/' },
];

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getActiveItem = () => {
    const sortedItems = [...NAV_ITEMS].sort((a, b) => b.href.length - a.href.length);
    const active = sortedItems.find(item => 
      pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
    );
    return active?.id || 'dashboard';
  };

  const activeId = getActiveItem();

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-white select-none relative font-sans overflow-visible">
      <div className={`flex items-center justify-between px-6 pt-6 pb-4 overflow-visible ${isCollapsed ? 'justify-center px-2' : ''}`}>
        {!isCollapsed ? (
          <Link href="/" className="flex items-center gap-2.5 outline-none">
            <img 
              src="/logo.png" 
              alt="Flixora Logo" 
              className="h-6 w-auto object-contain" 
            />
            <span className="text-[#FF4C00] text-[8px] font-black font-mono border border-[#FF4C00]/30 px-1 py-0.5 rounded uppercase tracking-widest bg-[#FF4C00]/5 shrink-0 align-middle">
              Admin
            </span>
          </Link>
        ) : (
          <Link href="/" className="flex items-center justify-center outline-none">
            <span className="w-6 h-6 rounded-lg bg-[#FF4C00] flex items-center justify-center font-black text-black text-[10px] font-mono">
              F
            </span>
          </Link>
        )}
        
        <button 
          onClick={handleToggleCollapse}
          className="hidden md:flex items-center justify-center p-1.5 rounded-lg bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-800 transition-all outline-none"
        >
          <ChevronLeft size={16} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className={`flex-grow px-4 py-6 space-y-2.5 overflow-visible ${isCollapsed ? 'px-2' : ''}`}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;

          return (
            <div key={item.id} className="relative flex items-center w-full overflow-visible">
              {/* Far left vertical glowing bar */}
              {isActive && (
                <div 
                  className={`absolute w-[5px] h-10 rounded-r-[4px] bg-[#FF4C00] z-20 ${
                    isCollapsed ? 'left-[-8px]' : 'left-[-16px]'
                  }`}
                  style={{
                    boxShadow: `
                      0 0 8px 2px rgba(255, 76, 0, 0.9),
                      0 0 40px 10px rgba(255, 76, 0, 0.35),
                      0 0 80px 20px rgba(255, 76, 0, 0.15)
                    `
                  }}
                />
              )}
              
              <Link
                key={item.id}
                href={item.href}
                className={`group flex items-center gap-4 py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 outline-none w-full relative rounded-2xl overflow-visible ${
                  isCollapsed ? 'justify-center px-0' : 'pl-4 pr-3 ml-[-5px]'
                } ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white font-bold'
                    : 'text-[#B3B3B3] hover:bg-[#1A1A1A] hover:text-white'
                }`}
                style={!isCollapsed && isActive ? { marginLeft: '-5px', paddingLeft: '16px' } : {}}
              >
                {/* Icon in plain dark circle */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isActive 
                    ? 'bg-[#2A2A2A] text-white' 
                    : 'bg-[#141414] text-[#B3B3B3] group-hover:bg-[#2A2A2A] group-hover:text-white'
                }`}>
                  <Icon className="w-[18px] h-[18px]" />
                </div>
                
                {!isCollapsed && (
                  <span className="transition-opacity duration-200 flex-grow">{item.label}</span>
                )}

                {/* Right-aligned chevron (active item only) */}
                {isActive && !isCollapsed && (
                  <ChevronRight size={13} className="text-zinc-500 shrink-0" />
                )}

                {isCollapsed && (
                  <div className="absolute left-16 z-50 scale-0 group-hover:scale-100 bg-[#1A1A1A] border border-zinc-805 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all duration-150 origin-left shadow-xl pointer-events-none whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className={`p-4 border-t border-[#1A1A1A] relative ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 text-left focus:outline-none group rounded-full md:rounded-lg cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center font-bold text-white shadow-inner group-hover:border-[#FF4C00]/60 transition-colors shrink-0">
              A
            </div>
            
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 pr-4">
                <span className="text-xs font-black text-white truncate">Admin Account</span>
                <span className="text-[10px] text-zinc-500 truncate font-semibold uppercase tracking-wider">Super Admin</span>
              </div>
            )}
          </button>
        </div>

        {isProfileOpen && (
          <div className="absolute bottom-16 left-4 bg-[#0E0E0E] border border-[#1A1A1A] rounded-xl shadow-2xl p-2 w-48 z-50 flex flex-col gap-1">
            <Link 
              href="/admin/profile" 
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-950 transition-all"
            >
              <User size={14} className="text-[#FF4C00]" />
              Account Settings
            </Link>
            <Link 
              href="/admin/logs" 
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-950 transition-all"
            >
              <ShieldAlert size={14} className="text-[#FF4C00]" />
              System Logs
            </Link>
            <div className="h-px bg-[#1A1A1A] my-1" />
            <button 
              onClick={() => alert('Sign out clicked')}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-red-500 hover:text-red-400 hover:bg-red-950/20 transition-all w-full text-left"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className={`hidden md:block h-screen bg-[#0A0A0A] shrink-0 sticky top-0 transition-all duration-300 ease-in-out overflow-visible z-30 ${
        isCollapsed ? 'w-[78px]' : 'w-[260px]'
      }`}>
        {sidebarContent}
      </aside>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-[260px] h-full shadow-2xl">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={onClose} />
        </div>
      )}
    </>
  );
}
