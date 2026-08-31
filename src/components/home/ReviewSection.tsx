"use client";

import { motion } from "framer-motion";
import ReviewCard from "./ReviewCard";

const reviews = [
  {
    id: 1,
    name: "Sarah Wilson",
    username: "@sarah_w",
    rating: 5,
    review:
      "Flixora has completely changed the way I discover movies. The recommendations are surprisingly accurate and the interface looks amazing.",
    avatar:
      "https://i.pravatar.cc/150?img=47",
  },
  {
    id: 2,
    name: "Daniel Smith",
    username: "@daniel_s",
    rating: 5,
    review:
      "The movie collection is great and everything feels really smooth. I especially love the personalized recommendations.",
    avatar:
      "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 3,
    name: "Emma Johnson",
    username: "@emma_j",
    rating: 4,
    review:
      "A beautiful platform for movie lovers. Finding something interesting to watch is much easier now.",
    avatar:
      "https://i.pravatar.cc/150?img=32",
  },
  {
    id: 4,
    name: "Michael Brown",
    username: "@michael_b",
    rating: 5,
    review:
      "I really like the clean dark design and how quickly I can find movies based on my mood.",
    avatar:
      "https://i.pravatar.cc/150?img=11",
  },
];

export default function ReviewSection() {
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

            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF4C00]">
              Community Reviews
            </span>

            <span className="h-[2px] w-8 bg-[#FF4C00]" />
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            What Our{" "}
            <span className="text-[#FF4C00]">
              Viewers Say
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-500">
            See what movie lovers around the world think about
            their experience with Flixora.
          </p>
        </motion.div>

        {/* ================= REVIEW CARDS ================= */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
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
                name={review.name}
                username={review.username}
                review={review.review}
                rating={review.rating}
                avatar={review.avatar}
              />
            </motion.div>
          ))}
        </div>

        {/* ================= BOTTOM STAT ================= */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 flex flex-col items-center justify-center gap-2 text-center"
        >
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className="text-[#FF4C00]"
                >
                  ★
                </span>
              ))}
            </div>

            <span className="text-sm font-bold text-white">
              4.8/5
            </span>
          </div>

          <p className="text-xs text-zinc-600">
            Based on thousands of viewer reviews
          </p>
        </motion.div>
      </div>
    </section>
  );
}