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
  AlertTriangle,
  ChevronDown,
  Crown,
  Zap,
  Flame,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authClient } from '@/app/(auth)/lib/auth-client';

interface Profile {
  _id: string;
  userId: string;
  name: string;
  avatar: string;
  avatarId?: string;
}

const PRESET_AVATARS = [
  { id: 'spiderman', name: 'Spider-Man', url: "https://i.ibb.co/Cs0Z14TD/857476df6e87.jpg" },
  { id: 'batman', name: 'Batman', url: "https://i.ibb.co/fzQdvy33/c5005c8f408c.jpg" },
  { id: 'hulk', name: 'Hulk', url: "https://i.ibb.co/KjG62St5/28a071b23c43.jpg" },
  { id: 'ironman', name: 'Iron Man', url: "https://i.ibb.co/N6pnL1Vd/c0b33285fed7.jpg" },
  { id: 'captain_america', name: 'Captain America', url: "https://i.ibb.co/9kBq2HrN/99052d2013b0.jpg" },
  { id: 'robot', name: 'Robot', url: "https://i.ibb.co/99BwLZ1f/df4b1e66aac1.png" },
  { id: 'tom', name: 'Tom', url: "https://i.ibb.co/ZRCZZjZY/77a32760a782.png" },
  { id: 'jerry', name: 'Jerry', url: "https://i.ibb.co/chCxgVC0/e7ba688df62e.png" },
  { id: 'preset_1', name: 'Vector 1', url: "https://i.ibb.co/T94VNG1/feca82718a3f.png" },
  { id: 'preset_2', name: 'Vector 2', url: "https://i.ibb.co/hRfpJsBz/77c8ff018f5a.png" },
  { id: 'preset_3', name: 'Vector 3', url: "https://i.ibb.co/XxyLdGR6/3dc0753b83ec.png" },
  { id: 'preset_4', name: 'Vector 4', url: "https://i.ibb.co/mrkSXMgF/7dedb3686be5.png" },
  { id: 'preset_5', name: 'Vector 5', url: "https://i.ibb.co/LXQNQV9m/652fb8497ee2.png" },
  { id: 'preset_6', name: 'Vector 6', url: "https://i.ibb.co/1Y2xx1kP/51b2fb15a0ee.png" },
  { id: 'preset_7', name: 'Vector 7', url: "https://i.ibb.co/CKKwvPt3/ff71a75a86b2.png" },
  { id: 'preset_8', name: 'Vector 8', url: "https://i.ibb.co/gbHs65wB/23a94dbf6add.png" },
  { id: 'preset_9', name: 'Vector 9', url: "https://i.ibb.co/wr8KLWVX/b36812a8e507.png" },
  { id: 'preset_10', name: 'Vector 10', url: "https://i.ibb.co/Kj6rV2Lf/6d56e0aff7cb.png" },
  { id: 'preset_11', name: 'Vector 11', url: "https://i.ibb.co/xS2Bbnnf/c2ad01014374.png" },
  { id: 'preset_12', name: 'Vector 12', url: "https://i.ibb.co/1tg3pmf5/66bf149bee43.png" },
  { id: 'preset_13', name: 'Vector 13', url: "https://i.ibb.co/6JYZcLwx/78848dc519d3.png" },
  { id: 'preset_14', name: 'Vector 14', url: "https://i.ibb.co/t6rg5Wg/0a79a010554f.png" },
  { id: 'preset_15', name: 'Vector 15', url: "https://i.ibb.co/JjbgKv0Y/5a26e062d00a.png" },
  { id: 'preset_16', name: 'Vector 16', url: "https://i.ibb.co/nNTXmzFc/94d78e061075.png" },
  { id: 'preset_17', name: 'Vector 17', url: "https://i.ibb.co/6Rjr6hnF/b4b11563b172.png" },
  { id: 'preset_18', name: 'Vector 18', url: "https://i.ibb.co/B1kNw0P/d35c729b0b32.png" },
  { id: 'preset_19', name: 'Vector 19', url: "https://i.ibb.co/0VhJB6Jq/81a3061e3614.png" },
  { id: 'preset_20', name: 'Vector 20', url: "https://i.ibb.co/K3tMSb9/3c4645c88c8b.png" }
];

const ROLE_OPTIONS = [
  { id: 'user', name: 'Default (Movie Fan)', icon: Sparkles, color: 'text-zinc-500' },
  { id: 'superman', name: 'Superman', icon: Crown, color: 'text-[#FF4C00]' },
  { id: 'spiderman', name: 'Spider-Man', icon: Zap, color: 'text-red-500' },
  { id: 'batman', name: 'Batman', icon: Shield, color: 'text-zinc-400' },
  { id: 'ironman', name: 'Iron Man', icon: Sparkles, color: 'text-yellow-500' },
  { id: 'thor', name: 'Thor', icon: Zap, color: 'text-cyan-400' },
  { id: 'hulk', name: 'Hulk', icon: Flame, color: 'text-emerald-500' },
  { id: 'captainamerica', name: 'Captain America', icon: Shield, color: 'text-blue-500' },
  { id: 'tom', name: 'Tom', icon: User, color: 'text-sky-400' },
  { id: 'jerry', name: 'Jerry', icon: User, color: 'text-orange-400' },
];

export default function SettingsPage() {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'account' | 'notifications' | 'playback' | 'privacy'>('profile');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const API_BASE = '';

  // Profile management states
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState(PRESET_AVATARS[0].url);
  const [editAvatarId, setEditAvatarId] = useState(PRESET_AVATARS[0].id);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setSelectedRole((session.user as any).role || 'user');
    }
  }, [session]);

  const updateRole = async () => {
    if (session?.user && (session.user as any).role !== 'admin' && selectedRole !== (session.user as any).role) {
      const roleRes = await fetch(`${API_BASE}/api/user/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole })
      });
      if (!roleRes.ok) {
        toast.error('Failed to update character role');
        return false;
      }
    }
    return true;
  };

  // Account inputs
  const [email, setEmail] = useState('user@flixora.com');
  const [twoFactor, setTwoFactor] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const { data: session } = authClient.useSession();

  // Dynamically load profiles from the backend database and account email
  useEffect(() => {
    if (session?.user?.id) {
      setEmail(session.user.email);

      const fetchProfiles = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/profiles?userId=${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.length === 0) {
              const createRes = await fetch(`${API_BASE}/api/profiles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: session.user.id,
                  name: session.user.name || 'Primary Account',
                  avatar: PRESET_AVATARS[0].url,
                  avatarId: PRESET_AVATARS[0].id,
                }),
              });
              if (createRes.ok) {
                const newProf = await createRes.json();
                setProfiles([newProf]);
                setEditName(newProf.name);
                setEditAvatar(newProf.avatar);
                setEditAvatarId(newProf.avatarId || PRESET_AVATARS[0].id);
              }
            } else {
              setProfiles(data);
              if (data.length > 0) {
                setEditName(data[0].name);
                setEditAvatar(data[0].avatar);
                setEditAvatarId(data[0].avatarId || PRESET_AVATARS[0].id);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching profiles:', error);
        }
      };

      fetchProfiles();
    }
  }, [session]);

  // Sync session name as the default display name
  useEffect(() => {
    if (session?.user?.name && !editName) {
      setEditName(session.user.name);
    }
  }, [session, editName]);

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
  const handleSaveSingleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    try {
      const roleSuccess = await updateRole();
      if (!roleSuccess) return;

      if (profiles.length > 0) {
        // UPDATE (PUT)
        const mainProfile = profiles[0];
        const res = await fetch(`${API_BASE}/api/profiles/${mainProfile._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editName.trim(),
            avatar: editAvatar,
            avatarId: editAvatarId
          })
        });
        if (res.ok) {
          const updated = await res.json();
          setProfiles([updated]);
          toast.success('Profile settings updated successfully!');
          triggerAutoSaveToast('Profile settings');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          toast.error('Failed to update profile');
        }
      } else {
        // CREATE (POST)
        if (!session?.user?.id) {
          toast.error('User session not loaded. Please wait.');
          return;
        }
        const res = await fetch(`${API_BASE}/api/profiles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: session.user.id,
            name: editName.trim(),
            avatar: editAvatar,
            avatarId: editAvatarId
          })
        });
        if (res.ok) {
          const created = await res.json();
          setProfiles([created]);
          toast.success('Profile created successfully!');
          triggerAutoSaveToast('Profile settings');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          toast.error('Failed to save profile');
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Error saving profile');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (2MB)
    const limitBytes = 2 * 1024 * 1024;
    if (file.size > limitBytes) {
      toast.error('Image size must be within 2MB');
      return;
    }

    setUploadingImage(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64String = reader.result as string;
      try {
        const res = await fetch(`${API_BASE}/api/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64String })
        });
        if (res.ok) {
          const data = await res.json();
          setEditAvatar(data.url);
          setEditAvatarId('custom');
          toast.success('Custom avatar uploaded!');
        } else {
          const err = await res.json();
          toast.error(err.error || 'Failed to upload custom avatar');
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
        toast.error('Upload failed');
      } finally {
        setUploadingImage(false);
      }
    };
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      toast.error('Failed to read image file');
      setUploadingImage(false);
    };
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
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Profile Settings</h3>
                  <p className="text-[10px] text-zinc-500 font-semibold mt-1 uppercase tracking-wide">Customize your display name and avatar</p>
                </div>

                <form onSubmit={handleSaveSingleProfile} className="flex flex-col gap-6 max-w-xl">
                  {/* Name Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest">Profile Name</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your Name"
                      required
                      className="w-full bg-[#141414] border border-[#262626] text-white rounded-xl px-4 py-3.5 text-xs font-semibold focus:outline-none focus:border-[#FF4C00]"
                    />
                  </div>

                  {/* Custom Image Upload & Current Preview */}
                  <div className="flex flex-col gap-3 border-t border-[#1A1A1A] pt-5">
                    <label className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest">Profile Picture</label>
                    
                    <div className="flex items-center gap-5">
                      {/* Current selected preview */}
                      <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center relative shadow-lg">
                        <img src={editAvatar} alt="preview" className="w-full h-full object-cover" />
                        {uploadingImage && (
                          <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                            <span className="loading loading-spinner loading-sm text-[#FF4C00]"></span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="file-input file-input-bordered file-input-sm w-full max-w-xs bg-zinc-950 text-xs border-zinc-850 text-gray-300 focus:outline-hidden"
                        />
                        <span className="text-[8px] text-zinc-550 font-black uppercase tracking-wide">PNG, JPG or WEBP (Max 2MB)</span>
                      </div>
                    </div>
                  </div>

                  {/* Preset Vector Avatars Selector */}
                  <div className="flex flex-col gap-2.5 border-t border-[#1A1A1A] pt-5">
                    <label className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest">Choose a preset avatar</label>
                    
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-3 bg-[#111] border border-[#262626] rounded-xl max-h-[140px] overflow-y-auto scrollbar-thin">
                      {PRESET_AVATARS.map((avatar) => (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => {
                            setEditAvatar(avatar.url);
                            setEditAvatarId(avatar.id);
                          }}
                          className={`relative aspect-square w-full rounded-lg border overflow-hidden hover:scale-105 transition-all cursor-pointer ${
                            editAvatarId === avatar.id ? 'border-[#FF4C00] ring-2 ring-[#FF4C00]/30' : 'border-zinc-800'
                          }`}
                        >
                          <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                          {editAvatarId === avatar.id && (
                            <div className="absolute inset-0 bg-[#FF4C00]/10 flex items-center justify-center">
                              <div className="bg-[#FF4C00] text-black rounded-full p-0.5">
                                <Check size={8} strokeWidth={4} />
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hero Character Role Selection Dropdown */}
                  {session?.user && (session.user as any).role !== 'admin' && (() => {
                    const currentSelectedOption = ROLE_OPTIONS.find(o => o.id === selectedRole) || ROLE_OPTIONS[0];
                    const CurrentSelectedIcon = currentSelectedOption.icon;
                    return (
                      <div className="flex flex-col gap-2 border-t border-[#1A1A1A] pt-5 relative">
                        <label className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest flex items-center gap-1.5">
                          <Shield size={12} className="text-[#FF4C00]" />
                          Select Hero Character Role
                        </label>
                        
                        {/* Custom Dropdown Trigger Button */}
                        <div className="relative w-full">
                          <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full bg-[#141414] border border-[#262626] hover:border-zinc-800 text-white rounded-xl px-4 py-3.5 text-xs font-semibold focus:outline-none flex items-center justify-between transition-all cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-2.5">
                              <CurrentSelectedIcon size={14} className={currentSelectedOption.color} />
                              <span className="uppercase tracking-wider">{currentSelectedOption.name}</span>
                            </div>
                            <ChevronDown size={14} className={`text-zinc-550 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {/* Custom Dropdown Options Menu */}
                          {isDropdownOpen && (
                            <>
                              {/* Invisible backdrop to close dropdown on clicking outside */}
                              <div 
                                className="fixed inset-0 z-30" 
                                onClick={() => setIsDropdownOpen(false)}
                              />
                              <div className="absolute bottom-[110%] left-0 right-0 z-50 bg-[#0E0E0E] border border-[#1A1A1A] rounded-xl shadow-2xl p-1.5 flex flex-col gap-1 max-h-[220px] overflow-y-auto scrollbar-thin animate-in fade-in slide-in-from-bottom-2 duration-200">
                                {ROLE_OPTIONS.map((option) => {
                                  const OptionIcon = option.icon;
                                  const isSelected = option.id === selectedRole;
                                  return (
                                    <button
                                      key={option.id}
                                      type="button"
                                      onClick={() => {
                                        setSelectedRole(option.id);
                                        setIsDropdownOpen(false);
                                      }}
                                      className={`flex items-center justify-between w-full px-3.5 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-left transition-all cursor-pointer ${
                                        isSelected 
                                          ? 'bg-[#FF4C00] text-black font-black' 
                                          : 'text-zinc-400 hover:text-white hover:bg-zinc-950'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <OptionIcon size={13} className={isSelected ? 'text-black' : option.color} />
                                        <span>{option.name}</span>
                                      </div>
                                      {isSelected && <Check size={13} strokeWidth={3} className="text-black" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 border-t border-[#1A1A1A] pt-5 mt-2">
                    <button
                      type="submit"
                      disabled={uploadingImage}
                      className="bg-[#FF4C00] hover:bg-[#e04300] text-black py-3.5 px-8 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#FF4C00]/10 disabled:opacity-55 disabled:cursor-not-allowed"
                    >
                      Save Settings
                    </button>
                  </div>
                </form>
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

      {/* Edit modal removed: profile updates are now managed directly inline */}

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
