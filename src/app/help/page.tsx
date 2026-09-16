'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, Search, Ticket, Tv, CreditCard, Shield, ChevronDown, MessageSquare } from 'lucide-react';

const FAQS = [
  {
    cat: 'Cinema Tickets',
    icon: Ticket,
    items: [
      {
        q: 'How do I present my ticket at the cinema gate?',
        a: 'Navigate to "My Bookings" in your dashboard or open the ticket URL from your confirmation. Show the QR code on your mobile screen or download the PDF ticket to present to staff at the entrance scanner.',
      },
      {
        q: 'Can I cancel or refund my cinema hall reservation?',
        a: 'Ticket cancellations and seat releases can be requested prior to showtime through customer support or via the admin gate desk depending on theater partner policy.',
      },
      {
        q: 'What happens if a showtime is sold out?',
        a: 'Live seat counts update every few seconds. If a showtime is sold out, check back for alternative dates or choose another nearby cinema hall in your district.',
      },
    ],
  },
  {
    cat: 'Subscription & Billing',
    icon: CreditCard,
    items: [
      {
        q: 'What payment methods does Flixora support?',
        a: 'We support local Bangladeshi payment solutions including bKash, Nagad, Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay.',
      },
      {
        q: 'How do I upgrade or cancel my subscription plan?',
        a: 'Go to Dashboard -> Subscription to manage or upgrade your streaming plan (Basic, Standard, or Premium). Changes take effect immediately.',
      },
    ],
  },
  {
    cat: 'Streaming & Devices',
    icon: Tv,
    items: [
      {
        q: 'What video quality options are available?',
        a: 'Flixora supports adaptive streaming from 720p HD up to 4K Ultra HD with Dolby Atmos audio depending on your device network connection and subscription plan.',
      },
      {
        q: 'How does Kids & Parental Control PIN work?',
        a: 'You can enable Kids Mode in settings to restrict mature titles and protect adult profiles with a 4-digit Parent PIN.',
      },
    ],
  },
];

export default function HelpCenterPage() {
  const [search, setSearch] = useState('');
  const [openIdx, setOpenIdx] = useState<string | null>(null);

  const toggleFaq = (key: string) => {
    setOpenIdx(openIdx === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-10 font-sans selection:bg-[#FF4C00] selection:text-black">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00] font-black text-xs uppercase tracking-widest">
            <HelpCircle size={14} /> Help Center & Support Hub
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            How Can We Help You?
          </h1>
          
          {/* SEARCH BAR */}
          <div className="relative pt-2">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search help topics, tickets, billing, 4K streaming..."
              className="w-full h-12 rounded-2xl bg-[#0C0C0C] border border-zinc-800 pl-12 pr-4 text-xs text-white placeholder-zinc-500 focus:border-[#FF4C00] focus:outline-none"
            />
          </div>
        </div>

        {/* FAQ CATEGORIES */}
        <div className="space-y-8">
          {FAQS.map((cat, catIdx) => {
            const Icon = cat.icon;
            return (
              <div key={catIdx} className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-black uppercase text-[#FF4C00] border-b border-zinc-900 pb-2">
                  <Icon size={16} /> <span>{cat.cat}</span>
                </div>

                <div className="space-y-2">
                  {cat.items.map((item, itemIdx) => {
                    const key = `${catIdx}-${itemIdx}`;
                    const isOpen = openIdx === key;
                    const matches = !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase());

                    if (!matches) return null;

                    return (
                      <div key={key} className="bg-[#0C0C0C] border border-zinc-850 rounded-2xl overflow-hidden">
                        <button
                          onClick={() => toggleFaq(key)}
                          className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-950 transition-colors"
                        >
                          <span>{item.q}</span>
                          <ChevronDown size={16} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180 text-[#FF4C00]' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="p-4 pt-0 text-xs text-zinc-400 font-medium leading-relaxed border-t border-zinc-900/60 bg-zinc-950/40">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* STILL NEED HELP CTA */}
        <div className="bg-[#0E0E0E] border border-zinc-800 rounded-3xl p-8 text-center space-y-4">
          <MessageSquare size={28} className="text-[#FF4C00] mx-auto" />
          <h3 className="text-lg font-black uppercase text-white">Still Need Assistance?</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto font-medium">
            Our support desk is available 24/7 to answer questions regarding bookings, streaming issues, or account settings.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 rounded-xl bg-[#FF4C00] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF4C00]/20"
          >
            Contact Customer Support
          </Link>
        </div>

      </div>
    </div>
  );
}
