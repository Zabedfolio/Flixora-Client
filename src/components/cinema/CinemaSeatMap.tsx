'use client';

import React, { useState } from 'react';
import { SeatInfo, CinemaHall } from '@/data/cinemaData';
import { Ticket, CheckCircle2, Sparkles, Volume2, Grid, Layers, Eye } from 'lucide-react';

interface CinemaSeatMapProps {
  hall: CinemaHall;
  seats: SeatInfo[];
  selectedSeatIds: string[];
  groupHeldSeats?: string[];
  isLeader?: boolean;
  onToggleSeat: (seat: SeatInfo) => void;
  onProceedToCheckout?: () => void;
  onProceedGroupCheckout?: () => void;
  groupTotalPrice?: number;
  isSubmitting?: boolean;
}

export default function CinemaSeatMap({
  hall,
  seats,
  selectedSeatIds,
  groupHeldSeats = [],
  isLeader = false,
  onToggleSeat,
  onProceedToCheckout,
  onProceedGroupCheckout,
  groupTotalPrice = 0,
  isSubmitting = false,
}: CinemaSeatMapProps) {
  // View mode state for mobile tap accessibility (3D Arc vs 2D Flat Grid)
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

  // Rows A through H (8 rows)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsByRow: Record<string, SeatInfo[]> = {};

  rows.forEach((r) => {
    seatsByRow[r] = seats.filter((s) => s.row === r);
  });

  const selectedSeatsObj = seats.filter((s) => selectedSeatIds.includes(s.id));
  const totalPrice = selectedSeatsObj.reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* CONTROLS HEADER BAR (View mode switcher: 3D Parabolic Arc vs Flat 2D Grid) */}
      <div className="flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF4C00] animate-pulse" />
          <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
            Interactive Seat Selection
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              viewMode === '3d'
                ? 'bg-[#FF4C00] text-black font-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers size={13} />
            <span>3D Parabolic Arc</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('2d')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              viewMode === '2d'
                ? 'bg-[#FF4C00] text-black font-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Grid size={13} />
            <span>Flat 2D Grid</span>
          </button>
        </div>
      </div>

      {/* PHOTOREALISTIC THEATER AUDITORIUM FRAME */}
      <div className="relative rounded-3xl bg-[#000000] border border-zinc-800 p-4 sm:p-8 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.95)]">
        
        {/* AMBIENT WALL LIGHT STRIPS (Thin vertical amber light strips along far left/right walls) */}
        {viewMode === '3d' && (
          <>
            <div className="absolute top-10 left-3 w-1.5 h-80 bg-gradient-to-b from-amber-500/90 via-amber-500/40 to-transparent blur-[1px] shadow-[0_0_20px_rgba(245,158,11,0.9)] rounded-full hidden sm:block" />
            <div className="absolute top-10 right-3 w-1.5 h-80 bg-gradient-to-b from-amber-500/90 via-amber-500/40 to-transparent blur-[1px] shadow-[0_0_20px_rgba(245,158,11,0.9)] rounded-full hidden sm:block" />

            {/* SIDE AUDITORIUM SPEAKERS */}
            <div className="absolute top-16 left-6 w-5 h-9 bg-zinc-950 border border-zinc-800 rounded-md shadow-xl hidden md:flex items-center justify-center text-zinc-700">
              <Volume2 size={12} />
            </div>
            <div className="absolute top-16 right-6 w-5 h-9 bg-zinc-950 border border-zinc-800 rounded-md shadow-xl hidden md:flex items-center justify-center text-zinc-700">
              <Volume2 size={12} />
            </div>
          </>
        )}

        {/* 1. TOP CINEMA SCREEN PANEL */}
        <div className="relative flex flex-col items-center justify-center mb-12 pt-1">
          {/* Centered Trapezoidal Glowing Screen Panel */}
          <div className="relative w-full max-w-2xl h-24 sm:h-28 rounded-t-3xl bg-gradient-to-b from-[#151922] via-[#0B0E14] to-[#040406] border-t-2 border-x-2 border-zinc-700/80 shadow-[0_15px_50px_rgba(255,140,0,0.18)] flex flex-col items-center justify-center overflow-hidden">
            {/* Soft Blue-White Ambient Gradient Glow beneath the Screen */}
            <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-sky-300/20 via-sky-500/5 to-transparent blur-lg pointer-events-none" />
            
            {/* Centered Letter-Spaced Uppercase Text */}
            <span className="text-xs sm:text-sm font-black tracking-[0.45em] uppercase text-zinc-200 font-mono drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              CINEMA SCREEN
            </span>
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-amber-400/90 mt-1">
              4K LASER IMAX SIGHTLINE
            </span>
          </div>

          {/* Screen Light Projection Beam Reflection onto Floor */}
          <div className="w-full max-w-xl h-5 bg-gradient-to-b from-sky-400/10 via-amber-500/5 to-transparent blur-md rounded-b-full" />
        </div>

        {/* 2. TRUE PARABOLIC CURVED SEAT MATRIX */}
        <div className="overflow-x-auto pt-6 sm:pt-10 pb-10 scrollbar-thin scrollbar-thumb-zinc-800">
          <div className="min-w-[720px] max-w-4xl mx-auto space-y-5 px-4">
            {rows.map((rowLetter, rowIdx) => {
              const rowSeats = seatsByRow[rowLetter] || [];
              const isPremiumRow = ['F', 'G', 'H'].includes(rowLetter);

              // Perspective scale depth: Back rows slightly smaller, front rows larger
              const perspectiveWidthScale = viewMode === '3d' ? 0.92 + (rowIdx / rows.length) * 0.12 : 1;

              return (
                <div
                  key={rowLetter}
                  className="flex items-center justify-center gap-1 sm:gap-2 transition-transform duration-300 relative py-1"
                  style={{
                    transform: `scale(${perspectiveWidthScale})`,
                  }}
                >
                  {/* Faint Row Label (Left) */}
                  <span
                    className={`w-6 text-center text-[11px] font-black uppercase font-mono tracking-wider shrink-0 ${
                      isPremiumRow ? 'text-amber-400' : 'text-zinc-500'
                    }`}
                  >
                    {rowLetter}
                  </span>

                  {/* LEFT SEAT BLOCK (Seats 1-8) */}
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {rowSeats.slice(0, 8).map((seat, colIdx) => {
                      const isSelected = selectedSeatIds.includes(seat.id);
                      const isBooked = seat.status === 'booked';
                      const isHeldByOther = seat.status === 'held';
                      const isPremium = seat.type === 'premium';

                      // Global column position across 16 seats (0 to 15)
                      const globalCol = colIdx; // 0..7
                      const normX = (globalCol - 7.5) / 7.5; // -1.0 to -0.06

                      // True Parabolic Arc Offset (Curves UP towards screen at outer edges)
                      const parabolicY = viewMode === '3d' ? -Math.pow(normX, 2) * (14 + rowIdx * 2.2) : 0;
                      const tiltAngle = viewMode === '3d' ? -normX * (13 + rowIdx * 1.2) : 0;

                      return (
                        <div
                          key={seat.id}
                          style={{
                            transform: `translateY(${parabolicY}px) rotate(${tiltAngle}deg)`,
                          }}
                          className="transition-transform duration-200"
                        >
                          {(() => {
                            const isSelected = selectedSeatIds.includes(seat.id);
                            const isGroupHeld = groupHeldSeats.includes(seat.id);
                            const isBooked = seat.status === 'booked';
                            const isHeldByOther = seat.status === 'held' && !isGroupHeld;
                            const isPremium = seat.type === 'premium';

                            return (
                              <button
                                type="button"
                                disabled={isBooked || isHeldByOther}
                                onClick={() => onToggleSeat(seat)}
                                title={`${seat.id} (${isGroupHeld ? 'Group Reserved Seat' : isPremium ? 'Premium VIP' : 'Regular'}) - ${seat.price} BDT`}
                                className={`group relative flex flex-col items-center justify-center p-0.5 rounded-t-xl transition-all duration-200 cursor-pointer ${
                                  isSelected
                                    ? 'scale-110 z-20'
                                    : isBooked || isHeldByOther
                                    ? 'opacity-30 cursor-not-allowed'
                                    : 'hover:-translate-y-1 hover:scale-110 hover:z-10'
                                }`}
                              >
                                {/* Seat Chair Backrest Contour */}
                                <div
                                  className={`w-6 sm:w-7.5 h-4 sm:h-5 rounded-t-lg flex items-center justify-center font-bold text-[8px] sm:text-[9.5px] tracking-tighter transition-all shadow-md ${
                                    isSelected
                                      ? 'bg-[#FF4C00] text-black font-black ring-2 ring-white shadow-[0_0_18px_rgba(255,76,0,1)]'
                                      : isGroupHeld
                                      ? 'bg-purple-600 text-white font-black border border-purple-300 ring-1 ring-purple-400 shadow-[0_0_14px_rgba(147,51,234,0.9)]'
                                      : isBooked || isHeldByOther
                                      ? 'bg-zinc-800 text-zinc-600 border border-zinc-700'
                                      : isPremium
                                      ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-black font-black border border-amber-300 shadow-[0_2px_10px_rgba(245,158,11,0.6)]'
                                      : 'bg-gradient-to-b from-[#FF4C00] via-[#D62800] to-[#991600] text-white border border-[#FF6633]/60 shadow-[0_2px_10px_rgba(255,76,0,0.6)] group-hover:from-[#FF6600] group-hover:to-[#B31A00]'
                                  }`}
                                >
                                  <span className="px-1 py-0.2 rounded-full font-mono font-black">
                                    {seat.number}
                                  </span>
                                </div>

                                {/* Seat Chair Bottom Cushion Base */}
                                <div
                                  className={`w-7 sm:w-8.5 h-2 sm:h-2.5 rounded-b-md border-t transition-all ${
                                    isSelected
                                      ? 'bg-[#E64400] border-[#FF4C00]/80'
                                      : isGroupHeld
                                      ? 'bg-purple-800 border-purple-400/80'
                                      : isBooked || isHeldByOther
                                      ? 'bg-zinc-900 border-zinc-800'
                                      : isPremium
                                      ? 'bg-amber-700 border-amber-400/60'
                                      : 'bg-[#801200] border-[#FF4C00]/40'
                                  }`}
                                />
                              </button>
                            );
                          })()}
                        </div>
                      );
                    })}
                  </div>

                  {/* CENTER AISLE WALKWAY WITH ILLUMINATED STEP LIGHT DASHES */}
                  <div className="w-8 sm:w-10 flex flex-col items-center justify-center shrink-0">
                    <div className="w-5 h-1.5 rounded-full bg-amber-400/95 shadow-[0_0_12px_rgba(251,191,36,0.95)]" />
                  </div>

                  {/* RIGHT SEAT BLOCK (Seats 9-16) */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {rowSeats.slice(8, 16).map((seat, colIdx) => {
                      const isSelected = selectedSeatIds.includes(seat.id);
                      const isBooked = seat.status === 'booked';
                      const isHeldByOther = seat.status === 'held';
                      const isPremium = seat.type === 'premium';

                      // Global column position across 16 seats (8 to 15)
                      const globalCol = colIdx + 8; // 8..15
                      const normX = (globalCol - 7.5) / 7.5; // +0.06 to +1.0

                      // True Parabolic Arc Offset (Curves UP towards screen at outer edges)
                      const parabolicY = viewMode === '3d' ? -Math.pow(normX, 2) * (14 + rowIdx * 2.2) : 0;
                      const tiltAngle = viewMode === '3d' ? -normX * (13 + rowIdx * 1.2) : 0;

                      return (
                        <div
                          key={seat.id}
                          style={{
                            transform: `translateY(${parabolicY}px) rotate(${tiltAngle}deg)`,
                          }}
                          className="transition-transform duration-200"
                        >
                          {(() => {
                            const isSelected = selectedSeatIds.includes(seat.id);
                            const isGroupHeld = groupHeldSeats.includes(seat.id);
                            const isBooked = seat.status === 'booked';
                            const isHeldByOther = seat.status === 'held' && !isGroupHeld;
                            const isPremium = seat.type === 'premium';

                            return (
                              <button
                                type="button"
                                disabled={isBooked || isHeldByOther}
                                onClick={() => onToggleSeat(seat)}
                                title={`${seat.id} (${isGroupHeld ? 'Group Reserved Seat' : isPremium ? 'Premium VIP' : 'Regular'}) - ${seat.price} BDT`}
                                className={`group relative flex flex-col items-center justify-center p-0.5 rounded-t-xl transition-all duration-200 cursor-pointer ${
                                  isSelected
                                    ? 'scale-110 z-20'
                                    : isBooked || isHeldByOther
                                    ? 'opacity-30 cursor-not-allowed'
                                    : 'hover:-translate-y-1 hover:scale-110 hover:z-10'
                                }`}
                              >
                                {/* Seat Chair Backrest Contour */}
                                <div
                                  className={`w-6 sm:w-7.5 h-4 sm:h-5 rounded-t-lg flex items-center justify-center font-bold text-[8px] sm:text-[9.5px] tracking-tighter transition-all shadow-md ${
                                    isSelected
                                      ? 'bg-[#FF4C00] text-black font-black ring-2 ring-white shadow-[0_0_18px_rgba(255,76,0,1)]'
                                      : isGroupHeld
                                      ? 'bg-purple-600 text-white font-black border border-purple-300 ring-1 ring-purple-400 shadow-[0_0_14px_rgba(147,51,234,0.9)]'
                                      : isBooked || isHeldByOther
                                      ? 'bg-zinc-800 text-zinc-600 border border-zinc-700'
                                      : isPremium
                                      ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-black font-black border border-amber-300 shadow-[0_2px_10px_rgba(245,158,11,0.6)]'
                                      : 'bg-gradient-to-b from-[#FF4C00] via-[#D62800] to-[#991600] text-white border border-[#FF6633]/60 shadow-[0_2px_10px_rgba(255,76,0,0.6)] group-hover:from-[#FF6600] group-hover:to-[#B31A00]'
                                  }`}
                                >
                                  <span className="px-1 py-0.2 rounded-full font-mono font-black">
                                    {seat.number}
                                  </span>
                                </div>

                                {/* Seat Chair Bottom Cushion Base */}
                                <div
                                  className={`w-7 sm:w-8.5 h-2 sm:h-2.5 rounded-b-md border-t transition-all ${
                                    isSelected
                                      ? 'bg-[#E64400] border-[#FF4C00]/80'
                                      : isGroupHeld
                                      ? 'bg-purple-800 border-purple-400/80'
                                      : isBooked || isHeldByOther
                                      ? 'bg-zinc-900 border-zinc-800'
                                      : isPremium
                                      ? 'bg-amber-700 border-amber-400/60'
                                      : 'bg-[#801200] border-[#FF4C00]/40'
                                  }`}
                                />
                              </button>
                            );
                          })()}
                        </div>
                      );
                    })}
                  </div>

                  {/* Faint Row Label (Right) */}
                  <span
                    className={`w-6 text-center text-[11px] font-black uppercase font-mono tracking-wider shrink-0 ${
                      isPremiumRow ? 'text-amber-400' : 'text-zinc-500'
                    }`}
                  >
                    {rowLetter}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. AISLE STEPS AT BOTTOM-CENTER WITH GLOWING TREAD LINES */}
        <div className="flex flex-col items-center justify-center pt-2 space-y-1">
          <div className="w-16 h-1.5 rounded-full bg-amber-400/90 shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
          <div className="w-24 h-1.5 rounded-full bg-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 mt-1">
            CENTER AISLE ENTRANCE
          </span>
        </div>

      </div>

      {/* OPTIONAL STICKY SUMMARY & CHECKOUT FOOTER (WHEN PROVIDED) */}
      {onProceedToCheckout && (
        <div className="sticky bottom-4 z-40 rounded-3xl border border-zinc-800 bg-[#0E0E0E]/95 backdrop-blur-xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.9)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00] shrink-0">
              <Ticket size={24} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  Selected Seats:
                </span>
                <span className="text-sm font-black text-[#FF4C00]">
                  {selectedSeatsObj.length > 0
                    ? selectedSeatsObj.map((s) => s.id).join(', ')
                    : 'None selected'}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl font-black text-white">
                  {totalPrice} <span className="text-xs font-bold text-zinc-400">BDT</span>
                </span>
                {selectedSeatsObj.length > 0 && (
                  <span className="text-xs font-semibold text-zinc-500">
                    ({selectedSeatsObj.length} seat(s) x avg {(totalPrice / selectedSeatsObj.length).toFixed(0)} BDT)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {isLeader ? (
              /* GROUP LEADER: Single Primary Action Button */
              <button
                type="button"
                disabled={
                  (selectedSeatsObj.length === 0 && groupHeldSeats.length === 0) || isSubmitting
                }
                onClick={onProceedGroupCheckout || onProceedToCheckout}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF4C00] to-purple-600 hover:from-[#e04300] hover:to-purple-500 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#FF4C00]/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <CheckCircle2 size={18} />
                <span>
                  {isSubmitting
                    ? 'Launching Stripe Gateway...'
                    : `Pay & Confirm Group Tickets (${
                        groupTotalPrice > 0 ? groupTotalPrice : totalPrice
                      } BDT)`}
                </span>
              </button>
            ) : (
              /* INVITED FRIENDS / MEMBERS */
              <>
                {onProceedGroupCheckout && selectedSeatsObj.length > 0 && (
                  <button
                    type="button"
                    disabled={groupHeldSeats.length === 0 || isSubmitting}
                    onClick={onProceedGroupCheckout}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 size={16} />
                    <span>
                      {isSubmitting
                        ? 'Launching Stripe Gateway...'
                        : `Pay All Group Seats (${groupTotalPrice} BDT)`}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={
                    (selectedSeatsObj.length === 0 &&
                      (!onProceedGroupCheckout || groupHeldSeats.length === 0)) ||
                    isSubmitting
                  }
                  onClick={
                    selectedSeatsObj.length > 0
                      ? onProceedToCheckout
                      : onProceedGroupCheckout || onProceedToCheckout
                  }
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#FF4C00] hover:bg-[#e04300] disabled:opacity-40 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF4C00]/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  <CheckCircle2 size={16} />
                  <span>
                    {isSubmitting
                      ? 'Launching Stripe Gateway...'
                      : selectedSeatsObj.length > 0
                      ? `Pay My Seats (${totalPrice} BDT)`
                      : `Pay All Group Seats (${groupTotalPrice} BDT)`}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
