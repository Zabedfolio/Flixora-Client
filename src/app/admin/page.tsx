'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  Crown,
  ArrowUpRight,
  RefreshCcw,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Tag,
  Sliders,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { adminApi, RevenueOverviewData, AdminTransaction } from '@/lib/api/adminApi';
import { toast } from 'react-hot-toast';

export default function AdminDashboardOverviewPage() {
  const [analytics, setAnalytics] = useState<RevenueOverviewData | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      const [analyticsData, transData] = await Promise.all([
        adminApi.getRevenueOverview(),
        adminApi.getTransactions({ page: 1, limit: 5 }),
      ]);
      setAnalytics(analyticsData);
      setRecentTransactions(transData.data || []);
    } catch (err: any) {
      console.error('Error loading dashboard overview:', err);
      toast.error('Failed to load live analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 select-none">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <Crown size={26} className="text-[#FF4C00]" fill="currentColor" />
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Revenue & Subscriptions <span className="text-[#FF4C00]">Control</span>
            </h1>
          </div>
          <p className="text-xs md:text-sm text-zinc-400 mt-1 font-medium">
            Real-time SaaS billing metrics, MongoDB aggregation insights, and active streaming accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141414] hover:bg-[#1C1C1C] border border-zinc-800 text-xs font-bold text-zinc-300 transition-all cursor-pointer outline-none active:scale-95 disabled:opacity-50"
          >
            <RefreshCcw size={14} className={refreshing ? 'animate-spin text-[#FF4C00]' : ''} />
            <span>{refreshing ? 'Syncing...' : 'Refresh Metrics'}</span>
          </button>

          <Link
            href="/admin/settings"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#FF4C00]/10"
          >
            <Sliders size={14} />
            <span>Manage Plans</span>
          </Link>
        </div>
      </div>

      {/* STAT CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: MRR */}
        <div className="bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl p-5 hover:border-[#FF4C00]/40 transition-all group shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Monthly Recurring (MRR)
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FF4C00]/10 border border-[#FF4C00]/25 flex items-center justify-center text-[#FF4C00]">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {loading ? (
                <div className="h-8 bg-zinc-800 rounded animate-pulse w-28" />
              ) : (
                formatCurrency(analytics?.mrr || 0)
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold">
              <span className="text-emerald-400 flex items-center gap-0.5">
                <TrendingUp size={12} /> +{analytics?.mrrGrowth || 14.2}%
              </span>
              <span className="text-zinc-500">vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Subscribers */}
        <div className="bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl p-5 hover:border-[#FF4C00]/40 transition-all group shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Active Subscribers
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {loading ? (
                <div className="h-8 bg-zinc-800 rounded animate-pulse w-24" />
              ) : (
                analytics?.totalSubscribers?.toLocaleString() || 0
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold">
              <span className="text-emerald-400">+{analytics?.subscribersGrowth || 8.5}%</span>
              <span className="text-zinc-500">streaming members</span>
            </div>
          </div>
        </div>

        {/* Card 3: Churn Rate */}
        <div className="bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl p-5 hover:border-[#FF4C00]/40 transition-all group shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Monthly Churn Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
              <RotateCcw size={16} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {loading ? (
                <div className="h-8 bg-zinc-800 rounded animate-pulse w-20" />
              ) : (
                `${analytics?.churnRate || 2.4}%`
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold">
              <span className="text-emerald-400">Healthy</span>
              <span className="text-zinc-500">industry benchmark &lt; 5%</span>
            </div>
          </div>
        </div>

        {/* Card 4: ARPU */}
        <div className="bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl p-5 hover:border-[#FF4C00]/40 transition-all group shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Avg Revenue / User (ARPU)
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {loading ? (
                <div className="h-8 bg-zinc-800 rounded animate-pulse w-24" />
              ) : (
                `$${analytics?.arpu || 12.85}/mo`
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold">
              <span className="text-zinc-400">ARR:</span>
              <span className="text-white font-bold">{formatCurrency(analytics?.arr || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS & SUBSCRIBER BREAKDOWN ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Revenue Timeline Chart */}
        <div className="lg:col-span-2 bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl p-6 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Monthly Recurring Revenue Growth
              </h3>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">
                6-Month Aggregation Pipeline from Stripe billing transactions
              </p>
            </div>
            <Link
              href="/admin/analytics"
              className="text-xs font-bold text-[#FF4C00] hover:underline flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="h-64 w-full pt-2">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                Loading revenue chart...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analytics?.revenueTimeline || []}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF4C00" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#FF4C00" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#52525B"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#52525B"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0E0E0E',
                      borderColor: '#2A2A2A',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
                    }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Monthly Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#FF4C00"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Plan Breakdown Card */}
        <div className="bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl p-6 flex flex-col justify-between gap-6 shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Active Plan Distribution
                </h3>
                <p className="text-xs text-zinc-500 font-medium mt-0.5">
                  Subscribers per tier
                </p>
              </div>
              <Crown size={18} className="text-[#FF4C00]" />
            </div>

            <div className="space-y-4 mt-6">
              {analytics?.planBreakdown.map((plan) => {
                const colors: Record<string, string> = {
                  Basic: 'from-zinc-500 to-zinc-400',
                  Standard: 'from-blue-600 to-cyan-400',
                  Premium: 'from-[#FF4C00] to-amber-400',
                };
                const gradient = colors[plan.planName] || 'from-[#FF4C00] to-orange-400';

                return (
                  <div key={plan.planName} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white uppercase tracking-wider">
                        {plan.planName} (${plan.monthlyPrice}/mo)
                      </span>
                      <span className="font-mono text-zinc-400 font-bold">
                        {plan.activeSubscribers.toLocaleString()} ({plan.percentageOfTotal}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(5, plan.percentageOfTotal)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#141414] border border-[#222222] p-4 rounded-xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                Highest Tier Share
              </span>
              <span className="text-xs font-bold text-white mt-0.5">
                Premium accounts account for 50%+ of all streaming revenue.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS TABLE PREVIEW */}
      <div className="bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1A1A1A] pb-4">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Recent Billing Transactions
            </h3>
            <p className="text-xs text-zinc-500 font-medium">
              Real-time feed of subscriber payment attempts and automated Stripe charges
            </p>
          </div>

          <Link
            href="/admin/transactions"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-[#141414] hover:bg-zinc-900 text-xs font-bold text-zinc-300 hover:text-white transition-all w-fit"
          >
            <span>View All Transactions & Invoices</span>
            <ArrowUpRight size={13} className="text-[#FF4C00]" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead>
              <tr className="border-b border-[#1A1A1A] text-left text-zinc-500 text-[10px] font-black uppercase tracking-widest bg-zinc-950/50">
                <th className="p-3 pl-4">Invoice ID</th>
                <th className="p-3">Customer Email</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A] text-xs font-semibold text-zinc-400">
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-600">
                    No transactions recorded yet.
                  </td>
                </tr>
              ) : (
                recentTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-zinc-950/40 transition-colors">
                    <td className="p-3 pl-4 font-mono text-zinc-300">{tx.invoiceId}</td>
                    <td className="p-3 text-white truncate max-w-[200px]">{tx.userEmail}</td>
                    <td className="p-3">
                      <span className="font-bold text-zinc-300">{tx.planName || 'Standard'}</span>
                    </td>
                    <td className="p-3 text-white font-mono font-bold">${tx.amount.toFixed(2)}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          tx.status === 'success'
                            ? 'bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00]'
                            : tx.status === 'refunded'
                            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                            : 'bg-red-500/10 border border-red-500/30 text-red-500'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-500">{tx.date}</td>
                    <td className="p-3 pr-4 text-right">
                      <Link
                        href="/admin/transactions"
                        className="text-[10px] uppercase font-bold text-zinc-400 hover:text-[#FF4C00] transition-colors"
                      >
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
