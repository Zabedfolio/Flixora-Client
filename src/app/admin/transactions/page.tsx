'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  Download,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Copy,
  RefreshCw,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { adminApi, AdminTransaction, TransactionStatus } from '@/lib/api/adminApi';
import { toast } from 'react-hot-toast';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'refunded' | 'failed'>('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Refund Modal State
  const [selectedTxForRefund, setSelectedTxForRefund] = useState<AdminTransaction | null>(null);
  const [refundReason, setRefundReason] = useState('Customer requested cancellation & refund');
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

  // Debounce search query input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch transactions from dynamic backend API
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getTransactions({
        page,
        limit,
        search: debouncedSearch,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });

      setTransactions(res.data || []);
      setTotalPages(res.pagination.totalPages || 1);
      setTotalCount(res.pagination.total || 0);
    } catch (err: any) {
      console.error('Failed to fetch transactions:', err);
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Handle Process Refund
  const handleConfirmRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxForRefund) return;

    try {
      setIsProcessingRefund(true);
      const updated = await adminApi.processRefund(selectedTxForRefund._id, refundReason);
      toast.success(`Transaction ${updated.invoiceId || selectedTxForRefund.stripeTransactionId} refunded successfully!`);
      
      // Update local state instantly
      setTransactions((prev) =>
        prev.map((t) => (t._id === selectedTxForRefund._id ? { ...t, status: 'refunded', refundReason } : t))
      );
      setSelectedTxForRefund(null);
    } catch (err: any) {
      console.error('Refund processing error:', err);
      toast.error(err.message || 'Failed to process refund');
    } finally {
      setIsProcessingRefund(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 select-none">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <CreditCard size={26} className="text-[#FF4C00]" />
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Transaction & Invoice <span className="text-[#FF4C00]">History</span>
            </h1>
          </div>
          <p className="text-xs md:text-sm text-zinc-400 mt-1 font-medium">
            Search subscriber payments by Stripe ID or Email, filter by status, and issue direct Stripe refunds.
          </p>
        </div>

        <button
          onClick={() => fetchTransactions()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141414] hover:bg-[#1C1C1C] border border-zinc-800 text-xs font-bold text-zinc-300 transition-all cursor-pointer outline-none w-fit"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-[#FF4C00]' : ''} />
          <span>Refresh Table</span>
        </button>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0E0E0E] border border-[#1A1A1A] p-4 rounded-2xl">
        {/* Real-time search bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by Transaction ID or User Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-[#222222] focus:border-[#FF4C00]/50 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-white placeholder:text-zinc-600 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-[#141414] border border-[#222222] p-1 rounded-xl overflow-x-auto scrollbar-none">
          {(['all', 'success', 'refunded', 'failed'] as const).map((st) => {
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF4C00] text-black shadow-sm font-extrabold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC TRANSACTION TABLE */}
      <div className="bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead>
              <tr className="border-b border-[#1A1A1A] text-left text-zinc-500 text-[10px] font-black uppercase tracking-widest bg-zinc-950/70">
                <th className="p-4 pl-6">Invoice</th>
                <th className="p-4">Stripe Transaction ID</th>
                <th className="p-4">Customer Email</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A] text-xs font-semibold text-zinc-400">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-zinc-500">
                    <Loader2 size={24} className="animate-spin text-[#FF4C00] mx-auto mb-2" />
                    <span>Loading real-time transactions...</span>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-zinc-500">
                    No transactions matching your criteria.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-zinc-950/40 transition-colors">
                    {/* Invoice ID */}
                    <td className="p-4 pl-6 font-mono text-zinc-300 font-bold whitespace-nowrap">
                      {tx.invoiceId || 'INV-2026-XXXX'}
                    </td>

                    {/* Stripe Transaction ID with quick copy */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-zinc-400 text-[11px]">
                        <span className="truncate max-w-[130px]">{tx.stripeTransactionId}</span>
                        <button
                          onClick={() => copyToClipboard(tx.stripeTransactionId, 'Transaction ID')}
                          className="text-zinc-600 hover:text-[#FF4C00] transition-colors p-1"
                          title="Copy Stripe ID"
                        >
                          <Copy size={11} />
                        </button>
                      </div>
                    </td>

                    {/* Customer Email */}
                    <td className="p-4 text-white font-medium max-w-[180px] truncate">
                      {tx.userEmail}
                    </td>

                    {/* Plan Tier */}
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-[10px] uppercase">
                        {tx.planName || 'Standard'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                      ${tx.amount.toFixed(2)}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                          tx.status === 'success'
                            ? 'bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00]'
                            : tx.status === 'refunded'
                            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                            : 'bg-red-500/10 border border-red-500/30 text-red-500'
                        }`}
                      >
                        {tx.status === 'success' ? 'Success' : tx.status === 'refunded' ? 'Refunded' : 'Failed'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="p-4 text-zinc-500 text-[11px] whitespace-nowrap">
                      {tx.date}
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* Download Invoice Button */}
                        <a
                          href={`/api/payments/invoice?id=${tx._id}`}
                          download
                          onClick={() => toast.success(`Downloading invoice ${tx.invoiceId}...`)}
                          className="p-2 rounded-lg bg-[#141414] hover:bg-[#1F1F1F] border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          title="Download Invoice"
                        >
                          <Download size={13} />
                        </a>

                        {/* Process Refund Action Button */}
                        {tx.status === 'success' ? (
                          <button
                            onClick={() => setSelectedTxForRefund(tx)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 border border-red-900/60 text-red-400 hover:text-red-300 font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer outline-none"
                            title="Process Stripe Refund"
                          >
                            <RotateCcw size={11} />
                            <span>Refund</span>
                          </button>
                        ) : tx.status === 'refunded' ? (
                          <span className="text-[10px] font-bold text-zinc-600 italic px-2 py-1">
                            Refunded
                          </span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION BAR */}
        <div className="p-4 border-t border-[#1A1A1A] flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-950/40">
          <span className="text-xs text-zinc-500 font-semibold">
            Showing <strong className="text-white">{transactions.length}</strong> of{' '}
            <strong className="text-white">{totalCount}</strong> transactions (Page {page} of {totalPages})
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1E1E1E] border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1E1E1E] border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* PROCESS REFUND MODAL */}
      {selectedTxForRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl shadow-2xl p-6 flex flex-col gap-5 select-none animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-950/30 border border-red-900/60 flex items-center justify-center text-red-500 shrink-0">
                <RotateCcw size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Process Stripe Refund
                </h3>
                <p className="text-xs text-zinc-500 font-medium mt-0.5">
                  Invoice {selectedTxForRefund.invoiceId} • Amount: ${selectedTxForRefund.amount.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl text-xs text-red-400 font-medium leading-relaxed">
              This action triggers an immediate Stripe refund and updates the transaction status to <strong className="text-white font-bold">Refunded</strong>.
            </div>

            <form onSubmit={handleConfirmRefund} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Refund Reason / Memo
                </label>
                <input
                  type="text"
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g., Customer requested cancellation"
                  className="w-full bg-[#141414] border border-[#262626] rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500/60 transition-all font-semibold"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#1A1A1A]">
                <button
                  type="button"
                  onClick={() => setSelectedTxForRefund(null)}
                  disabled={isProcessingRefund}
                  className="flex-1 bg-[#141414] hover:bg-[#1E1E1E] text-zinc-400 hover:text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isProcessingRefund}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessingRefund ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Refunding...</span>
                    </>
                  ) : (
                    <span>Confirm Refund</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
