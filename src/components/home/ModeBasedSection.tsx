'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2,
  Smile,
  Zap,
  Heart,
  Moon,
  Ghost,
  Cpu,
  Flame,
  LayoutGrid,
  ListFilter,
  Sparkles,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react';
import MediaCard from '@/components/ui/card';
import { getMoodBasedPicks, MoviePick } from '@/data/home/moodBased';

export type MoodId =
  | 'feel-good'
  | 'thrilling'
  | 'romantic'
  | 'chill'
  | 'dark'
  | 'mind-bending'
  | 'adrenaline';

export type EnergyLevel = 'all' | 'relaxed' | 'balanced' | 'high';

interface MoodOption {
  id: MoodId;
  label: string;
  tagline: string;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
  energy: 'relaxed' | 'balanced' | 'high';
}

const MOODS: MoodOption[] = [
  {
    id: 'feel-good',
    label: 'Feel-Good',
    tagline: 'Heartwarming, uplifting stories to boost your spirits',
    icon: Smile,
    color: '#FF4C00',
    bgGradient: 'from-[#FF4C00]/20 via-[#FF4C00]/5 to-transparent',
    energy: 'balanced',
  },
  {
    id: 'thrilling',
    label: 'Thrilling',
    tagline: 'Edge-of-your-seat suspense and high-stakes twists',
    icon: Zap,
    color: '#FF8C00',
    bgGradient: 'from-[#FF8C00]/20 via-[#FF8C00]/5 to-transparent',
    energy: 'high',
  },
  {
    id: 'romantic',
    label: 'Romantic',
    tagline: 'Deep emotional connections and passionate tales',
    icon: Heart,
    color: '#FF3366',
    bgGradient: 'from-[#FF3366]/20 via-[#FF3366]/5 to-transparent',
    energy: 'relaxed',
  },
  {
    id: 'chill',
    label: 'Chill & Cozy',
    tagline: 'Laid-back, comforting visuals for a easy night in',
    icon: Moon,
    color: '#00E5FF',
    bgGradient: 'from-[#00E5FF]/20 via-[#00E5FF]/5 to-transparent',
    energy: 'relaxed',
  },
  {
    id: 'dark',
    label: 'Dark & Gritty',
    tagline: 'Raw, intense noir mysteries and psychological depth',
    icon: Ghost,
    color: '#A855F7',
    bgGradient: 'from-[#A855F7]/20 via-[#A855F7]/5 to-transparent',
    energy: 'high',
  },
  {
    id: 'mind-bending',
    label: 'Mind-Bending',
    tagline: 'Complex sci-fi, time loops, and reality-altering plots',
    icon: Cpu,
    color: '#3B82F6',
    bgGradient: 'from-[#3B82F6]/20 via-[#3B82F6]/5 to-transparent',
    energy: 'balanced',
  },
  {
    id: 'adrenaline',
    label: 'Adrenaline Rush',
    tagline: 'Non-stop action sequences and fast-paced thrill rides',
    icon: Flame,
    color: '#FF2A00',
    bgGradient: 'from-[#FF2A00]/20 via-[#FF2A00]/5 to-transparent',
    energy: 'high',
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
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
};

export default function MoodBasedPicks() {
  const [activeMood, setActiveMood] = useState<MoodId>('feel-good');
  const [selectorMode, setSelectorMode] = useState<'chips' | 'grid'>('chips');
  const [energyFilter, setEnergyFilter] = useState<EnergyLevel>('all');
  const [picks, setPicks] = useState<MoviePick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMoodBasedPicks()
      .then(data => {
        setPicks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading mood-based picks:', err);
        setLoading(false);
      });
  }, []);

  const filteredMovies = useMemo(() => {
    return picks.filter(item => {
      const matchesMood = item.moods.includes(activeMood);
      const matchesEnergy =
        energyFilter === 'all' || item.energy === energyFilter;
      return matchesMood && matchesEnergy;
    });
  }, [picks, activeMood, energyFilter]);

  const activeMoodData = useMemo(() => {
    return MOODS.find(m => m.id === activeMood) || MOODS[0];
  }, [activeMood]);

  if (loading) {
    return (
      <section className="relative bg-black py-16 px-4 md:px-8 border-t border-[#121212]">
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[350px]">
          <span className="loading loading-spinner text-[#FF4C00] loading-lg"></span>
          <p className="text-[10px] text-zinc-500 mt-4 tracking-widest uppercase font-bold">
            Scanning Your Vibes...
          </p>
        </div>
      </section>
    );
  }

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
              onClick={() => setSelectorMode('chips')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectorMode === 'chips'
                  ? 'bg-[#FF4C00] text-black shadow-md shadow-[#FF4C00]/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ListFilter size={14} />
              <span>Chips</span>
            </button>

            <button
              onClick={() => setSelectorMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectorMode === 'grid'
                  ? 'bg-[#FF4C00] text-black shadow-md shadow-[#FF4C00]/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid size={14} />
              <span>Grid View</span>
            </button>
          </div>
        </div>

        {/* MOOD SELECTOR AREA */}
        <AnimatePresence mode="wait">
          {selectorMode === 'chips' ? (
            /* CHIPS SELECTOR VIEW */
            <motion.div
              key="chips-view"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mb-8 flex overflow-x-auto sm:flex-wrap items-center gap-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {MOODS.map(mood => {
                const Icon = mood.icon;
                const isActive = activeMood === mood.id;
                const moodMovieCount = picks.filter(p =>
                  p.moods.includes(mood.id),
                ).length;

                return (
                  <button
                    key={mood.id}
                    onClick={() => setActiveMood(mood.id)}
                    className={`relative flex shrink-0 items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-bold transition-all duration-200 outline-none cursor-pointer ${
                      isActive
                        ? 'bg-[#FF4C00] border-[#FF4C00] text-black shadow-[0_0_20px_rgba(255,76,0,0.25)]'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    <Icon
                      size={16}
                      className={isActive ? 'text-black' : 'text-[#FF4C00]'}
                    />
                    <span>{mood.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-black/20 text-black font-extrabold'
                          : 'bg-white/10 text-zinc-400'
                      }`}
                    >
                      {moodMovieCount}
                    </span>

                    {isActive && (
                      <motion.div
                        layoutId="activeMoodChip"
                        className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#FF4C00]"
                        transition={{
                          type: 'spring',
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
              {MOODS.map(mood => {
                const Icon = mood.icon;
                const isActive = activeMood === mood.id;
                const moodMovieCount = picks.filter(p =>
                  p.moods.includes(mood.id),
                ).length;

                return (
                  <motion.div
                    key={mood.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveMood(mood.id)}
                    className={`relative p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between min-h-[110px] overflow-hidden transition-all duration-300 ${
                      isActive
                        ? 'bg-[#141414] border-[#FF4C00] shadow-[0_0_25px_rgba(255,76,0,0.3)]'
                        : 'bg-[#0B0B0B] border-white/10 hover:border-white/20 hover:bg-[#121212]'
                    }`}
                  >
                    {/* Background Subtle Gradient */}
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${mood.bgGradient} opacity-40 pointer-events-none`}
                    />

                    <div className="relative z-10 flex items-center justify-between">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isActive
                            ? 'bg-[#FF4C00] text-black'
                            : 'bg-white/5 text-white'
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
                          isActive ? 'text-[#FF4C00]' : 'text-white'
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
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 flex items-center gap-1.5 shrink-0">
              <SlidersHorizontal size={12} className="text-[#FF4C00]" />
              Energy Intensity:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {(['all', 'relaxed', 'balanced', 'high'] as EnergyLevel[]).map(
                lvl => (
                  <button
                    key={lvl}
                    onClick={() => setEnergyFilter(lvl)}
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md transition-all ${
                      energyFilter === lvl
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {lvl}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="text-xs text-zinc-400 font-medium">
            Showing{' '}
            <span className="text-white font-bold">
              {filteredMovies.length}
            </span>{' '}
            titles for{' '}
            <span className="text-[#FF4C00] font-bold">
              {activeMoodData.label}
            </span>
          </div>
        </div>

        {/* MOOD RESULTS GRID */}
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
                    Try switching energy levels or selecting a different mood
                    chip.
                  </p>
                  <button
                    onClick={() => setEnergyFilter('all')}
                    className="mt-4 px-4 py-2 bg-[#FF4C00] text-black text-xs font-bold rounded-full hover:bg-[#E04300] transition-colors"
                  >
                    Reset Energy Filter
                  </button>
                </div>
              ) : (
                filteredMovies.map(item => (
                  <motion.div
                    key={item.id}
                    variants={cardVariants}
                    className="w-full"
                  >
                    <MediaCard
                      id={item.id}
                      title={item.title}
                      unsplash_url={item.image}
                      rating={item.rating.toFixed(1)}
                      year={item.year.toString()}
                      category={item.category}
                      duration={`${item.matchScore}% Match`}
                      isNew={item.matchScore >= 95}
                    />
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
