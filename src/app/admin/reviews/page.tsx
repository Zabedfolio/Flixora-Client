"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Search,
  Check,
  X,
  Trash2,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  RefreshCw,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

/* =====================================================
   TYPES
===================================================== */

type ReviewStatus =
  | "Pending"
  | "Approved"
  | "Rejected";

interface Review {
  id: string | number;
  user: string;
  email: string;
  movie: string;
  rating: number;
  review: string;
  status: ReviewStatus;
  date: string;
}

/* =====================================================
   FILTERS
===================================================== */

const STATUS_FILTERS: ReviewStatus[] = [
  "Pending",
  "Approved",
  "Rejected",
];

const ALL_FILTER = "All";

/* =====================================================
   PAGE
===================================================== */

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openMenu, setOpenMenu] = useState<string | number | null>(null);

  const REVIEWS_PER_PAGE = 6;

  /* ===================================================
     FETCH LIVE REVIEWS FROM MONGODB
  =================================================== */

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      } else {
        toast.error("Failed to load reviews from database");
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      toast.error("Error connecting to database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSyncData = async () => {
    setIsRefreshing(true);
    await fetchReviews();
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Live database reviews synchronized!");
    }, 400);
  };

  /* ===================================================
     REVIEW ACTIONS (DB INTEGRATED)
  =================================================== */

  const updateStatus = async (
    id: string | number,
    status: ReviewStatus
  ) => {
    // Optimistically update local UI state
    setReviews((previous) =>
      previous.map((review) =>
        review.id === id
          ? {
              ...review,
              status,
            }
          : review
      )
    );
    setOpenMenu(null);

    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Review status updated to ${status}!`);
      } else {
        toast.error(data.message || "Failed to update status");
        fetchReviews(); // Revert on failure
      }
    } catch (err) {
      console.error("Error updating review status:", err);
      toast.error("Network error updating status");
      fetchReviews();
    }
  };

  const deleteReview = async (id: string | number) => {
    // Optimistically remove from UI
    setReviews((previous) =>
      previous.filter((review) => review.id !== id)
    );
    setOpenMenu(null);

    try {
      const res = await fetch(`/api/admin/reviews?id=${encodeURIComponent(String(id))}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Review deleted from database!");
      } else {
        toast.error(data.message || "Failed to delete review");
        fetchReviews();
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error("Network error deleting review");
      fetchReviews();
    }
  };

  /* ===================================================
     FILTER REVIEWS
  =================================================== */

  const filteredReviews = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesSearch =
        !searchText ||
        review.user.toLowerCase().includes(searchText) ||
        review.email.toLowerCase().includes(searchText) ||
        review.movie.toLowerCase().includes(searchText) ||
        review.review.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === ALL_FILTER ||
        review.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reviews, search, statusFilter]);

  /* ===================================================
     PAGINATION
  =================================================== */

  const totalPages = Math.max(
    Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE),
    1
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * REVIEWS_PER_PAGE;

  const currentReviews = filteredReviews.slice(
    startIndex,
    startIndex + REVIEWS_PER_PAGE
  );

  /* ===================================================
     STATISTICS
  =================================================== */

  const totalCount = reviews.length;

  const pendingCount = reviews.filter(
    (review) => review.status === "Pending"
  ).length;

  const approvedCount = reviews.filter(
    (review) => review.status === "Approved"
  ).length;

  const rejectedCount = reviews.filter(
    (review) => review.status === "Rejected"
  ).length;

  /* ===================================================
     STATUS STYLE
  =================================================== */

  const getStatusStyle = (status: ReviewStatus) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Rejected":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }
  };

  /* ===================================================
     RETURN
  =================================================== */

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <main className="min-w-0 flex-1">
        {/* =============================================
            HEADER
        ============================================== */}

        <div className="border-b border-[#1A1A1A] bg-[#0A0A0A]">
          <div className="px-6 py-7 md:px-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              {/* Heading */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <MessageSquare
                    size={18}
                    className="text-[#FF4C00]"
                  />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF4C00]">
                    Content Management
                  </span>
                </div>

                <h1 className="text-2xl font-black tracking-tight md:text-3xl">
                  Review Moderation
                </h1>

                <p className="mt-2 text-sm text-zinc-500">
                  Review, approve or reject real-time user reviews directly connected to MongoDB.
                </p>
              </div>

              {/* Action Controls & Total Reviews */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSyncData}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 rounded-xl border border-[#222222] bg-[#111111] px-4 py-3 text-xs font-bold text-zinc-300 transition-all hover:border-[#FF4C00]/40 hover:text-white disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={`text-[#FF4C00] ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  <span>Sync DB</span>
                </button>

                <div className="flex items-center gap-3 rounded-xl border border-[#222222] bg-[#111111] px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF4C00]/10">
                    <MessageSquare
                      size={18}
                      className="text-[#FF4C00]"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Total Reviews
                    </p>
                    <p className="text-lg font-black">
                      {totalCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =============================================
            CONTENT
        ============================================== */}

        <div className="p-6 md:p-10">
          {/* ===========================================
              STAT CARDS
          ============================================ */}

          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {/* Total */}
            <StatCard
              title="Total Reviews"
              value={totalCount}
              icon={
                <MessageSquare
                  size={19}
                  className="text-[#FF4C00]"
                />
              }
              iconBg="bg-[#FF4C00]/10"
              valueClass="text-white"
            />

            {/* Pending */}
            <StatCard
              title="Pending"
              value={pendingCount}
              icon={
                <Clock
                  size={19}
                  className="text-yellow-400"
                />
              }
              iconBg="bg-yellow-500/10"
              valueClass="text-yellow-400"
            />

            {/* Approved */}
            <StatCard
              title="Approved"
              value={approvedCount}
              icon={
                <CheckCircle2
                  size={19}
                  className="text-emerald-400"
                />
              }
              iconBg="bg-emerald-500/10"
              valueClass="text-emerald-400"
            />

            {/* Rejected */}
            <StatCard
              title="Rejected"
              value={rejectedCount}
              icon={
                <XCircle
                  size={19}
                  className="text-red-400"
                />
              }
              iconBg="bg-red-500/10"
              valueClass="text-red-400"
            />
          </div>

          {/* ===========================================
              TABLE CONTAINER
          ============================================ */}

          <div className="overflow-hidden rounded-2xl border border-[#1E1E1E] bg-[#101010]">
            {/* Table Controls */}
            <div className="border-b border-[#1E1E1E] p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Search */}
                <div className="relative w-full lg:w-[320px]">
                  <Search
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search reviews..."
                    className="h-11 w-full rounded-xl border border-[#242424] bg-[#080808] pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-[#FF4C00]/60"
                  />
                </div>

                {/* Status Filters */}
                <div className="flex items-center gap-2 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter(ALL_FILTER);
                      setCurrentPage(1);
                    }}
                    className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
                      statusFilter === ALL_FILTER
                        ? "bg-[#FF4C00] text-black"
                        : "bg-[#181818] text-zinc-400 hover:bg-[#202020] hover:text-white"
                    }`}
                  >
                    All
                  </button>

                  {STATUS_FILTERS.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => {
                        setStatusFilter(filter);
                        setCurrentPage(1);
                      }}
                      className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
                        statusFilter === filter
                          ? "bg-[#FF4C00] text-black"
                          : "bg-[#181818] text-zinc-400 hover:bg-[#202020] hover:text-white"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* =========================================
                TABLE OR LOADING SKELETON
            ========================================== */}

            {loading ? (
              <div className="py-24 text-center">
                <Loader2 size={32} className="mx-auto animate-spin text-[#FF4C00] mb-3" />
                <p className="text-xs font-mono text-zinc-500">Loading MongoDB Review Records...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-[#1E1E1E]">
                      <TableHeader>User</TableHeader>
                      <TableHeader>Movie</TableHeader>
                      <TableHeader>Rating</TableHeader>
                      <TableHeader>Review</TableHeader>
                      <TableHeader>Status</TableHeader>
                      <TableHeader>Date</TableHeader>
                      <TableHeader align="right">Action</TableHeader>
                    </tr>
                  </thead>

                  <tbody>
                    {currentReviews.map((review) => (
                      <tr
                        key={review.id}
                        className="border-b border-[#181818] transition-colors hover:bg-[#141414]"
                      >
                        {/* USER */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#FF4C00]/20 bg-[#FF4C00]/10 text-sm font-black text-[#FF4C00]">
                              {review.user.charAt(0).toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-bold text-white">
                                {review.user}
                              </p>
                              <p className="mt-0.5 text-[11px] text-zinc-600">
                                {review.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* MOVIE */}
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-white">
                            {review.movie}
                          </p>
                        </td>

                        {/* RATING */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-1">
                            <Star
                              size={14}
                              className="fill-yellow-400 text-yellow-400"
                            />
                            <span className="text-sm font-bold">
                              {review.rating}
                            </span>
                          </div>
                        </td>

                        {/* REVIEW */}
                        <td className="max-w-[300px] px-6 py-5">
                          <p className="line-clamp-2 text-xs leading-5 text-zinc-400">
                            {review.review}
                          </p>
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wide ${getStatusStyle(
                              review.status
                            )}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                review.status === "Approved"
                                  ? "bg-emerald-400"
                                  : review.status === "Rejected"
                                  ? "bg-red-400"
                                  : "bg-yellow-400"
                              }`}
                            />
                            {review.status}
                          </span>
                        </td>

                        {/* DATE */}
                        <td className="px-6 py-5">
                          <span className="text-xs text-zinc-500">
                            {review.date}
                          </span>
                        </td>

                        {/* ACTION */}
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            {/* Approve */}
                            <button
                              type="button"
                              onClick={() => updateStatus(review.id, "Approved")}
                              title="Approve"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/10 bg-emerald-500/10 text-emerald-400 transition-all hover:bg-emerald-500 hover:text-black"
                            >
                              <Check size={16} />
                            </button>

                            {/* Reject */}
                            <button
                              type="button"
                              onClick={() => updateStatus(review.id, "Rejected")}
                              title="Reject"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/10 bg-red-500/10 text-red-400 transition-all hover:bg-red-500 hover:text-white"
                            >
                              <X size={16} />
                            </button>

                            {/* More Menu */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenMenu(
                                    openMenu === review.id ? null : review.id
                                  )
                                }
                                title="More actions"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#252525] bg-[#1A1A1A] text-zinc-400 transition-all hover:text-white"
                              >
                                <MoreVertical size={16} />
                              </button>

                              {openMenu === review.id && (
                                <div className="absolute right-0 top-11 z-30 w-36 rounded-xl border border-[#2A2A2A] bg-[#151515] p-1.5 shadow-2xl">
                                  {/* Approve */}
                                  <button
                                    type="button"
                                    onClick={() => updateStatus(review.id, "Approved")}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-400 hover:bg-[#202020] hover:text-emerald-400"
                                  >
                                    <Check size={14} />
                                    Approve
                                  </button>

                                  {/* Reject */}
                                  <button
                                    type="button"
                                    onClick={() => updateStatus(review.id, "Rejected")}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-400 hover:bg-[#202020] hover:text-red-400"
                                  >
                                    <X size={14} />
                                    Reject
                                  </button>

                                  <div className="my-1 h-px bg-[#282828]" />

                                  {/* Delete */}
                                  <button
                                    type="button"
                                    onClick={() => deleteReview(review.id)}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10"
                                  >
                                    <Trash2 size={14} />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* EMPTY STATE */}
                {currentReviews.length === 0 && (
                  <div className="py-20 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#181818]">
                      <MessageSquare
                        size={24}
                        className="text-zinc-600"
                      />
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      No reviews found
                    </h3>
                    <p className="mt-1 text-xs text-zinc-600">
                      Try changing your search or filter.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* =========================================
                PAGINATION
            ========================================== */}

            {!loading && filteredReviews.length > 0 && (
              <div className="flex items-center justify-between border-t border-[#1E1E1E] px-6 py-4">
                <p className="text-xs text-zinc-600">
                  Showing{" "}
                  <span className="font-bold text-zinc-400">
                    {startIndex + 1}
                  </span>{" "}
                  -{" "}
                  <span className="font-bold text-zinc-400">
                    {Math.min(
                      startIndex + REVIEWS_PER_PAGE,
                      filteredReviews.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-zinc-400">
                    {filteredReviews.length}
                  </span>
                </p>

                <div className="flex items-center gap-2">
                  {/* Previous */}
                  <button
                    type="button"
                    disabled={safeCurrentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#242424] bg-[#181818] text-zinc-400 transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {/* Page Number */}
                  <div className="px-3 text-xs font-bold text-zinc-400">
                    {safeCurrentPage} / {totalPages}
                  </div>

                  {/* Next */}
                  <button
                    type="button"
                    disabled={safeCurrentPage >= totalPages}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1)
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#242424] bg-[#181818] text-zinc-400 transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* =====================================================
   STAT CARD COMPONENT
===================================================== */

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  valueClass: string;
}

function StatCard({
  title,
  value,
  icon,
  iconBg,
  valueClass,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[#1E1E1E] bg-[#101010] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-zinc-500">
            {title}
          </p>
          <h2 className={`mt-2 text-2xl font-black ${valueClass}`}>
            {value}
          </h2>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   TABLE HEADER COMPONENT
===================================================== */

interface TableHeaderProps {
  children: React.ReactNode;
  align?: "left" | "right";
}

function TableHeader({
  children,
  align = "left",
}: TableHeaderProps) {
  return (
    <th
      className={`px-6 py-4 text-[10px] font-black uppercase tracking-wider text-zinc-500 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}