'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  Star, 
  MessageSquare, 
  PenLine, 
  X, 
  Send, 
  Loader2, 
  Sparkles, 
  MessageSquareDashed, 
  Film 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ReviewCard from '@/components/home/ReviewCard';

interface ReviewItem {
  _id: string;
  movieId: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  rating: number;
  review: string;
  createdAt: string;
}

interface MovieReviewsSectionProps {
  movieId: string | number;
  movieTitle: string;
}

export default function MovieReviewsSection({
  movieId,
  movieTitle,
}: MovieReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalReviews: 0, averageRating: 0 });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isModalOpen]);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?movieId=${movieId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
          setStats(data.stats || { totalReviews: 0, averageRating: 0 });
        }
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    if (movieId) {
      fetchReviews();
    }
  }, [movieId, fetchReviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || reviewText.trim().length < 3) {
      toast.error('Please write at least a few words in your review.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: String(movieId),
          movieTitle,
          rating,
          review: reviewText.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Your review has been published!', {
          icon: <Sparkles size={16} className="text-[#FF4C00]" />,
          style: {
            background: '#0E0E0E',
            color: '#fff',
            border: '1px solid #FF4C00',
          },
        });
        setReviewText('');
        setIsModalOpen(false);
        fetchReviews();
      } else {
        toast.error(data.message || 'Failed to submit review');
      }
    } catch (err) {
      toast.error('Network error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingLabel = (score: number) => {
    switch (score) {
      case 5:
        return 'Masterpiece';
      case 4:
        return 'Very Good';
      case 3:
        return 'Good';
      case 2:
        return 'Fair';
      case 1:
        return 'Disappointing';
      default:
        return '';
    }
  };

  return (
    <section className="bg-black px-6 py-16 md:px-10 border-t border-zinc-900">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/20 text-[#FF4C00] text-[10px] font-black uppercase tracking-widest">
                <MessageSquare size={12} />
                <span>Audience Voices</span>
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
              Viewer Reviews & Ratings
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-1">
              Read authentic perspectives from Flixora members who have watched this film.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3.5">
            {stats.totalReviews > 0 && (
              <div className="flex items-center gap-2 bg-[#0A0A0A] border border-zinc-800 px-4 py-2.5 rounded-xl">
                <div className="flex items-center gap-1 text-[#FF4C00]">
                  <Star size={16} fill="currentColor" />
                  <span className="font-black text-sm text-white">
                    {stats.averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-zinc-600 text-xs">•</span>
                <span className="text-xs text-zinc-400 font-semibold">
                  {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-[#FF4C00]/20 cursor-pointer select-none"
            >
              <PenLine size={15} />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid or Loading or Empty State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[220px] gap-3">
            <Loader2 size={32} className="animate-spin text-[#FF4C00]" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Loading Reviews...
            </span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-[#0A0A0A] border border-dashed border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
              <MessageSquareDashed size={32} />
            </div>

            <div className="flex flex-col gap-1 max-w-sm">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                No Reviews Yet
              </h3>
              <p className="text-xs text-zinc-500">
                Be the first viewer to rate "{movieTitle}" and share your thoughts with the community!
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 flex items-center gap-2 bg-[#FF4C00]/10 hover:bg-[#FF4C00] text-[#FF4C00] hover:text-black border border-[#FF4C00]/30 font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition-all cursor-pointer"
            >
              <PenLine size={14} />
              <span>Write the First Review</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => {
              const usernameClean = `@${(r.userName || 'viewer')
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '')}`;
              const fallbackAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                r.userName || 'Viewer'
              )}&backgroundColor=141414&textColor=ff4c00`;

              return (
                <ReviewCard
                  key={r._id}
                  name={r.userName}
                  username={usernameClean}
                  review={r.review}
                  rating={r.rating}
                  avatar={r.userAvatar || fallbackAvatar}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================
          WRITE A REVIEW MODAL (Portal-Mounted)
      ========================================== */}
      {mounted && isModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Backdrop with Blur */}
          <div
            onClick={() => !submitting && setIsModalOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in"
          />

          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-800 bg-[#0E0E0E] shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-850 p-6 bg-zinc-950/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF4C00]/10 border border-[#FF4C00]/20 flex items-center justify-center text-[#FF4C00]">
                  <PenLine size={18} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                    Review Movie
                  </h3>
                  <p className="text-xs text-zinc-500 font-semibold truncate max-w-[240px] sm:max-w-xs">
                    {movieTitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => !submitting && setIsModalOpen(false)}
                disabled={submitting}
                className="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitReview} className="p-6 flex flex-col gap-6">
              {/* Star Rating Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-300">
                  Your Rating
                </label>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = star <= (hoverRating || rating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 text-zinc-700 hover:scale-115 transition-transform cursor-pointer focus:outline-none"
                        >
                          <Star
                            size={26}
                            fill={active ? 'currentColor' : 'none'}
                            className={active ? 'text-[#FF4C00]' : 'text-zinc-700'}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-xs font-bold text-[#FF4C00] ml-2 px-2.5 py-0.5 rounded-md bg-[#FF4C00]/10 border border-[#FF4C00]/20">
                    {getRatingLabel(hoverRating || rating)} ({hoverRating || rating}.0)
                  </span>
                </div>
              </div>

              {/* Review Textarea */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-300">
                    Your Review
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {reviewText.length}/1000
                  </span>
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value.slice(0, 1000))}
                  placeholder="Share your thoughts on the plot, character arcs, acting, pacing, and direction..."
                  rows={4}
                  required
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-xs sm:text-sm text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none focus:ring-1 focus:ring-[#FF4C00] transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-850">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting || reviewText.trim().length < 3}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider transition-all hover:scale-[1.02] shadow-lg shadow-[#FF4C00]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Publish Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
