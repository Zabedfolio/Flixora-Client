'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import QRCode from 'qrcode';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TicketPDFDocument from '@/components/cinema/TicketPDF';
import {
  Ticket as TicketIcon,
  Calendar,
  Clock,
  MapPin,
  Download,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Share2,
  Film,
  Building2,
  User,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TicketPageProps {
  params: Promise<{ ticketId: string }>;
}

export default function TicketDetailsPage({ params }: TicketPageProps) {
  const { ticketId } = use(params);
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [posterDataUrl, setPosterDataUrl] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const [accessDenied, setAccessDenied] = useState(false);

  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${ticketId}`
    : `https://flixora-client.vercel.app/verify/${ticketId}`;

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        setAccessDenied(false);
        const res = await fetch(`/api/cinema/tickets?ticketId=${encodeURIComponent(ticketId)}`);
        const data = await res.json();

        if (res.status === 403 || data.accessDenied) {
          setAccessDenied(true);
          setTicket(null);
          return;
        }

        if (res.ok && data.success && data.ticket) {
          setTicket(data.ticket);

          // Generate PNG Data URL for PDF QR Code
          try {
            const url = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 200 });
            setQrDataUrl(url);
          } catch {
            // silent
          }

          // Convert Poster Image URL to Data URL for PDF
          if (data.ticket.moviePoster) {
            try {
              const imgRes = await fetch(data.ticket.moviePoster);
              const blob = await imgRes.blob();
              const reader = new FileReader();
              reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                  setPosterDataUrl(reader.result);
                }
              };
              reader.readAsDataURL(blob);
            } catch {
              setPosterDataUrl(data.ticket.moviePoster);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load ticket:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId, verifyUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="animate-spin text-[#FF4C00]" />
        <p className="text-xs font-mono text-zinc-500">Loading Cinema Ticket {ticketId}...</p>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-black text-white p-6 pt-24 sm:pt-28 flex flex-col items-center justify-center text-center font-sans">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-black uppercase text-white tracking-wide">Access Denied</h2>
        <p className="text-xs text-zinc-400 mt-2 max-w-md font-medium">
          This cinema ticket pass belongs to another user account. You do not have authorization to view or download tickets owned by other customers.
        </p>
        <div className="flex items-center gap-3 mt-6">
          <Link
            href="/dashboard/my-tickets"
            className="px-6 py-2.5 rounded-xl bg-[#FF4C00] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF4C00]/20"
          >
            View My Bookings
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider"
          >
            Home
          </Link>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-black uppercase text-white">Ticket Not Found</h2>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm">
          No cinema ticket reservation found matching ID <strong className="text-white">{ticketId}</strong>.
        </p>
        <Link
          href="/"
          className="mt-6 px-6 py-2.5 rounded-xl bg-[#FF4C00] text-black font-black text-xs uppercase tracking-wider"
        >
          Back to Flixora Home
        </Link>
      </div>
    );
  }

  const rawStatus = (ticket.status || '').toLowerCase();
  const isCancelled = rawStatus === 'cancelled';
  const isUsed = rawStatus === 'used';
  const isActive = rawStatus === 'active' || rawStatus === 'confirmed';

  return (
    <div className="min-h-screen bg-black text-white pt-24 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-10 font-sans select-none">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* NAV & STATUS HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/my-tickets"
              className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              <ChevronLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#FF4C00]">
                  Official Cinema Entry Pass
                </span>
              </div>
              <h1 className="text-2xl font-black uppercase text-white font-mono mt-0.5">
                {ticket.ticketId}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${
                isUsed
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  : isCancelled
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}
            >
              <CheckCircle2 size={14} />
              <span>{isUsed ? 'Already Used' : isCancelled ? 'Cancelled' : 'Active Ticket'}</span>
            </span>

            {/* Download PDF Button */}
            {qrDataUrl ? (
              <PDFDownloadLink
                document={<TicketPDFDocument ticket={ticket} qrDataUrl={qrDataUrl} posterDataUrl={posterDataUrl} />}
                fileName={`Flixora-Ticket-${ticket.ticketId}.pdf`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF4C00]/20 cursor-pointer"
              >
                {({ loading: pdfLoading }) => (
                  <>
                    <Download size={14} />
                    <span>{pdfLoading ? 'Generating PDF...' : 'Download Ticket PDF'}</span>
                  </>
                )}
              </PDFDownloadLink>
            ) : null}
          </div>
        </div>

        {/* MAIN TICKET CARD PASS */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-[#0E0E0E] shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4C00]/10 blur-3xl rounded-full pointer-events-none" />

          {/* Top Info Grid */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between border-b border-zinc-900 pb-6">
            <div className="flex items-center gap-4">
              <img
                src={ticket.moviePoster}
                alt={ticket.movieTitle}
                className="w-20 h-28 rounded-2xl object-cover border-2 border-[#FF4C00]/40 shadow-xl shrink-0"
              />
              <div>
                <h2 className="text-xl font-black text-white">{ticket.movieTitle}</h2>
                <div className="flex items-center gap-2 text-xs font-bold text-[#FF4C00] mt-1">
                  <Building2 size={14} />
                  <span>{ticket.hallName}</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{ticket.hallAddress}</p>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-3 rounded-2xl border-4 border-zinc-900 shadow-xl mx-auto sm:mx-0 flex flex-col items-center">
              <QRCodeSVG
                value={verifyUrl}
                size={110}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="M"
              />
              <span className="text-[9px] font-mono font-bold text-black mt-1 tracking-wider">
                {ticket.ticketId}
              </span>
            </div>
          </div>

          {/* Ticket Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#121212] p-5 rounded-2xl border border-zinc-850">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Show Date</p>
              <p className="text-sm font-black text-white mt-1 flex items-center gap-1.5">
                <Calendar size={14} className="text-[#FF4C00]" />
                {ticket.date}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Showtime</p>
              <p className="text-sm font-black text-white mt-1 flex items-center gap-1.5">
                <Clock size={14} className="text-[#FF4C00]" />
                {ticket.time}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Reserved Seats</p>
              <p className="text-sm font-mono font-black text-[#FF4C00] mt-1">
                {Array.isArray(ticket.seatNumbers) ? ticket.seatNumbers.join(', ') : ticket.seatNumbers}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Total Paid</p>
              <p className="text-sm font-black text-emerald-400 mt-1">
                {ticket.totalPrice} BDT
              </p>
            </div>
          </div>

          {/* Security Payload Notice */}
          <div className="pt-2 flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-900">
            <span>Customer: <strong className="text-zinc-300">{ticket.userName}</strong> ({ticket.userEmail})</span>
            <span className="font-mono text-[10px]">Verified Hash Security Payload</span>
          </div>
        </div>

      </div>
    </div>
  );
}
