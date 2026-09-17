'use client';

import React, { useState } from 'react';
import { Cookie, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CookiePreferencesPage() {
  const [performance, setPerformance] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const handleSave = () => {
    toast.success('Cookie preferences saved successfully!');
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-10 font-sans selection:bg-[#FF4C00] selection:text-black">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* HEADER */}
        <div className="space-y-3 border-b border-zinc-900/80 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00] font-black text-xs uppercase tracking-widest">
            <Cookie size={14} /> Privacy Controls
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Cookie Preferences
          </h1>
          <p className="text-xs text-zinc-400 font-medium max-w-2xl">
            Flixora uses cookies and similar technologies to maintain user authentication, process theater bookings, save streaming playback progress, and improve performance.
          </p>
        </div>

        {/* COOKIE TOGGLES */}
        <div className="space-y-4">
          <div className="bg-[#0B0B0B] border border-[#141414] hover:border-[#FF4C00]/30 transition-all rounded-2xl p-6 flex items-start justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white uppercase">Essential Cookies</h3>
                <span className="text-[10px] font-bold text-[#FF4C00] bg-[#FF4C00]/10 border border-[#FF4C00]/20 px-2 py-0.5 rounded">Always Active</span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">
                Necessary for fundamental platform functionality, authentication sessions, and secure payment processing. Cannot be disabled.
              </p>
            </div>
            <input type="checkbox" checked disabled className="w-5 h-5 accent-[#FF4C00] cursor-not-allowed mt-1" />
          </div>

          <div className="bg-[#0B0B0B] border border-[#141414] hover:border-[#FF4C00]/30 transition-all rounded-2xl p-6 flex items-start justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white uppercase">Performance & Streaming Cookies</h3>
              <p className="text-xs text-zinc-400 font-medium">
                Saves video quality settings, playback timestamp resume points, and regional CDN edge routing.
              </p>
            </div>
            <input
              type="checkbox"
              checked={performance}
              onChange={(e) => setPerformance(e.target.checked)}
              className="w-5 h-5 accent-[#FF4C00] cursor-pointer mt-1"
            />
          </div>

          <div className="bg-[#0B0B0B] border border-[#141414] hover:border-[#FF4C00]/30 transition-all rounded-2xl p-6 flex items-start justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white uppercase">Analytics & Recommendation Cookies</h3>
              <p className="text-xs text-zinc-400 font-medium">
                Helps our AI recommendation engine suggest movies, anime, and cinema showtimes tailored to your taste.
              </p>
            </div>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="w-5 h-5 accent-[#FF4C00] cursor-pointer mt-1"
            />
          </div>

          <div className="bg-[#0B0B0B] border border-[#141414] hover:border-[#FF4C00]/30 transition-all rounded-2xl p-6 flex items-start justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white uppercase">Promotional & Partner Cookies</h3>
              <p className="text-xs text-zinc-400 font-medium">
                Allows cinema hall partners to display special premiere promotions and discount offers.
              </p>
            </div>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="w-5 h-5 accent-[#FF4C00] cursor-pointer mt-1"
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            className="px-8 py-3.5 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF4C00]/20 flex items-center gap-2 cursor-pointer"
          >
            <Save size={16} /> Save Preference Settings
          </button>
        </div>

      </div>
    </div>
  );
}
