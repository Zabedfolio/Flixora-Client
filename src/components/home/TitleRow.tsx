"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Play,
  ArrowUpRight,
} from "lucide-react";
import MediaCard from "@/components/ui/card";

type Movie = {
  id: number;
  title: string;
  category: string;
  rating: string;
  image: string;
  year: string;
  duration: string;
};

const movies: Movie[] = [
  {
    id: 1,
    title: "The Last Stand",
    category: "ACTION • DRAMA",
    rating: "8.9",
    year: "2026",
    duration: "2h 12m",
    image: "https://picsum.photos/seed/laststandmovie/700/1000",
  },
  {
    id: 2,
    title: "Dark Mission",
    category: "ACTION • THRILLER",
    rating: "8.7",
    year: "2026",
    duration: "2h 08m",
    image: "https://picsum.photos/seed/darkmissionmovie/700/1000",
  },
  {
    id: 3,
    title: "Edge of Tomorrow",
    category: "SCI-FI • ACTION",
    rating: "8.5",
    year: "2025",
    duration: "2h 18m",
    image: "https://picsum.photos/seed/edgeoftomorrowmovie/700/1000",
  },
  {
    id: 4,
    title: "After Rain",
    category: "DRAMA • ROMANCE",
    rating: "8.2",
    year: "2025",
    duration: "1h 56m",
    image: "https://picsum.photos/seed/afterrainmovie/700/1000",
  },
  {
    id: 5,
    title: "The Final Target",
    category: "ACTION • CRIME",
    rating: "8.3",
    year: "2026",
    duration: "2h 05m",
    image: "https://picsum.photos/seed/finaltargetmovie/700/1000",
  },
  {
    id: 6,
    title: "Neon Shadows",
    category: "THRILLER • CYBERPUNK",
    rating: "8.6",
    year: "2026",
    duration: "2h 21m",
    image: "https://picsum.photos/seed/neonshadowsmovie/700/1000",
  },
  {
    id: 7,
    title: "Chrono Drift",
    category: "ADVENTURE • FANTASY",
    rating: "8.8",
    year: "2026",
    duration: "2h 14m",
    image: "https://picsum.photos/seed/chronodriftmovie/700/1000",
  },
  {
    id: 8,
    title: "The Silent Cosmos",
    category: "SCI-FI • SPACE",
    rating: "9.0",
    year: "2026",
    duration: "2h 28m",
    image: "https://picsum.photos/seed/silentcosmosmovie/700/1000",
  },
  {
    id: 9,
    title: "Echoes of Eternity",
    category: "DRAMA • MYSTERY",
    rating: "8.4",
    year: "2025",
    duration: "2h 02m",
    image: "https://picsum.photos/seed/echoeseternitymovie/700/1000",
  },
  {
    id: 10,
    title: "Fury Born of War",
    category: "ACTION • WAR",
    rating: "8.7",
    year: "2026",
    duration: "2h 16m",
    image: "https://picsum.photos/seed/furywarmovie/700/1000",
  },
  {
    id: 11,
    title: "Beyond the Unknown",
    category: "SCI-FI • MYSTERY",
    rating: "8.9",
    year: "2026",
    duration: "2h 24m",
    image: "https://picsum.photos/seed/beyondunknownmovie/700/1000",
  },
  {
    id: 12,
    title: "Broken Silence",
    category: "DRAMA • MYSTERY",
    rating: "8.1",
    year: "2025",
    duration: "1h 49m",
    image: "https://picsum.photos/seed/brokensilencemovie/700/1000",
  },
];

export default function TitleRow() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);

  const scrollRight = () => {
    if (!carouselRef.current) return;

    carouselRef.current.scrollBy({
      left: carouselRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const scrollLeft = () => {
    if (!carouselRef.current) return;

    carouselRef.current.scrollBy({
      left: -carouselRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const handleViewAll = () => {
    router.push("/explore");
  };

  return (
    <section className="relative w-full overflow-hidden bg-black py-20">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-[650px] -translate-x-1/2 rounded-full bg-orange-500/[0.035] blur-[120px]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="mb-7">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-orange-500" />

            <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange-500">
              Curated For You
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            Popular{" "}
            <span className="text-orange-500">Movies</span>
          </h2>

          <p className="mt-2 text-sm text-zinc-400 sm:text-base">
            Handpicked stories worth watching tonight
          </p>
        </div>

        {/* Divider */}
        <div className="mb-8 h-px w-full bg-white/10">
          <div className="h-px w-20 bg-orange-500" />
        </div>

        {/* ================= CAROUSEL WRAPPER ================= */}
        <div className="relative">

          {/* LEFT ARROW */}
          <button
            onClick={scrollLeft}
            aria-label="Previous movies"
            className="
              group
              absolute
              left-1
              top-1/2
              z-40
              hidden
              h-11
              w-11
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/15
              bg-black/80
              text-white
              shadow-xl
              backdrop-blur-md
              transition-all
              duration-300
              hover:border-orange-500
              hover:bg-orange-500
              hover:shadow-[0_0_25px_rgba(249,115,22,0.35)]
              sm:flex
            "
          >
            <ChevronLeft
              size={20}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
          </button>

          {/* RIGHT ARROW */}
          <button
            onClick={scrollRight}
            aria-label="Next movies"
            className="
              group
              absolute
              right-1
              top-1/2
              z-40
              hidden
              h-11
              w-11
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/15
              bg-black/80
              text-white
              shadow-xl
              backdrop-blur-md
              transition-all
              duration-300
              hover:border-orange-500
              hover:bg-orange-500
              hover:shadow-[0_0_25px_rgba(249,115,22,0.35)]
              sm:flex
            "
          >
            <ChevronRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>

          {/* ================= MOVIE CARDS ================= */}
          <div
            ref={carouselRef}
            className="
              flex
              snap-x
              snap-mandatory
              gap-5
              overflow-x-auto
              scroll-smooth
              pb-4
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {movies.map((movie, index) => {
              return (
                <div
                  key={movie.id}
                  className="
                    min-w-[calc((100%-60px)/4)]
                    max-w-[calc((100%-60px)/4)]
                    flex-[0_0_calc((100%-60px)/4)]
                    snap-start

                    max-[1100px]:min-w-[calc((100%-40px)/3)]
                    max-[1100px]:max-w-[calc((100%-40px)/3)]
                    max-[1100px]:flex-[0_0_calc((100%-40px)/3)]

                    max-[760px]:min-w-[calc((100%-20px)/2)]
                    max-[760px]:max-w-[calc((100%-20px)/2)]
                    max-[760px]:flex-[0_0_calc((100%-20px)/2)]

                    max-[500px]:min-w-full
                    max-[500px]:max-w-full
                    max-[500px]:flex-[0_0_100%]
                  "
                >
                  <MediaCard
                    title={movie.title}
                    unsplash_url={movie.image}
                    rating={movie.rating}
                    year={movie.year}
                    category={movie.category.split(" • ")[0]}
                    duration={movie.duration}
                    isNew={index % 3 === 0}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= MOBILE ARROWS ================= */}
        <div className="mt-5 flex justify-center gap-3 sm:hidden">
          <button
            onClick={scrollLeft}
            aria-label="Previous movies"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-white/15
              bg-zinc-900
              text-white
              transition-all
              hover:border-orange-500
              hover:bg-orange-500
            "
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={scrollRight}
            aria-label="Next movies"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-white/15
              bg-zinc-900
              text-white
              transition-all
              hover:border-orange-500
              hover:bg-orange-500
            "
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* ================= BOTTOM ================= */}
        <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
            <span className="text-orange-500">{movies.length}</span>{" "}
            Titles in Collection
          </span>

          <button
            onClick={handleViewAll}
            className="
              group
              flex
              items-center
              gap-2
              text-xs
              font-bold
              uppercase
              tracking-[0.12em]
              text-white
              transition-all
              duration-300
              hover:text-orange-500
            "
          >
            View All

            <ArrowUpRight
              size={15}
              className="
                text-orange-500
                transition-transform
                duration-300
                group-hover:-translate-y-1
                group-hover:translate-x-1
              "
            />
          </button>
        </div>
      </div>

    
    </section>
  );
}