'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Mail,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  X,
  RefreshCw,
  Archive,
  CornerUpLeft,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);

      const res = await fetch(`/api/admin/messages?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setMessages(data.data || []);
      } else {
        toast.error(data.message || 'Failed to fetch contact messages.');
      }
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      toast.error('Server error fetching contact messages.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`Message marked as "${newStatus}".`);
        setMessages((prev) =>
          prev.map((msg) => (msg._id === id ? { ...msg, status: newStatus as any } : msg))
        );
        if (selectedMsg && selectedMsg._id === id) {
          setSelectedMsg({ ...selectedMsg, status: newStatus as any });
        }
      } else {
        toast.error(data.message || 'Failed to update message status.');
      }
    } catch (err) {
      toast.error('Error updating status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Message deleted successfully.');
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        if (selectedMsg && selectedMsg._id === id) setSelectedMsg(null);
      } else {
        toast.error(data.message || 'Failed to delete message.');
      }
    } catch (err) {
      toast.error('Error deleting message.');
    }
  };

  const openDetailModal = (msg: ContactMessage) => {
    setSelectedMsg(msg);
    if (msg.status === 'unread') {
      handleStatusChange(msg._id, 'read');
    }
  };

  // Metrics
  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => m.status === 'unread').length;
  const supportCount = messages.filter((m) => m.category === 'Technical Support').length;
  const generalCount = messages.filter((m) => m.category === 'General Inquiry').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'read':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'replied':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'archived':
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
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
            <MessageSquare size={13} /> Support & Contact Inbox
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            Contact Messages
          </h1>
          <p className="text-xs text-zinc-400 font-medium">
            Review user inquiries, support tickets, cinema booking questions, and studio messages.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#FF4C00]/40 flex items-center gap-2 text-xs font-bold transition-all cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-[#FF4C00]' : ''} /> Refresh
        </button>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0D0D0D] border border-zinc-900/60 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Messages</span>
            <MessageSquare size={16} className="text-[#FF4C00]" />
          </div>
          <div className="text-2xl font-black text-white">{totalCount}</div>
        </div>

        <div className="bg-[#0D0D0D] border border-zinc-900/60 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider">Unread</span>
            <Clock size={16} />
          </div>
          <div className="text-2xl font-black text-white">{unreadCount}</div>
        </div>

        <div className="bg-[#0D0D0D] border border-zinc-900/60 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-xs font-bold uppercase tracking-wider">Technical Support</span>
            <Mail size={16} />
          </div>
          <div className="text-2xl font-black text-white">{supportCount}</div>
        </div>

        <div className="bg-[#0D0D0D] border border-zinc-900/60 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-bold uppercase tracking-wider">General Inquiries</span>
            <CheckCircle2 size={16} />
          </div>
          <div className="text-2xl font-black text-white">{generalCount}</div>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-[#0D0D0D] border border-zinc-900/60 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-3 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by sender name, email, or subject..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-zinc-950 border border-zinc-900/80 text-xs text-white placeholder-zinc-500 focus:border-[#FF4C00] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-900/80 px-3 py-1.5 rounded-xl text-xs text-zinc-400">
            <Filter size={14} className="text-[#FF4C00]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0E0E0E]">All Statuses</option>
              <option value="unread" className="bg-[#0E0E0E]">Unread</option>
              <option value="read" className="bg-[#0E0E0E]">Read</option>
              <option value="replied" className="bg-[#0E0E0E]">Replied</option>
              <option value="archived" className="bg-[#0E0E0E]">Archived</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-900/80 px-3 py-1.5 rounded-xl text-xs text-zinc-400">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0E0E0E]">All Categories</option>
              <option value="General Inquiry" className="bg-[#0E0E0E]">General Inquiry</option>
              <option value="Technical Support" className="bg-[#0E0E0E]">Technical Support</option>
              <option value="Billing & Tickets" className="bg-[#0E0E0E]">Billing & Tickets</option>
              <option value="Partnership" className="bg-[#0E0E0E]">Partnership</option>
              <option value="Press" className="bg-[#0E0E0E]">Press</option>
            </select>
          </div>
        </div>
      </div>

      {/* MESSAGES TABLE */}
      <div className="bg-[#0D0D0D] border border-zinc-900/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 border-b border-zinc-900/80 text-zinc-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-4 px-6">Sender</th>
                <th className="py-4 px-6">Category & Subject</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500 font-medium">
                    Loading contact messages...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500 font-medium">
                    No contact messages found.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg._id} className={`hover:bg-zinc-950/60 transition-colors ${msg.status === 'unread' ? 'bg-[#FF4C00]/5' : ''}`}>
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        {msg.name}
                        {msg.status === 'unread' && (
                          <span className="w-2 h-2 rounded-full bg-[#FF4C00] shrink-0" title="Unread Message" />
                        )}
                      </div>
                      <div className="text-zinc-500 text-[11px] font-mono">{msg.email}</div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-block px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-[#FF4C00] font-mono mb-1">
                        {msg.category}
                      </span>
                      <div className="font-bold text-white truncate max-w-xs">{msg.subject}</div>
                    </td>

                    <td className="py-4 px-6 text-zinc-500 font-mono text-[11px]">
                      {new Date(msg.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={msg.status}
                        disabled={updatingId === msg._id}
                        onChange={(e) => handleStatusChange(msg._id, e.target.value)}
                        className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer bg-zinc-950 ${getStatusBadge(
                          msg.status
                        )}`}
                      >
                        <option value="unread" className="bg-[#0E0E0E] text-amber-400">Unread</option>
                        <option value="read" className="bg-[#0E0E0E] text-blue-400">Read</option>
                        <option value="replied" className="bg-[#0E0E0E] text-emerald-400">Replied</option>
                        <option value="archived" className="bg-[#0E0E0E] text-zinc-400">Archived</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDetailModal(msg)}
                          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                          title="View Message Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(msg._id)}
                          className="p-2 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-950/50 transition-colors cursor-pointer"
                          title="Delete Message"
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

      {/* MESSAGE DETAIL MODAL */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0E0E0E] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
            <button
              onClick={() => setSelectedMsg(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div>
              <div className="inline-block px-2.5 py-0.5 rounded bg-[#FF4C00]/10 text-[#FF4C00] border border-[#FF4C00]/30 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                {selectedMsg.category}
              </div>
              <h3 className="text-xl font-black text-white">{selectedMsg.subject}</h3>
              <p className="text-xs text-zinc-500 font-mono">Received on {new Date(selectedMsg.createdAt).toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950 border border-zinc-850 p-4 rounded-2xl text-xs">
              <div className="space-y-1">
                <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Sender Name</span>
                <div className="text-white font-bold text-sm">{selectedMsg.name}</div>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Email Address</span>
                <div className="text-[#FF4C00] font-mono flex items-center gap-1">
                  <Mail size={12} /> {selectedMsg.email}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-zinc-400 font-bold text-xs">Message Content</span>
              <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-2xl text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {selectedMsg.message}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-850">
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject)}`}
                  onClick={() => handleStatusChange(selectedMsg._id, 'replied')}
                  className="px-4 py-2 rounded-xl bg-[#FF4C00] text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#e04300] transition-colors cursor-pointer"
                >
                  <CornerUpLeft size={14} /> Reply via Email
                </a>

                <select
                  value={selectedMsg.status}
                  onChange={(e) => handleStatusChange(selectedMsg._id, e.target.value)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider outline-none cursor-pointer bg-zinc-950 ${getStatusBadge(
                    selectedMsg.status
                  )}`}
                >
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedMsg(null)}
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
