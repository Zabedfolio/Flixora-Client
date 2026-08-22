'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  Film,
  Play,
  Send,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  highlight: string;
  aiMatch: number;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop',
    title: 'Fury: Born of War',
    subtitle:
      'A grizzled tank commander makes tough decisions as he and his crew fight their way across Germany in April, 1945.',
    highlight: 'Critically Acclaimed Action',
    aiMatch: 96,
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    title: 'The Silent Cosmos',
    subtitle:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival and discover deep stellar secrets.",
    highlight: 'Top Sci-Fi Blockbuster',
    aiMatch: 99,
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop',
    title: 'Neon Shadows',
    subtitle:
      'When a ruthless crime syndicate threatens the cyberpunk streets of Gotham, a rogue detective takes the law into his own hands.',
    highlight: "Viewer's Choice Thriller",
    aiMatch: 93,
  },
];

const AUTO_PLAY_INTERVAL = 5000;
const RESUME_DELAY = 8000;

// --- AI quick-recommendation demo data -------------------------------------
// Static/mock keyword matcher standing in for a real AI backend. Swap this
// out for an actual API call (e.g. to your assistant/LLM endpoint) later.
interface AiSuggestion {
  title: string;
  reason: string;
}

const AI_SUGGESTION_CHIPS = ['Something intense', 'Feel-good pick', 'Surprise me'];

const AI_KEYWORD_MAP: { keywords: string[]; suggestion: AiSuggestion }[] = [
  {
    keywords: ['intense', 'action', 'war', 'fight'],
    suggestion: { title: 'Fury: Born of War', reason: 'high-stakes, unrelenting combat drama' },
  },
  {
    keywords: ['feel-good', 'feel good', 'happy', 'light', 'romance'],
    suggestion: { title: 'Echoes of Eternity', reason: 'a warm, slow-burn love story' },
  },
  {
    keywords: ['space', 'sci-fi', 'scifi', 'cosmos', 'thoughtful'],
    suggestion: { title: 'The Silent Cosmos', reason: 'a meditative journey through deep space' },
  },
  {
    keywords: ['thriller', 'dark', 'crime', 'neon', 'cyberpunk'],
    suggestion: { title: 'Neon Shadows', reason: 'a gritty, neon-soaked crime thriller' },
  },
];

const AI_FALLBACK_SUGGESTIONS: AiSuggestion[] = [
  { title: 'Tokyo Cyber-Run', reason: "it's trending hard with viewers like you" },
  { title: 'Chrono Drift', reason: 'a fan-favorite pick across all moods' },
  { title: 'Project Zero: Genesis', reason: "Flixora's top-rated new release" },
];

function getAiSuggestion(query: string): AiSuggestion {
  const normalized = query.toLowerCase();
  const match = AI_KEYWORD_MAP.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword))
  );

  if (match) {
    return match.suggestion;
  }

  return AI_FALLBACK_SUGGESTIONS[
    Math.floor(Math.random() * AI_FALLBACK_SUGGESTIONS.length)
  ];
}
// -----------------------------------------------------------------------------

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AiSuggestion | null>(null);

  const currentMovie = SLIDES[currentSlide];

  useEffect(() => {
    if (!isAutoPlaying) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentSlide(previous => (previous + 1) % SLIDES.length);
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);

    window.setTimeout(() => {
      setIsAutoPlaying(true);
    }, RESUME_DELAY);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    pauseAutoPlay();
  };

  const goToNextSlide = () => {
    setCurrentSlide(previous => (previous + 1) % SLIDES.length);

    pauseAutoPlay();
  };

  const goToPreviousSlide = () => {
    setCurrentSlide(previous => (previous - 1 + SLIDES.length) % SLIDES.length);

    pauseAutoPlay();
  };

  const runAiSearch = (query: string) => {
    const trimmed = query.trim();

    if (!trimmed) {
      return;
    }

    pauseAutoPlay();
    setAiLoading(true);
    setAiSuggestion(null);

    // Simulated "thinking" delay — replace with a real API call.
    window.setTimeout(() => {
      setAiSuggestion(getAiSuggestion(trimmed));
      setAiLoading(false);
    }, 900);
  };

  const handleAiSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runAiSearch(aiQuery);
  };

  const handleChipClick = (chip: string) => {
    setAiQuery(chip);
    runAiSearch(chip);
  };

  const matchLabel = useMemo(
    () => `${currentMovie.aiMatch}% AI Match`,
    [currentMovie.aiMatch]
  );

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-black">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{
            opacity: 0,
            scale: 1.05,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.98,
          }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${currentMovie.image})`,
            }}
          />

          

          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/30" />

          <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:40px_40px] opacity-30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className=" flex   h-full items-center ">
            {/* Ask Flix AI — quick recommendation bar */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.7,
              }}
              className="mt-50  w-8/12   mx-auto "
            >
              <form
                onSubmit={handleAiSubmit}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 p-2 backdrop-blur-md focus-within:border-[#FF4C00]/50"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#FF4C00]/15 border border-[#FF4C00]/30">
                  <Bot size={16} className="text-[#FF4C00]" />
                </div>

                <input
                  type="text"
                  value={aiQuery}
                  onChange={(event) => setAiQuery(event.target.value)}
                  placeholder="Ask Flix AI what to watch tonight..."
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white placeholder:text-zinc-500 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={aiLoading || !aiQuery.trim()}
                  aria-label="Ask Flix AI"
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#FF4C00] text-black transition-transform duration-200 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                >
                  <Send size={14} />
                </button>
              </form>

              {/* Quick suggestion chips */}
              {/* <div className="mt-3 flex flex-wrap gap-2">
                {AI_SUGGESTION_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-zinc-300 transition-colors hover:border-[#FF4C00]/40 hover:text-[#FF4C00]"
                  >
                    {chip}
                  </button>
                ))}
              </div> */}

              {/* AI response */}
              <AnimatePresence mode="wait">
                {(aiLoading || aiSuggestion) && (
                  <motion.div
                    key={aiLoading ? 'loading' : aiSuggestion?.title}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="mt-3 flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/5 px-4 py-3 backdrop-blur-sm"
                  >
                    <Sparkles size={14} className="mt-0.5 flex-shrink-0 text-[#FF4C00]" />

                    {aiLoading ? (
                      <span className="text-xs font-medium text-zinc-400">
                        Flix is thinking
                        <span className="animate-pulse">...</span>
                      </span>
                    ) : (
                      <p className="text-xs font-medium leading-relaxed text-zinc-300">
                        Try{' '}
                        <span className="font-bold text-white">
                          {aiSuggestion?.title}
                        </span>{' '}
                        — {aiSuggestion?.reason}.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>       
      </div>

      {/* Previous */}
      <button
        type="button"
        onClick={goToPreviousSlide}
        aria-label="Previous slide"
        className="absolute left-6 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white transition-all duration-300 hover:scale-110 hover:border-transparent hover:bg-[#FF4C00] md:flex"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Next */}
      <button
        type="button"
        onClick={goToNextSlide}
        aria-label="Next slide"
        className="absolute right-6 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white transition-all duration-300 hover:scale-110 hover:border-transparent hover:bg-[#FF4C00] md:flex"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-10 bg-[#FF4C00]'
                : 'w-2.5 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center text-[10px] font-bold tracking-widest text-white/50 sm:flex">
        SCROLL TO EXPLORE
        <div className="mt-2 h-8 w-px animate-bounce bg-linear-to-b from-transparent via-[#FF4C00] to-transparent" />
      </div>
    </section>
  );
}