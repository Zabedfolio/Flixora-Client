'use client';

import React, { useState } from 'react';
import { Briefcase, MapPin, Send, Loader2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  desc: string;
}

const OPEN_POSITIONS: JobPosition[] = [
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
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [experience, setExperience] = useState('Mid Level');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setSelectedJob(null);
    setApplicantName('');
    setApplicantEmail('');
    setApplicantPhone('');
    setExperience('Mid Level');
    setPortfolioUrl('');
    setCoverLetter('');
    setIsSubmitting(false);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!applicantName.trim() || !applicantEmail.trim() || !applicantPhone.trim()) {
      toast.error('Please enter your name, email, and phone number.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: applicantName.trim(),
          email: applicantEmail.trim(),
          phone: applicantPhone.trim(),
          jobTitle: selectedJob.title,
          department: selectedJob.department,
          experience,
          portfolioUrl: portfolioUrl.trim(),
          coverLetter: coverLetter.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Application submitted! Sent directly to Admin Dashboard.');
        resetForm();
      } else {
        toast.error(data.message || 'Failed to submit application.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      toast.error('Server error submitting application. Please try again.');
      setIsSubmitting(false);
    }
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
                onClick={() => setSelectedJob(job)}
                className="px-5 py-2.5 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 self-start md:self-auto"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>

        {/* APPLICATION FORM MODAL */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-[#0E0E0E] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
              <button
                onClick={resetForm}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div>
                <span className="text-[10px] font-bold text-[#FF4C00] uppercase tracking-wider font-mono">Job Application</span>
                <h3 className="text-xl font-black text-white mt-0.5">{selectedJob.title}</h3>
                <p className="text-xs text-zinc-500 font-medium mt-1">Department: {selectedJob.department} ({selectedJob.type})</p>
              </div>

              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Full Name <span className="text-[#FF4C00]">*</span></label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Zabed Mahmud"
                    className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-800 px-3.5 text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Email Address <span className="text-[#FF4C00]">*</span></label>
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
                    <label className="block text-zinc-400 font-bold mb-1">Phone Number <span className="text-[#FF4C00]">*</span></label>
                    <input
                      type="tel"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="+880 1700 000000"
                      className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-800 px-3.5 text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Experience Level</label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-800 px-3 text-white focus:border-[#FF4C00] focus:outline-none cursor-pointer"
                    >
                      <option value="Entry Level">Entry Level (0-2 yrs)</option>
                      <option value="Mid Level">Mid Level (3-5 yrs)</option>
                      <option value="Senior Level">Senior Level (5+ yrs)</option>
                      <option value="Lead / Architect">Lead / Architect (8+ yrs)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Portfolio / Resume URL</label>
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-800 px-3.5 text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Cover Letter / Additional Notes</label>
                  <textarea
                    rows={3}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell us why you are excited about Flixora and what projects you have built..."
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 text-white placeholder-zinc-600 focus:border-[#FF4C00] focus:outline-none resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 size={16} className="animate-spin text-black" />
                    ) : (
                      <>
                        <Send size={14} /> Submit Application
                      </>
                    )}
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
