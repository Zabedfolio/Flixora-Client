"use client";

import React, { useMemo, useState } from "react";
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
} from "lucide-react";

type ReviewStatus = "Pending" | "Approved" | "Rejected";

interface Review {
  id: number;
  user: string;
  email: string;
  movie: string;
  rating: number;
  review: string;
  status: ReviewStatus;
  date: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    user: "Anika Rahman",
    email: "anika@gmail.com",
    movie: "Inception",
    rating: 5,
    review:
      "Absolutely amazing movie! The story, visuals and acting were outstanding.",
    status: "Pending",
    date: "Sep 01, 2026",
  },
  {
    id: 2,
    user: "Siam Ahmed",
    email: "siam@gmail.com",
    movie: "Interstellar",
    rating: 5,
    review:
      "One of the best science fiction movies I have ever watched.",
    status: "Approved",
    date: "Aug 31, 2026",
  },
  {
    id: 3,
    user: "Nusrat Jahan",
    email: "nusrat@gmail.com",
    movie: "The Dark Knight",
    rating: 4,
    review:
      "Great movie with excellent performances and a very strong storyline.",
    status: "Pending",
    date: "Aug 30, 2026",
  },
  {
    id: 4,
    user: "Rakib Hasan",
    email: "rakib@gmail.com",
    movie: "Avatar",
    rating: 3,
    review:
      "The visuals are impressive, but the story could have been better.",
    status: "Rejected",
    date: "Aug 29, 2026",
  },
  {
    id: 5,
    user: "Mim Akter",
    email: "mim@gmail.com",
    movie: "Oppenheimer",
    rating: 5,
    review:
      "Brilliant direction and acting. A very powerful cinematic experience.",
    status: "Approved",
    date: "Aug 28, 2026",
  },
  {
    id: 6,
    user: "Tanvir Islam",
    email: "tanvir@gmail.com",
    movie: "Dune: Part Two",
    rating: 4,
    review:
      "Beautiful cinematography and world building. Loved the movie.",
    status: "Pending",
    date: "Aug 27, 2026",
  },
  {
    id: 7,
    user: "Fariha Noor",
    email: "fariha@gmail.com",
    movie: "Avengers: Endgame",
    rating: 5,
    review:
      "Such an emotional and entertaining movie. The ending was perfect.",
    status: "Approved",
    date: "Aug 26, 2026",
  },
  {
    id: 8,
    user: "Hasan Mahmud",
    email: "hasan@gmail.com",
    movie: "Joker",
    rating: 2,
    review:
      "The movie was interesting but some scenes were unnecessarily disturbing.",
    status: "Rejected",
    date: "Aug 25, 2026",
  },
];

const STATUS_FILTERS = ["All", "Pending", "Approved", "Rejected"];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const REVIEWS_PER_PAGE = 6;

  // ==============================
  // Review Actions
  // ==============================

  const updateStatus = (
    id: number,
    status: ReviewStatus
  ) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id
          ? { ...review, status }
          : review
      )
    );

    setOpenMenu(null);
  };

  const deleteReview = (id: number) => {
    setReviews((prev) =>
      prev.filter((review) => review.id !== id)
    );

    setOpenMenu(null);
  };

  // ==============================
  // Filter Reviews
  // ==============================

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        review.user.toLowerCase().includes(searchText) ||
        review.movie.toLowerCase().includes(searchText) ||
        review.review.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        review.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reviews, search, statusFilter]);

  // ==============================
  // Pagination
  // ==============================

  const totalPages = Math.ceil(
    filteredReviews.length / REVIEWS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * REVIEWS_PER_PAGE;

  const currentReviews = filteredReviews.slice(
    startIndex,
    startIndex + REVIEWS_PER_PAGE
  );

  // ==============================
  // Statistics
  // ==============================

  const pendingCount = reviews.filter(
    (review) => review.status === "Pending"
  ).length;

  const approvedCount = reviews.filter(
    (review) => review.status === "Approved"
  ).length;

  const rejectedCount = reviews.filter(
    (review) => review.status === "Rejected"
  ).length;

  const totalCount = reviews.length;

  // ==============================
  // Status Badge
  // ==============================

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

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="flex min-h-screen">

        {/* =================================
            SIDEBAR
        ================================= */}

        <div className="hidden md:block w-[260px] shrink-0">
          {/* 
            If your AdminSidebar file has a different name/path,
            change this import and component.
          */}
        </div>

        {/* =================================
            MAIN CONTENT
        ================================= */}

        <main className="flex-1 min-w-0">

          {/* Header */}
          <div className="border-b border-[#1A1A1A] bg-[#0A0A0A]">
            <div className="px-6 md:px-10 py-7">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare
                      size={18}
                      className="text-[#FF4C00]"
                    />

                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF4C00]">
                      Content Management
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                    Review Moderation
                  </h1>

                  <p className="text-sm text-zinc-500 mt-2">
                    Review, approve or reject user reviews.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#111111] border border-[#222222] rounded-xl px-4 py-3">
                  <MessageSquare
                    size={18}
                    className="text-[#FF4C00]"
                  />

                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
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

          <div className="p-6 md:p-10">

            {/* =================================
                STAT CARDS
            ================================= */}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

              {/* Total */}
              <div className="bg-[#101010] border border-[#1E1E1E] rounded-2xl p-5">
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-semibold text-zinc-500">
                      Total Reviews
                    </p>

                    <h2 className="text-2xl font-black mt-2">
                      {totalCount}
                    </h2>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#FF4C00]/10 flex items-center justify-center">
                    <MessageSquare
                      size={19}
                      className="text-[#FF4C00]"
                    />
                  </div>

                </div>
              </div>

              {/* Pending */}
              <div className="bg-[#101010] border border-[#1E1E1E] rounded-2xl p-5">
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-semibold text-zinc-500">
                      Pending
                    </p>

                    <h2 className="text-2xl font-black mt-2 text-yellow-400">
                      {pendingCount}
                    </h2>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                    <Clock
                      size={19}
                      className="text-yellow-400"
                    />
                  </div>

                </div>
              </div>

              {/* Approved */}
              <div className="bg-[#101010] border border-[#1E1E1E] rounded-2xl p-5">
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-semibold text-zinc-500">
                      Approved
                    </p>

                    <h2 className="text-2xl font-black mt-2 text-emerald-400">
                      {approvedCount}
                    </h2>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2
                      size={19}
                      className="text-emerald-400"
                    />
                  </div>

                </div>
              </div>

              {/* Rejected */}
              <div className="bg-[#101010] border border-[#1E1E1E] rounded-2xl p-5">
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-semibold text-zinc-500">
                      Rejected
                    </p>

                    <h2 className="text-2xl font-black mt-2 text-red-400">
                      {rejectedCount}
                    </h2>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <XCircle
                      size={19}
                      className="text-red-400"
                    />
                  </div>

                </div>
              </div>

            </div>

            {/* =================================
                TABLE CONTAINER
            ================================= */}

            <div className="bg-[#101010] border border-[#1E1E1E] rounded-2xl overflow-hidden">

              {/* Table Header */}
              <div className="p-5 border-b border-[#1E1E1E]">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                  {/* Search */}
                  <div className="relative w-full lg:w-[320px]">

                    <Search
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search reviews..."
                      className="w-full h-11 bg-[#080808] border border-[#242424] rounded-xl pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-[#FF4C00]/60 transition-colors"
                    />

                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-2 overflow-x-auto">

                    {STATUS_FILTERS.map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setStatusFilter(filter);
                          setCurrentPage(1);
                        }}
                        className={`px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                          statusFilter === filter
                            ? "bg-[#FF4C00] text-black"
                            : "bg-[#181818] text-zinc-400 hover:text-white hover:bg-[#202020]"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}

                  </div>

                </div>

              </div>

              {/* =================================
                  TABLE
              ================================= */}

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1000px]">

                  <thead>
                    <tr className="border-b border-[#1E1E1E]">

                      <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                        User
                      </th>

                      <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                        Movie
                      </th>

                      <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                        Rating
                      </th>

                      <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                        Review
                      </th>

                      <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                        Status
                      </th>

                      <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                        Date
                      </th>

                      <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                        Action
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {currentReviews.map((review) => (

                      <tr
                        key={review.id}
                        className="border-b border-[#181818] hover:bg-[#141414] transition-colors"
                      >

                        {/* USER */}
                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/20 flex items-center justify-center text-sm font-black text-[#FF4C00]">
                              {review.user.charAt(0)}
                            </div>

                            <div className="min-w-0">

                              <p className="text-sm font-bold text-white">
                                {review.user}
                              </p>

                              <p className="text-[11px] text-zinc-600 mt-0.5">
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
                        <td className="px-6 py-5 max-w-[300px]">

                          <p className="text-xs text-zinc-400 leading-5 line-clamp-2">
                            {review.review}
                          </p>

                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wide ${getStatusStyle(
                              review.status
                            )}`}
                          >

                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
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
                              onClick={() =>
                                updateStatus(
                                  review.id,
                                  "Approved"
                                )
                              }
                              title="Approve"
                              className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all"
                            >
                              <Check size={16} />
                            </button>

                            {/* Reject */}
                            <button
                              onClick={() =>
                                updateStatus(
                                  review.id,
                                  "Rejected"
                                )
                              }
                              title="Reject"
                              className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                            >
                              <X size={16} />
                            </button>

                            {/* More */}
                            <div className="relative">

                              <button
                                onClick={() =>
                                  setOpenMenu(
                                    openMenu === review.id
                                      ? null
                                      : review.id
                                  )
                                }
                                className="w-9 h-9 rounded-lg bg-[#1A1A1A] border border-[#252525] text-zinc-400 flex items-center justify-center hover:text-white transition-all"
                              >
                                <MoreVertical size={16} />
                              </button>

                              {openMenu === review.id && (

                                <div className="absolute right-0 top-11 z-30 w-36 bg-[#151515] border border-[#2A2A2A] rounded-xl shadow-2xl p-1.5">

                                  <button
                                    onClick={() =>
                                      updateStatus(
                                        review.id,
                                        "Approved"
                                      )
                                    }
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-emerald-400 hover:bg-[#202020] rounded-lg"
                                  >
                                    <Check size={14} />
                                    Approve
                                  </button>

                                  <button
                                    onClick={() =>
                                      updateStatus(
                                        review.id,
                                        "Rejected"
                                      )
                                    }
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-red-400 hover:bg-[#202020] rounded-lg"
                                  >
                                    <X size={14} />
                                    Reject
                                  </button>

                                  <div className="h-px bg-[#282828] my-1" />

                                  <button
                                    onClick={() =>
                                      deleteReview(review.id)
                                    }
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-lg"
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

                {/* Empty State */}
                {currentReviews.length === 0 && (

                  <div className="py-20 text-center">

                    <div className="w-14 h-14 mx-auto rounded-2xl bg-[#181818] flex items-center justify-center mb-4">
                      <MessageSquare
                        size={24}
                        className="text-zinc-600"
                      />
                    </div>

                    <h3 className="text-sm font-bold text-white">
                      No reviews found
                    </h3>

                    <p className="text-xs text-zinc-600 mt-1">
                      Try changing your search or filter.
                    </p>

                  </div>

                )}

              </div>

              {/* =================================
                  PAGINATION
              ================================= */}

              {filteredReviews.length > 0 && (

                <div className="flex items-center justify-between px-6 py-4 border-t border-[#1E1E1E]">

                  <p className="text-xs text-zinc-600">
                    Showing{" "}
                    <span className="text-zinc-400 font-bold">
                      {startIndex + 1}
                    </span>{" "}
                    -{" "}
                    <span className="text-zinc-400 font-bold">
                      {Math.min(
                        startIndex + REVIEWS_PER_PAGE,
                        filteredReviews.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="text-zinc-400 font-bold">
                      {filteredReviews.length}
                    </span>
                  </p>

                  <div className="flex items-center gap-2">

                    <button
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.max(1, page - 1)
                        )
                      }
                      className="w-9 h-9 rounded-lg bg-[#181818] border border-[#242424] flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <div className="px-3 text-xs font-bold text-zinc-400">
                      {currentPage} / {Math.max(totalPages, 1)}
                    </div>

                    <button
                      disabled={
                        currentPage === totalPages ||
                        totalPages === 0
                      }
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(totalPages, page + 1)
                        )
                      }
                      className="w-9 h-9 rounded-lg bg-[#181818] border border-[#242424] flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
    </div>
  );
}