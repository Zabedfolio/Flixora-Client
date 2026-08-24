'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Tv, 
  Eye, 
  Plus, 
  Edit2, 
  Check, 
  Trash2, 
  X,
  Lock,
  Mail,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Profile {
  id: string;
  name: string;
  avatarColor: string;
  isKids: boolean;
}

const INITIAL_PROFILES: Profile[] = [
  { id: '1', name: 'Primary Account', avatarColor: '#FF4C00', isKids: false },
  { id: '2', name: 'Kids Corner', avatarColor: '#3B82F6', isKids: true }
];

export default function SettingsPage() {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'account' | 'notifications' | 'playback' | 'privacy'>('profile');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile management states
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [editName, setEditName] = useState('');
  const [editIsKids, setEditIsKids] = useState(false);
  const [editColor, setEditColor] = useState('#FF4C00');

  // Account inputs
  const [email, setEmail] = useState('user@flixora.com');
  const [twoFactor, setTwoFactor] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Notifications inputs
  const [notifyNewEpisodes, setNotifyNewEpisodes] = useState(true);
  const [notifyRecommend, setNotifyRecommend] = useState(false);
  const [notifyPromo, setNotifyPromo] = useState(false);
  const [notifyAi, setNotifyAi] = useState(true);

  // Playback inputs
  const [quality, setQuality] = useState('Auto');
  const [autoplay, setAutoplay] = useState(true);
  const [subtitle, setSubtitle] = useState('English');
  const [dataUsage, setDataUsage] = useState('Wifi');

  // Privacy inputs
  const [spoilerMode, setSpoilerMode] = useState(true);
  const [socialVisibility, setSocialVisibility] = useState(false);

  // Auto-save triggers small brand orange toasts
  const triggerAutoSaveToast = (settingName: string) => {
    setToastMessage(`${settingName} updated successfully`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    if (editingProfile) {
      setProfiles(prev => prev.map(p => 
        p.id === editingProfile.id ? { ...p, name: editName, isKids: editIsKids, avatarColor: editColor } : p
      ));
      triggerAutoSaveToast('Profile settings');
    } else {
      const newProfile: Profile = {
        id: Math.random().toString(),
        name: editName,
        isKids: editIsKids,
        avatarColor: editColor
      };
      setProfiles(prev => [...prev, newProfile]);
      triggerAutoSaveToast('New profile created');
    }
    setIsEditProfileModalOpen(false);
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    setIsEditProfileModalOpen(false);
    triggerAutoSaveToast('Profile deleted');
  };

  const handleOpenAddProfile = () => {
    setEditingProfile(null);
    setEditName('');
    setEditIsKids(false);
    setEditColor('#FF4C00');
    setIsEditProfileModalOpen(true);
  };

  const handleOpenEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
    setEditName(profile.name);
    setEditIsKids(profile.isKids);
    setEditColor(profile.avatarColor);
    setIsEditProfileModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans relative">
      <main className="pt-8 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full select-none flex flex-col gap-8">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col gap-1.5 border-b border-[#1A1A1A] pb-5">
          <div className="flex items-center gap-2.5">
            <Settings className="text-[#FF4C00] shrink-0" size={24} fill="currentColor" />
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
              System Settings
            </h1>
          </div>
          <p className="text-xs md:text-sm text-zinc-550 font-medium max-w-2xl leading-relaxed">
            Manage your profiles, change passwords, and configure defaults.
          </p>
        </div>

        {/* TWO COLUMN SIDEBAR LAYOUT */}
        <div className="flex flex-col lg:flex-row items-start gap-8 mt-2">
          
          {/* Sub Navigation Left Column (Vertical on Desktop, Horizontal Scroll on Mobile) */}
          <nav className="flex lg:flex-col gap-2.5 w-full lg:w-60 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none shrink-0 border-b lg:border-b-0 border-[#1A1A1A] -mx-2 px-2">
            {[
              { id: 'profile', label: 'Profiles', icon: User },
              { id: 'account', label: 'Security', icon: Shield },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'playback', label: 'Playback', icon: Tv },
              { id: 'privacy', label: 'Privacy', icon: Eye }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeSubTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 outline-none shrink-0 cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#1A1A1A] text-[#FF4C00] border-l-3 border-[#FF4C00] font-extrabold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <TabIcon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sub Navigation Target Tab Panels */}
          <div className="flex-1 w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 md:p-8 min-h-[420px] transition-all">
            
            {/* SUB-TAB 1: PROFILE MANAGEMENT */}
            {activeSubTab === 'profile' && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Profile Management</h3>
                  <p className="text-[10px] text-zinc-500 font-semibold mt-1 uppercase tracking-wide">Add, edit, or customize display accounts</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {profiles.map((profile) => (
                    <div 
                      key={profile.id} 
                      onClick={() => handleOpenEditProfile(profile)}
                      className="group flex flex-col items-center gap-3 bg-[#0E0E0E] hover:bg-[#141414] border border-[#1A1A1A] rounded-2xl p-5 text-center cursor-pointer transition-all hover:scale-103"
                    >
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white relative shadow-md"
                        style={{ backgroundColor: profile.avatarColor }}
                      >
                        {profile.name[0]}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center text-white transition-opacity">
                          <Edit2 size={16} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0 w-full">
                        <span className="text-xs font-bold text-white truncate block">{profile.name}</span>
                        {profile.isKids && (
                          <span className="text-[8px] bg-blue-900/30 border border-blue-500/20 text-blue-400 font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md w-fit mx-auto mt-0.5">
                            Kids
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add Profile Card */}
                  <button 
                    onClick={handleOpenAddProfile}
                    className="flex flex-col items-center justify-center border border-dashed border-[#FF4C00]/30 hover:border-[#FF4C00] bg-transparent hover:bg-[#FF4C00]/5 text-zinc-400 hover:text-white rounded-2xl p-5 cursor-pointer transition-all min-h-[126px] outline-none group"
                  >
                    <Plus size={20} className="text-[#FF4C00] group-hover:scale-110 transition-transform mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Add Profile</span>
                  </button>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: ACCOUNT & SECURITY */}
            {activeSubTab === 'account' && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-200 max-w-xl">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Account & Security</h3>
                  <p className="text-[10px] text-zinc-500 font-semibold mt-1 uppercase tracking-wide">Manage primary access emails and passwords</p>
                </div>

                {/* Email management */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-3 border-b border-[#1A1A1A] pb-6">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        readOnly 
                        value={email}
                        className="w-full bg-[#141414] border border-[#262626] text-zinc-500 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none"
                      />
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-650" />
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const val = prompt('Enter new email:');
                      if (val) { setEmail(val); triggerAutoSaveToast('Email address'); }
                    }}
                    className="border border-zinc-700 hover:border-white text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all cursor-pointer outline-none"
                  >
                    Change Email
                  </button>
                </div>

                {/* Password field */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-3 border-b border-[#1A1A1A] pb-6">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest">Password</label>
                    <div className="relative">
                      <input 
                        type="password" 
                        readOnly 
                        value="••••••••••••••"
                        className="w-full bg-[#141414] border border-[#262626] text-zinc-500 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none"
                      />
                      <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-650" />
                    </div>
                  </div>
                  <button 
                    onClick={() => toast.success('Change password flow initiated!')}
                    className="border border-zinc-700 hover:border-white text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all cursor-pointer outline-none"
                  >
                    Change Password
                  </button>
                </div>

                {/* Two-Factor Authentication toggle */}
                <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-6">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-white uppercase tracking-wide">Two-Factor Authentication</span>
                    <span className="text-[10px] text-zinc-500 font-semibold leading-relaxed">Secure your account with multi-factor tokens</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={twoFactor}
                    onChange={(e) => { setTwoFactor(e.target.checked); triggerAutoSaveToast('2FA settings'); }}
                    className="toggle toggle-[#FF4C00] checked:bg-[#FF4C00] checked:border-[#FF4C00]"
                  />
                </div>

                {/* Account deletion warning */}
                <div className="mt-4 pt-4 border-t border-red-950/20">
                  <span className="text-xs font-bold text-red-500 uppercase tracking-wide">Danger Zone</span>
                  <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed mt-1 uppercase tracking-wide">Permanently purge your Flixora account data</p>
                  <button 
                    onClick={() => setIsDeleteAccountModalOpen(true)}
                    className="mt-4 border border-red-500/40 hover:bg-red-950/20 text-red-500 font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all cursor-pointer outline-none"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: NOTIFICATIONS */}
            {activeSubTab === 'notifications' && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Notification Preferences</h3>
                  <p className="text-[10px] text-zinc-500 font-semibold mt-1 uppercase tracking-wide">Toggle email and push alerts</p>
                </div>

                <div className="space-y-4 max-w-xl">
                  {[
                    { state: notifyNewEpisodes, setState: setNotifyNewEpisodes, title: 'New Episode Alerts', desc: 'Get notified when new episodes of your saved shows drop' },
                    { state: notifyRecommend, setState: setNotifyRecommend, title: 'Recommendation Emails', desc: 'Receive weekly taste recommendations curated by our AI engine' },
                    { state: notifyPromo, setState: setNotifyPromo, title: 'Promotional Offers', desc: 'Stay updated on plan discounts and early-access campaigns' },
                    { state: notifyAi, setState: setNotifyAi, title: 'AI Assistant Tips', desc: 'Allow AI conversational hints on mood-playlist recommendations' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-[#1A1A1A]/40 pb-4">
                      <div className="flex flex-col gap-0.5 max-w-sm">
                        <span className="text-xs font-bold text-white uppercase tracking-wide">{item.title}</span>
                        <span className="text-[10px] text-zinc-500 font-semibold leading-relaxed">{item.desc}</span>
                      </div>
                      <input 
                        type="checkbox"
                        checked={item.state}
                        onChange={(e) => { item.setState(e.target.checked); triggerAutoSaveToast(item.title); }}
                        className="toggle toggle-[#FF4C00] checked:bg-[#FF4C00] checked:border-[#FF4C00]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB 4: PLAYBACK */}
            {activeSubTab === 'playback' && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-200 max-w-lg">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Playback Preferences</h3>
                  <p className="text-[10px] text-zinc-500 font-semibold mt-1 uppercase tracking-wide">Configure screen ratios and default resolutions</p>
                </div>

                {/* Resolution quality dropdown */}
                <div className="flex items-center justify-between border-b border-[#1A1A1A]/40 pb-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-white uppercase tracking-wide">Default Video Quality</span>
                    <span className="text-[10px] text-zinc-500 font-semibold leading-relaxed">Auto-selects optimal stream rates</span>
                  </div>
                  <select
                    value={quality}
                    onChange={(e) => { setQuality(e.target.value); triggerAutoSaveToast('Default Quality'); }}
                    className="bg-[#141414] border border-[#262626] text-white rounded-xl px-4 py-2.5 text-xs font-bold outline-none cursor-pointer focus:border-[#FF4C00]/50 transition-all uppercase tracking-wider"
                  >
                    <option value="Auto">Auto (Recommended)</option>
                    <option value="1080p">1080p (Full HD)</option>
                    <option value="720p">720p (HD)</option>
                    <option value="480p">480p (Data Saver)</option>
                  </select>
                </div>

                {/* Autoplay next toggle */}
                <div className="flex items-center justify-between border-b border-[#1A1A1A]/40 pb-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-white uppercase tracking-wide">Autoplay Next Episode</span>
                    <span className="text-[10px] text-zinc-500 font-semibold leading-relaxed">Automatically start queue titles</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={autoplay}
                    onChange={(e) => { setAutoplay(e.target.checked); triggerAutoSaveToast('Autoplay options'); }}
                    className="toggle toggle-[#FF4C00] checked:bg-[#FF4C00] checked:border-[#FF4C00]"
                  />
                </div>

                {/* Subtitles dropdown */}
                <div className="flex items-center justify-between border-b border-[#1A1A1A]/40 pb-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-white uppercase tracking-wide">Subtitle Language</span>
                    <span className="text-[10px] text-zinc-500 font-semibold leading-relaxed">Default language tags</span>
                  </div>
                  <select
                    value={subtitle}
                    onChange={(e) => { setSubtitle(e.target.value); triggerAutoSaveToast('Subtitle language'); }}
                    className="bg-[#141414] border border-[#262626] text-white rounded-xl px-4 py-2.5 text-xs font-bold outline-none cursor-pointer focus:border-[#FF4C00]/50 transition-all uppercase tracking-wider"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                </div>

                {/* Data usage */}
                <div className="flex items-center justify-between border-b border-[#1A1A1A]/40 pb-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-white uppercase tracking-wide">Data Usage Preference</span>
                    <span className="text-[10px] text-zinc-500 font-semibold leading-relaxed">Limit downloads to Wifi connection</span>
                  </div>
                  <select
                    value={dataUsage}
                    onChange={(e) => { setDataUsage(e.target.value); triggerAutoSaveToast('Data Usage'); }}
                    className="bg-[#141414] border border-[#262626] text-white rounded-xl px-4 py-2.5 text-xs font-bold outline-none cursor-pointer focus:border-[#FF4C00]/50 transition-all uppercase tracking-wider"
                  >
                    <option value="Wifi">Wifi Only</option>
                    <option value="Always">Always Allow Mobile Data</option>
                  </select>
                </div>
              </div>
            )}

            {/* SUB-TAB 5: PRIVACY */}
            {activeSubTab === 'privacy' && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-200 max-w-lg">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Privacy & Visibility</h3>
                  <p className="text-[10px] text-zinc-500 font-semibold mt-1 uppercase tracking-wide">Control content access, tracking options, and audits</p>
                </div>

                {/* Spoiler mode */}
                <div className="flex items-center justify-between border-b border-[#1A1A1A]/40 pb-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-white uppercase tracking-wide">Spoiler-Safe Mode</span>
                    <span className="text-[10px] text-zinc-500 font-semibold leading-relaxed">Blur episode synopsis descriptions on unwatched titles</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={spoilerMode}
                    onChange={(e) => { setSpoilerMode(e.target.checked); triggerAutoSaveToast('Spoiler mode'); }}
                    className="toggle toggle-[#FF4C00] checked:bg-[#FF4C00] checked:border-[#FF4C00]"
                  />
                </div>

                {/* Visibility visibility */}
                <div className="flex items-center justify-between border-b border-[#1A1A1A]/40 pb-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-white uppercase tracking-wide">Viewing Activity Visibility</span>
                    <span className="text-[10px] text-zinc-500 font-semibold leading-relaxed">Allow profile stats sharing to linked taste-twins</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={socialVisibility}
                    onChange={(e) => { setSocialVisibility(e.target.checked); triggerAutoSaveToast('Social visibility'); }}
                    className="toggle toggle-[#FF4C00] checked:bg-[#FF4C00] checked:border-[#FF4C00]"
                  />
                </div>

                {/* Download data */}
                <div className="mt-4">
                  <span className="text-xs font-bold text-white uppercase tracking-wide">Data Exports</span>
                  <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed mt-1 uppercase tracking-wide">Request a ZIP download archive of all watch history and ratings</p>
                  <button 
                    onClick={() => toast.success('Data export compilation request sent to your registered email.')}
                    className="mt-4 border border-zinc-700 hover:border-white text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all cursor-pointer outline-none"
                  >
                    Download My Data
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

      {/* FIXED FEEDBACK AUTO-SAVE TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-55 bg-[#FF4C00] text-black text-xs font-black uppercase tracking-wider px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200">
          <Check size={14} strokeWidth={3} />
          {toastMessage}
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl shadow-2xl p-6 flex flex-col gap-5 select-none animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                {editingProfile ? 'Edit Profile' : 'Add Profile'}
              </h3>
              <button 
                onClick={() => setIsEditProfileModalOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              
              {/* Profile Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest">Profile Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Guest Account"
                  required
                  className="w-full bg-[#141414] border border-[#262626] text-white rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#FF4C00]"
                />
              </div>

              {/* Avatar Color */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest">Avatar Background Color</label>
                <div className="flex gap-2">
                  {['#FF4C00', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'].map((col) => (
                    <button 
                      key={col}
                      type="button"
                      onClick={() => setEditColor(col)}
                      className={`w-7 h-7 rounded-lg border transition-all cursor-pointer ${
                        editColor === col ? 'scale-110 border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              {/* Kids Mode Toggle */}
              <div className="flex items-center justify-between border-t border-b border-[#1A1A1A] py-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-white uppercase tracking-wide">Kids Profile</span>
                  <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider">Restrict playback to age-safe content</span>
                </div>
                <input 
                  type="checkbox"
                  checked={editIsKids}
                  onChange={(e) => setEditIsKids(e.target.checked)}
                  className="toggle toggle-primary"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-2">
                {editingProfile && (
                  <button 
                    type="button"
                    onClick={() => handleDeleteProfile(editingProfile.id)}
                    className="p-3.5 rounded-xl border border-zinc-800 hover:border-red-500 text-zinc-450 hover:text-red-500 transition-all cursor-pointer"
                    title="Delete profile"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="flex-1 border border-[#262626] hover:bg-zinc-950 text-zinc-400 hover:text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#FF4C00] hover:bg-[#e04300] text-black py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#FF4C00]/10"
                >
                  Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      {isDeleteAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl shadow-2xl p-6 flex flex-col gap-5 select-none animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-950/20 border border-red-900/50 flex items-center justify-center text-red-500 shrink-0">
                <AlertTriangle size={18} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Delete Account?
              </h3>
            </div>

            <p className="text-xs text-zinc-450 leading-relaxed font-semibold">
              This action is permanent. All payment histories, playlists, and profiles will be lost.
              Please type <strong className="text-white">DELETE</strong> below to confirm.
            </p>

            <div className="flex flex-col gap-4">
              <input 
                type="text" 
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full bg-[#141414] border border-[#262626] text-white rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-red-500"
              />

              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setIsDeleteAccountModalOpen(false); setDeleteConfirmText(''); }}
                  className="flex-1 border border-[#262626] hover:bg-zinc-950 text-zinc-400 hover:text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={deleteConfirmText !== 'DELETE'}
                  onClick={() => { toast.success('Account successfully purged'); setIsDeleteAccountModalOpen(false); }}
                  className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    deleteConfirmText === 'DELETE'
                      ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer shadow-lg shadow-red-600/10'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-550 cursor-not-allowed'
                  }`}
                >
                  Delete
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
