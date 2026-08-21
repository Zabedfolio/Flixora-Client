"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Heart,
  BarChart3,
  User,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
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
  isLive?: boolean;
}

const videos: Video[] = [
  {
    id: "1",
    title: "Srivalli (Video) | Pushpa | Allu Arjun, Rashmika Mandanna",
    views: "60 views",
    uploaded: "5 months ago",
    duration: "5:51",
    thumbnail:
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=225&fit=crop",
    channel: {
      name: "t-series",
      avatar: "https://i.pravatar.cc/40?img=11",
    },
  },
  {
    id: "2",
    title: "Car Racing",
    views: "61 views",
    uploaded: "5 months ago",
    duration: "00:24",
    thumbnail:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=225&fit=crop",
    channel: {
      name: "rengoku",
      avatar: "https://i.pravatar.cc/40?img=12",
    },
  },
  {
    id: "3",
    title: "Roblox Game development",
    views: "21 views",
    uploaded: "5 months ago",
    duration: "00:24",
    thumbnail:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=225&fit=crop",
    channel: {
      name: "swdefsg",
      avatar: "https://i.pravatar.cc/40?img=33",
    },
  },
  {
    id: "4",
    title: "Ghevar Recipe",
    views: "21 views",
    uploaded: "8 months ago",
    duration: "00:05",
    thumbnail:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a285?w=400&h=225&fit=crop",
    channel: {
      name: "mhari rasoi",
      avatar: "https://i.pravatar.cc/40?img=5",
    },
  },
  {
    id: "5",
    title: "Check this out",
    views: "11 views",
    uploaded: "10 months ago",
    duration: "00:11",
    thumbnail:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=225&fit=crop",
    channel: {
      name: "modak",
      avatar: "https://i.pravatar.cc/40?img=20",
    },
  },
  {
    id: "6",
    title: "test",
    views: "2 views",
    uploaded: "1 years ago",
    duration: "00:31",
    thumbnail:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=225&fit=crop",
    channel: {
      name: "rengoku",
      avatar: "https://i.pravatar.cc/40?img=12",
    },
  },
  {
    id: "7",
    title: "success story of a great person",
    views: "18 views",
    uploaded: "1 years ago",
    duration: "00:21",
    thumbnail:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
    channel: {
      name: "one",
      avatar: "https://i.pravatar.cc/40?img=8",
    },
  },
  {
    id: "8",
    title: "Chittorgarh Rajasthan",
    views: "72 views",
    uploaded: "1 years ago",
    duration: "00:26",
    thumbnail:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=225&fit=crop",
    channel: {
      name: "demo22",
      avatar: "https://i.pravatar.cc/40?img=15",
    },
  },
  {
    id: "9",
    title: "Narlai Rajasthan",
    views: "150 views",
    uploaded: "1 years ago",
    duration: "00:26",
    thumbnail:
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=225&fit=crop",
    channel: {
      name: "madara",
      avatar: "https://i.pravatar.cc/40?img=25",
    },
  },
  {
    id: "10",
    title: "Check out this video 🔥🔥",
    views: "67 views",
    uploaded: "1 years ago",
    duration: "00:55",
    thumbnail:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop",
    channel: {
      name: "rengoku",
      avatar: "https://i.pravatar.cc/40?img=12",
    },
  },
  {
    id: "11",
    title: "Black Myth: Wukong - Official...",
    views: "202 views",
    uploaded: "1 years ago",
    duration: "3:17",
    thumbnail:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop",
    channel: {
      name: "technogamerz",
      avatar: "https://i.pravatar.cc/40?img=60",
    },
  },
  {
    id: "12",
    title: "Black Myth Wukong Official Trailer",
    views: "129 views",
    uploaded: "1 years ago",
    duration: "1:23",
    thumbnail:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop",
    channel: {
      name: "ghost gaming",
      avatar: "https://i.pravatar.cc/40?img=68",
    },
  },
];

export default function YourFeed() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;

  return (
    <>
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Your Feed
        </motion.h1>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="card bg-[#1a1a24] border border-base-300 shadow-xl hover:shadow-2xl hover:border-red-500/30 transition-all cursor-pointer group"
            >
              {/* Thumbnail */}
              <figure className="relative aspect-video overflow-hidden rounded-t-2xl">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-xs px-1.5 py-0.5 rounded font-medium">
                  {video.duration}
                </div>
              </figure>

              {/* Card Body */}
              <div className="card-body p-4">
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
                    <p className="font-medium text-gray-300">
                      {video.channel.name}
                    </p>
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
        <div className="flex flex-col items-center gap-3 mt-12">
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
      </main>
    </>
  );
}
