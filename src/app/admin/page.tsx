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
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck
              size={18}
              className="text-[#FF4C00]"
            />

            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FF4C00]">
              Flixora Administration
            </span>
          </div>

          <h1 className="text-3xl font-black md:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Manage your Flixora platform from one place.
          </p>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {/* Catalogue */}
          <Link
            href="/admin/catalogue"
            className="group rounded-2xl border border-[#1E1E1E] bg-[#101010] p-6 transition-all hover:border-[#FF4C00]/40"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF4C00]/10">
              <Film
                size={22}
                className="text-[#FF4C00]"
              />
            </div>

            <h2 className="text-lg font-black">
              Catalogue
            </h2>

            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Manage movies and catalogue content.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-[#FF4C00]">
              Manage

              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </Link>

          {/* Users */}
          <Link
            href="/admin/users"
            className="group rounded-2xl border border-[#1E1E1E] bg-[#101010] p-6 transition-all hover:border-[#FF4C00]/40"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF4C00]/10">
              <Users
                size={22}
                className="text-[#FF4C00]"
              />
            </div>

            <h2 className="text-lg font-black">
              Users
            </h2>

            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Manage registered Flixora users.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-[#FF4C00]">
              Manage

              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </Link>

          {/* Reviews */}
          <Link
            href="/admin/reviews"
            className="group rounded-2xl border border-[#1E1E1E] bg-[#101010] p-6 transition-all hover:border-[#FF4C00]/40"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF4C00]/10">
              <MessageSquare
                size={22}
                className="text-[#FF4C00]"
              />
            </div>

            <h2 className="text-lg font-black">
              Reviews
            </h2>

            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Moderate, approve and reject user reviews.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-[#FF4C00]">
              Review Moderation

              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </Link>

          {/* Analytics */}
          <Link
            href="/admin/analytics"
            className="group rounded-2xl border border-[#1E1E1E] bg-[#101010] p-6 transition-all hover:border-[#FF4C00]/40"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF4C00]/10">
              <BarChart3
                size={22}
                className="text-[#FF4C00]"
              />
            </div>

            <h2 className="text-lg font-black">
              Analytics
            </h2>

            <p className="mt-2 text-xs leading-5 text-zinc-500">
              View platform statistics and analytics.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-[#FF4C00]">
              View Analytics

              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </Link>
        </div>

        {/* Reviews Shortcut */}
        <div className="mt-8 rounded-2xl border border-[#1E1E1E] bg-[#101010] p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
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

              <p className="mt-2 text-xs text-zinc-500">
                Check pending reviews and manage user feedback.
              </p>
            </div>

            <Link
              href="/admin/reviews"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF4C00] px-5 py-3 text-xs font-black text-black transition-all hover:bg-[#ff5f1a]"
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