"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, Loader2, Film } from "lucide-react";
import ReviewCard from "./ReviewCard";

interface ReviewData {
  _id: string;
  movieId: string;
  movieTitle: string;
  userName: string;
  username: string;
  userAvatar: string;
  rating: number;
  review: string;
  createdAt: string;
}

export default function ReviewSection() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalReviews: 0, averageRating: 0 });

  useEffect(() => {
    async function loadRealReviews() {
      try {
        setLoading(true);
        const res = await fetch("/api/reviews?limit=12");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.reviews)) {
            setReviews(data.reviews);
            if (data.stats) {
              setStats(data.stats);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load community reviews:", err);
      } finally {
        setLoading(false);
      }
    }

    loadRealReviews();
  }, []);

  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-24">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-20 h-[350px] w-[500px] -translate-x-1/2 rounded-full bg-[#FF4C00]/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="h-[2px] w-8 bg-[#FF4C00]" />
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF4C00]">
              <MessageSquare size={12} />
              <span>Community Reviews</span>
            </span>
            <span className="h-[2px] w-8 bg-[#FF4C00]" />
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            What Our <span className="text-[#FF4C00]">Viewers Say</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-500">
            Real perspectives and movie impressions shared directly by Flixora members from movie details pages.
          </p>
        </motion.div>

        {/* ================= REVIEWS CONTENT ================= */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[220px] gap-3">
            <Loader2 size={32} className="animate-spin text-[#FF4C00]" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Loading Community Reviews...
            </span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-[#0A0A0A] border border-dashed border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#FF4C00]">
              <Film size={28} />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                No Community Reviews Yet
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Be the first to share your thoughts! Visit any movie details page, rate the film, and your review will appear here publicly.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {reviews.map((review, index) => {
              const username =
                review.username ||
                `@${(review.userName || 'viewer').toLowerCase().replace(/[^a-z0-9]/g, '')}`;
              const avatar =
                review.userAvatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  review.userName || 'Viewer'
                )}&backgroundColor=141414&textColor=ff4c00`;

              return (
                <motion.div
                  key={review._id}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.1,
                  }}
                >
                  <ReviewCard
                    name={review.userName}
                    username={username}
                    review={review.review}
                    rating={review.rating}
                    avatar={avatar}
                    movieTitle={review.movieTitle}
                    movieId={review.movieId}
                  />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ================= BOTTOM STATS ================= */}
        {!loading && reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 flex flex-col items-center justify-center gap-2 text-center"
          >
            <div className="flex items-center gap-2 bg-[#0E0E0E] border border-zinc-850 px-5 py-2.5 rounded-2xl">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={15}
                    fill={index < Math.round(stats.averageRating) ? "currentColor" : "none"}
                    className={index < Math.round(stats.averageRating) ? "text-[#FF4C00]" : "text-zinc-700"}
                  />
                ))}
              </div>

              <span className="text-sm font-black text-white ml-1">
                {stats.averageRating.toFixed(1)} / 5.0
              </span>

              <span className="text-zinc-600 text-xs">•</span>

              <span className="text-xs text-zinc-400 font-semibold">
                Based on {stats.totalReviews} verified viewer {stats.totalReviews === 1 ? 'review' : 'reviews'}
              </span>
            </div>

            <p className="text-[11px] text-zinc-600 font-medium">
              All reviews are submitted by verified viewers on movie details pages
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}