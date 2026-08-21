"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Heart,
  BarChart3,
  User,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";

interface Video {
  id: string;
  title: string;
  views: string;
  uploaded: string;
  duration: string;
  thumbnail: string;
  channel: {
    name: string;
    avatar: string;
  };
}

const likedVideos: Video[] = [
  {
    id: "1",
    title: "Srivalli (Video) | Pushpa | Allu Arjun, Rashmika Mandanna",
    views: "60 views",
    uploaded: "5 months ago",
    duration: "5:51",
    thumbnail: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=225&fit=crop",
    channel: { name: "t-series", avatar: "https://i.pravatar.cc/40?img=11" },
  },
  {
    id: "2",
    title: "Black Myth: Wukong - Official Trailer",
    views: "202 views",
    uploaded: "1 year ago",
    duration: "3:17",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop",
    channel: { name: "technogamerz", avatar: "https://i.pravatar.cc/40?img=60" },
  },
  {
    id: "3",
    title: "Car Racing Highlights",
    views: "61 views",
    uploaded: "5 months ago",
    duration: "00:24",
    thumbnail: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=225&fit=crop",
    channel: { name: "rengoku", avatar: "https://i.pravatar.cc/40?img=12" },
  },
];

export default function LikedVideos() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalPages = 1;

  return (
    <div className="flex min-h-screen bg-[#0f0f13] text-white relative">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="btn btn-ghost btn-circle"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Liked Videos</h1>
          <div className="w-10" /> {/* spacer */}
        </div>

        {/* Desktop Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:block text-3xl font-bold mb-8"
        >
          Liked Videos
        </motion.h1>

        {/* Empty State (if no videos) */}
        {likedVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Heart className="w-16 h-16 text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-300">No liked videos yet</h2>
            <p className="text-gray-500 mt-2">Videos you like will appear here</p>
          </div>
        ) : (
          <>
            {/* Video Grid - Fully Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {likedVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="card bg-[#1a1a24] border border-base-300 shadow-xl hover:shadow-2xl hover:border-red-500/40 transition-all cursor-pointer group"
                >
                  {/* Thumbnail */}
                  <figure className="relative aspect-video overflow-hidden rounded-t-2xl">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                    {/* Duration */}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-xs px-1.5 py-0.5 rounded font-medium">
                      {video.duration}
                    </div>
                    {/* Liked Badge */}
                    <div className="absolute top-2 right-2 bg-red-600 p-1.5 rounded-full shadow-lg">
                      <Heart className="w-3.5 h-3.5 fill-white text-white" />
                    </div>
                  </figure>

                  {/* Card Body */}
                  <div className="card-body p-3 sm:p-4">
                    <h2 className="card-title text-sm font-medium line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                      {video.title}
                    </h2>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="avatar">
                        <div className="w-7 h-7 rounded-full">
                          <Image
                            src={video.channel.avatar}
                            alt={video.channel.name}
                            width={28}
                            height={28}
                            className="rounded-full"
                          />
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        <p className="font-medium text-gray-300">{video.channel.name}</p>
                        <p>
                          {video.views} · {video.uploaded}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col items-center gap-3 mt-10 sm:mt-12">
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-circle btn-error text-white disabled:opacity-40"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="btn btn-circle btn-error text-white disabled:opacity-40"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}