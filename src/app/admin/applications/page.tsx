'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle,
  Clock,
  UserCheck,
  UserX,
  ExternalLink,
  Trash2,
  Eye,
  X,
  RefreshCw,
  Mail,
  Phone,
  FileText,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface JobApplication {
  _id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  experience: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'interviewing' | 'hired' | 'rejected';
  createdAt: string;
}

export default function AdminJobApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (departmentFilter !== 'all') params.append('department', departmentFilter);

      const res = await fetch(`/api/admin/applications?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setApplications(data.data || []);
      } else {
        toast.error(data.message || 'Failed to fetch job applications.');
      }
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      toast.error('Server error fetching applications.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, departmentFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`Application status updated to "${newStatus}".`);
        setApplications((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status: newStatus as any } : app))
        );
        if (selectedApp && selectedApp._id === id) {
          setSelectedApp({ ...selectedApp, status: newStatus as any });
        }
      } else {
        toast.error(data.message || 'Failed to update status.');
      }
    } catch (err) {
      toast.error('Error updating status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job application?')) return;

    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Application deleted successfully.');
        setApplications((prev) => prev.filter((app) => app._id !== id));
        if (selectedApp && selectedApp._id === id) setSelectedApp(null);
      } else {
        toast.error(data.message || 'Failed to delete application.');
      }
    } catch (err) {
      toast.error('Error deleting application.');
    }
  };

  // Metrics
  const totalCount = applications.length;
  const pendingCount = applications.filter((a) => a.status === 'pending').length;
  const interviewingCount = applications.filter((a) => a.status === 'interviewing').length;
  const hiredCount = applications.filter((a) => a.status === 'hired').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'reviewed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'interviewing':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'hired':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* PAGE TITLE & REFRESH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Briefcase size={13} /> Career Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            Job Applications
          </h1>
          <p className="text-xs text-zinc-400 font-medium">
            Manage candidates, review resumes, and track recruitment pipelines.
          </p>
        </div>

        <button
          onClick={fetchApplications}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#FF4C00]/40 flex items-center gap-2 text-xs font-bold transition-all cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-[#FF4C00]' : ''} /> Refresh
        </button>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0D0D0D] border border-[#141414] rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Received</span>
            <Briefcase size={16} className="text-[#FF4C00]" />
          </div>
          <div className="text-2xl font-black text-white">{totalCount}</div>
        </div>

        <div className="bg-[#0D0D0D] border border-[#141414] rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Review</span>
            <Clock size={16} />
          </div>
          <div className="text-2xl font-black text-white">{pendingCount}</div>
        </div>

        <div className="bg-[#0D0D0D] border border-[#141414] rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-bold uppercase tracking-wider">Interviewing</span>
            <UserCheck size={16} />
          </div>
          <div className="text-2xl font-black text-white">{interviewingCount}</div>
        </div>

        <div className="bg-[#0D0D0D] border border-[#141414] rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold uppercase tracking-wider">Hired</span>
            <CheckCircle size={16} />
          </div>
          <div className="text-2xl font-black text-white">{hiredCount}</div>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-[#0D0D0D] border border-[#141414] rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-3 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by candidate name, email, or position..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-zinc-950 border border-[#141414] text-xs text-white placeholder-zinc-500 focus:border-[#FF4C00] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-zinc-950 border border-[#141414] px-3 py-1.5 rounded-xl text-xs text-zinc-400">
            <Filter size={14} className="text-[#FF4C00]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0E0E0E]">All Statuses</option>
              <option value="pending" className="bg-[#0E0E0E]">Pending</option>
              <option value="reviewed" className="bg-[#0E0E0E]">Reviewed</option>
              <option value="interviewing" className="bg-[#0E0E0E]">Interviewing</option>
              <option value="hired" className="bg-[#0E0E0E]">Hired</option>
              <option value="rejected" className="bg-[#0E0E0E]">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-zinc-950 border border-[#141414] px-3 py-1.5 rounded-xl text-xs text-zinc-400">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0E0E0E]">All Departments</option>
              <option value="Engineering" className="bg-[#0E0E0E]">Engineering</option>
              <option value="Data & AI" className="bg-[#0E0E0E]">Data & AI</option>
              <option value="Design" className="bg-[#0E0E0E]">Design</option>
              <option value="DevOps" className="bg-[#0E0E0E]">DevOps</option>
            </select>
          </div>
        </div>
      </div>

      {/* APPLICATIONS TABLE */}
      <div className="bg-[#0D0D0D] border border-[#141414] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 border-b border-[#141414] text-zinc-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-4 px-6">Candidate</th>
                <th className="py-4 px-6">Position & Dept</th>
                <th className="py-4 px-6">Experience</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141414]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500 font-medium">
                    Loading job applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500 font-medium">
                    No job applications found.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-zinc-950/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-sm">{app.name}</div>
                      <div className="text-zinc-500 text-[11px] font-mono">{app.email}</div>
                      <div className="text-zinc-600 text-[10px]">{app.phone}</div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{app.jobTitle}</div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-[#FF4C00] font-mono">
                        {app.department}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-zinc-400 font-medium">{app.experience}</td>

                    <td className="py-4 px-6 text-zinc-500 font-mono text-[11px]">
                      {new Date(app.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={app.status}
                        disabled={updatingId === app._id}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer bg-zinc-950 ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        <option value="pending" className="bg-[#0E0E0E] text-amber-400">Pending</option>
                        <option value="reviewed" className="bg-[#0E0E0E] text-blue-400">Reviewed</option>
                        <option value="interviewing" className="bg-[#0E0E0E] text-purple-400">Interviewing</option>
                        <option value="hired" className="bg-[#0E0E0E] text-emerald-400">Hired</option>
                        <option value="rejected" className="bg-[#0E0E0E] text-red-400">Rejected</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                          title="View Application Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(app._id)}
                          className="p-2 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-950/50 transition-colors cursor-pointer"
                          title="Delete Application"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0E0E0E] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div>
              <div className="inline-block px-2.5 py-0.5 rounded bg-[#FF4C00]/10 text-[#FF4C00] border border-[#FF4C00]/30 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                {selectedApp.department}
              </div>
              <h3 className="text-xl font-black text-white">{selectedApp.jobTitle}</h3>
              <p className="text-xs text-zinc-500 font-mono">Submitted on {new Date(selectedApp.createdAt).toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950 border border-[#141414] p-4 rounded-2xl text-xs">
              <div className="space-y-1">
                <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Candidate Name</span>
                <div className="text-white font-bold text-sm">{selectedApp.name}</div>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Experience</span>
                <div className="text-white font-bold">{selectedApp.experience}</div>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Email Address</span>
                <div className="text-[#FF4C00] font-mono flex items-center gap-1">
                  <Mail size={12} /> {selectedApp.email}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Phone Number</span>
                <div className="text-zinc-300 font-mono flex items-center gap-1">
                  <Phone size={12} /> {selectedApp.phone}
                </div>
              </div>
            </div>

            {selectedApp.portfolioUrl && (
              <div className="space-y-1.5">
                <span className="text-zinc-400 font-bold text-xs">Portfolio / Resume Link</span>
                <a
                  href={selectedApp.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[#FF4C00] font-mono text-xs flex items-center justify-between hover:border-[#FF4C00]/40 transition-colors"
                >
                  <span className="truncate">{selectedApp.portfolioUrl}</span>
                  <ExternalLink size={14} className="shrink-0 ml-2" />
                </a>
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-zinc-400 font-bold text-xs">Cover Letter / Application Notes</span>
              <div className="bg-zinc-950 border border-[#141414] p-4 rounded-2xl text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {selectedApp.coverLetter || 'No cover letter provided.'}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#141414]">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-bold">Update Status:</span>
                <select
                  value={selectedApp.status}
                  onChange={(e) => handleStatusChange(selectedApp._id, e.target.value)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider outline-none cursor-pointer bg-zinc-950 ${getStatusBadge(
                    selectedApp.status
                  )}`}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
