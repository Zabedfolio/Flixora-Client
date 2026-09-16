'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Briefcase, MapPin, Clock, Sparkles, CheckCircle2, Send, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const OPEN_POSITIONS = [
  {
    id: 'pos-1',
    title: 'Senior Frontend Engineer (Next.js & WebGL)',
    department: 'Engineering',
    location: 'Dhaka, Bangladesh / Remote',
    type: 'Full-Time',
    desc: 'Build high-performance, photorealistic 3D WebGL components and dynamic video player interfaces for millions of streaming fans.',
  },
  {
    id: 'pos-2',
    title: 'AI Recommendation Systems Lead',
    department: 'Data & AI',
    location: 'Remote',
    type: 'Full-Time',
    desc: 'Architect machine learning models and vector search algorithms for hyper-personalized movie recommendation engines.',
  },
  {
    id: 'pos-3',
    title: 'Product Designer (UI/UX Cinema System)',
    department: 'Design',
    location: 'Dhaka, Bangladesh',
    type: 'Full-Time',
    desc: 'Craft sleek, glassmorphic dark-mode interfaces and immersive interactive cinema seat selection maps.',
  },
  {
    id: 'pos-4',
    title: 'Streaming Infrastructure & CDN Engineer',
    department: 'DevOps',
    location: 'Remote',
    type: 'Full-Time',
    desc: 'Optimize low-latency live streaming protocols, global edge caching, and automated gate verification APIs.',
  },
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) {
      toast.error('Please enter your name and email address.');
      return;
    }
    toast.success('Application submitted successfully! Our talent acquisition team will review your profile.');
    setSelectedJob(null);
    setApplicantName('');
    setApplicantEmail('');
    setResumeUrl('');
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-10 font-sans selection:bg-[#FF4C00] selection:text-black">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00] font-black text-xs uppercase tracking-widest">
            <Briefcase size={14} /> Join Flixora Team
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Build the Future of Cinema & Streaming
          </h1>
          <p className="text-zinc-400 text-xs sm:text-base font-medium">
            We are looking for bold thinkers, engineers, designers, and movie visionaries to craft world-class digital streaming experiences.
          </p>
        </div>

        {/* OPEN POSITIONS LIST */}
        <div className="space-y-4">
          <h2 className="text-lg font-black uppercase text-white border-b border-zinc-900 pb-3">Open Positions</h2>

          {OPEN_POSITIONS.map((job) => (
            <div
              key={job.id}
              className="bg-[#0C0C0C] border border-zinc-850 hover:border-zinc-750 rounded-2xl p-6 transition-all space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                  <span className="px-2.5 py-0.5 rounded bg-[#FF4C00]/10 text-[#FF4C00] border border-[#FF4C00]/20">
                    {job.department}
                  </span>
                  <span className="text-zinc-400 flex items-center gap-1">
                    <MapPin size={12} /> {job.location}
                  </span>
                  <span className="text-zinc-500">• {job.type}</span>
                </div>

                <h3 className="text-lg font-black text-white">{job.title}</h3>
                <p className="text-xs text-zinc-400 font-medium">{job.desc}</p>
              </div>

              <button
                onClick={() => setSelectedJob(job.title)}
                className="px-5 py-2.5 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 self-start md:self-auto"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>

        {/* APPLICATION FORM MODAL */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[#0E0E0E] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
              <div>
                <span className="text-[10px] font-bold text-[#FF4C00] uppercase tracking-wider font-mono">Job Application</span>
                <h3 className="text-xl font-black text-white mt-0.5">{selectedJob}</h3>
              </div>

              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-800 px-3.5 text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-800 px-3.5 text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Portfolio / Resume Link</label>
                  <input
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile or GitHub"
                    className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-800 px-3.5 text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="flex-1 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#FF4C00] text-black font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Send size={14} /> Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
