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
              const isHovered = hoveredMovie === movie.id;

              return (
                <article
                  key={movie.id}
                  onMouseEnter={() => setHoveredMovie(movie.id)}
                  onMouseLeave={() => setHoveredMovie(null)}
                  className="
                    group
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
                  <div
                    className="
                      relative
                      aspect-[3/4.35]
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/10
                      bg-zinc-950
                      shadow-2xl
                      transition-all
                      duration-500
                      ease-out
                      group-hover:-translate-y-2
                      group-hover:border-orange-500/50
                      group-hover:shadow-[0_25px_70px_rgba(0,0,0,0.75)]
                    "
                  >
                    {/* ================= IMAGE ================= */}
                    <div
                      className={`
                        absolute
                        inset-0
                        bg-cover
                        bg-center
                        ease-in-out
                        ${
                          isHovered
                            ? "animate-[movieSpin_2s_ease-in-out]"
                            : ""
                        }
                      `}
                      style={{
                        backgroundImage: `url("${movie.image}")`,
                      }}
                    />

                    {/* Image Overlay */}
                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-black/0
                        transition-all
                        duration-500
                        group-hover:bg-black/10
                      "
                    />

                    {/* Dark Gradient */}
                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black
                        via-black/25
                        to-transparent
                        opacity-85
                        transition-opacity
                        duration-500
                        group-hover:opacity-100
                      "
                    />

                    {/* Orange Hover Glow */}
                    <div
                      className="
                        pointer-events-none
                        absolute
                        -bottom-24
                        left-1/2
                        h-48
                        w-48
                        -translate-x-1/2
                        rounded-full
                        bg-orange-500/30
                        opacity-0
                        blur-[70px]
                        transition-all
                        duration-500
                        group-hover:opacity-100
                      "
                    />

                    {/* Top Shine */}
                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-x-0
                        top-0
                        h-32
                        bg-gradient-to-b
                        from-white/15
                        to-transparent
                        opacity-0
                        transition-opacity
                        duration-500
                        group-hover:opacity-100
                      "
                    />

                    {/* ================= RATING ================= */}
                    <div className="absolute right-3 top-3 z-20">
                      <div
                        className="
                          flex
                          items-center
                          gap-1.5
                          rounded-lg
                          border
                          border-white/15
                          bg-black/75
                          px-2.5
                          py-1.5
                          text-xs
                          font-bold
                          text-white
                          backdrop-blur-md
                          transition-all
                          duration-300
                          group-hover:scale-105
                          group-hover:border-orange-500/60
                        "
                      >
                        <Star
                          size={12}
                          fill="currentColor"
                          className="text-orange-500"
                        />

                        {movie.rating}
                      </div>
                    </div>

                    {/* ================= PLAY BUTTON ================= */}
                    <button
                      aria-label={`Play ${movie.title}`}
                      className="
                        absolute
                        left-1/2
                        top-1/2
                        z-30
                        flex
                        h-12
                        w-12
                        -translate-x-1/2
                        -translate-y-1/2
                        scale-75
                        items-center
                        justify-center
                        rounded-full
                        bg-orange-500
                        text-white
                        opacity-0
                        shadow-[0_0_35px_rgba(249,115,22,0.5)]
                        transition-all
                        duration-500
                        group-hover:scale-100
                        group-hover:opacity-100
                        hover:scale-110
                        hover:bg-orange-400
                      "
                    >
                      <Play size={17} fill="currentColor" />
                    </button>

                    {/* ================= CARD CONTENT ================= */}
                    <div className="absolute inset-x-0 bottom-0 z-20 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span
                          className="
                            text-[10px]
                            font-bold
                            tracking-[0.25em]
                            text-orange-500
                            transition-all
                            duration-300
                            group-hover:tracking-[0.35em]
                          "
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="text-[10px] font-medium text-white/70">
                          {movie.year}
                        </span>
                      </div>

                      <h3
                        className="
                          translate-y-1
                          text-lg
                          font-extrabold
                          leading-tight
                          text-white
                          transition-all
                          duration-300
                          group-hover:translate-y-0
                          group-hover:text-orange-50
                        "
                      >
                        {movie.title}
                      </h3>

                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-white/65">
                        {movie.category}
                      </p>

                      {/* Hover Extra Info */}
                      <div
                        className="
                          mt-3
                          flex
                          items-center
                          justify-between
                          overflow-hidden
                          max-h-0
                          translate-y-2
                          opacity-0
                          transition-all
                          duration-500
                          group-hover:max-h-10
                          group-hover:translate-y-0
                          group-hover:opacity-100
                        "
                      >
                        <span className="text-[10px] font-medium text-white/60">
                          {movie.duration}
                        </span>

                        <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500">
                          Explore
                          <ArrowUpRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
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