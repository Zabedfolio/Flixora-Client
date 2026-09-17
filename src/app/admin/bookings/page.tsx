'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Ticket as TicketIcon,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Building2,
  User,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BookingRecord {
  _id?: string;
  bookingId?: string;
  ticketId: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  movieTitle: string;
  moviePoster?: string;
  hallName: string;
  hallAddress?: string;
  district?: string;
  date: string;
  time: string;
  seatNumbers?: string[];
  seats?: string[];
  totalPrice: number;
  status: 'active' | 'used' | 'cancelled' | 'confirmed' | 'Active' | 'Used' | 'Cancelled';
  createdAt?: string;
  usedAt?: string;
  cancelledAt?: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'used' | 'cancelled'>('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/bookings');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        }
      } else {
        toast.error('Failed to fetch cinema bookings');
      }
    } catch (err: any) {
      toast.error(err.message || 'Network error fetching bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (ticketId: string, bookingId?: string) => {
    if (!confirm(`Are you sure you want to CANCEL booking ticket ${ticketId}? This will release the reserved seats.`)) {
      return;
    }

    try {
      setCancellingId(ticketId);
      const query = new URLSearchParams({ ticketId, bookingId: bookingId || '' }).toString();
      const res = await fetch(`/api/admin/bookings?${query}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || `Booking ${ticketId} cancelled successfully!`);
        fetchBookings();
      } else {
        toast.error(data.message || 'Failed to cancel booking');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error executing booking cancellation');
    } finally {
      setCancellingId(null);
    }
  };

  // Metrics Calculation
  const totalBookings = bookings.length;
  const activeCount = bookings.filter((b) => (b.status || '').toLowerCase() === 'active' || (b.status || '').toLowerCase() === 'confirmed').length;
  const usedCount = bookings.filter((b) => (b.status || '').toLowerCase() === 'used').length;
  const cancelledCount = bookings.filter((b) => (b.status || '').toLowerCase() === 'cancelled').length;
  const totalRevenue = bookings
    .filter((b) => (b.status || '').toLowerCase() !== 'cancelled')
    .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

  // Filtered List
  const filteredBookings = bookings.filter((b) => {
    const rawStatus = (b.status || '').toLowerCase();
    const normalizedStatus = rawStatus === 'confirmed' ? 'active' : rawStatus;

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? normalizedStatus === 'active'
        : normalizedStatus === statusFilter;

    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      b.ticketId.toLowerCase().includes(q) ||
      (b.bookingId && b.bookingId.toLowerCase().includes(q)) ||
      (b.userName && b.userName.toLowerCase().includes(q)) ||
      (b.userEmail && b.userEmail.toLowerCase().includes(q)) ||
      b.movieTitle.toLowerCase().includes(q) ||
      b.hallName.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 md:p-10 space-y-8 font-sans selection:bg-[#FF4C00] selection:text-black">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-850 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/20 text-[#FF4C00] text-xs font-black uppercase tracking-widest">
              <TicketIcon size={14} />
              <span>Cinema Gate Management</span>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Cinema Bookings & Ticket Passes
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl font-medium">
            Monitor physical cinema reservations, verify ticket passes, check entrance gate status, and manage cancellations.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-bold text-xs transition-all cursor-pointer self-start md:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-[#FF4C00]' : ''} />
          <span>Refresh Bookings</span>
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#0E0E0E] border border-zinc-800 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Reservations</span>
          <p className="text-2xl font-black text-white font-mono">{totalBookings}</p>
        </div>

        <div className="bg-[#0E0E0E] border border-zinc-800 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Active Passes</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">{activeCount}</p>
        </div>

        <div className="bg-[#0E0E0E] border border-zinc-800 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Redeemed / Used</span>
          <p className="text-2xl font-black text-blue-400 font-mono">{usedCount}</p>
        </div>

        <div className="bg-[#0E0E0E] border border-zinc-800 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Cancelled</span>
          <p className="text-2xl font-black text-red-400 font-mono">{cancelledCount}</p>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-[#0E0E0E] border border-[#FF4C00]/30 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-bold text-[#FF4C00] uppercase tracking-wider">Total Box Office Revenue</span>
          <p className="text-2xl font-black text-[#FF4C00] font-mono">৳{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="bg-[#0E0E0E] border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ticket code, customer name, email, movie or hall..."
            className="w-full h-10 rounded-xl border border-zinc-800 bg-zinc-950 pl-10 pr-4 text-xs text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'active', 'used', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#FF4C00] text-black font-black'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* BOOKINGS TABLE / CARDS */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 size={36} className="animate-spin text-[#FF4C00] mx-auto" />
          <p className="text-xs font-mono text-zinc-500">Loading Cinema Hall Bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="py-16 bg-[#0E0E0E] border border-dashed border-zinc-800 rounded-3xl text-center flex flex-col items-center justify-center gap-3">
          <TicketIcon size={36} className="text-zinc-600" />
          <h3 className="text-sm font-black uppercase text-white">No Cinema Bookings Found</h3>
          <p className="text-xs text-zinc-500 max-w-sm">
            {search ? 'Try adjusting your search criteria.' : 'There are no cinema bookings stored in the database.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const seatsList = b.seatNumbers || b.seats || [];
            const rawStatus = (b.status || '').toLowerCase();
            const isCancelled = rawStatus === 'cancelled';
            const isUsed = rawStatus === 'used';
            const isActive = rawStatus === 'active' || rawStatus === 'confirmed';

            return (
              <div
                key={b.ticketId}
                className="bg-[#0E0E0E] border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                  {/* Movie & Ticket Identifiers */}
                  <div className="flex items-center gap-4">
                    <img
                      src={b.moviePoster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500'}
                      alt={b.movieTitle}
                      className="w-14 h-20 rounded-xl object-cover border border-[#FF4C00]/30 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-[#FF4C00] bg-[#FF4C00]/10 border border-[#FF4C00]/30 px-2 py-0.5 rounded">
                          {b.ticketId}
                        </span>
                        {b.bookingId && (
                          <span className="text-[10px] font-mono text-zinc-500">
                            (Booking Ref: {b.bookingId})
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-black text-white mt-1">{b.movieTitle}</h3>
                      <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <Building2 size={12} className="text-[#FF4C00]" />
                        <span>{b.hallName}</span>
                        {b.district && <span className="text-zinc-600">• {b.district}</span>}
                      </p>
                    </div>
                  </div>

                  {/* Status & Customer Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase block">Pass Holder</span>
                      <span className="text-xs font-bold text-white block">{b.userName || 'Cinema Guest'}</span>
                      <span className="text-[11px] text-zinc-500 block">{b.userEmail || 'customer@flixora.com'}</span>
                    </div>

                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 self-start sm:self-auto ${
                        isActive
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : isUsed
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                          : 'bg-red-500/10 border-red-500/30 text-red-400'
                      }`}
                    >
                      {isActive && <CheckCircle2 size={14} />}
                      {isUsed && <ShieldCheck size={14} />}
                      {isCancelled && <XCircle size={14} />}
                      <span>{isActive ? 'Active Pass' : isUsed ? 'Redeemed Pass' : 'Cancelled'}</span>
                    </span>
                  </div>
                </div>

                {/* Booking Details Grid & Action Buttons */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase block">Show Date</span>
                      <span className="font-semibold text-zinc-200 flex items-center gap-1 mt-0.5">
                        <Calendar size={13} className="text-[#FF4C00]" /> {b.date}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase block">Showtime</span>
                      <span className="font-semibold text-zinc-200 flex items-center gap-1 mt-0.5">
                        <Clock size={13} className="text-[#FF4C00]" /> {b.time}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase block">Seats</span>
                      <div className="flex flex-nowrap items-center gap-1 mt-0.5 whitespace-nowrap" title={seatsList.join(', ')}>
                        {seatsList.slice(0, 2).map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 rounded font-mono font-bold text-[11px] text-[#FF4C00] shrink-0"
                          >
                            {s}
                          </span>
                        ))}
                        {seatsList.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-[#FF4C00]/10 border border-[#FF4C00]/30 rounded font-mono font-bold text-[11px] text-[#FF4C00] shrink-0">
                            +{seatsList.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase block">Total Paid</span>
                      <span className="font-black text-emerald-400 font-mono text-sm block mt-0.5">
                        ৳{(Number(b.totalPrice) || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0">
                    {/* View Ticket & Verification side */}
                    <Link
                      href={`/tickets/${b.ticketId}`}
                      target="_blank"
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-white transition-all cursor-pointer"
                    >
                      <TicketIcon size={14} className="text-[#FF4C00]" />
                      <span>View Ticket Pass</span>
                      <ExternalLink size={12} className="text-zinc-500" />
                    </Link>

                    <Link
                      href={`/verify/${b.ticketId}`}
                      target="_blank"
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-400 transition-all cursor-pointer"
                    >
                      <ShieldCheck size={14} />
                      <span>Gate Verification</span>
                    </Link>

                    {/* Cancel Booking Button */}
                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelBooking(b.ticketId, b.bookingId)}
                        disabled={cancellingId === b.ticketId}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold text-red-400 hover:text-red-300 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {cancellingId === b.ticketId ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
