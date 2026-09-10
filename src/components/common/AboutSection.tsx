"use client";

import Link from "next/link";
import {
  Clapperboard,
  Sparkles,
  PlayCircle,
  Users,
  Film,
  Star,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Clapperboard,
    title: "A World of Movies",
    description:
      "Explore a growing collection of movies across action, drama, comedy, thriller, sci-fi and more.",
  },
  {
    icon: Sparkles,
    title: "Smart Recommendations",
    description:
      "Discover movies that match your interests with personalized recommendations built around your taste.",
  },
  {
    icon: PlayCircle,
    title: "Watch Your Way",
    description:
      "Find movie details, trailers and your favorite content in one smooth and immersive experience.",
  },
  {
    icon: Users,
    title: "Built for Movie Lovers",
    description:
      "Rate movies, share your thoughts and discover what other Flixora viewers are enjoying.",
  },
];

const marqueeItems = [
  "DISCOVER",
  "WATCH",
  "EXPLORE",
  "RATE",
  "RECOMMEND",
  "REPEAT",
  "YOUR NEXT STORY",
  "YOUR NEXT FAVORITE",
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#080808] py-20 md:py-28"
    >
      {/* =========================================
          BACKGROUND EFFECTS
      ========================================= */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#FF4C00]/5 blur-[120px]" />

      <div className="pointer-events-none absolute -left-40 top-1/2 h-72 w-72 rounded-full bg-[#FF4C00]/[0.025] blur-[100px]" />

      {/* =========================================
          MAIN CONTENT
      ========================================= */}
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">

        {/* =========================================
            TOP LABEL
        ========================================= */}
        <div className="mb-5 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF4C00]/20 bg-[#FF4C00]/5 px-4 py-2">
            <Film size={14} className="text-[#FF4C00]" />

            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#FF4C00]">
              About Flixora
            </span>
          </div>
        </div>

        {/* =========================================
            HEADING
        ========================================= */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            More Than Just
            <span className="block text-[#FF4C00]">
              Movies.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base md:leading-8">
            Flixora brings movies, discovery and personalized experiences
            together in one place. Find something you love, press play and
            make every watch feel like a new journey.
          </p>
        </div>

        {/* =========================================
            INFINITE CINEMATIC MARQUEE
        ========================================= */}
        <div className="relative mt-16 -mx-5 overflow-hidden border-y border-[#1A1A1A] bg-[#0B0B0B] py-5 md:-mx-8">

          {/* Left Fade */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#0B0B0B] to-transparent md:w-32" />

          {/* Right Fade */}
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#0B0B0B] to-transparent md:w-32" />

          <div className="flex w-max animate-[marquee_28s_linear_infinite]">

            {/* First group */}
            <div className="flex shrink-0 items-center">
              {marqueeItems.map((item, index) => (
                <div
                  key={`first-${item}-${index}`}
                  className="flex items-center"
                >
                  <span className="px-5 text-sm font-black uppercase tracking-[0.2em] text-zinc-500 md:px-7 md:text-base">
                    {item}
                  </span>

                  <span className="flex h-2 w-2 items-center justify-center">
                    <span className="h-1.5 w-1.5 rotate-45 bg-[#FF4C00]" />
                  </span>
                </div>
              ))}
            </div>

            {/* Second group for seamless loop */}
            <div className="flex shrink-0 items-center">
              {marqueeItems.map((item, index) => (
                <div
                  key={`second-${item}-${index}`}
                  className="flex items-center"
                >
                  <span className="px-5 text-sm font-black uppercase tracking-[0.2em] text-zinc-500 md:px-7 md:text-base">
                    {item}
                  </span>

                  <span className="flex h-2 w-2 items-center justify-center">
                    <span className="h-1.5 w-1.5 rotate-45 bg-[#FF4C00]" />
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* =========================================
            CINEMATIC STATEMENT
        ========================================= */}
        <div className="mx-auto mt-16 max-w-4xl text-center md:mt-20">

          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-[#FF4C00]/40" />

            <Star
              size={15}
              className="fill-[#FF4C00] text-[#FF4C00]"
            />

            <div className="h-px w-10 bg-[#FF4C00]/40" />
          </div>

          <p className="text-xl font-bold leading-relaxed text-zinc-200 sm:text-2xl md:text-3xl">
            "Every movie has a story.
            <span className="text-[#FF4C00]">
              {" "}Every story deserves to be discovered.
            </span>
            "
          </p>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
            This is Flixora
          </p>
        </div>

        {/* =========================================
            FEATURE CARDS
        ========================================= */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-[#1E1E1E] bg-[#101010] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#FF4C00]/30 hover:bg-[#121212]"
              >

                {/* Card Number */}
                <div className="absolute right-5 top-5 text-[10px] font-black tracking-widest text-zinc-800">
                  0{index + 1}
                </div>

                {/* Icon */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[#FF4C00]/15 bg-[#FF4C00]/10 transition-all duration-300 group-hover:border-[#FF4C00]/30 group-hover:bg-[#FF4C00]/15">
                  <Icon
                    size={21}
                    className="text-[#FF4C00] transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Title */}
                <h3 className="text-base font-black text-white">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {feature.description}
                </p>

                {/* =================================
                    EXPLORE BUTTON
                    Goes to /movies
                ================================= */}
                <Link
                  href="/movies"
                  className="mt-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-700 transition-all duration-300 hover:text-[#FF4C00]"
                >
                  <span>Explore</span>

                  <ArrowRight
                    size={12}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                {/* Hover Glow */}
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-[#FF4C00]/5 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              </div>
            );
          })}

        </div>

        {/* =========================================
            BOTTOM CTA
        ========================================= */}
        <div className="relative mt-10 overflow-hidden rounded-2xl border border-[#1E1E1E] bg-[#0D0D0D] px-6 py-7 md:px-10 md:py-8">

          {/* Orange Accent */}
          <div className="absolute left-0 top-0 h-full w-1 bg-[#FF4C00]" />

          <div className="flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">

            <div>
              <p className="text-lg font-black text-white">
                Your next favorite movie is waiting.
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Discover something new and let the story begin.
              </p>
            </div>

            {/* Bottom CTA also goes to /movies */}
            <Link
              href="/movies"
              className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#FF4C00]"
            >
              <PlayCircle size={17} />

              <span>Press Play</span>

              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>
        </div>

      </div>

      {/* =========================================
          MARQUEE ANIMATION
      ========================================= */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}