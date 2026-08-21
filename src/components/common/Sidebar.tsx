'use client';

import React, { useState, useEffect } from 'react';
import { 
  Home,
  Compass,
  Bookmark,
  Play,
  Sparkles,
  Settings,
  LayoutDashboard,
  Film,
  Users,
  Flag,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  LogOut,
  Clock,
  Crown
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  forcedRole?: 'user' | 'admin' | 'loading';
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  roles: ('user' | 'admin')[];
}

const NAV_ITEMS: NavItem[] = [
  // User Navigation (7 items)
  { id: 'dashboard_user', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', roles: ['user'] },
  { id: 'mylist', label: 'My List', icon: Bookmark, href: '/dashboard/my-list', roles: ['user'] },
  { id: 'playlists', label: 'Mood Playlists', icon: Sparkles, href: '/dashboard/my-playlist', roles: ['user'] },
  { id: 'history_user', label: 'History', icon: Clock, href: '/dashboard/history', roles: ['user'] },
  { id: 'subscription', label: 'Subscription', icon: Crown, href: '/dashboard/subscription', roles: ['user'] },
  { id: 'settings_user', label: 'Settings', icon: Settings, href: '/dashboard/setting', roles: ['user'] },
  { id: 'home_user', label: 'Home Page', icon: Home, href: '/', roles: ['user'] },

  // Admin Navigation (7 items)
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin', roles: ['admin'] },
  { id: 'catalogue', label: 'Catalogue', icon: Film, href: '/admin/catalogue', roles: ['admin'] },
  { id: 'users', label: 'Users', icon: Users, href: '/admin/users', roles: ['admin'] },
  { id: 'reviews', label: 'Reviews', icon: Flag, href: '/admin/reviews', roles: ['admin'] },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/admin/analytics', roles: ['admin'] },
  { id: 'settings_admin', label: 'Settings', icon: Settings, href: '/admin/settings', roles: ['admin'] },
  { id: 'home_admin', label: 'Home Page', icon: Home, href: '/', roles: ['admin'] },
];

export default function Sidebar({ isOpen = false, onClose, forcedRole }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Mock Session state
  const [sessionRole, setSessionRole] = useState<'user' | 'admin' | 'loading'>('loading');

  useEffect(() => {
    // Check if role is saved in localStorage, default to user for demonstration
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('flixora-session-role') as 'user' | 'admin';
      const timer = setTimeout(() => {
        setSessionRole(saved || 'user');
      }, 1000); // 1s simulation of session load
      return () => clearTimeout(timer);
    }
  }, []);

  const currentRole = forcedRole || sessionRole;
  const isLoading = currentRole === 'loading';

  const handleRoleToggle = () => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    if (typeof window !== 'undefined') {
      localStorage.setItem('flixora-session-role', nextRole);
    }
    setSessionRole(nextRole);
    setIsProfileOpen(false);
  };

  // Filter items matching current role
  const filteredItems = NAV_ITEMS.filter(item => 
    !isLoading && item.roles.includes(currentRole as 'user' | 'admin')
  );

  // Active state matching based on active route
  const getActiveItem = () => {
    const sortedItems = [...filteredItems].sort((a, b) => b.href.length - a.href.length);
    const active = sortedItems.find(item => 
      pathname === item.href || (item.href !== '/' && item.href !== '/admin' && item.href !== '/dashboard' && pathname?.startsWith(item.href))
    );
    return active?.id || '';
  };

  const activeId = getActiveItem();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-white select-none relative font-sans overflow-visible">
      
      {/* BRAND LOGO HEADER */}
      <div className={`flex items-center justify-between px-6 pt-6 pb-4 overflow-visible ${isCollapsed ? 'justify-center px-2' : ''}`}>
        {!isCollapsed ? (
          <Link href="/" className="flex items-center gap-2.5 outline-none">
            <img 
              src="/logo.png" 
              alt="Flixora Logo" 
              className="h-10 w-auto object-contain" 
            />
            {currentRole === 'admin' && (
              <span className="text-[#FF4C00] text-[8px] font-black font-mono border border-[#FF4C00]/30 px-1 py-0.5 rounded uppercase tracking-widest bg-[#FF4C00]/5 shrink-0 align-middle">
                Admin
              </span>
            )}
          </Link>
        ) : (
          <Link href="/" className="flex items-center justify-center outline-none">
            <span className="w-6 h-6 rounded-lg bg-[#FF4C00] flex items-center justify-center font-black text-black text-[10px] font-mono">
              F
            </span>
          </Link>
        )}
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex items-center justify-center p-1.5 rounded-lg bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-800 transition-all outline-none cursor-pointer"
        >
          <ChevronLeft size={16} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* SKELETON LOADER STATE */}
      {isLoading ? (
        <nav className={`flex-grow px-4 py-6 space-y-4 ${isCollapsed ? 'px-2' : ''}`}>
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-4 py-3.5 animate-pulse rounded-xl ${
                isCollapsed ? 'justify-center px-0' : 'px-5'
              }`}
            >
              <div className="w-[20px] h-[20px] rounded-md bg-zinc-900 shrink-0" />
              {!isCollapsed && (
                <div className="h-4 bg-zinc-900 rounded w-7/12" />
              )}
            </div>
          ))}
        </nav>
      ) : (
        /* CONDITIONAL ROLE NAVIGATION */
        <nav className={`flex-grow px-4 py-6 space-y-2.5 overflow-visible ${isCollapsed ? 'px-2' : ''}`}>
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;

            return (
              <div key={item.id} className="relative flex items-center w-full overflow-visible">
                {/* Far left vertical glowing bar */}
                {isActive && (
                  <div 
                    className={`absolute w-[7px] h-11 rounded-r-lg bg-[#FF4C00] z-20 ${
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
                  className={`group flex items-center gap-4 py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 outline-none w-full relative rounded-xl overflow-visible ${
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
      )}

      {/* BOTTOM PROFILE / AVATAR */}
      {isLoading ? (
        <div className={`p-4 border-t border-[#1A1A1A] flex items-center gap-3 animate-pulse ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-zinc-900 shrink-0" />
          {!isCollapsed && (
            <div className="space-y-2 flex-grow pr-4">
              <div className="h-3 bg-zinc-900 rounded w-1/2" />
              <div className="h-2 bg-zinc-900 rounded w-1/3" />
            </div>
          )}
        </div>
      ) : (
        <div className={`p-4 border-t border-[#1A1A1A] relative ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 text-left focus:outline-none group rounded-full md:rounded-lg cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center font-bold text-white shadow-inner group-hover:border-[#FF4C00]/60 transition-colors shrink-0">
                {currentRole === 'admin' ? 'A' : 'U'}
              </div>
              
              {!isCollapsed && (
                <div className="flex flex-col min-w-0 pr-4">
                  <span className="text-xs font-black text-white truncate">
                    {currentRole === 'admin' ? 'Admin Portal' : 'User Portal'}
                  </span>
                  <span className="text-[10px] text-zinc-550 truncate font-semibold uppercase tracking-wider">
                    {currentRole === 'admin' ? 'Super Admin' : 'Premium Member'}
                  </span>
                </div>
              )}
            </button>
          </div>

          {isProfileOpen && (
            <div className="absolute bottom-16 left-4 bg-[#0E0E0E] border border-[#1A1A1A] rounded-xl shadow-2xl p-2 w-52 z-50 flex flex-col gap-1">
              {currentRole === 'admin' ? (
                <>
                  <button 
                    onClick={handleRoleToggle}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-950 transition-all w-full text-left cursor-pointer"
                  >
                    <Sparkles size={14} className="text-[#FF4C00]" />
                    Switch to User View
                  </button>
                  <Link 
                    href="/admin/settings"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-950 transition-all"
                  >
                    <Settings size={14} className="text-[#FF4C00]" />
                    Settings
                  </Link>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => alert('Switch profile clicked')}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-950 transition-all w-full text-left cursor-pointer"
                  >
                    <UserIcon size={14} className="text-[#FF4C00]" />
                    Switch Profile
                  </button>
                  <button 
                    onClick={handleRoleToggle}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-950 transition-all w-full text-left cursor-pointer"
                  >
                    <Sparkles size={14} className="text-[#FF4C00]" />
                    Switch to Admin View
                  </button>
                </>
              )}
              
              <div className="h-px bg-[#1A1A1A] my-1" />
              
              <button 
                onClick={() => alert('Sign out clicked')}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-red-500 hover:text-red-400 hover:bg-red-950/20 transition-all w-full text-left cursor-pointer"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <aside className={`hidden md:block h-screen bg-[#0A0A0A] shrink-0 sticky top-0 transition-all duration-300 ease-in-out border-r border-[#1A1A1A]/30 overflow-visible z-30 ${
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
