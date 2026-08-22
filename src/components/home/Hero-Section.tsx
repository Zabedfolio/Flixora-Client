'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Film, Play } from 'lucide-react';
import Link from 'next/link';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  highlight: string;
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
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    title: 'The Silent Cosmos',
    subtitle:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival and discover deep stellar secrets.",
    highlight: 'Top Sci-Fi Blockbuster',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop',
    title: 'Neon Shadows',
    subtitle:
      'When a ruthless crime syndicate threatens the cyberpunk streets of Gotham, a rogue detective takes the law into his own hands.',
    highlight: "Viewer's Choice Thriller",
  },
];

const AUTO_PLAY_INTERVAL = 5000;
const RESUME_DELAY = 8000;

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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

          <div className="absolute inset-0 bg-linear-to-r from-black via-black/60 to-transparent" />

          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/30" />

          <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:40px_40px] opacity-30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
              }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-md sm:px-5 sm:py-2">
                <Film className="h-3.5 w-3.5 text-[#FF4C00] sm:h-4 sm:w-4" />

                <span className="max-w-60 truncate text-[8px] font-bold tracking-wider text-[#E5E5E5] sm:max-w-none sm:text-[10px] sm:tracking-widest">
                  STREAMING NOW • EXCLUSIVE COLLECTION
                </span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
              className="mb-6 text-4xl font-black leading-none tracking-tight text-white sm:text-5xl lg:text-7xl"
            >
              {currentMovie.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.2,
              }}
              className="mb-8 max-w-lg text-base leading-relaxed text-zinc-300 sm:text-lg"
            >
              {currentMovie.subtitle}
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.3,
              }}
            >
              <Link
                href="/movies"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#FF4C00] px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#FF4C00]/10 transition-all duration-300 hover:scale-105 hover:bg-[#E04300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00]"
              >
                <Play size={16} fill="currentColor" />
                WATCH NOW
              </Link>
            </motion.div>

            {/* Highlight */}
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.6,
              }}
              className="mt-10 inline-flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-5 py-2 text-xs font-semibold text-zinc-300 backdrop-blur-sm"
            >
              <span className="text-[#FF4C00]">★</span>

              {currentMovie.highlight}
            </motion.div>
          </div>
        </div>
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
