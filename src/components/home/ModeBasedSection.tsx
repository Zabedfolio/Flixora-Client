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
  Cpu,
  Flame,
  Play,
  Plus,
  Check,
  LayoutGrid,
  ListFilter,
  Sparkles,
  SlidersHorizontal,
  Star,
  type LucideIcon,
} from "lucide-react";

export type MoodId =
  | "feel-good"
  | "thrilling"
  | "romantic"
  | "chill"
  | "dark"
  | "mind-bending"
  | "adrenaline";

export type EnergyLevel = "all" | "relaxed" | "balanced" | "high";

interface MoodOption {
  id: MoodId;
  label: string;
  tagline: string;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
  energy: "relaxed" | "balanced" | "high";
}

interface MoviePick {
  id: number;
  title: string;
  image: string;
  category: string;
  year: number;
  rating: number;
  matchScore: number;
  blurb: string;
  moods: MoodId[];
  energy: "relaxed" | "balanced" | "high";
}

const MOODS: MoodOption[] = [
  {
    id: "feel-good",
    label: "Feel-Good",
    tagline: "Heartwarming, uplifting stories to boost your spirits",
    icon: Smile,
    color: "#FF4C00",
    bgGradient: "from-[#FF4C00]/20 via-[#FF4C00]/5 to-transparent",
    energy: "balanced",
  },
  {
    id: "thrilling",
    label: "Thrilling",
    tagline: "Edge-of-your-seat suspense and high-stakes twists",
    icon: Zap,
    color: "#FF8C00",
    bgGradient: "from-[#FF8C00]/20 via-[#FF8C00]/5 to-transparent",
    energy: "high",
  },
  {
    id: "romantic",
    label: "Romantic",
    tagline: "Deep emotional connections and passionate tales",
    icon: Heart,
    color: "#FF3366",
    bgGradient: "from-[#FF3366]/20 via-[#FF3366]/5 to-transparent",
    energy: "relaxed",
  },
  {
    id: "chill",
    label: "Chill & Cozy",
    tagline: "Laid-back, comforting visuals for a easy night in",
    icon: Moon,
    color: "#00E5FF",
    bgGradient: "from-[#00E5FF]/20 via-[#00E5FF]/5 to-transparent",
    energy: "relaxed",
  },
  {
    id: "dark",
    label: "Dark & Gritty",
    tagline: "Raw, intense noir mysteries and psychological depth",
    icon: Ghost,
    color: "#A855F7",
    bgGradient: "from-[#A855F7]/20 via-[#A855F7]/5 to-transparent",
    energy: "high",
  },
  {
    id: "mind-bending",
    label: "Mind-Bending",
    tagline: "Complex sci-fi, time loops, and reality-altering plots",
    icon: Cpu,
    color: "#3B82F6",
    bgGradient: "from-[#3B82F6]/20 via-[#3B82F6]/5 to-transparent",
    energy: "balanced",
  },
  {
    id: "adrenaline",
    label: "Adrenaline Rush",
    tagline: "Non-stop action sequences and fast-paced thrill rides",
    icon: Flame,
    color: "#FF2A00",
    bgGradient: "from-[#FF2A00]/20 via-[#FF2A00]/5 to-transparent",
    energy: "high",
  },
];

const PICKS: MoviePick[] = [
  {
    id: 1,
    title: "Echoes of Eternity",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop",
    category: "Drama / Romance",
    year: 2024,
    rating: 8.8,
    matchScore: 98,
    blurb: "A slow-burn love story across two lifetimes.",
    moods: ["romantic", "feel-good", "chill"],
    energy: "relaxed",
  },
  {
    id: 2,
    title: "Chrono Drift",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop",
    category: "Adventure / Fantasy",
    year: 2025,
    rating: 8.5,
    matchScore: 94,
    blurb: "A light, whimsical time-hopping adventure.",
    moods: ["feel-good", "chill", "mind-bending"],
    energy: "balanced",
  },
  {
    id: 3,
    title: "Fury: Born of War",
    image: "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&auto=format&fit=crop",
    category: "Action / War",
    year: 2025,
    rating: 9.1,
    matchScore: 97,
    blurb: "Relentless, high-stakes combat drama.",
    moods: ["thrilling", "dark", "adrenaline"],
    energy: "high",
  },
  {
    id: 4,
    title: "Shadows in the Neon",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop",
    category: "Thriller / Cyberpunk",
    year: 2025,
    rating: 8.9,
    matchScore: 96,
    blurb: "A tense neon-soaked cat-and-mouse chase.",
    moods: ["thrilling", "dark", "mind-bending"],
    energy: "high",
  },
  {
    id: 5,
    title: "Tokyo Cyber-Run",
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&auto=format&fit=crop",
    category: "Anime / Cyberpunk",
    year: 2026,
    rating: 8.7,
    matchScore: 93,
    blurb: "Fast-paced anime chaos with heart.",
    moods: ["thrilling", "feel-good", "adrenaline"],
    energy: "high",
  },
  {
    id: 6,
    title: "The Silent Cosmos",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop",
    category: "Documentary / Sci-Fi",
    year: 2026,
    rating: 9.3,
    matchScore: 99,
    blurb: "A meditative, awe-filled journey through space.",
    moods: ["chill", "romantic", "mind-bending"],
    energy: "relaxed",
  },
  {
    id: 7,
    title: "Project Zero: Genesis",
    image: "https://images.unsplash.com/photo-1511715282680-fbf93a50e721?w=800&auto=format&fit=crop",
    category: "Sci-Fi / Action",
    year: 2026,
    rating: 8.6,
    matchScore: 92,
    blurb: "Brooding sci-fi with a dark moral core.",
    moods: ["dark", "thrilling", "mind-bending"],
    energy: "high",
  },
  {
    id: 8,
    title: "Velvet Singularity",
    image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&auto=format&fit=crop",
    category: "Mystery / Thriller",
    year: 2025,
    rating: 8.4,
    matchScore: 90,
    blurb: "An atmospheric mystery unraveling digital secrets.",
    moods: ["mind-bending", "chill", "romantic"],
    energy: "relaxed",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

export default function MoodBasedPicks() {
  const [activeMood, setActiveMood] = useState<MoodId>("feel-good");
  const [selectorMode, setSelectorMode] = useState<"chips" | "grid">("chips");
  const [energyFilter, setEnergyFilter] = useState<EnergyLevel>("all");
  const [savedIds, setSavedIds] = useState<number[]>([]);

  const filteredMovies = useMemo(() => {
    return PICKS.filter((item) => {
      const matchesMood = item.moods.includes(activeMood);
      const matchesEnergy =
        energyFilter === "all" || item.energy === energyFilter;
      return matchesMood && matchesEnergy;
    });
  }, [activeMood, energyFilter]);

  const activeMoodData = useMemo(() => {
    return MOODS.find((m) => m.id === activeMood) || MOODS[0];
  }, [activeMood]);

  const toggleSave = (id: number) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="relative bg-black py-16 px-4 md:px-8 select-none overflow-hidden z-10 border-t border-[#121212]">
      {/* Dynamic Background Glow matching active mood */}
      <div
        className="absolute top-1/4 right-1/4 translate-y-1/3 w-[550px] h-[550px] blur-[140px] rounded-full pointer-events-none z-0 hidden lg:block transition-all duration-700 opacity-20"
        style={{ backgroundColor: activeMoodData.color }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER & SELECTOR VIEW TOGGLE */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
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

          {/* VIEW MODE SWITCHER (Chips vs Grid) */}
          <div className="flex items-center gap-2 bg-[#0E0E0E] border border-white/10 rounded-full p-1 self-start sm:self-auto">
            <button
              onClick={() => setSelectorMode("chips")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectorMode === "chips"
                  ? "bg-[#FF4C00] text-black shadow-md shadow-[#FF4C00]/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <ListFilter size={14} />
              <span>Chips</span>
            </button>

            <button
              onClick={() => setSelectorMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectorMode === "grid"
                  ? "bg-[#FF4C00] text-black shadow-md shadow-[#FF4C00]/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <LayoutGrid size={14} />
              <span>Grid View</span>
            </button>
          </div>
        </div>

        {/* MOOD SELECTOR AREA (ANIMATED TRANSITION BETWEEN CHIPS & GRID) */}
        <AnimatePresence mode="wait">
          {selectorMode === "chips" ? (
            /* CHIPS SELECTOR VIEW */
            <motion.div
              key="chips-view"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mb-8 flex flex-wrap items-center gap-2.5"
            >
              {MOODS.map((mood) => {
                const Icon = mood.icon;
                const isActive = activeMood === mood.id;
                const moodMovieCount = PICKS.filter((p) =>
                  p.moods.includes(mood.id)
                ).length;

                return (
                  <button
                    key={mood.id}
                    onClick={() => setActiveMood(mood.id)}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-bold transition-all duration-200 outline-none cursor-pointer ${
                      isActive
                        ? "bg-[#FF4C00] border-[#FF4C00] text-black shadow-[0_0_20px_rgba(255,76,0,0.25)]"
                        : "bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300 hover:border-white/20"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={isActive ? "text-black" : "text-[#FF4C00]"}
                    />
                    <span>{mood.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-black/20 text-black font-extrabold"
                          : "bg-white/10 text-zinc-400"
                      }`}
                    >
                      {moodMovieCount}
                    </span>

                    {isActive && (
                      <motion.div
                        layoutId="activeMoodChip"
                        className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#FF4C00]"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </motion.div>
          ) : (
            /* GRID SELECTOR VIEW */
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="mb-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3"
            >
              {MOODS.map((mood) => {
                const Icon = mood.icon;
                const isActive = activeMood === mood.id;
                const moodMovieCount = PICKS.filter((p) =>
                  p.moods.includes(mood.id)
                ).length;

                return (
                  <motion.div
                    key={mood.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveMood(mood.id)}
                    className={`relative p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between min-h-[110px] overflow-hidden transition-all duration-300 ${
                      isActive
                        ? "bg-[#141414] border-[#FF4C00] shadow-[0_0_25px_rgba(255,76,0,0.3)]"
                        : "bg-[#0B0B0B] border-white/10 hover:border-white/20 hover:bg-[#121212]"
                    }`}
                  >
                    {/* Background Subtle Gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${mood.bgGradient} opacity-40 pointer-events-none`}
                    />

                    <div className="relative z-10 flex items-center justify-between">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isActive
                            ? "bg-[#FF4C00] text-black"
                            : "bg-white/5 text-white"
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                        {moodMovieCount} picks
                      </span>
                    </div>

                    <div className="relative z-10 mt-3">
                      <h4
                        className={`text-xs font-extrabold truncate ${
                          isActive ? "text-[#FF4C00]" : "text-white"
                        }`}
                      >
                        {mood.label}
                      </h4>
                      <p className="text-[9px] text-zinc-500 truncate mt-0.5">
                        {mood.energy} energy
                      </p>
                    </div>

                    {isActive && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF4C00] animate-ping" />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ENERGY INTENSITY FILTER & SUMMARY BAR */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
              <SlidersHorizontal size={12} className="text-[#FF4C00]" />
              Energy Intensity:
            </span>
            {(["all", "relaxed", "balanced", "high"] as EnergyLevel[]).map(
              (lvl) => (
                <button
                  key={lvl}
                  onClick={() => setEnergyFilter(lvl)}
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md transition-all ${
                    energyFilter === lvl
                      ? "bg-white/10 text-white border border-white/20"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {lvl}
                </button>
              )
            )}
          </div>

          <div className="text-xs text-zinc-400 font-medium">
            Showing <span className="text-white font-bold">{filteredMovies.length}</span> titles for{" "}
            <span className="text-[#FF4C00] font-bold">{activeMoodData.label}</span>
          </div>
        </div>

        {/* MOOD RESULTS GRID WITH FRAMER MOTION ANIMATIONS */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeMood}-${energyFilter}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5"
            >
              {filteredMovies.length === 0 ? (
                <div className="col-span-full py-16 text-center flex flex-col items-center justify-center bg-white/5 rounded-2xl border border-white/5">
                  <Sparkles size={28} className="text-[#FF4C00] mb-2" />
                  <p className="text-sm font-bold text-white">
                    No matching titles for this energy filter
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Try switching energy levels or selecting a different mood chip.
                  </p>
                  <button
                    onClick={() => setEnergyFilter("all")}
                    className="mt-4 px-4 py-2 bg-[#FF4C00] text-black text-xs font-bold rounded-full hover:bg-[#E04300] transition-colors"
                  >
                    Reset Energy Filter
                  </button>
                </div>
              ) : (
                filteredMovies.map((item) => {
                  const isSaved = savedIds.includes(item.id);

                  return (
                    <motion.div
                      key={item.id}
                      variants={cardVariants}
                      className="group/card flex flex-col gap-2.5"
                    >
                      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden border border-white/5 hover:border-[#FF4C00]/50 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,76,0,0.18)] transition-all duration-300 ease-out cursor-pointer bg-[#0A0A0A]">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                        />

                        {/* Top Rating & Match Badge */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                          <span className="bg-black/70 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-extrabold text-[#FF4C00]">
                            {item.matchScore}% Match
                          </span>
                        </div>

                        {/* Top Save Bookmark Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSave(item.id);
                          }}
                          className={`absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                            isSaved
                              ? "bg-[#FF4C00] text-black"
                              : "bg-black/60 text-white border border-white/10 hover:border-[#FF4C00]"
                          }`}
                        >
                          {isSaved ? <Check size={14} /> : <Plus size={14} />}
                        </button>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 z-10 p-4 text-center">
                          <p className="text-[11px] text-zinc-300 leading-snug font-medium">
                            {item.blurb}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <button className="w-10 h-10 rounded-full bg-[#FF4C00] hover:bg-[#E04300] flex items-center justify-center text-black shadow-lg shadow-[#FF4C00]/30 transition-transform active:scale-95">
                              <Play
                                size={16}
                                fill="currentColor"
                                className="ml-0.5"
                              />
                            </button>
                            <button
                              onClick={() => toggleSave(item.id)}
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                isSaved
                                  ? "bg-[#FF4C00] text-black"
                                  : "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                              }`}
                            >
                              {isSaved ? <Check size={16} /> : <Plus size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Movie Info */}
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-sm font-bold text-white truncate group-hover/card:text-[#FF4C00] transition-colors leading-tight">
                            {item.title}
                          </h4>
                          <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold shrink-0">
                            <Star size={10} fill="currentColor" />
                            {item.rating}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-semibold mt-0.5 truncate">
                          {item.category} •{" "}
                          <span className="text-zinc-600">{item.year}</span>
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}