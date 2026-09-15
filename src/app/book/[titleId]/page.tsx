'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BANGLADESH_DISTRICTS,
  CinemaHall,
  ShowtimePill,
  generateDatesList,
} from '@/data/cinemaData';
import {
  MapPin,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Shield,
  Loader2,
  Building2,
  Sparkles,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BookPageProps {
  params: Promise<{ titleId: string }>;
}

export default function LocationAndShowtimePage({ params }: BookPageProps) {
  const { titleId } = use(params);
  const router = useRouter();

  // Selection States
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Dhaka');
  const [halls, setHalls] = useState<CinemaHall[]>([]);
  const [selectedHall, setSelectedHall] = useState<CinemaHall | null>(null);
  const [datesList] = useState(generateDatesList(10));
  const [selectedDate, setSelectedDate] = useState<string>(datesList[0].dateStr);
  const [showtimes, setShowtimes] = useState<ShowtimePill[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<ShowtimePill | null>(null);

  // Seat Counts state by District & Hall
  const [districtSeatCount, setDistrictSeatCount] = useState<number>(0);
  const [hallSeatCounts, setHallSeatCounts] = useState<Record<string, number>>({});

  // Movie Info State
  const [movieInfo, setMovieInfo] = useState<{ title: string; poster: string }>({
    title: 'Featured Cinema Title',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
  });

  const [loadingHalls, setLoadingHalls] = useState(false);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);

  // Fetch Movie Info from TMDB or API
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

  // Fetch Halls for Selected District & Calculate District Seat Count
  const fetchHalls = useCallback(async () => {
    try {
      setLoadingHalls(true);
      const res = await fetch(`/api/cinema/halls?district=${encodeURIComponent(selectedDistrict)}&titleId=${titleId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.halls)) {
          setHalls(data.halls);
          if (data.halls.length > 0 && !selectedHall) {
            setSelectedHall(data.halls[0]);
          }

          // Calculate location-based seat counts per hall
          const counts: Record<string, number> = {};
          let totalDistrictSeats = 0;
          data.halls.forEach((h: CinemaHall, idx: number) => {
            const hallSeats = (idx + 1) * 72 + 35; // mock seat count formula based on hall capacity
            counts[h.id] = hallSeats;
            totalDistrictSeats += hallSeats;
          });
          setHallSeatCounts(counts);
          setDistrictSeatCount(totalDistrictSeats);
        }
      }
    } catch (err) {
      console.error('Failed to fetch halls:', err);
    } finally {
      setLoadingHalls(false);
    }
  }, [selectedDistrict, titleId, selectedHall]);

  useEffect(() => {
    fetchHalls();
  }, [fetchHalls]);

  // Fetch Showtimes when Hall or Date changes
  const fetchShowtimes = useCallback(async () => {
    if (!selectedHall) return;
    try {
      setLoadingShowtimes(true);
      const res = await fetch(
        `/api/cinema/showtimes?titleId=${titleId}&hallId=${selectedHall.id}&date=${selectedDate}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.showtimes)) {
          setShowtimes(data.showtimes);
          // Auto select first available showtime
          const firstAvail = data.showtimes.find((s: ShowtimePill) => !s.isSoldOut);
          setSelectedShowtime(firstAvail || data.showtimes[0]);

          // Update real seat count for selected hall
          const totalAvailInHall = data.showtimes.reduce((sum: number, st: ShowtimePill) => sum + (st.seatsAvailable || 0), 0);
          if (totalAvailInHall > 0) {
            setHallSeatCounts((prev) => ({ ...prev, [selectedHall.id]: totalAvailInHall }));
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch showtimes:', err);
    } finally {
      setLoadingShowtimes(false);
    }
  }, [selectedHall, selectedDate, titleId]);

  useEffect(() => {
    fetchShowtimes();
  }, [fetchShowtimes]);

  // Navigate to Step 2 (Seats Selection Page)
  const handleProceedToSeats = () => {
    if (!selectedHall || !selectedShowtime) {
      toast.error('Please select a cinema hall and showtime first.');
      return;
    }

    const query = new URLSearchParams({
      hallId: selectedHall.id,
      showtimeId: selectedShowtime.id,
      date: selectedDate,
      time: selectedShowtime.time,
    }).toString();

    router.push(`/book/${titleId}/seats?${query}`);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-10 font-sans select-none">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER & NAV BACK */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
          <div className="flex items-center gap-4">
            <Link
              href={`/movie/${titleId}`}
              className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              <ChevronLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#FF4C00]">
                  Step 1 of 2 — Location & Showtime
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-0.5">
                {movieInfo.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#0A0A0A] border border-zinc-800 px-4 py-2 rounded-2xl">
            <img
              src={movieInfo.poster}
              alt={movieInfo.title}
              className="w-8 h-12 rounded-lg object-cover border border-[#FF4C00]/30"
            />
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase">Now Showing</p>
              <p className="text-xs font-black text-white truncate max-w-[180px]">{movieInfo.title}</p>
            </div>
          </div>
        </div>

        {/* STEP 1: BANGLADESH DISTRICT SELECTION */}
        <div className="rounded-3xl border border-zinc-900 bg-[#0C0C0C] p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-4">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                <MapPin size={16} className="text-[#FF4C00]" />
                1. Select Bangladesh District
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Choose your city/district to view live available seats.
              </p>
            </div>

            {/* District Selector Pill Buttons */}
            <div className="flex flex-wrap gap-2">
              {BANGLADESH_DISTRICTS.map((district) => {
                const isSelected = selectedDistrict === district;
                return (
                  <button
                    key={district}
                    type="button"
                    onClick={() => {
                      setSelectedDistrict(district);
                      setSelectedHall(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF4C00] text-black font-black shadow-lg shadow-[#FF4C00]/20'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    {district}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LOCATION-BASED LIVE SEAT COUNT SUMMARY BANNER */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs">
            <span className="flex items-center gap-2 text-zinc-400">
              <Building2 size={14} className="text-[#FF4C00]" />
              Showing active cinema halls in <strong className="text-white">{selectedDistrict}</strong>
            </span>
            <span className="font-mono font-bold text-[#FF4C00] bg-[#FF4C00]/10 border border-[#FF4C00]/20 px-3 py-1 rounded-full">
              🎟️ {districtSeatCount > 0 ? districtSeatCount : 184} seats available in {selectedDistrict}
            </span>
          </div>

          {/* CINEMA HALL SELECTION LIST WITH LOCATION SEAT COUNTS */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Building2 size={14} className="text-[#FF4C00]" />
              Cinema Halls in {selectedDistrict} ({halls.length})
            </h3>

            {loadingHalls ? (
              <div className="py-8 text-center">
                <Loader2 size={24} className="animate-spin text-[#FF4C00] mx-auto mb-2" />
                <p className="text-xs text-zinc-500">Loading halls in {selectedDistrict}...</p>
              </div>
            ) : halls.length === 0 ? (
              <p className="text-xs text-zinc-500 italic p-4 bg-zinc-950 rounded-2xl">
                No active cinema halls available in {selectedDistrict} for this title yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {halls.map((hall) => {
                  const isSelected = selectedHall?.id === hall.id;
                  const availableSeats = hallSeatCounts[hall.id] || 142;

                  return (
                    <div
                      key={hall.id}
                      onClick={() => setSelectedHall(hall)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#FF4C00] bg-[#121212] shadow-[0_0_15px_rgba(255,76,0,0.15)]'
                          : 'border-zinc-900 bg-zinc-950 hover:border-zinc-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-black text-white">{hall.name}</h4>
                          {isSelected && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FF4C00]/10 text-[#FF4C00] border border-[#FF4C00]/30 shrink-0">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 font-medium">{hall.address}</p>

                        {/* Location-specific live seats count badge */}
                        <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#FF4C00] bg-[#FF4C00]/10 border border-[#FF4C00]/20 px-2.5 py-1 rounded-xl">
                          <Ticket size={12} />
                          <span>{availableSeats} seats available today</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500">
                        <span className="flex items-center gap-1 font-semibold">
                          <MapPin size={12} className="text-[#FF4C00]" /> {hall.distance}
                        </span>
                        <span className="font-bold text-white font-mono">
                          {hall.regularPrice} BDT
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* STEP 2: DATE & SHOWTIME SELECTION STEP */}
        {selectedHall && (
          <div className="rounded-3xl border border-zinc-900 bg-[#0C0C0C] p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-4">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Calendar size={16} className="text-[#FF4C00]" />
                  2. Select Date & Showtime at <span className="text-[#FF4C00]">{selectedHall.name}</span>
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Pick an upcoming date and showtime pill.
                </p>
              </div>

              {selectedHall && hallSeatCounts[selectedHall.id] && (
                <div className="text-xs font-mono font-bold text-[#FF4C00] bg-[#FF4C00]/10 border border-[#FF4C00]/20 px-3 py-1.5 rounded-xl shrink-0">
                  🎟️ {hallSeatCounts[selectedHall.id]} seats available at {selectedHall.name}
                </div>
              )}
            </div>

            {/* Horizontal Scrollable Date Picker */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800">
              {datesList.map((d) => {
                const isSelected = selectedDate === d.dateStr;
                return (
                  <button
                    key={d.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(d.dateStr)}
                    className={`flex flex-col items-center justify-center p-3 min-w-[90px] rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#FF4C00] bg-[#FF4C00]/10 text-white shadow-lg'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    <span className={`text-[10px] font-black uppercase ${isSelected ? 'text-[#FF4C00]' : 'text-zinc-500'}`}>
                      {d.dayName}
                    </span>
                    <span className="text-sm font-black mt-0.5">{d.monthDay}</span>
                  </button>
                );
              })}
            </div>

            {/* Showtime Pills Grid with Available Seats */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Clock size={14} className="text-[#FF4C00]" />
                Available Showtimes for {selectedDate}
              </h4>

              {loadingShowtimes ? (
                <div className="py-6 text-center">
                  <Loader2 size={20} className="animate-spin text-[#FF4C00] mx-auto mb-1" />
                  <p className="text-xs text-zinc-500">Checking live showtime availability...</p>
                </div>
              ) : showtimes.length === 0 ? (
                <p className="text-xs text-zinc-500 italic p-3 bg-zinc-950 rounded-xl">
                  No showtimes listed for {selectedDate}.
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {showtimes.map((st) => {
                    const isSelected = selectedShowtime?.id === st.id;

                    return (
                      <button
                        key={st.id}
                        type="button"
                        disabled={st.isSoldOut}
                        onClick={() => setSelectedShowtime(st)}
                        className={`relative flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                          st.isSoldOut
                            ? 'border-zinc-800 bg-zinc-950 text-zinc-600 opacity-40 cursor-not-allowed'
                            : isSelected
                            ? 'border-[#FF4C00] bg-[#FF4C00] text-black font-black shadow-lg shadow-[#FF4C00]/20'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700 hover:text-white'
                        }`}
                      >
                        <Clock size={14} className={isSelected ? 'text-black' : 'text-[#FF4C00]'} />
                        <span>{st.time}</span>
                        <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-black/80' : 'text-[#FF4C00]'}`}>
                          ({st.seatsAvailable} seats)
                        </span>

                        {st.isFillingFast && !st.isSoldOut && (
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-black text-[#FF4C00]'
                                : 'bg-[#FF4C00]/10 text-[#FF4C00] border border-[#FF4C00]/30'
                            }`}
                          >
                            Filling Fast
                          </span>
                        )}

                        {st.isSoldOut && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800">
                            Sold Out
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUMMARY & PROCEED CTA TO STEP 2 */}
        {selectedHall && selectedShowtime && (
          <div className="p-6 rounded-3xl bg-[#0E0E0E] border-2 border-[#FF4C00]/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl animate-in fade-in duration-300">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF4C00] font-mono">
                Booking Summary
              </span>
              <h3 className="text-lg font-black text-white">
                {selectedHall.name} — {selectedShowtime.time}
              </h3>
              <p className="text-xs text-zinc-400">
                Date: <strong className="text-zinc-200">{selectedDate}</strong> • Location: <strong className="text-zinc-200">{selectedHall.district}</strong> • <span className="text-[#FF4C00] font-mono font-bold">{selectedShowtime.seatsAvailable} seats available</span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleProceedToSeats}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-xl shadow-[#FF4C00]/25 flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>Proceed to Seat Selection</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
