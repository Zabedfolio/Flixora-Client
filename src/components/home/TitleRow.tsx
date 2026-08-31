"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

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
    fetchFromTMDB<{ results: any[] }>(
      "/movie/popular?language=en-US&page=4"
    )
      .then((data) => {
        if (data.results && data.results.length > 0) {
          setMovies(
            data.results.slice(0, 10).map((movie) => ({
              id: movie.id,
              title: movie.title,
              category: getGenreName(movie.genre_ids),
              rating:
                movie.vote_average > 0
                  ? movie.vote_average.toFixed(1)
                  : "8.5",
              image: getTMDBImageUrl(movie.poster_path, "w500"),
              year: movie.release_date
                ? new Date(movie.release_date)
                    .getFullYear()
                    .toString()
                : "2026",
              duration: formatDuration(movie.id),
            }))
          );
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
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto flex min-h-[350px] w-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
        >
          <span className="loading loading-spinner text-[#FF4C00] loading-lg"></span>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500"
          >
            Populating Popular Hits...
          </motion.p>
        </motion.div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7 }}
      className="relative overflow-hidden bg-black py-16 sm:py-20 lg:py-24"
    >
      {/* Dynamic Background Highlights */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="absolute right-0 top-0 h-[450px] w-[600px] rounded-full bg-[#FF4C00]/5 blur-[120px]"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER SECTION ================= */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-10 flex items-end justify-between gap-6"
        >
          <div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-2.5 flex items-center gap-2"
            >
              <span className="h-5 w-1 rounded-full bg-[#FF4C00]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF4C00]">
                Trending Blocks
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-3xl font-black tracking-tight text-white sm:text-4xl"
            >
              Popular{" "}
              <span className="text-[#FF4C00]">Movies</span>
            </motion.h2>

            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.35,
                duration: 0.6,
                ease: "easeOut",
              }}
              className="mt-4 h-[2px] bg-[#FF4C00]"
            />
          </div>

          {/* ================= CONTROLS ================= */}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="flex items-center gap-2.5 max-[500px]:hidden"
          >
            <motion.button
              whileHover={{
                scale: 1.08,
                x: -2,
              }}
              whileTap={{
                scale: 0.9,
              }}
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
              "
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.08,
                x: 2,
              }}
              whileTap={{
                scale: 0.9,
              }}
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
              "
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ================= CAROUSEL WRAPPER ================= */}

        <div className="relative group/carousel">

          {/* Left Shadow Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-16 bg-gradient-to-r from-black to-transparent"
          />

          {/* Right Shadow Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-16 bg-gradient-to-l from-black to-transparent"
          />

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
                <motion.div
                  key={movie.id}
                  initial={{
                    opacity: 0,
                    y: 45,
                    scale: 0.95,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: {
                      duration: 0.25,
                    },
                  }}
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}