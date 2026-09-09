'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Tag,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Crown,
  Calendar,
  Percent,
  Tv,
  Monitor,
  Download,
  AlertCircle,
  Loader2,
  Copy,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { adminApi, AdminPlan, PromoCodeItem, PromoCodeFormInput } from '@/lib/api/adminApi';
import { toast } from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'plans' | 'promos'>('plans');

  // Plan Settings States
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<AdminPlan | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isSavingPlan, setIsSavingPlan] = useState(false);

  // Promo Code States
  const [promoCodes, setPromoCodes] = useState<PromoCodeItem[]>([]);
  const [promosLoading, setPromosLoading] = useState(true);
  const [isCreatingPromo, setIsCreatingPromo] = useState(false);
  const [isSubmittingPromo, setIsSubmittingPromo] = useState(false);

  const [promoForm, setPromoForm] = useState<PromoCodeFormInput>({
    code: '',
    discountPercentage: 20,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 100,
  });

  // Load Plans
  const loadPlans = async () => {
    try {
      setPlansLoading(true);
      const data = await adminApi.getPlans();
      setPlans(data || []);
    } catch (err: any) {
      console.error('Failed to load plans:', err);
      toast.error('Failed to load subscription plans');
    } finally {
      setPlansLoading(false);
    }
  };

  // Load Promo Codes
  const loadPromoCodes = async () => {
    try {
      setPromosLoading(true);
      const data = await adminApi.getPromoCodes();
      setPromoCodes(data || []);
    } catch (err: any) {
      console.error('Failed to load promo codes:', err);
      toast.error('Failed to load promo codes');
    } finally {
      setPromosLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
    loadPromoCodes();
  }, []);

  // Handle Save Plan (Create or Update)
  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    try {
      setIsSavingPlan(true);
      if (editingPlan._id) {
        // Update existing plan
        const updated = await adminApi.updatePlan(editingPlan._id, editingPlan);
        toast.success(`Plan "${updated.name}" updated successfully!`);
        setPlans((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      } else {
        // Create new plan
        const created = await adminApi.createPlan(editingPlan);
        toast.success(`New plan "${created.name}" created!`);
        setPlans((prev) => [...prev, created]);
      }
      setIsPlanModalOpen(false);
      setEditingPlan(null);
    } catch (err: any) {
      console.error('Plan save error:', err);
      toast.error(err.message || 'Failed to save plan');
    } finally {
      setIsSavingPlan(false);
    }
  };

  // Handle Delete Plan
  const handleDeletePlan = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the "${name}" plan?`)) return;

    try {
      await adminApi.deletePlan(id);
      toast.success(`Plan "${name}" removed successfully!`);
      setPlans((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      console.error('Delete plan error:', err);
      toast.error('Failed to delete plan');
    }
  };

  // Handle Create Promo Code
  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmittingPromo(true);
      const created = await adminApi.createPromoCode(promoForm);
      toast.success(`Promo code "${created.code}" created successfully!`);
      setPromoCodes((prev) => [created, ...prev]);
      setIsCreatingPromo(false);
      setPromoForm({
        code: '',
        discountPercentage: 20,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: 100,
      });
    } catch (err: any) {
      console.error('Promo creation error:', err);
      toast.error(err.message || 'Failed to create promo code');
    } finally {
      setIsSubmittingPromo(false);
    }
  };

  // Handle Delete Promo Code
  const handleDeletePromo = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to remove promo code "${code}"?`)) return;

    try {
      await adminApi.deletePromoCode(id);
      toast.success(`Promo code "${code}" deleted!`);
      setPromoCodes((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      console.error('Delete promo error:', err);
      toast.error('Failed to delete promo code');
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 select-none">
      {/* HEADER & TAB SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <Sliders size={26} className="text-[#FF4C00]" />
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Subscription & Promo <span className="text-[#FF4C00]">Settings</span>
            </h1>
          </div>
          <p className="text-xs md:text-sm text-zinc-400 mt-1 font-medium">
            Configure streaming plan pricing, quality limits, and manage promotional discount codes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-[#0E0E0E] border border-[#1A1A1A] p-1.5 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'plans'
                ? 'bg-[#FF4C00] text-black font-extrabold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Crown size={14} />
            <span>Subscription Plans</span>
          </button>

          <button
            onClick={() => setActiveTab('promos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'promos'
                ? 'bg-[#FF4C00] text-black font-extrabold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Tag size={14} />
            <span>Promo Codes</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SUBSCRIPTION PLANS SETTINGS */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                Active Streaming Tiers
              </h2>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">
                Update prices, resolution limits, and concurrent screen access
              </p>
            </div>

            <button
              onClick={() => {
                setEditingPlan({
                  _id: '',
                  name: '',
                  price: '$12.99/mo',
                  billingCycle: 'monthly',
                  resolution: '1080p (FHD)',
                  videoQuality: '1080p (FHD)',
                  screens: '2 screens',
                  maxScreens: 2,
                  downloads: 'Standard downloads',
                  ads: 'Ad-free',
                  kids: '2 kids profiles',
                  isActive: true,
                });
                setIsPlanModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#FF4C00]/10"
            >
              <Plus size={14} />
              <span>Add New Plan</span>
            </button>
          </div>

          {plansLoading ? (
            <div className="p-12 text-center text-zinc-500">
              <Loader2 size={24} className="animate-spin text-[#FF4C00] mx-auto mb-2" />
              <span>Loading subscription plans...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-[#0E0E0E] border border-[#1A1A1A] hover:border-[#FF4C00]/40 rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all duration-200 shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-4">
                      <div>
                        <h3 className="text-base font-black text-white uppercase tracking-wider">
                          {plan.name}
                        </h3>
                        <span className="text-[10px] text-zinc-500 font-mono uppercase font-bold">
                          {plan.billingCycle || 'monthly'} billing
                        </span>
                      </div>
                      <span className="text-xl font-black text-[#FF4C00]">
                        {plan.price}
                      </span>
                    </div>

                    <ul className="space-y-3 text-xs font-semibold text-zinc-400">
                      <li className="flex items-center justify-between">
                        <span className="text-zinc-500">Video Quality:</span>
                        <strong className="text-white">{plan.videoQuality || plan.resolution}</strong>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-zinc-500">Max Screens:</span>
                        <strong className="text-white">{plan.screens}</strong>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-zinc-500">Offline Downloads:</span>
                        <strong className="text-white">{plan.downloads}</strong>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-zinc-500">Ad Experience:</span>
                        <strong className="text-white">{plan.ads}</strong>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-zinc-500">Kids Profile:</span>
                        <strong className="text-white">{plan.kids}</strong>
                      </li>
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-[#1A1A1A]">
                    <button
                      onClick={() => {
                        setEditingPlan({ ...plan });
                        setIsPlanModalOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer"
                    >
                      <Edit2 size={13} className="text-[#FF4C00]" />
                      <span>Edit Settings</span>
                    </button>

                    {plans.length > 1 && (
                      <button
                        onClick={() => handleDeletePlan(plan._id, plan.name)}
                        className="p-2.5 rounded-xl bg-red-950/20 hover:bg-red-900/40 border border-red-900/50 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                        title="Delete Plan"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROMO CODES MANAGEMENT */}
      {activeTab === 'promos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                Active Promotional Discount Codes
              </h2>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">
                Generate coupons, set percentage discounts, and enforce usage limits
              </p>
            </div>

            <button
              onClick={() => setIsCreatingPromo(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#FF4C00]/10"
            >
              <Plus size={14} />
              <span>Create Promo Code</span>
            </button>
          </div>

          {/* Promo Codes Table */}
          <div className="bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="table w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#1A1A1A] text-left text-zinc-500 text-[10px] font-black uppercase tracking-widest bg-zinc-950/70">
                    <th className="p-4 pl-6">Code String</th>
                    <th className="p-4">Discount</th>
                    <th className="p-4">Usage / Limit</th>
                    <th className="p-4">Expiration Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A] text-xs font-semibold text-zinc-400">
                  {promosLoading ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-zinc-500">
                        <Loader2 size={24} className="animate-spin text-[#FF4C00] mx-auto mb-2" />
                        <span>Loading promo codes...</span>
                      </td>
                    </tr>
                  ) : promoCodes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-zinc-500">
                        No active promo codes. Click "Create Promo Code" to add one!
                      </td>
                    </tr>
                  ) : (
                    promoCodes.map((promo) => {
                      const isExpired = new Date(promo.expirationDate) < new Date();
                      const isExhausted = promo.usedCount >= promo.usageLimit;

                      return (
                        <tr key={promo._id} className="hover:bg-zinc-950/40 transition-colors">
                          <td className="p-4 pl-6 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-white text-sm tracking-wider">
                                {promo.code}
                              </span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(promo.code);
                                  toast.success(`Code ${promo.code} copied!`);
                                }}
                                className="text-zinc-600 hover:text-[#FF4C00] transition-colors p-1"
                                title="Copy Code"
                              >
                                <Copy size={12} />
                              </button>
                            </div>
                          </td>

                          <td className="p-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-400 font-bold text-[11px] font-mono">
                              {promo.discountPercentage}% OFF
                            </span>
                          </td>

                          <td className="p-4 whitespace-nowrap">
                            <div className="space-y-1 max-w-[140px]">
                              <div className="flex justify-between text-[10px] text-zinc-400">
                                <span>{promo.usedCount} used</span>
                                <span>{promo.usageLimit} limit</span>
                              </div>
                              <div className="w-full h-1.5 bg-[#1F1F1F] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#FF4C00] rounded-full"
                                  style={{
                                    width: `${Math.min(100, (promo.usedCount / promo.usageLimit) * 100)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="p-4 text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                            {promo.expirationDate}
                          </td>

                          <td className="p-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                isExpired || isExhausted || !promo.isActive
                                  ? 'bg-zinc-800 text-zinc-500'
                                  : 'bg-[#FF4C00]/10 border border-[#FF4C00]/30 text-[#FF4C00]'
                              }`}
                            >
                              {isExpired ? 'Expired' : isExhausted ? 'Limit Reached' : 'Active'}
                            </span>
                          </td>

                          <td className="p-4 pr-6 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleDeletePromo(promo._id, promo.code)}
                              className="p-2 rounded-lg bg-red-950/20 hover:bg-red-900/40 border border-red-900/50 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                              title="Delete Promo Code"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PLAN EDIT/CREATE MODAL */}
      {isPlanModalOpen && editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl shadow-2xl p-6 select-none animate-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-4">
              <div className="flex items-center gap-2.5">
                <Crown size={20} className="text-[#FF4C00]" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  {editingPlan._id ? `Edit ${editingPlan.name} Plan` : 'Create New Stream Plan'}
                </h3>
              </div>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    placeholder="e.g. Standard"
                    className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#FF4C00]/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                    Price (e.g. $11.99/mo)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                    placeholder="$11.99/mo"
                    className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#FF4C00]/50 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                    Video Quality / Resolution
                  </label>
                  <select
                    value={editingPlan.videoQuality || editingPlan.resolution}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        resolution: e.target.value,
                        videoQuality: e.target.value,
                      })
                    }
                    className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#FF4C00]/50 cursor-pointer"
                  >
                    <option value="720p (HD)">720p (HD)</option>
                    <option value="1080p (FHD)">1080p (FHD)</option>
                    <option value="4K + HDR">4K + HDR</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                    Concurrent Screens
                  </label>
                  <select
                    value={editingPlan.maxScreens || 1}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        maxScreens: Number(e.target.value),
                        screens: `${e.target.value} screen${Number(e.target.value) > 1 ? 's' : ''}`,
                      })
                    }
                    className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#FF4C00]/50 cursor-pointer"
                  >
                    <option value="1">1 Screen</option>
                    <option value="2">2 Screens</option>
                    <option value="4">4 Screens</option>
                    <option value="6">6 Screens</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                    Offline Downloads
                  </label>
                  <select
                    value={editingPlan.downloads}
                    onChange={(e) => setEditingPlan({ ...editingPlan, downloads: e.target.value })}
                    className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#FF4C00]/50 cursor-pointer"
                  >
                    <option value="No downloads">No downloads</option>
                    <option value="Standard downloads">Standard downloads</option>
                    <option value="Unlimited downloads">Unlimited downloads</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                    Ad Policy
                  </label>
                  <select
                    value={editingPlan.ads}
                    onChange={(e) => setEditingPlan({ ...editingPlan, ads: e.target.value })}
                    className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#FF4C00]/50 cursor-pointer"
                  >
                    <option value="Ad-supported">Ad-supported</option>
                    <option value="Ad-free">Ad-free</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#1A1A1A]">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="flex-1 bg-[#141414] hover:bg-[#1E1E1E] text-zinc-400 py-3 rounded-xl uppercase font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPlan}
                  className="flex-1 bg-[#FF4C00] hover:bg-[#e04300] text-black py-3 rounded-xl uppercase font-black text-xs transition-all shadow-lg shadow-[#FF4C00]/10 flex items-center justify-center gap-2"
                >
                  {isSavingPlan ? <Loader2 size={14} className="animate-spin" /> : <span>Save Plan</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PROMO CODE MODAL */}
      {isCreatingPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl shadow-2xl p-6 select-none animate-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-4">
              <div className="flex items-center gap-2.5">
                <Tag size={20} className="text-[#FF4C00]" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Create Promotional Code
                </h3>
              </div>
              <button
                onClick={() => setIsCreatingPromo(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                  Promo Code (e.g. FLIX25)
                </label>
                <input
                  type="text"
                  required
                  placeholder="CODE STRING"
                  value={promoForm.code}
                  onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                  className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white uppercase font-mono font-bold outline-none focus:border-[#FF4C00]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={promoForm.discountPercentage}
                    onChange={(e) => setPromoForm({ ...promoForm, discountPercentage: Number(e.target.value) })}
                    className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white font-mono outline-none focus:border-[#FF4C00]/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                    Usage Limit (Claims)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={promoForm.usageLimit}
                    onChange={(e) => setPromoForm({ ...promoForm, usageLimit: Number(e.target.value) })}
                    className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white font-mono outline-none focus:border-[#FF4C00]/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                  Expiration Date
                </label>
                <input
                  type="date"
                  required
                  value={promoForm.expirationDate}
                  onChange={(e) => setPromoForm({ ...promoForm, expirationDate: e.target.value })}
                  className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white font-mono outline-none focus:border-[#FF4C00]/50"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#1A1A1A]">
                <button
                  type="button"
                  onClick={() => setIsCreatingPromo(false)}
                  className="flex-1 bg-[#141414] hover:bg-[#1E1E1E] text-zinc-400 py-3 rounded-xl uppercase font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPromo}
                  className="flex-1 bg-[#FF4C00] hover:bg-[#e04300] text-black py-3 rounded-xl uppercase font-black text-xs transition-all shadow-lg shadow-[#FF4C00]/10 flex items-center justify-center gap-2"
                >
                  {isSubmittingPromo ? <Loader2 size={14} className="animate-spin" /> : <span>Create Code</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
