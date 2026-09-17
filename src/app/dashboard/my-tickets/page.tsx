'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Ticket as TicketIcon,
  Calendar,
  Clock,
  MapPin,
  Building2,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  Filter,
} from 'lucide-react';
import { authClient } from '@/app/(auth)/lib/auth-client';
export default function MyTicketsDashboardPage() {
  const { data: session } = authClient.useSession();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'used'>('all');
  const [search, setSearch] = useState('');

  const [liveProfile, setLiveProfile] = useState<{ id?: string; email?: string } | null>(null);

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

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const userId = session?.user?.id || liveProfile?.id || '';
      const email = session?.user?.email || liveProfile?.email || '';
      const res = await fetch(
        `/api/cinema/tickets?userId=${encodeURIComponent(userId)}&email=${encodeURIComponent(email)}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.tickets)) {
          setTickets(data.tickets);
        }
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [session, liveProfile]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filteredTickets = tickets.filter((t) => {
    const matchesFilter =
      filterStatus === 'all'
        ? true
        : filterStatus === 'active'
        ? t.status === 'Active'
        : t.status === 'Used';

    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      t.ticketId.toLowerCase().includes(query) ||
      t.movieTitle.toLowerCase().includes(query) ||
      t.hallName.toLowerCase().includes(query) ||
      t.district.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans select-none space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-900 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/20 text-[#FF4C00] text-xs font-black uppercase tracking-widest">
              <TicketIcon size={14} />
              <span>Cinema Hall Tickets</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            My Cinema Tickets & Entry Passes
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl font-medium">
            Manage your physical cinema hall ticket reservations, download PDF passes, and present QR codes at gate check-in.
          </p>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="rounded-2xl border border-zinc-900 bg-[#0C0C0C] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-[320px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by movie, hall, ticket code..."
            className="w-full h-10 rounded-xl border border-zinc-800 bg-zinc-950 pl-10 pr-4 text-xs text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'active', 'used'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#FF4C00] text-black font-black'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* TICKETS LIST */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 size={32} className="animate-spin text-[#FF4C00] mx-auto mb-2" />
          <p className="text-xs font-mono text-zinc-500">Loading your cinema tickets...</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="py-16 bg-[#0A0A0A] border border-dashed border-zinc-850 rounded-3xl text-center flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
            <TicketIcon size={28} />
          </div>
          <h3 className="text-sm font-black uppercase text-white">No Tickets Found</h3>
          <p className="text-xs text-zinc-500 max-w-sm">
            {search ? 'Try clearing your search query.' : 'You have not booked any physical cinema tickets yet.'}
          </p>
          <Link
            href="/"
            className="mt-2 px-5 py-2.5 rounded-xl bg-[#FF4C00] text-black font-black text-xs uppercase tracking-wider"
          >
            Browse Movies in Theaters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((t) => {
            const isUsed = t.status === 'Used';
            return (
              <Link
                key={t.ticketId}
                href={`/tickets/${t.ticketId}`}
                className="group relative rounded-3xl border border-zinc-900 bg-[#0C0C0C] hover:border-[#FF4C00]/50 p-5 transition-all flex flex-col justify-between shadow-lg cursor-pointer hover:scale-[1.01]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.moviePoster}
                        alt={t.movieTitle}
                        className="w-14 h-20 rounded-xl object-cover border border-[#FF4C00]/30 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#FF4C00] bg-[#FF4C00]/10 border border-[#FF4C00]/20 px-2 py-0.5 rounded">
                          {t.ticketId}
                        </span>
                        <h3 className="text-base font-black text-white mt-1 group-hover:text-[#FF4C00] transition-colors truncate max-w-[180px]">
                          {t.movieTitle}
                        </h3>
                        <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                          <Building2 size={12} className="text-zinc-500" /> {t.hallName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-zinc-900 text-xs text-zinc-400">
                    <div className="flex justify-between">
                      <span>Show Date:</span>
                      <strong className="text-white">{t.date}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Showtime:</span>
                      <strong className="text-white">{t.time}</strong>
                    </div>
                    <div className="flex justify-between items-start">
                      <span>Reserved Seats:</span>
                      <strong
                        className="text-[#FF4C00] font-mono text-right max-w-[170px] truncate"
                        title={(() => {
                          const seatArr = Array.isArray(t.seatNumbers) ? t.seatNumbers : Array.isArray(t.seats) ? t.seats : [];
                          return seatArr.join(', ');
                        })()}
                      >
                        {(() => {
                          const seatArr = Array.isArray(t.seatNumbers) ? t.seatNumbers : Array.isArray(t.seats) ? t.seats : [];
                          if (seatArr.length === 0) return 'N/A';
                          if (seatArr.length <= 4) return seatArr.join(', ');
                          return `${seatArr.slice(0, 3).join(', ')} (+${seatArr.length - 3})`;
                        })()}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      isUsed
                        ? 'bg-zinc-900 text-zinc-500 border-zinc-800'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {isUsed ? 'Already Used' : 'Active Ticket'}
                  </span>

                  <span className="text-xs font-black text-white group-hover:text-[#FF4C00] flex items-center gap-1">
                    <span>View Pass & QR</span>
                    <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}
