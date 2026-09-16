'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Ticket as TicketIcon, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Building, 
  QrCode,
  ShieldCheck,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TicketData {
  id: string;
  ticketId: string;
  movieTitle: string;
  hallName: string;
  hallAddress: string;
  date: string;
  time: string;
  seats: string[];
  totalPrice: number;
  status: 'active' | 'used' | 'cancelled';
  userName: string;
  userEmail: string;
  createdAt: string;
  usedAt?: string;
}

export default function TicketVerificationPage() {
  const params = useParams();
  const ticketIdParam = (params?.ticketId as string) || '';
  const router = useRouter();

  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTicketDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cinema/tickets?ticketId=${encodeURIComponent(ticketIdParam)}&verify=true`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Ticket not found in the system');
        setTicket(null);
      } else {
        setTicket(data.ticket);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to verification server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketIdParam) {
      fetchTicketDetails();
    }
  }, [ticketIdParam]);

  const handleMarkAsUsed = async () => {
    if (!ticket) return;
    setVerifying(true);
    try {
      const res = await fetch('/api/cinema/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: ticket.ticketId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Ticket marked as USED successfully!');
        setTicket(data.ticket);
      } else {
        toast.error(data.message || 'Failed to update ticket status');
      }
    } catch (err: any) {
      toast.error(err.message || 'Verification error occurred');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center pt-32 sm:pt-36 pb-16 px-4 md:px-8 font-sans selection:bg-[#FF4C00] selection:text-black">
      <div className="w-full max-w-xl bg-[#0E0E0E] border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Header navigation */}
        <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80 mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#FF4C00] transition-colors"
          >
            <ArrowLeft size={16} /> Return to Portal
          </button>
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
            <ShieldCheck size={16} className="text-[#FF4C00]" /> Cinema Gate Verification
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-[#FF4C00] animate-spin" />
            <p className="text-zinc-400 text-sm font-medium">Verifying Ticket ID: {ticketIdParam}...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 space-y-6">
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-500">
              <XCircle size={44} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Verification Failed</h1>
              <p className="text-red-400 text-sm mt-2 font-medium">{error}</p>
            </div>
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-900 text-left text-xs font-mono text-zinc-400">
              Ticket Pass Key: {ticketIdParam}
            </div>
          </div>
        ) : ticket ? (
          <div className="space-y-6">
            {/* STATUS BANNER */}
            {ticket.status === 'active' && (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400 flex items-center gap-4 animate-pulse">
                <CheckCircle2 size={36} className="shrink-0 text-emerald-500" />
                <div>
                  <h2 className="text-lg font-black tracking-wide text-emerald-400 uppercase">
                    ✓ VALID TICKET - ENTRY APPROVED
                  </h2>
                  <p className="text-xs text-emerald-300/80 font-medium">
                    This ticket is valid for admission. Scan staff can approve entry now.
                  </p>
                </div>
              </div>
            )}

            {ticket.status === 'used' && (
              <div className="p-5 rounded-2xl bg-red-500/10 border-2 border-red-500/40 text-red-400 flex items-center gap-4">
                <XCircle size={36} className="shrink-0 text-red-500" />
                <div>
                  <h2 className="text-lg font-black tracking-wide text-red-400 uppercase">
                    ✗ TICKET ALREADY USED
                  </h2>
                  <p className="text-xs text-red-300/80 font-medium">
                    Entry denied. This pass was redeemed on {ticket.usedAt ? new Date(ticket.usedAt).toLocaleTimeString() : 'earlier today'}.
                  </p>
                </div>
              </div>
            )}

            {ticket.status === 'cancelled' && (
              <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-400 flex items-center gap-4">
                <AlertTriangle size={36} className="shrink-0 text-amber-500" />
                <div>
                  <h2 className="text-lg font-black tracking-wide text-amber-400 uppercase">
                    ⚠ TICKET CANCELLED
                  </h2>
                  <p className="text-xs text-amber-300/80 font-medium">
                    This ticket was cancelled or refunded. Entry denied.
                  </p>
                </div>
              </div>
            )}

            {/* MOVIE & TICKET DETAILS */}
            <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between border-b border-zinc-900 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#FF4C00] tracking-widest font-mono">
                    {ticket.ticketId}
                  </span>
                  <h1 className="text-xl font-black text-white mt-0.5">{ticket.movieTitle}</h1>
                </div>
                <div className="bg-[#FF4C00]/10 border border-[#FF4C00]/30 px-3 py-1 rounded-full text-[#FF4C00] font-black text-xs font-mono">
                  {ticket.seats.length} {ticket.seats.length === 1 ? 'SEAT' : 'SEATS'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Building size={16} className="text-[#FF4C00] shrink-0" />
                  <div>
                    <span className="text-zinc-500 text-[10px] block uppercase font-bold">Cinema Hall</span>
                    <span className="font-semibold">{ticket.hallName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-zinc-300">
                  <MapPin size={16} className="text-[#FF4C00] shrink-0" />
                  <div>
                    <span className="text-zinc-500 text-[10px] block uppercase font-bold">Location</span>
                    <span className="font-semibold">{ticket.hallAddress}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-zinc-300">
                  <Calendar size={16} className="text-[#FF4C00] shrink-0" />
                  <div>
                    <span className="text-zinc-500 text-[10px] block uppercase font-bold">Date</span>
                    <span className="font-semibold">{ticket.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-zinc-300">
                  <Clock size={16} className="text-[#FF4C00] shrink-0" />
                  <div>
                    <span className="text-zinc-500 text-[10px] block uppercase font-bold">Showtime</span>
                    <span className="font-semibold">{ticket.time}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-900 flex items-center justify-between">
                <div>
                  <span className="text-zinc-500 text-[10px] block uppercase font-bold">Reserved Seats</span>
                  <div className="flex flex-nowrap items-center gap-1.5 mt-1 whitespace-nowrap" title={ticket.seats.join(', ')}>
                    {ticket.seats.slice(0, 2).map((seat) => (
                      <span key={seat} className="px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-white font-mono font-bold text-xs shrink-0">
                        {seat}
                      </span>
                    ))}
                    {ticket.seats.length > 2 && (
                      <span className="px-2 py-0.5 rounded bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00] font-mono font-bold text-xs shrink-0">
                        +{ticket.seats.length - 2}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 text-[10px] block uppercase font-bold">Total Paid</span>
                  <span className="text-base font-black text-[#FF4C00] font-mono">
                    ৳{ticket.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* HOLDER DETAILS */}
            <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <User size={16} className="text-zinc-400" />
                <div>
                  <span className="text-zinc-500 text-[10px] block uppercase font-bold">Pass Holder</span>
                  <span className="font-semibold text-white">{ticket.userName}</span>
                  <span className="text-zinc-500 block text-[11px]">{ticket.userEmail}</span>
                </div>
              </div>
            </div>

            {/* VERIFICATION ACTIONS */}
            {ticket.status === 'active' ? (
              <button
                onClick={handleMarkAsUsed}
                disabled={verifying}
                className="w-full py-4 rounded-2xl bg-[#FF4C00] hover:bg-[#FF4C00]/90 text-black font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#FF4C00]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Marking as Used...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} /> Mark Ticket as Used (Admit User)
                  </>
                )}
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-zinc-900 text-center text-xs font-semibold text-zinc-400 border border-zinc-850">
                Ticket already processed and finalized.
              </div>
            )}
          </div>
        ) : null}

      </div>
    </div>
  );
}
