'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CinemaHall, SeatInfo, ShowtimePill } from '@/data/cinemaData';
import CinemaSeatMap from '@/components/cinema/CinemaSeatMap';
import GroupBookingModal from '@/components/cinema/GroupBookingModal';
import {
  ChevronLeft,
  Ticket,
  Shield,
  Loader2,
  Building2,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Lock,
  Users,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { authClient } from '@/app/(auth)/lib/auth-client';
import { toast } from 'react-hot-toast';
import { useKidsStore } from '@/lib/store/kidsStore';

interface SeatsPageProps {
  params: Promise<{ titleId: string }>;
}

export default function SeatSelectionAndPaymentPage({ params }: SeatsPageProps) {
  const { titleId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = authClient.useSession();
  const { isKidsMode } = useKidsStore();

  useEffect(() => {
    if (isKidsMode) {
      toast.error('Ticket booking is restricted in Kids Mode.');
      router.replace('/');
    }
  }, [isKidsMode, router]);

  const [liveProfile, setLiveProfile] = useState<{ id?: string; name?: string; email?: string } | null>(null);

  useEffect(() => {
    fetch('/api/user/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setLiveProfile(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const hallId = searchParams.get('hallId') || '';
  const showtimeId = searchParams.get('showtimeId') || '';
  const selectedDate = searchParams.get('date') || '';
  const selectedTime = searchParams.get('time') || '';
  const urlGroupCode = searchParams.get('groupCode') || '';

  // Group Booking State
  const [groupCode, setGroupCode] = useState<string>(urlGroupCode);
  const [groupShareUrl, setGroupShareUrl] = useState<string>('');
  const [groupDetails, setGroupDetails] = useState<any>(null);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  // Seats & Hall state
  const [seats, setSeats] = useState<SeatInfo[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [hall, setHall] = useState<CinemaHall | null>(null);

  // Movie Info State
  const [movieInfo, setMovieInfo] = useState<{ title: string; poster: string }>({
    title: 'Featured Cinema Title',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
  });

  const [loadingSeats, setLoadingSeats] = useState(true);
  const [isSubmittingStripe, setIsSubmittingStripe] = useState(false);

  // Temporary User Session ID for Seat Locking
  const [userId] = useState(() => `user_${Math.random().toString(36).substring(2, 9)}`);

  // Fetch Movie Info
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        if (/^\d+$/.test(titleId)) {
          const res = await fetch(`https://api.themoviedb.org/3/movie/${titleId}?api_key=5e2a3ee409a77e9a41a9f41b2a05735e`);
          if (res.ok) {
            const data = await res.json();
            setMovieInfo({
              title: data.title || data.name || 'Featured Movie',
              poster: data.poster_path
                ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
            });
          }
        }
      } catch (err) {
        // silent
      }
    };
    fetchMovie();
  }, [titleId]);

  // Fetch Hall details
  useEffect(() => {
    const fetchHallDetails = async () => {
      try {
        const res = await fetch(`/api/cinema/halls?titleId=${titleId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.halls)) {
            const found = data.halls.find((h: CinemaHall) => h.id === hallId);
            if (found) {
              setHall(found);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch hall details:', err);
      }
    };
    if (hallId) {
      fetchHallDetails();
    }
  }, [hallId, titleId]);

  // Fetch Seats Map and Real-Time Locks
  const fetchSeatsMap = useCallback(async (isInitial = false) => {
    if (!showtimeId || !hallId) return;
    try {
      if (isInitial) setLoadingSeats(true);
      const effectiveUserId = session?.user?.id || liveProfile?.id || userId;
      const res = await fetch(
        `/api/cinema/seats?showtimeId=${showtimeId}&hallId=${hallId}&userId=${effectiveUserId}&groupCode=${groupCode}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.seats)) {
          setSeats(data.seats);
          if (Array.isArray(data.myHeldSeats)) {
            setSelectedSeatIds(data.myHeldSeats);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch seats map:', err);
    } finally {
      if (isInitial) setLoadingSeats(false);
    }
  }, [showtimeId, hallId, userId, groupCode, session, liveProfile]);

  useEffect(() => {
    fetchSeatsMap(true);
  }, [fetchSeatsMap]);

  // Real-Time Polling for Seats (Every 2 seconds - live synchronization)
  useEffect(() => {
    if (!showtimeId) return;
    const interval = setInterval(() => {
      fetchSeatsMap(false);
    }, 2000);
    return () => clearInterval(interval);
  }, [showtimeId, fetchSeatsMap]);

  const notifiedPaidEventsRef = React.useRef<Set<string>>(new Set());
  const isAuthenticated = !!(session?.user?.id || liveProfile?.id);
  const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '';
  const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;

  // Join group room automatically if groupCode is present
  useEffect(() => {
    if (!groupCode || !isAuthenticated) return;
    const joinRoom = async () => {
      try {
        const userEmail = session?.user?.email || liveProfile?.email || '';
        const userName = session?.user?.name || liveProfile?.name || '';
        const realUserId = session?.user?.id || liveProfile?.id || userId;

        await fetch('/api/cinema/group-booking/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            groupCode,
            userId: realUserId,
            userName,
            userEmail,
          }),
        });
      } catch (err) {
        // silent
      }
    };
    joinRoom();
  }, [groupCode, session, liveProfile, userId, isAuthenticated]);

  // Fetch Group Booking details if groupCode is present
  const fetchGroupDetails = useCallback(async () => {
    if (!groupCode) return;
    try {
      const res = await fetch(`/api/cinema/group-booking/${groupCode}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.group) {
          setGroupDetails(data.group);
          if (Array.isArray(data.members)) {
            setGroupMembers(data.members);

            // Live notification when a member/friend completes payment
            data.members.forEach((m: any) => {
              if (m.paymentStatus === 'paid') {
                const paidSeatsArr =
                  Array.isArray(m.paidSeats) && m.paidSeats.length > 0
                    ? m.paidSeats
                    : m.selectedSeats;
                const eventKey = `${m.userId}_${m.ticketId || (paidSeatsArr || []).join(',')}`;
                if (!notifiedPaidEventsRef.current.has(eventKey)) {
                  notifiedPaidEventsRef.current.add(eventKey);
                  toast.success(
                    `🎉 ${m.userName || 'Group member'} completed payment for seat(s): ${(paidSeatsArr || []).join(', ')}!`,
                    { duration: 8000 }
                  );
                  fetchSeatsMap();
                }
              }
            });
          }
          if (typeof window !== 'undefined') {
            setGroupShareUrl(
              `${window.location.origin}/book/${titleId}/seats?hallId=${encodeURIComponent(hallId)}&showtimeId=${encodeURIComponent(showtimeId)}&date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(selectedTime)}&groupCode=${groupCode}`
            );
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch group details:', err);
    }
  }, [groupCode, titleId, hallId, showtimeId, selectedDate, selectedTime, fetchSeatsMap]);

  useEffect(() => {
    fetchGroupDetails();
  }, [fetchGroupDetails]);

  useEffect(() => {
    if (!groupCode) return;
    const interval = setInterval(() => {
      fetchGroupDetails();
    }, 2000);
    return () => clearInterval(interval);
  }, [groupCode, fetchGroupDetails]);

  // Open or Create Group Booking Session
  const handleOpenOrCreateGroupBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to start or join a group booking.');
      router.push(loginUrl);
      return;
    }

    if (groupCode && groupShareUrl) {
      setIsGroupModalOpen(true);
      return;
    }

    try {
      setIsCreatingGroup(true);
      const userEmail = session?.user?.email || liveProfile?.email || '';
      const userName = session?.user?.name || liveProfile?.name || '';
      const realUserId = session?.user?.id || liveProfile?.id || userId;

      const res = await fetch('/api/cinema/group-booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleId,
          movieTitle: movieInfo.title,
          moviePoster: movieInfo.poster,
          hallId: hall?.id || hallId,
          hallName: hall?.name || 'Star Cineplex',
          showtimeId,
          date: selectedDate,
          time: selectedTime,
          selectedSeats: selectedSeatIds,
          userId: realUserId,
          userName,
          userEmail,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.groupCode) {
        setGroupCode(data.groupCode);
        setGroupShareUrl(data.shareUrl);
        setGroupDetails(data.group);
        setIsGroupModalOpen(true);
        toast.success('Group Booking invite link generated!');
        router.replace(
          `/book/${titleId}/seats?hallId=${encodeURIComponent(hallId)}&showtimeId=${encodeURIComponent(showtimeId)}&date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(selectedTime)}&groupCode=${data.groupCode}`
        );
      } else {
        toast.error(data.message || 'Failed to create group booking session');
      }
    } catch (err) {
      toast.error('Network error starting group booking');
    } finally {
      setIsCreatingGroup(false);
    }
  };

  // Handle Seat Selection / Temporary Lock Holding
  const handleToggleSeat = async (seat: SeatInfo) => {
    if (!showtimeId || !hallId) return;

    if (groupCode && !isAuthenticated) {
      toast.error('Please log in to join group seat selection.');
      router.push(loginUrl);
      return;
    }

    const isCurrentlySelected = selectedSeatIds.includes(seat.id);
    const newSelected = isCurrentlySelected
      ? selectedSeatIds.filter((id) => id !== seat.id)
      : [...selectedSeatIds, seat.id];

    // Optimistic UI update
    setSelectedSeatIds(newSelected);

    const userName = session?.user?.name || liveProfile?.name || 'Cinema Customer';
    const userEmail = session?.user?.email || liveProfile?.email || 'customer@flixora.com';
    const realUserId = session?.user?.id || liveProfile?.id || userId;

    try {
      const res = await fetch('/api/cinema/lock-seat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showtimeId,
          hallId,
          date: selectedDate,
          time: selectedTime,
          seatId: seat.id,
          userId: realUserId,
          groupCode,
          userName,
          userEmail,
          action: isCurrentlySelected ? 'release' : 'lock',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || 'Seat reservation conflict');
        fetchSeatsMap();
      }
    } catch (err) {
      console.error('Lock seat error:', err);
      fetchSeatsMap();
    }
  };

  // Trigger Stripe Payment Checkout Session Redirect
  const handleStripeCheckout = async (targetSeatsParam?: string[]) => {
    if (!isAuthenticated) {
      toast.error('Please log in to proceed to ticket checkout.');
      router.push(loginUrl);
      return;
    }

    let seatsToBook =
      targetSeatsParam && targetSeatsParam.length > 0
        ? targetSeatsParam
        : selectedSeatIds;

    if (seatsToBook.length === 0 && groupCode && Array.isArray(groupDetails?.groupHeldSeats) && groupDetails.groupHeldSeats.length > 0) {
      seatsToBook = groupDetails.groupHeldSeats;
    }

    if (!hall || seatsToBook.length === 0) {
      toast.error('Please select at least 1 seat to continue.');
      return;
    }

    try {
      setIsSubmittingStripe(true);
      const selectedSeatObjs = seats.filter((s) => seatsToBook.includes(s.id));
      const totalPrice = selectedSeatObjs.reduce((sum, s) => sum + s.price, 0);

      const userEmail = session?.user?.email || liveProfile?.email || '';
      const userName = session?.user?.name || liveProfile?.name || '';
      const realUserId = session?.user?.id || liveProfile?.id || userId;

      const res = await fetch('/api/cinema/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleId,
          movieTitle: movieInfo.title,
          moviePoster: movieInfo.poster,
          hallId: hall.id,
          hallName: hall.name,
          hallAddress: hall.address,
          district: hall.district,
          showtimeId,
          date: selectedDate,
          time: selectedTime,
          seatNumbers: seatsToBook,
          totalPrice,
          userId: realUserId,
          groupCode,
          userEmail,
          userName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        toast.success('Redirecting to Stripe Secure Payment Gateway...');
        window.location.href = data.url;
      } else if (data.ticketId) {
        toast.success(`Booking confirmed! Ticket ID: ${data.ticketId}`);
        router.push(`/tickets/${data.ticketId}`);
      } else {
        toast.error(data.message || 'Payment session initialization failed.');
      }
    } catch (err) {
      toast.error('Network error launching Stripe payment.');
    } finally {
      setIsSubmittingStripe(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-10 font-sans select-none">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER & NAV BACK TO STEP 1 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/book/${titleId}`)}
              className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#FF4C00]">
                  Step 2 of 2 — Seat Selection & Stripe Payment
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-0.5">
                {movieInfo.title}
              </h1>
            </div>
          </div>

          {/* Selected Booking Info Summary & Group Booking Action */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              onClick={handleOpenOrCreateGroupBooking}
              disabled={isCreatingGroup}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-purple-900/20 shrink-0"
            >
              {isCreatingGroup ? (
                <Loader2 size={16} className="animate-spin text-purple-400" />
              ) : (
                <Users size={16} className="text-purple-400" />
              )}
              <span>{groupCode ? 'View Group Invite' : 'Invite Friends to Book'}</span>
            </button>

            {hall && (
              <div className="flex items-center gap-3 bg-[#0A0A0A] border border-zinc-800 px-4 py-2.5 rounded-2xl">
                <Building2 size={16} className="text-[#FF4C00] shrink-0" />
                <div className="text-xs">
                  <p className="font-black text-white">{hall.name} ({hall.district})</p>
                  <p className="text-[11px] text-zinc-400">
                    {selectedDate} @ <strong className="text-[#FF4C00] font-mono">{selectedTime}</strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* GROUP BOOKING ACTIVE BANNER */}
        {groupCode && !isAuthenticated && (
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-amber-200">
            <div className="flex items-center gap-3">
              <Lock size={20} className="text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Login Required for Group Booking</p>
                <p className="text-[11px] text-amber-300/80">
                  You are accessing a shared group booking link. Please log in or register to select seats and complete payment.
                </p>
              </div>
            </div>
            <Link
              href={loginUrl}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold uppercase tracking-wider text-xs flex items-center justify-center shrink-0 transition-all"
            >
              Sign In to Join
            </Link>
          </div>
        )}

        {groupCode && (
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold shrink-0">
                <Users size={18} />
              </div>
              <div>
                <p className="font-bold text-white flex items-center gap-2">
                  <span>Group Session Active:</span>
                  <span className="font-mono text-purple-300 bg-purple-950 border border-purple-800 px-2 py-0.5 rounded">
                    {groupCode}
                  </span>
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {groupMembers.length > 0
                    ? `${groupMembers.length} friend(s) in room: ${groupMembers.map((m) => m.userName).join(', ')}`
                    : 'Share your link with friends so they can pick adjacent seats in real-time!'}
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenOrCreateGroupBooking}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Share2 size={14} />
              <span>Share Invite Link & QR</span>
            </button>
          </div>
        )}

        {/* PARABOLIC SEAT MAP CONTAINER */}
        <div className="rounded-3xl border border-zinc-900 bg-[#0C0C0C] p-6 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Ticket size={16} className="text-[#FF4C00]" />
                Select Interactive Seats ({hall ? hall.name : 'Cinema Hall'})
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Tap individual seats on the curved layout. Held seats automatically expire in 10 minutes.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-950 px-3.5 py-2 rounded-xl border border-zinc-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-bold">10-Min Temporary Hold Active</span>
            </div>
          </div>

          {loadingSeats || !hall ? (
            <div className="py-20 text-center">
              <Loader2 size={36} className="animate-spin text-[#FF4C00] mx-auto mb-2" />
              <p className="text-xs font-mono text-zinc-500">Loading curved seat map layout...</p>
            </div>
          ) : (
            <CinemaSeatMap
              hall={hall}
              seats={seats}
              selectedSeatIds={selectedSeatIds}
              groupHeldSeats={groupDetails?.groupHeldSeats || []}
              isLeader={
                groupDetails
                  ? groupDetails.leaderUserId === (session?.user?.id || liveProfile?.id || userId) ||
                    (groupDetails.leaderEmail && groupDetails.leaderEmail === (session?.user?.email || liveProfile?.email)) ||
                    groupMembers.some(
                      (m) =>
                        m.isLeader &&
                        (m.userId === (session?.user?.id || liveProfile?.id || userId) ||
                          (m.userEmail && m.userEmail === (session?.user?.email || liveProfile?.email)))
                    )
                  : false
              }
              onToggleSeat={handleToggleSeat}
              onProceedToCheckout={() => handleStripeCheckout()}
              onProceedGroupCheckout={
                groupCode && (groupDetails?.groupHeldSeats || []).length > 0
                  ? () => handleStripeCheckout(groupDetails.groupHeldSeats)
                  : undefined
              }
              groupTotalPrice={seats
                .filter((s) => (groupDetails?.groupHeldSeats || []).includes(s.id))
                .reduce((sum, s) => sum + s.price, 0)}
              isSubmitting={isSubmittingStripe}
            />
          )}
        </div>

        {/* STRIPE PAYMENT FOOTER BANNER */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <CreditCard size={20} className="text-[#FF4C00] shrink-0" />
            <div>
              <p className="font-bold text-white">Stripe Secure Payments Integrated</p>
              <p className="text-[11px] text-zinc-500">
                End-to-end SSL encrypted card checkout. Instant digital QR ticket pass generated upon payment completion.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-zinc-500 font-mono text-[10px]">
            <Lock size={12} className="text-emerald-400" />
            <span>256-Bit SSL Protected</span>
          </div>
        </div>

        {/* GROUP BOOKING MODAL */}
        <GroupBookingModal
          isOpen={isGroupModalOpen}
          onClose={() => setIsGroupModalOpen(false)}
          groupCode={groupCode}
          shareUrl={groupShareUrl}
          movieTitle={movieInfo.title}
          hallName={hall ? hall.name : 'Cinema Hall'}
          date={selectedDate}
          time={selectedTime}
          selectedSeats={selectedSeatIds}
          members={groupMembers}
        />

      </div>
    </div>
  );
}
