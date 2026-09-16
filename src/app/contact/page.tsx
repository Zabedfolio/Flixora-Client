'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ContactUsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Thank you! Your message has been sent to Flixora Support.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-10 font-sans selection:bg-[#FF4C00] selection:text-black">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00] font-black text-xs uppercase tracking-widest">
            <MessageSquare size={14} /> Contact Support
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            We’re Here to Help
          </h1>
          <p className="text-zinc-400 text-xs sm:text-base font-medium">
            Have a question about your subscription, cinema hall ticket reservation, or platform features? Reach out to our 24/7 team.
          </p>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CONTACT INFO CARDS */}
          <div className="space-y-4 lg:col-span-1">
            <div className="bg-[#0C0C0C] border border-zinc-850 rounded-2xl p-6 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00]">
                <Mail size={18} />
              </div>
              <h3 className="text-sm font-black uppercase text-white">Email Support</h3>
              <p className="text-xs text-zinc-400 font-medium">Fast support for account & billing inquiries.</p>
              <a href="mailto:support@flixora.com" className="text-xs font-mono font-bold text-[#FF4C00] block pt-1">
                support@flixora.com
              </a>
            </div>

            <div className="bg-[#0C0C0C] border border-zinc-850 rounded-2xl p-6 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00]">
                <MapPin size={18} />
              </div>
              <h3 className="text-sm font-black uppercase text-white">Headquarters</h3>
              <p className="text-xs text-zinc-400 font-medium">
                Level 8, Bashundhara City Mall, Panthapath, Dhaka, Bangladesh.
              </p>
            </div>

            <div className="bg-[#0C0C0C] border border-zinc-850 rounded-2xl p-6 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00]">
                <Clock size={18} />
              </div>
              <h3 className="text-sm font-black uppercase text-white">Support Hours</h3>
              <p className="text-xs text-zinc-400 font-medium">24/7 Automated Ticket & Gate Scanner Desk</p>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="bg-[#0E0E0E] border border-zinc-800 rounded-3xl p-6 sm:p-8 lg:col-span-2 space-y-6">
            <h2 className="text-xl font-black uppercase text-white">Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-11 rounded-xl bg-zinc-950 border border-zinc-800 px-4 text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-11 rounded-xl bg-zinc-950 border border-zinc-800 px-4 text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Cinema ticket issue, Billing, Feedback..."
                  className="w-full h-11 rounded-xl bg-zinc-950 border border-zinc-800 px-4 text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you today?"
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-4 text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF4C00]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send size={16} /> {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
