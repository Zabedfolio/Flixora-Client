"use client";

import Link from "next/link";
import {
  MessageSquare,
  Users,
  Film,
  BarChart3,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <main className="p-6 md:p-10">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck
              size={18}
              className="text-[#FF4C00]"
            />

            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FF4C00]">
              Flixora Administration
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black">
            Admin Dashboard
          </h1>

          <p className="text-sm text-zinc-500 mt-2">
            Manage your Flixora platform from one place.
          </p>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          {/* Catalogue */}
          <Link
            href="/admin/catalogue"
            className="group bg-[#101010] border border-[#1E1E1E] rounded-2xl p-6 hover:border-[#FF4C00]/40 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FF4C00]/10 flex items-center justify-center mb-5">
              <Film
                size={22}
                className="text-[#FF4C00]"
              />
            </div>

            <h2 className="text-lg font-black">
              Catalogue
            </h2>

            <p className="text-xs text-zinc-500 mt-2 leading-5">
              Manage movies and catalogue content.
            </p>

            <div className="flex items-center gap-2 mt-5 text-xs font-bold text-[#FF4C00]">
              Manage
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>

          {/* Users */}
          <Link
            href="/admin/users"
            className="group bg-[#101010] border border-[#1E1E1E] rounded-2xl p-6 hover:border-[#FF4C00]/40 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FF4C00]/10 flex items-center justify-center mb-5">
              <Users
                size={22}
                className="text-[#FF4C00]"
              />
            </div>

            <h2 className="text-lg font-black">
              Users
            </h2>

            <p className="text-xs text-zinc-500 mt-2 leading-5">
              Manage registered Flixora users.
            </p>

            <div className="flex items-center gap-2 mt-5 text-xs font-bold text-[#FF4C00]">
              Manage
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>

          {/* Reviews */}
          <Link
            href="/admin/reviews"
            className="group bg-[#101010] border border-[#1E1E1E] rounded-2xl p-6 hover:border-[#FF4C00]/40 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FF4C00]/10 flex items-center justify-center mb-5">
              <MessageSquare
                size={22}
                className="text-[#FF4C00]"
              />
            </div>

            <h2 className="text-lg font-black">
              Reviews
            </h2>

            <p className="text-xs text-zinc-500 mt-2 leading-5">
              Moderate, approve and reject user reviews.
            </p>

            <div className="flex items-center gap-2 mt-5 text-xs font-bold text-[#FF4C00]">
              Review Moderation
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>

          {/* Analytics */}
          <Link
            href="/admin/analytics"
            className="group bg-[#101010] border border-[#1E1E1E] rounded-2xl p-6 hover:border-[#FF4C00]/40 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FF4C00]/10 flex items-center justify-center mb-5">
              <BarChart3
                size={22}
                className="text-[#FF4C00]"
              />
            </div>

            <h2 className="text-lg font-black">
              Analytics
            </h2>

            <p className="text-xs text-zinc-500 mt-2 leading-5">
              View platform statistics and analytics.
            </p>

            <div className="flex items-center gap-2 mt-5 text-xs font-bold text-[#FF4C00]">
              View Analytics
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>

        </div>

        {/* Reviews Shortcut */}
        <div className="mt-8 bg-[#101010] border border-[#1E1E1E] rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <div className="flex items-center gap-2">
                <MessageSquare
                  size={17}
                  className="text-[#FF4C00]"
                />

                <h2 className="font-black">
                  Review Moderation
                </h2>
              </div>

              <p className="text-xs text-zinc-500 mt-2">
                Check pending reviews and manage user feedback.
              </p>
            </div>

            <Link
              href="/admin/reviews"
              className="inline-flex items-center justify-center gap-2 bg-[#FF4C00] hover:bg-[#ff5f1a] text-black px-5 py-3 rounded-xl text-xs font-black transition-all"
            >
              Open Reviews
              <ArrowRight size={15} />
            </Link>

          </div>
        </div>

      </main>
    </div>
  );
}