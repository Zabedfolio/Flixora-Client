"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2,
  Smile,
  Zap,
  Heart,
  Moon,
  Ghost,
  Play,
  Plus,
  type LucideIcon,
} from "lucide-react";

type Mood = "feel-good" | "thrilling" | "romantic" | "chill" | "dark";

interface MoodOption {
  id: Mood;
  label: string;
  icon: LucideIcon;
}

interface MoviePick {
  id: number;
  title: string;
  image: string;
  category: string;
  year: number;
  blurb: string;
  moods: Mood[];
}

const MOODS: MoodOption[] = [
  { id: "feel-good", label: "Feel-Good", icon: Smile },
  { id: "thrilling", label: "Thrilling", icon: Zap },
  { id: "romantic", label: "Romantic", icon: Heart },
  { id: "chill", label: "Chill", icon: Moon },
  { id: "dark", label: "Dark & Gritty", icon: Ghost },
];

const PICKS: MoviePick[] = [
  { id: 1, title: "Echoes of Eternity", image: "/movies/echoes.jpg", category: "Drama / Romance", year: 2024, blurb: "A slow-burn love story across two lifetimes.", moods: ["romantic", "feel-good", "chill"] },
  { id: 2, title: "Chrono Drift", image: "/movies/chrono.jpg", category: "Adventure / Fantasy", year: 2025, blurb: "A light, whimsical time-hopping adventure.", moods: ["feel-good", "chill"] },
  { id: 3, title: "Fury: Born of War", image: "/movies/fury.jpg", category: "Action / War", year: 2025, blurb: "Relentless, high-stakes combat drama.", moods: ["thrilling", "dark"] },
  { id: 4, title: "Shadows in the Neon", image: "/movies/neon.jpg", category: "Thriller / Cyberpunk", year: 2025, blurb: "A tense neon-soaked cat-and-mouse chase.", moods: ["thrilling", "dark"] },
  { id: 5, title: "Tokyo Cyber-Run", image: "/movies/tokyo.jpg", category: "Anime / Cyberpunk", year: 2026, blurb: "Fast-paced anime chaos with heart.", moods: ["thrilling", "feel-good"] },
  { id: 6, title: "The Silent Cosmos", image: "/movies/cosmos.jpg", category: "Documentary", year: 2026, blurb: "A meditative, awe-filled journey through space.", moods: ["chill", "romantic"] },
  { id: 7, title: "Project Zero: Genesis", image: "/movies/fury.jpg", category: "Sci-Fi / Action", year: 2026, blurb: "Brooding sci-fi with a dark moral core.", moods: ["dark", "thrilling"] },
];

export default function MoodBasedPicks() {
  const [activeMood, setActiveMood] = useState<Mood>("feel-good");

  const filtered = useMemo(
    () => PICKS.filter((p) => p.moods.includes(activeMood)),
    [activeMood]
  );

  return (
    <section className="relative bg-black py-16 px-4 md:px-8 select-none overflow-hidden z-10 border-t border-[#121212]">
      <div className="absolute bottom-0 right-1/4 translate-y-1/3 w-[550px] h-[550px] bg-[#FF4C00]/5 blur-[130px] rounded-full pointer-events-none z-0 hidden lg:block" />

      {/* HEADER */}
      <div className="relative z-10 max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <Wand2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF4C00] flex-shrink-0" />
          <h2 className="text-xl xs:text-2xl md:text-3xl font-black tracking-tight text-white uppercase leading-tight">
            Mood-Based Picks
          </h2>
        </div>
        <p className="text-[11px] sm:text-xs md:text-sm text-zinc-400 font-medium leading-normal">
          Tell us how you feel, we&apos;ll pick what to watch
        </p>
      </div>

      {/* MOOD SELECTOR (DaisyUI chips) */}
      <div className="relative z-10 max-w-7xl mx-auto mb-10 flex flex-wrap gap-2.5">
        {MOODS.map((mood) => {
          const Icon = mood.icon;
          const isActive = activeMood === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => setActiveMood(mood.id)}
              className={`btn btn-sm sm:btn-md rounded-full gap-2 border transition-all duration-300 ${
                isActive
                  ? "bg-[#FF4C00] hover:bg-[#E04300] border-[#FF4C00] text-black"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300"
              }`}
            >
              <Icon size={16} />
              <span className="text-xs font-bold">{mood.label}</span>
            </button>
          );
        })}
      </div>

      {/* RESULTS GRID */}
      <div className="relative z-10 max-w-7xl mx-auto min-h-[280px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMood}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5"
          >
            {filtered.length === 0 && (
              <p className="col-span-full text-center text-zinc-500 text-sm py-10">
                No picks for this mood yet — try another one.
              </p>
            )}

            {filtered.map((item) => (
              <div key={item.id} className="group/card flex flex-col gap-2.5">
                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden border border-white/5 hover:border-[#FF4C00]/50 hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(255,76,0,0.12)] transition-all duration-300 ease-out cursor-pointer">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />

                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 z-10 p-3 text-center">
                    <p className="text-[10px] text-zinc-300 leading-snug">{item.blurb}</p>
                    <div className="flex items-center gap-3">
                      <button className="w-9 h-9 rounded-full bg-[#FF4C00] flex items-center justify-center text-white">
                        <Play size={14} fill="currentColor" className="ml-0.5" />
                      </button>
                      <button className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <h4 className="text-sm font-bold text-white truncate w-full group-hover/card:text-[#FF4C00] transition-colors leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-semibold mt-0.5 truncate">
                    {item.category} • <span className="text-zinc-600">{item.year}</span>
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}