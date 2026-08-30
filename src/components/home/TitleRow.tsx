"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MediaCard from "@/components/ui/card";
import { fetchFromTMDB, getTMDBImageUrl } from "@/data/tmdb";
import { getGenreName, formatDuration } from "@/data/home/newReleases";

type Movie = {
  id: number;
  title: string;
  category: string;
  rating: string;
  image: string;
  year: string;
  duration: string;
};

export default function TitleRow() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFromTMDB<{ results: any[] }>('/movie/popular?language=en-US&page=4')
      .then((data) => {
        if (data.results && data.results.length > 0) {
          setMovies(data.results.slice(0, 10).map((movie) => ({
            id: movie.id,
            title: movie.title,
            category: getGenreName(movie.genre_ids),
            rating: movie.vote_average > 0 ? movie.vote_average.toFixed(1) : '8.5',
            image: getTMDBImageUrl(movie.poster_path, 'w500'),
            year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : '2026',
            duration: formatDuration(movie.id),
          })));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading popular films:", err);
        setLoading(false);
      });
  }, []);

  const handleScrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -800,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 800,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-black py-16">
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[350px]">
          <span className="loading loading-spinner text-[#FF4C00] loading-lg"></span>
          <p className="text-[10px] text-zinc-500 mt-4 tracking-widest uppercase font-bold">Populating Popular Hits...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-black py-16 sm:py-20 lg:py-24">
      {/* Dynamic Background Highlights */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute right-0 top-0 h-[450px] w-[600px] rounded-full bg-[#FF4C00]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= HEADER SECTION ================= */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-[#FF4C00]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF4C00]">
                Trending Blocks
              </span>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Popular <span className="text-[#FF4C00]">Movies</span>
            </h2>

            <div className="mt-4 h-[2px] w-12 bg-[#FF4C00]" />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2.5 max-[500px]:hidden">
            <button
              onClick={handleScrollLeft}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-black/60
                text-white
                transition-all
                duration-300
                hover:border-orange-500/50
                hover:bg-orange-500
                hover:text-black
                active:scale-95
              "
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={handleScrollRight}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-black/60
                text-white
                transition-all
                duration-300
                hover:border-orange-500/50
                hover:bg-orange-500
                hover:text-black
                active:scale-95
              "
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ================= CAROUSEL WRAPPER ================= */}
        <div className="relative group/carousel">
          {/* Left Shadow Scrim */}
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-16 bg-gradient-to-r from-black to-transparent opacity-80" />

          {/* Right Shadow Scrim */}
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-16 bg-gradient-to-l from-black to-transparent opacity-80" />

          {/* ================= MOVIE CARDS ================= */}
          <div
            ref={carouselRef}
            className="
              flex
              snap-x
              snap-mandatory
              gap-5
              overflow-x-auto
              overflow-y-hidden
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
                    id={movie.id}
                    title={movie.title}
                    unsplash_url={movie.image}
                    rating={movie.rating}
                    year={movie.year}
                    category={movie.category}
                    duration={movie.duration}
                    isNew={index % 3 === 0}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}