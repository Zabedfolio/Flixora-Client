"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { getTMDBImageUrl } from "@/data/tmdb";

export interface AiMovie {
  id: number;
  title: string;
  original_title?: string;
  overview?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  media_type?: string;
}

interface AiMovieResultCardProps {
  movie: AiMovie;
  index?: number;
  onSelect?: (movie: AiMovie) => void;
}

export default function AiMovieResultCard({
  movie,
  index = 0,
  onSelect,
}: AiMovieResultCardProps) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : null;
  const rating =
    typeof movie.vote_average === "number" ? movie.vote_average.toFixed(1) : null;

  const posterUrl = getTMDBImageUrl(movie.poster_path, "w342");

  return (
    <motion.button
      type="button"
      onClick={() => onSelect?.(movie)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group relative w-[132px] flex-shrink-0 snap-start overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF4C00]/60 hover:shadow-[0_8px_24px_rgba(255,76,0,0.25)] sm:w-[150px]"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
        {movie.poster_path ? (
          <img
            src={posterUrl}
            alt={movie.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-2 text-center text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            No Poster
          </div>
        )}

        {/* Rating badge */}
        {rating && (
          <div className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 backdrop-blur-sm">
            <Star size={10} className="fill-[#FF4C00] text-[#FF4C00]" />
            <span className="text-[10px] font-bold text-white">{rating}</span>
          </div>
        )}

        {/* Bottom gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Info */}
      <div className="px-2.5 py-2">
        <p className="line-clamp-1 text-xs font-bold text-white">
          {movie.title}
        </p>
        {year && (
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
            {year}
          </p>
        )}
      </div>
    </motion.button>
  );
}