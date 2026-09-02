'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Crown,
  CreditCard,
  Download,
  Check,
  AlertTriangle,
  Loader2,
  Info,
  PackageX,
  Copy,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { authClient } from '@/app/(auth)/lib/auth-client';
import {
  getAllPlans,
  getUserPayments,
  Plan,
  BillingRecord,
} from '@/lib/paymentsData';

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [billingList, setBillingList] = useState<BillingRecord[]>([]);
  const [checkoutLoadingKey, setCheckoutLoadingKey] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const { data: session } = authClient.useSession();
  const searchParams = useSearchParams();

  const handleInitiateCheckout = async (planKey: string) => {
    setCheckoutLoadingKey(planKey);
    try {
      const res = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          planId: planKey,
          userId: session?.user?.id || '',
          email: session?.user?.email || '',
          name: session?.user?.name || '',
          fromPlanId: currentPlan || '',
        }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout session error', data);
        toast.error(data?.message || 'Failed to initialize payment.');
        setCheckoutLoadingKey(null);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error('Failed to connect to checkout service.');
      setCheckoutLoadingKey(null);
    }
  };

  const loadData = useCallback(async (userId?: string) => {
    setLoading(true);
    try {
      const resPlans = await getAllPlans();
      if (resPlans.data && resPlans.data.length > 0) {
        setPlans(resPlans.data);
      }

      if (userId) {
        try {
          const profileRes = await fetch('/api/user/profile');
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            if (profileData.user?.planId) {
              setCurrentPlan(profileData.user.planId);
            }
          }
        } catch (err) {
          console.error('Error fetching live user profile in subscription:', err);
        }

        const historyData = await getUserPayments(userId);
        setBillingList(historyData);

        const latestPaidPayment = historyData.find(
          (item: BillingRecord) => item.status === 'Paid',
        );
        if (latestPaidPayment && !currentPlan) {
          setCurrentPlan(latestPaidPayment.planId);
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

  const activePlanData = plans.find(p => p._id === currentPlan);

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      `Subscription cancelled. Reason: ${cancelReason || 'None provided'}`,
    );
    setIsCancelModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans relative">
      <main className="pt-8 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full select-none flex flex-col gap-10">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-0.5 border-b border-[#1A1A1A] pb-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <Crown
                className="text-[#FF4C00] shrink-0"
                size={24}
                fill="currentColor"
              />
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
                Subscription Plan
              </h1>
            </div>
            <p className="text-xs md:text-sm text-zinc-500 font-medium max-w-2xl leading-relaxed">
              View your billing statements, change payment methods, or upgrade
              your streaming resolution.
            </p>
          </div>
        </div>

        {/* CURRENT PLAN OVERVIEW SECTION */}
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
                  <span className="text-white font-bold">
                    {activePlanData.price}
                  </span>{' '}
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
            You don't have an active subscription yet. Choose a plan below to
            get started!
          </div>
        )}

        {/* DEMO CARD HELP ALERT */}
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
                Click any credential chip below to copy it instantly for use on
                the Stripe checkout page.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 text-[10px] uppercase font-black tracking-wider">
                Card:
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('4242424242424242');
                  toast.success('Card number copied!');
                }}
                className="flex items-center gap-1.5 bg-[#1F1F1F]/60 hover:bg-[#FF4C00] border border-[#2B2B2B] hover:border-transparent px-3 py-1.5 rounded-lg transition-all duration-250 cursor-pointer text-xs font-mono font-bold text-zinc-300 hover:text-black outline-none group active:scale-95"
              >
                <span>4242 4242 4242 4242</span>
                <Copy
                  size={11}
                  className="text-zinc-500 group-hover:text-black transition-colors"
                />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-500 text-[10px] uppercase font-black tracking-wider">
                Expiry:
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('12/30');
                  toast.success('Expiry copied!');
                }}
                className="flex items-center gap-1.5 bg-[#1F1F1F]/60 hover:bg-[#FF4C00] border border-[#2B2B2B] hover:border-transparent px-3 py-1.5 rounded-lg transition-all duration-250 cursor-pointer text-xs font-mono font-bold text-zinc-300 hover:text-black outline-none group active:scale-95"
              >
                <span>12/30</span>
                <Copy
                  size={11}
                  className="text-zinc-500 group-hover:text-black transition-colors"
                />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-500 text-[10px] uppercase font-black tracking-wider">
                CVC:
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('123');
                  toast.success('CVC copied!');
                }}
                className="flex items-center gap-1.5 bg-[#1F1F1F]/60 hover:bg-[#FF4C00] border border-[#2B2B2B] hover:border-transparent px-3 py-1.5 rounded-lg transition-all duration-250 cursor-pointer text-xs font-mono font-bold text-zinc-300 hover:text-black outline-none group active:scale-95"
              >
                <span>123</span>
                <Copy
                  size={11}
                  className="text-zinc-500 group-hover:text-black transition-colors"
                />
              </button>
            </div>
          </div>
        </div>

        {/* PLANS COMPARISON SECTION */}
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
              <p className="text-sm font-bold text-zinc-300">
                No subscription plans available
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map(plan => {
                const planKey = plan.slug ?? plan.name.toLowerCase();
                const isActive = plan._id === currentPlan || planKey === currentPlan;

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
                            Resolution:{' '}
                            <strong className="text-white">
                              {plan.resolution}
                            </strong>
                          </span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check size={14} className="text-[#FF4C00]" />
                          <span>
                            Screens:{' '}
                            <strong className="text-white">
                              {plan.screens}
                            </strong>
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
                      <button
                        type="button"
                        onClick={() => handleInitiateCheckout(planKey)}
                        disabled={!!checkoutLoadingKey}
                        className="w-full text-center py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all outline-none bg-[#1A1A1A] hover:bg-[#FF4C00] text-zinc-300 hover:text-black cursor-pointer hover:scale-[1.02] shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {checkoutLoadingKey === planKey ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Redirecting to Stripe...</span>
                          </>
                        ) : (
                          <span>{currentPlan ? 'Switch Plan' : 'Pay Now'}</span>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* BILLING & PAYMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-zinc-300 tracking-wide uppercase">
              Billing History
            </h2>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl">
              {billingList.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500 font-semibold">
                  No payment history found.
                </div>
              ) : (
                <table className="table w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#1A1A1A] text-left text-zinc-500 text-[10px] font-black uppercase tracking-widest bg-zinc-950/40">
                      <th className="p-4 pl-6">Invoice</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-6 text-right">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A] text-xs font-semibold text-zinc-400">
                    {billingList.map(bill => (
                      <tr
                        key={bill._id || bill.id}
                        className="hover:bg-zinc-950/40 transition-colors"
                      >
                        <td className="p-4 pl-6 font-mono text-zinc-300">
                          {bill.invoiceId}
                        </td>
                        <td className="p-4">{bill.date}</td>
                        <td className="p-4 text-white font-bold">
                          {bill.amount}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              bill.status === 'Paid'
                                ? 'bg-[#FF4C00]/10 border border-[#FF4C00]/25 text-[#FF4C00]'
                                : 'bg-red-500/10 border border-red-500/25 text-red-500'
                            }`}
                          >
                            {bill.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <a
                            href={`/api/payments/invoice?id=${bill._id || bill.id}`}
                            download
                            onClick={() =>
                              toast.success(`Downloading ${bill.invoiceId}...`)
                            }
                            className="inline-flex items-center justify-center p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer outline-none"
                            title="Download Invoice"
                          >
                            <Download size={13} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Mobile Stacked View */}
            <div className="flex sm:hidden flex-col gap-3">
              {billingList.map(bill => (
                <div
                  key={bill._id || bill.id}
                  className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between border-b border-[#1A1A1A]/40 pb-2">
                    <span className="text-xs font-bold text-zinc-300 font-mono">
                      {bill.invoiceId}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        bill.status === 'Paid'
                          ? 'bg-[#FF4C00]/10 border border-[#FF4C00]/25 text-[#FF4C00]'
                          : 'bg-red-500/10 border border-red-500/25 text-red-500'
                      }`}
                    >
                      {bill.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-500">{bill.date}</span>
                      <span className="text-white font-bold">
                        {bill.amount}
                      </span>
                    </div>
                    <a
                      href={`/api/payments/invoice?id=${bill._id || bill.id}`}
                      download
                      onClick={() =>
                        toast.success(`Downloading ${bill.invoiceId}...`)
                      }
                      className="inline-flex items-center justify-center p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer outline-none"
                      title="Download Invoice"
                    >
                      <Download size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-zinc-300 tracking-wide uppercase">
              Payment Details
            </h2>

            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 flex flex-col gap-5 h-full justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-[#FF4C00]">
                    <CreditCard size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Visa ending in 4242
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                      Expires 12/2028
                    </span>
                  </div>
                </div>

                <div className="bg-[#141414] border border-[#262626]/30 p-4 rounded-xl flex items-start gap-2.5 mt-2">
                  <Info size={14} className="text-zinc-500 shrink-0 mt-0.5" />
                  <p className="text-[9px] text-zinc-500 leading-relaxed font-semibold">
                    Billing details can be updated dynamically at any time. Card
                    validation takes 2-3 business hours.
                  </p>
                </div>
              </div>

              <button
                onClick={() => toast.success('Update payment dialog opened.')}
                className="w-full border border-[#FF4C00]/40 hover:border-[#FF4C00] text-[#FF4C00] hover:text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer hover:bg-[#FF4C00]/5 hover:scale-102 outline-none"
              >
                Update Payment
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* CANCELLATION MODAL */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl shadow-2xl p-6 flex flex-col gap-5 select-none animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-950/20 border border-red-900/50 flex items-center justify-center text-red-500 shrink-0">
                <AlertTriangle size={18} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Cancel Subscription?
              </h3>
            </div>

            <div className="bg-red-500/10 border border-red-500/25 p-4 rounded-xl flex items-start gap-2.5">
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider leading-relaxed">
                Retention offer: Cancel now, and you will retain access until
                2026-09-15. No early charges will apply.
              </p>
            </div>

            <form
              onSubmit={handleConfirmCancel}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                  Why are you leaving? (Optional)
                </label>
                <select
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] text-white rounded-xl pl-4 pr-10 py-2.5 text-xs font-semibold outline-none cursor-pointer focus:border-red-500/50 transition-all appearance-none"
                >
                  <option value="">Select a reason...</option>
                  <option value="expensive">Too expensive</option>
                  <option value="no-use">Don't use it enough</option>
                  <option value="content">Lack of content choices</option>
                  <option value="other">Other reason</option>
                </select>
              </div>

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#1A1A1A]">
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="flex-1 bg-[#1A1A1A] hover:bg-[#FF4C00] hover:text-black text-zinc-300 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer outline-none"
                >
                  Keep Subscription
                </button>

                <button
                  type="submit"
                  className="flex-1 border border-zinc-700 hover:bg-red-600/10 hover:border-red-500 text-zinc-400 hover:text-red-500 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer outline-none"
                >
                  Confirm Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
