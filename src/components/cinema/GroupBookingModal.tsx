'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Users,
  Copy,
  Check,
  Share2,
  X,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  Send,
  Ticket,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface GroupBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupCode: string;
  shareUrl: string;
  movieTitle: string;
  hallName: string;
  date: string;
  time: string;
  selectedSeats: string[];
  members?: any[];
}

export default function GroupBookingModal({
  isOpen,
  onClose,
  groupCode,
  shareUrl,
  movieTitle,
  hallName,
  date,
  time,
  selectedSeats,
  members = [],
}: GroupBookingModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Group invite link copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🍿 Join my Flixora Group Booking for "${movieTitle}" at ${hallName} (${date} @ ${time})! Reserved seats: ${selectedSeats.join(
        ', '
      )}. Book your adjacent seats here: ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl border border-zinc-800 bg-[#0C0C0C] p-6 sm:p-8 text-white shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-zinc-400 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/20 text-[#FF4C00] text-xs font-black uppercase tracking-widest">
            <Users size={14} />
            <span>Group Booking Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
            Invite Friends & Reserve Together
          </h2>
          <p className="text-xs text-zinc-400">
            Share this link or QR code with your movie squad. Friends can join your showtime and pick adjacent seats in real time.
          </p>
        </div>

        {/* Movie Session Details & Reserved Seats */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-3 text-xs text-zinc-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-white text-sm">{movieTitle}</p>
              <p className="text-zinc-400 mt-0.5">{hallName}</p>
              <p className="text-zinc-500 text-[11px] mt-0.5">
                {date} @ <strong className="text-[#FF4C00] font-mono">{time}</strong>
              </p>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] text-zinc-500 uppercase block">Group Code</span>
              <span className="text-xs font-black text-[#FF4C00] bg-[#FF4C00]/10 border border-[#FF4C00]/20 px-2 py-0.5 rounded">
                {groupCode}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-900 flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400">Current Reserved Group Seats:</span>
            <span className="font-mono text-xs font-black text-[#FF4C00]">
              {selectedSeats && selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Selecting...'}
            </span>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-[#111111] border border-zinc-800">
          <div className="bg-white p-3 rounded-2xl border-2 border-zinc-800 shadow-lg shrink-0">
            <QRCodeSVG value={shareUrl} size={110} bgColor="#FFFFFF" fgColor="#000000" level="M" />
          </div>

          <div className="space-y-3 w-full text-center sm:text-left">
            <div>
              <p className="text-xs font-bold text-white">Scan QR to Join Room</p>
              <p className="text-[11px] text-zinc-500">
                Scan with any mobile camera to immediately open seat selection on mobile.
              </p>
            </div>

            {/* Quick Share Buttons */}
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                <Send size={13} />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Copy Shareable Link Input */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Shareable Group Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full h-11 px-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="h-11 px-4 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-lg shadow-[#FF4C00]/20"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Active Members List */}
        {members && members.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-zinc-900">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
              <span>Friends in this Group ({members.length})</span>
              <span className="text-emerald-400 font-mono text-[10px]">Real-Time Sync Active</span>
            </p>
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {members.map((m: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-900 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-black flex items-center justify-center">
                      {m.userName ? m.userName.charAt(0).toUpperCase() : 'U'}
                    </span>
                    <span className="font-bold text-white">{m.userName}</span>
                    {m.isLeader && (
                      <span className="text-[9px] font-mono font-bold bg-[#FF4C00]/10 text-[#FF4C00] border border-[#FF4C00]/20 px-1.5 py-0.5 rounded">
                        LEADER
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-zinc-400 text-[11px]">
                    Seats: {Array.isArray(m.selectedSeats) && m.selectedSeats.length > 0 ? m.selectedSeats.join(', ') : 'Browsing...'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
