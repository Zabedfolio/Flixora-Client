"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface ReviewCardProps {
  name: string;
  username: string;
  review: string;
  rating: number;
  avatar: string;
}

export default function ReviewCard({
  name,
  username,
  review,
  rating,
  avatar,
}: ReviewCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        transition: { duration: 0.25 },
      }}
      className="
        group
        relative
        flex
        h-full
        min-h-[250px]
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-white/[0.08]
        bg-[#0b0b0b]
        p-6
        transition-all
        duration-300
        hover:border-[#FF4C00]/40
        hover:bg-[#101010]
      "
    >
      {/* Orange Glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-32
          w-32
          rounded-full
          bg-[#FF4C00]/10
          blur-3xl
          transition-opacity
          duration-300
          group-hover:bg-[#FF4C00]/20
        "
      />

      {/* Quote Icon */}
      <div className="absolute right-5 top-5 text-[#FF4C00]/20">
        <Quote size={38} fill="currentColor" />
      </div>

      {/* User Info */}
      <div className="relative z-10 flex items-center gap-3">
        <img
          src={avatar}
          alt={name}
          className="
            h-11
            w-11
            rounded-full
            border
            border-[#FF4C00]/30
            object-cover
          "
        />

        <div>
          <h3 className="text-sm font-bold text-white">
            {name}
          </h3>

          <p className="text-xs text-zinc-500">
            {username}
          </p>
        </div>
      </div>

      {/* Rating */}
      <div className="relative z-10 mt-5 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={15}
            className={
              index < rating
                ? "fill-[#FF4C00] text-[#FF4C00]"
                : "text-zinc-700"
            }
          />
        ))}

        <span className="ml-2 text-xs font-semibold text-zinc-400">
          {rating}.0
        </span>
      </div>

      {/* Review */}
      <p className="relative z-10 mt-5 flex-1 text-sm leading-7 text-zinc-400">
        “{review}”
      </p>

      {/* Bottom Line */}
      <div className="mt-5 h-px w-full bg-white/[0.06]" />

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
          Verified Viewer
        </span>

        <span className="h-1.5 w-1.5 rounded-full bg-[#FF4C00]" />
      </div>
    </motion.div>
  );
}