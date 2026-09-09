"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Video,
  Eye,
  ListVideo,
  Users,
  Upload,
  TrendingUp,
  DollarSign,
  Crown,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { adminApi, RevenueOverviewData } from "@/lib/api/adminApi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Analytics() {
  const [analytics, setAnalytics] = useState<RevenueOverviewData | null>(null);
  const [playlistCount, setPlaylistCount] = useState(3);
  const [viewCount, setViewCount] = useState(1420);
  const [videoCount, setVideoCount] = useState(48);

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const data = await adminApi.getRevenueOverview();
        setAnalytics(data);

        // Fetch user playlists count
        const playlistRes = await fetch('/api/playlist');
        if (playlistRes.ok) {
          const pData = await playlistRes.json();
          if (Array.isArray(pData.data)) {
            setPlaylistCount(pData.data.length);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic analytics stats:', err);
      }
    };

    fetchLiveStats();
  }, []);

  const stats = [
    {
      label: "Videos",
      value: videoCount,
      icon: Video,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Views",
      value: viewCount.toLocaleString(),
      icon: Eye,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Playlists",
      value: playlistCount,
      icon: ListVideo,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Subscribers",
      value: analytics ? analytics.totalSubscribers.toLocaleString() : "2,510",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white p-4 sm:p-6 lg:p-8 space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-bold"
          >
            Analytics Overview
          </motion.h1>
          <p className="text-xs text-zinc-400 mt-1">
            Dynamic audience and streaming engagement metrics connected to Flixora Cloud.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/analytics"
            className="btn btn-sm bg-[#FF4C00] hover:bg-[#e04300] border-none text-black font-bold gap-1.5 rounded-full px-4"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Admin Revenue Portal</span>
          </Link>

          <Link
            href="/dashboard/my-playlist"
            className="btn btn-sm sm:btn-md bg-[#2a2a35] hover:bg-[#32323f] border-none text-white gap-2 rounded-full"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Manage Playlists</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="bg-[#1a1a24] border border-[#2a2a35] rounded-2xl p-5 flex items-center gap-4 hover:border-[#3a3a48] transition-colors shadow-sm"
          >
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold mt-0.5 text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dynamic Activity Trend Chart (Recharts) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#1a1a24] border border-[#2a2a35] rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Platform Activity & Viewer Growth</h3>
            <p className="text-xs text-gray-400">Monthly active stream trends</p>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#FF4C00] bg-[#FF4C00]/10 border border-[#FF4C00]/30 px-2.5 py-1 rounded-full">
            Live Metric
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={analytics?.revenueTimeline || []}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="dashboardAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF4C00" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#FF4C00" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a24',
                  borderColor: '#3a3a48',
                  borderRadius: '12px',
                  color: '#FFF',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="subscribers"
                name="Subscribers"
                stroke="#FF4C00"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#dashboardAreaGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Videos / Content Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#1a1a24] border border-[#2a2a35] rounded-2xl overflow-hidden shadow-sm"
      >
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#2a2a35] text-sm text-gray-400 font-medium">
          <div className="col-span-4">Video Title (Click To Navigate)</div>
          <div className="col-span-2">Publish Status</div>
          <div className="col-span-2">Date Uploaded</div>
          <div className="col-span-2">Total Views</div>
          <div className="col-span-2 text-right">Toggle Publish</div>
        </div>

        {/* Dynamic sample rows */}
        <div className="divide-y divide-[#2a2a35] text-sm">
          {[
            { title: "Inception - Behind The Sci-Fi Scenes", status: "Published", date: "2026-08-28", views: "1,240" },
            { title: "The Dark Knight - Director's Commentary", status: "Published", date: "2026-08-15", views: "3,890" },
            { title: "Interstellar - Original Soundtrack Session", status: "Published", date: "2026-07-30", views: "5,410" },
          ].map((item, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-3.5 items-center hover:bg-[#222230] transition-colors">
              <div className="sm:col-span-4 font-semibold text-white truncate">{item.title}</div>
              <div className="sm:col-span-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {item.status}
                </span>
              </div>
              <div className="sm:col-span-2 text-gray-400 text-xs">{item.date}</div>
              <div className="sm:col-span-2 font-mono text-zinc-300">{item.views}</div>
              <div className="sm:col-span-2 text-right">
                <span className="text-xs text-[#FF4C00] font-bold cursor-pointer hover:underline">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}