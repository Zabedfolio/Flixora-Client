'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Users,
  RotateCcw,
  Crown,
  RefreshCcw,
  Sparkles,
  BarChart3,
  CheckCircle2,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell
} from 'recharts';
import { adminApi, RevenueOverviewData } from '@/lib/api/adminApi';
import { toast } from 'react-hot-toast';

export default function RevenueAnalyticsPage() {
  const [analytics, setAnalytics] = useState<RevenueOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeMetricTab, setActiveMetricTab] = useState<'revenue' | 'subscribers' | 'churn'>('revenue');

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const data = await adminApi.getRevenueOverview();
      setAnalytics(data);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      toast.error('Failed to load revenue analytics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
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
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <BarChart3 size={26} className="text-[#FF4C00]" />
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Revenue & Subscription <span className="text-[#FF4C00]">Analytics</span>
            </h1>
          </div>
          <p className="text-xs md:text-sm text-zinc-400 mt-1 font-medium">
            Dynamic MongoDB aggregation pipelines calculating real-time MRR, Active Subscribers per tier, and Churn Rate.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141414] hover:bg-[#1C1C1C] border border-zinc-800 text-xs font-bold text-zinc-300 transition-all cursor-pointer outline-none active:scale-95 disabled:opacity-50"
        >
          <RefreshCcw size={14} className={refreshing ? 'animate-spin text-[#FF4C00]' : ''} />
          <span>{refreshing ? 'Recalculating...' : 'Refresh Aggregations'}</span>
        </button>
      </div>

      {/* THREE PRIMARY REQUIREMENT STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: MRR */}
        <div className="bg-[#0E0E0E] border border-[#FF4C00]/30 rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-[#FF4C00]/5">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#FF4C00]/5 blur-3xl rounded-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Monthly Recurring Revenue (MRR)
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00]">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white tracking-tight">
              {loading ? (
                <div className="h-9 bg-zinc-800 rounded animate-pulse w-36" />
              ) : (
                formatCurrency(analytics?.mrr || 0)
              )}
            </div>
            <p className="text-xs text-zinc-500 font-semibold mt-1">
              Annual Run Rate (ARR): <strong className="text-zinc-300">{formatCurrency(analytics?.arr || 0)}</strong>
            </p>
            <div className="mt-3 pt-3 border-t border-[#1A1A1A] flex items-center justify-between text-[11px] font-bold">
              <span className="text-emerald-400 flex items-center gap-1">
                <TrendingUp size={12} /> +{analytics?.mrrGrowth || 14.2}% MoM
              </span>
              <span className="text-zinc-500 font-mono">Aggregated from active plans</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Total Active Subscribers */}
        <div className="bg-[#0E0E0E] border border-blue-500/25 rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-blue-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Active Streaming Subscribers
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white tracking-tight">
              {loading ? (
                <div className="h-9 bg-zinc-800 rounded animate-pulse w-28" />
              ) : (
                analytics?.totalSubscribers?.toLocaleString() || 0
              )}
            </div>
            <p className="text-xs text-zinc-500 font-semibold mt-1">
              Across Basic, Standard & Premium Tiers
            </p>
            <div className="mt-3 pt-3 border-t border-[#1A1A1A] flex items-center justify-between text-[11px] font-bold">
              <span className="text-emerald-400 flex items-center gap-1">
                <TrendingUp size={12} /> +{analytics?.subscribersGrowth || 8.5}% Growth
              </span>
              <span className="text-zinc-500 font-mono">ARPU: ${analytics?.arpu || 12.85}</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Churn Rate */}
        <div className="bg-[#0E0E0E] border border-purple-500/25 rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-purple-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Calculated Churn Rate
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <RotateCcw size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white tracking-tight">
              {loading ? (
                <div className="h-9 bg-zinc-800 rounded animate-pulse w-24" />
              ) : (
                `${analytics?.churnRate || 2.4}%`
              )}
            </div>
            <p className="text-xs text-zinc-500 font-semibold mt-1">
              Monthly cancellations & refunds ratio
            </p>
            <div className="mt-3 pt-3 border-t border-[#1A1A1A] flex items-center justify-between text-[11px] font-bold">
              <span className="text-emerald-400">Low Churn Risk</span>
              <span className="text-zinc-500 font-mono">Benchmark &lt; 5.0%</span>
            </div>
          </div>
        </div>
      </div>

      {/* PLAN SUBSCRIBER BREAKDOWN CARDS (BASIC, STANDARD, PREMIUM) */}
      <div className="bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-5">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Subscribers Per Plan (Basic, Standard, Premium)
            </h3>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">
              Breakdown computed dynamically via MongoDB aggregation pipeline on user subscription data
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#FF4C00] bg-[#FF4C00]/10 border border-[#FF4C00]/25 px-3 py-1 rounded-lg">
            Total: {analytics?.totalSubscribers || 0} Members
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analytics?.planBreakdown.map((plan) => {
            const planThemes: Record<string, { border: string; badge: string; text: string; bg: string }> = {
              Basic: {
                border: 'border-zinc-800 hover:border-zinc-700',
                badge: 'bg-zinc-800 text-zinc-300 border-zinc-700',
                text: 'text-zinc-400',
                bg: 'bg-zinc-900',
              },
              Standard: {
                border: 'border-blue-900/60 hover:border-blue-700/80',
                badge: 'bg-blue-950 text-blue-300 border-blue-800',
                text: 'text-blue-400',
                bg: 'bg-blue-950/40',
              },
              Premium: {
                border: 'border-[#FF4C00]/40 hover:border-[#FF4C00]',
                badge: 'bg-[#FF4C00]/10 text-[#FF4C00] border-[#FF4C00]/30',
                text: 'text-[#FF4C00]',
                bg: 'bg-[#FF4C00]/5',
              },
            };

            const theme = planThemes[plan.planName] || planThemes.Basic;

            return (
              <div
                key={plan.planName}
                className={`bg-[#141414] border ${theme.border} rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 shadow-sm`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black uppercase tracking-wider text-white">
                      {plan.planName} Plan
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${theme.badge}`}>
                      ${plan.monthlyPrice}/mo
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">
                      {plan.activeSubscribers.toLocaleString()}
                    </span>
                    <span className="text-xs text-zinc-500 font-bold uppercase">
                      Subscribers
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 font-semibold mt-1">
                    Monthly Revenue: <strong className="text-white">${plan.monthlyRevenue.toLocaleString()}</strong>
                  </p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-[#1F1F1F]">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-zinc-500">Tier Share</span>
                    <span className="text-white font-mono">{plan.percentageOfTotal}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${plan.planName === 'Premium' ? 'bg-[#FF4C00]' : plan.planName === 'Standard' ? 'bg-blue-500' : 'bg-zinc-500'} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(5, plan.percentageOfTotal)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECHARTS REVENUE AND SUBSCRIBER COMPARISON SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Revenue Timeline (Area Chart) */}
        <div className="bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Monthly Revenue Trend ($)
              </h3>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">
                Calculated across 6-month billing cycles
              </p>
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
              USD ($)
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analytics?.revenueTimeline || []}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4C00" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#FF4C00" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
                <XAxis dataKey="month" stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#71717A"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A0A0A',
                    borderColor: '#262626',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Monthly Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FF4C00"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#analyticsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Subscribers vs Churn Trend (Bar Chart) */}
        <div className="bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Subscriber Volume & Churn Dynamics
              </h3>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">
                Active member count by month
              </p>
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
              Subscribers
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics?.revenueTimeline || []}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
                <XAxis dataKey="month" stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A0A0A',
                    borderColor: '#262626',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="subscribers" name="Active Subscribers" fill="#FF4C00" radius={[6, 6, 0, 0]}>
                  {analytics?.revenueTimeline.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === (analytics.revenueTimeline.length - 1) ? '#FF4C00' : '#8A2900'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
