"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
// import { toast } from "react-toastify";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "/hero-image/image1.jpg",
    title: "Fury",
    subtitle: "A grizzled tank commander makes tough decisions as he and his crew fight their way across Germany in April, 1945.",
    highlight: "Library of Dreams",
  },
  {
    id: 2,
    image: "/hero-image/image2.jpg",
    title: "Cozy Reading Nook",
    subtitle: "Where every book feels like home",
    highlight: "Warm & Inviting",
  },
  {
    id: 3,
    image: "/hero-image/image3.jpg",
    title: "Endless Knowledge",
    subtitle: "Thousands of books waiting to be explored",
    highlight: "Your Next Adventure",
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

  const goToSlide = (index) => {
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

//   const handleShop = () => {
//     toast.success("Welcome to the bookstore! 📚", { autoClose: 2200 });
//   };

  return (
    <section className="relative h-screen  min-h-[640px] overflow-hidden bg-base-100">
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
              
              {/* Dark Overlay for better readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/30 dark:from-black/50 dark:via-black/30 dark:to-black/50" />
              
              {/* Subtle book pattern overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:40px_40px] opacity-40" />
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                <BookOpen className="w-5 h-5 text-amber-300" />
                <span className="text-xs font-medium text-white tracking-widest">EST. 2024 • CURATED COLLECTION</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-none text-white mb-6 tracking-tighter"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {slides[currentSlide].title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-md text-white/90 mb-8 max-w-lg"
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
              href={'/'}
                // onClick={handleShop}
                className="btn btn-primary px-10 py-4 rounded-2xl text-sm font-semibold flex items-center gap-3 hover:scale-105 transition-transform shadow-xl"
              >
                EXPLORE COLLECTION
                <ArrowRight size={22} />
              </Link>

              
            </motion.div>

            {/* Highlight Tag */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 inline-block px-6 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white/90 text-sm"
            >
              ✨ {slides[currentSlide].highlight}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/30 hover:bg-black/50 backdrop-blur-md text-white rounded-full border border-white/20 transition-all hover:scale-110"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/30 hover:bg-black/50 backdrop-blur-md text-white rounded-full border border-white/20 transition-all hover:scale-110"
      >
        <ChevronRight size={28} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white w-12" 
                : "bg-white/40 hover:bg-white/70 w-3"
            }`}
          />
        ))}
      </div>

      {/* Scroll Prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/70 text-xs tracking-widest"
      >
        SCROLL TO EXPLORE
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/40 to-transparent mt-2" />
      </motion.div>
    </section>
  );
}