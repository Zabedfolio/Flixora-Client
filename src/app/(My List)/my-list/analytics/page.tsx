"use client";

import { motion } from "framer-motion";
import {
  Video,
  Eye,
  ListVideo,
  Users,
  Upload,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Videos",
    value: 0,
    icon: Video,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Views",
    value: 0,
    icon: Eye,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    label: "Playlists",
    value: 0,
    icon: ListVideo,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    label: "Subscribers",
    value: 0,
    icon: Users,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export default function Analytics() {
  return (
    <div className="min-h-screen bg-[#0f0f13] text-white p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold"
        >
          Analytics
        </motion.h1>

        <Link
          href="/my-list/upload" // change to your real upload route
          className="btn btn-sm sm:btn-md bg-[#2a2a35] hover:bg-[#32323f] border-none text-white gap-2 rounded-full"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Upload Video</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="bg-[#1a1a24] border border-[#2a2a35] rounded-2xl p-5 flex items-center gap-4 hover:border-[#3a3a48] transition-colors"
          >
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold mt-0.5">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Videos Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#1a1a24] border border-[#2a2a35] rounded-2xl overflow-hidden"
      >
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#2a2a35] text-sm text-gray-400 font-medium">
          <div className="col-span-4">Video Title (Click To Navigate)</div>
          <div className="col-span-2">Publish Status</div>
          <div className="col-span-2">Date Uploaded</div>
          <div className="col-span-2">Total Views</div>
          <div className="col-span-2 text-right">Toggle Publish</div>
        </div>

        {/* Empty State */}
        <div className="px-6 py-16 text-center">
          <p className="text-gray-500 text-lg">No Videos</p>
        </div>
      </motion.div>
    </div>
  );
}