'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  AlertTriangle,
  Check,
  Copy,
  Crown,
  CreditCard,
  Download,
  Info,
  Loader2,
  PackageX,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authClient } from '@/app/(auth)/lib/auth-client';
import {
  getAllPlans,
  getUserPayments,
  type BillingRecord,
  type Plan,
} from '@/lib/paymentsData';

const DEFAULT_BILLING_HISTORY: BillingRecord[] = [
  {
    userId: 'demo-user',
    planId: 'premium',
    planName: 'Premium',
    amount: '$14.99',
    invoiceId: 'INV-2026-004',
    status: 'Paid',
    paymentMethod: 'Visa •••• 4242',
    date: '2026-08-15',
  },
  {
    userId: 'demo-user',
    planId: 'premium',
    planName: 'Premium',
    amount: '$14.99',
    invoiceId: 'INV-2026-003',
    status: 'Paid',
    paymentMethod: 'Visa •••• 4242',
    date: '2026-07-15',
  },
  {
    userId: 'demo-user',
    planId: 'standard',
    planName: 'Standard',
    amount: '$11.99',
    invoiceId: 'INV-2026-002',
    status: 'Paid',
    paymentMethod: 'Visa •••• 4242',
    date: '2026-06-15',
  },
  {
    userId: 'demo-user',
    planId: 'basic',
    planName: 'Basic',
    amount: '$7.99',
    invoiceId: 'INV-2026-001',
    status: 'Failed',
    paymentMethod: 'Visa •••• 4242',
    date: '2026-05-15',
  },
];

export default function SubscriptionPage() {
  const { data: session } = authClient.useSession();
  const searchParams = useSearchParams();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [billingList, setBillingList] = useState<BillingRecord[]>(DEFAULT_BILLING_HISTORY);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const loadData = useCallback(async (userId?: string) => {
    setLoading(true);
    try {
      const resPlans = await getAllPlans();
      if (resPlans.data && resPlans.data.length > 0) {
        setPlans(resPlans.data);
      } else {
        setPlans([
          {
            _id: 'basic',
            name: 'Basic',
            price: '$7.99/mo',
            resolution: '720p (HD)',
            screens: '1 screen',
            downloads: 'No downloads',
            ads: 'Ad-supported',
            kids: '1 kids profile',
          },
          {
            _id: 'standard',
            name: 'Standard',
            price: '$11.99/mo',
            resolution: '1080p (FHD)',
            screens: '2 screens',
            downloads: 'Standard downloads',
            ads: 'Ad-free',
            kids: '3 kids profiles',
          },
          {
            _id: 'premium',
            name: 'Premium',
            price: '$14.99/mo',
            resolution: '4K + HDR',
            screens: '4 screens',
            downloads: 'Unlimited downloads',
            ads: 'Ad-free',
            kids: 'Unlimited kids profiles',
          },
        ]);
      }

      if (userId) {
        const historyData = await getUserPayments(userId);
        if (historyData.length > 0) {
          setBillingList(historyData);
          const latestPaidPayment = historyData.find(
            (item: BillingRecord) => item.status === 'Paid',
          );
          if (latestPaidPayment && latestPaidPayment.planId) {
            setCurrentPlan(latestPaidPayment.planId);
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Error loading subscription data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      loadData(session.user.id);
    } else {
      loadData();
    }
  }, [session, loadData]);

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success === 'true') {
      toast.success('Payment successful! Your subscription is now active.');
      if (session?.user?.id) {
        loadData(session.user.id);
      }
    } else if (canceled === 'true') {
      toast.error('Payment process was cancelled.');
    }
  }, [searchParams, session, loadData]);

  const activePlanData = plans.find((plan) => plan._id === currentPlan) ?? plans[0] ?? null;

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Subscription cancelled. Reason: ${cancelReason || 'None provided'}`);
    setIsCancelModalOpen(false);
    setCancelReason('');
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans relative">
      <main className="pt-8 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full select-none flex flex-col gap-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-0.5 border-b border-[#1A1A1A] pb-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <Crown className="text-[#FF4C00] shrink-0" size={24} fill="currentColor" />
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
                Subscription Plan
              </h1>
            </div>
            <p className="text-xs md:text-sm text-zinc-500 font-medium max-w-2xl leading-relaxed">
              View your billing statements, change payment methods, or upgrade your streaming resolution.
            </p>
          </div>
        </div>

        {activePlanData ? (
          <section className="bg-[#1A1A1A] border border-[#FF4C00]/40 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_30px_rgba(255,76,0,0.06)] relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-40 h-40 bg-[#FF4C00]/5 blur-[60px] rounded-full pointer-events-none" />

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF4C00]/10 border border-[#FF4C00]/20 flex items-center justify-center text-[#FF4C00] shrink-0">
                <Crown size={22} fill="currentColor" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white uppercase tracking-wider">
                    {activePlanData.name} Plan
                  </span>
                  <span className="bg-[#FF4C00]/10 border border-[#FF4C00]/25 text-[#FF4C00] text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                    Active
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-semibold mt-0.5">
                  Current Cost:{' '}
                  <span className="text-white font-bold">{activePlanData.price}</span>{' '}
                  • Next renewal date:{' '}
                  <span className="text-white font-bold">2026-09-15</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 z-10">
              <a
                href="#plans"
                className="flex-1 md:flex-initial text-center bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#FF4C00]/10 outline-none"
              >
                Upgrade Plan
              </a>
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="flex-grow md:flex-initial border border-zinc-700 hover:border-red-500 text-zinc-400 hover:text-red-500 font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all cursor-pointer outline-none"
              >
                Cancel Sub
              </button>
            </div>
          </section>
        ) : (
          <div className="bg-[#1A1A1A]/40 border border-zinc-800/80 rounded-2xl p-6 text-center text-zinc-400 text-sm font-semibold">
            You don&apos;t have an active subscription yet. Choose a plan below to get started!
          </div>
        )}

        <div className="bg-[#1A1A1A] border border-[#FF4C00]/20 rounded-2xl p-5 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF4C00]/10 flex items-center justify-center text-[#FF4C00] shrink-0 animate-pulse">
              <Info size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Demo Payment Credentials
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5 font-medium leading-relaxed">
                Click any credential chip below to copy it instantly for use on the Stripe checkout page.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 text-[10px] uppercase font-black tracking-wider">Card:</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('4242424242424242');
                  toast.success('Card number copied!');
                }}
                className="flex items-center gap-1.5 bg-[#1F1F1F]/60 hover:bg-[#FF4C00] border border-[#2B2B2B] hover:border-transparent px-3 py-1.5 rounded-lg transition-all duration-250 cursor-pointer text-xs font-mono font-bold text-zinc-300 hover:text-black outline-none group active:scale-95"
              >
                <span>4242 4242 4242 4242</span>
                <Copy size={11} className="text-zinc-500 group-hover:text-black transition-colors" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-500 text-[10px] uppercase font-black tracking-wider">Expiry:</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('12/30');
                  toast.success('Expiry copied!');
                }}
                className="flex items-center gap-1.5 bg-[#1F1F1F]/60 hover:bg-[#FF4C00] border border-[#2B2B2B] hover:border-transparent px-3 py-1.5 rounded-lg transition-all duration-250 cursor-pointer text-xs font-mono font-bold text-zinc-300 hover:text-black outline-none group active:scale-95"
              >
                <span>12/30</span>
                <Copy size={11} className="text-zinc-500 group-hover:text-black transition-colors" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-500 text-[10px] uppercase font-black tracking-wider">CVC:</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('123');
                  toast.success('CVC copied!');
                }}
                className="flex items-center gap-1.5 bg-[#1F1F1F]/60 hover:bg-[#FF4C00] border border-[#2B2B2B] hover:border-transparent px-3 py-1.5 rounded-lg transition-all duration-250 cursor-pointer text-xs font-mono font-bold text-zinc-300 hover:text-black outline-none group active:scale-95"
              >
                <span>123</span>
                <Copy size={11} className="text-zinc-500 group-hover:text-black transition-colors" />
              </button>
            </div>
          </div>
        </div>

        <section id="plans" className="flex flex-col gap-6">
          <h2 className="text-lg font-bold text-zinc-300 tracking-wide uppercase">
            Available Stream Plans
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin text-[#FF4C00]" size={32} />
            </div>
          ) : plans.length === 0 ? (
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                <PackageX size={24} />
              </div>
              <p className="text-sm font-bold text-zinc-300">No subscription plans available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isActive = plan._id === currentPlan;

                return (
                  <div
                    key={plan._id}
                    className={`bg-[#0A0A0A] border rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all duration-300 ${
                      isActive
                        ? 'border-[#FF4C00] shadow-[0_0_25px_rgba(255,76,0,0.06)]'
                        : 'border-[#1A1A1A] hover:border-zinc-800'
                    }`}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-black text-white uppercase tracking-wider">
                            {plan.name}
                          </span>
                          <span className="text-xl font-black text-[#FF4C00]">
                            {plan.price ? plan.price.split('/')[0] : ''}
                          </span>
                        </div>
                        {isActive && (
                          <span className="bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00] text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">
                            Current Plan
                          </span>
                        )}
                      </div>

                      <ul className="space-y-3.5 text-xs font-semibold text-zinc-400">
                        <li className="flex items-center gap-2.5">
                          <Check size={14} className="text-[#FF4C00]" />
                          <span>
                            Resolution: <strong className="text-white">{plan.resolution}</strong>
                          </span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check size={14} className="text-[#FF4C00]" />
                          <span>
                            Screens: <strong className="text-white">{plan.screens}</strong>
                          </span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check size={14} className="text-[#FF4C00]" />
                          <span>{plan.downloads}</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check size={14} className="text-[#FF4C00]" />
                          <span>{plan.ads}</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check size={14} className="text-[#FF4C00]" />
                          <span>{plan.kids}</span>
                        </li>
                      </ul>
                    </div>

                    {isActive ? (
                      <button
                        disabled
                        className="w-full text-center py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all outline-none bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed"
                      >
                        Active Plan
                      </button>
                    ) : (
                      <Link
                        href={`/api/checkout_sessions?planId=${plan._id}&userId=${session?.user?.id || ''}&email=${encodeURIComponent(session?.user?.email || '')}&name=${encodeURIComponent(session?.user?.name || '')}&fromPlanId=${currentPlan || ''}`}
                        className="w-full text-center py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all outline-none bg-[#1A1A1A] hover:bg-[#FF4C00] text-zinc-300 hover:text-black cursor-pointer hover:scale-[1.02] shadow-sm block"
                      >
                        {currentPlan ? 'Switch Plan' : 'Pay Now'}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-zinc-300 tracking-wide uppercase">Billing History</h2>
            <div className="hidden sm:block overflow-x-auto bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl">
              <table className="table w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#1A1A1A] text-left text-zinc-500 text-[10px] font-black uppercase tracking-widest bg-zinc-950/40">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {billingList.map((item) => (
                    <tr key={item.invoiceId || item.date} className="border-b border-[#1A1A1A] last:border-b-0">
                      <td className="px-4 py-3 text-sm text-zinc-300">{item.date}</td>
                      <td className="px-4 py-3 text-sm text-zinc-200">{item.planName || item.planId}</td>
                      <td className="px-4 py-3 text-sm text-zinc-200">{item.amount}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
                            item.status === 'Paid'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-300">{item.invoiceId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden flex flex-col gap-3">
              {billingList.map((item) => (
                <div key={item.invoiceId || item.date} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-zinc-500">{item.date}</p>
                      <p className="text-sm font-bold text-white">{item.planName || item.planId}</p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-wide ${
                        item.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-zinc-400">{item.invoiceId}</span>
                    <span className="text-white font-semibold">{item.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#FF4C00]/10 text-[#FF4C00] p-2 rounded-full">
                  <CreditCard size={18} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Payment Method</h3>
              </div>
              <div className="rounded-xl border border-[#1A1A1A] bg-[#111111] p-4">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Visa ending in 4242</span>
                  <span className="text-[#FF4C00]">Default</span>
                </div>
                <div className="mt-3 text-2xl font-black text-white">**** 4242</div>
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#FF4C00]/10 text-[#FF4C00] p-2 rounded-full">
                  <Download size={18} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Plan Benefits</h3>
              </div>
              <ul className="space-y-3 text-sm text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#FF4C00]" />
                  4K Ultra HD streaming
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#FF4C00]" />
                  Up to 4 simultaneous screens
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#FF4C00]" />
                  Unlimited downloads
                </li>
              </ul>
            </div>
          </aside>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-[#FF4C00]/20 bg-[#101010] p-4 text-sm text-zinc-300">
          <AlertTriangle className="mt-0.5 text-[#FF4C00]" size={18} />
          <p>
            Subscription updates are managed through the payment flow. If your checkout isn&apos;t completing, verify your user session and Stripe credentials.
          </p>
        </div>
      </main>

      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#1A1A1A] bg-[#111111] p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-black uppercase tracking-wider text-white">Cancel Subscription</h3>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmCancel} className="mt-5 space-y-4">
              <label className="block text-sm text-zinc-300">
                Reason for cancellation
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#2A2A2A] bg-[#0B0B0B] p-3 text-white outline-none focus:border-[#FF4C00]"
                  rows={4}
                  placeholder="Tell us why you are cancelling..."
                />
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#FF4C00] px-4 py-2 text-sm font-black uppercase tracking-wider text-black"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
