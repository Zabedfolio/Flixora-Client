"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Film, Play } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop",
    title: "Fury: Born of War",
    subtitle: "A grizzled tank commander makes tough decisions as he and his crew fight their way across Germany in April, 1945.",
    highlight: "Critically Acclaimed Action",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
    title: "The Silent Cosmos",
    subtitle: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival and discover deep stellar secrets.",
    highlight: "Top Sci-Fi Blockbuster",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop",
    title: "Neon Shadows",
    subtitle: "When a ruthless crime syndicate threatens the cyberpunk streets of Gotham, a rogue detective takes the law into his own hands.",
    highlight: "Viewer's Choice Thriller",
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after manual interaction
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden bg-black select-none">
      
      {/* Slides */}
      <AnimatePresence mode="wait">
        {slides.map((slide, index) => (
          index === currentSlide && (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              
              {/* Premium Dark Gradients for better readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
              
              {/* Subtle visual grid mesh overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:40px_40px] opacity-30" />
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            
            {/* Tag Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-1.5 xs:gap-2 px-3 py-1.5 xs:px-5 xs:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6">
                <Film className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[#FF4C00] flex-shrink-0" />
                <span className="text-[8px] xs:text-[10px] font-bold text-[#E5E5E5] tracking-wider xs:tracking-widest uppercase truncate max-w-[240px] xs:max-w-none">
                  STREAMING NOW • EXCLUSIVE COLLECTION
                </span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-black leading-none text-white mb-6 tracking-tighter"
            >
              {slides[currentSlide].title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-zinc-300 mb-8 max-w-lg leading-relaxed"
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/"
                className="bg-[#FF4C00] hover:bg-[#E04300] text-white px-8 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2.5 transition-all duration-300 hover:scale-105 shadow-xl shadow-[#FF4C00]/10 outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00]"
              >
                <Play size={16} fill="currentColor" /> WATCH NOW
              </Link>
            </motion.div>

            {/* Highlight Tag */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 inline-flex items-center gap-2 px-5 py-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/5 text-zinc-300 text-xs font-semibold"
            >
              <span className="text-[#FF4C00]">★</span> {slides[currentSlide].highlight}
            </motion.div>

          </div>
        </div>
      </div>

      {/* Navigation Arrows (hidden on mobile/tablet) */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 hidden md:flex items-center justify-center bg-black/40 hover:bg-[#FF4C00] text-white hover:text-white rounded-full border border-white/10 hover:border-transparent transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 hidden md:flex items-center justify-center bg-black/40 hover:bg-[#FF4C00] text-white hover:text-white rounded-full border border-white/10 hover:border-transparent transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-[#FF4C00] w-10" 
                : "bg-white/30 hover:bg-white/50 w-2.5"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 text-[10px] font-bold tracking-widest"
      >
        SCROLL TO EXPLORE
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#FF4C00] to-transparent mt-2 animate-bounce" />
      </motion.div>

    </section>
  );
}