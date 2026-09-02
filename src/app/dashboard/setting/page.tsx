'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Shield,
  Bell,
  Tv,
  Eye,
  EyeOff,
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
  Sparkles,
  Loader2,
  KeyRound,
  Send
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
  const { data: session } = authClient.useSession();
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

  // Account & Security States
  const [email, setEmail] = useState('user@flixora.com');
  const [twoFactor, setTwoFactor] = useState(false);

  // Change Email Modal (Better Auth OTP)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailStep, setEmailStep] = useState<'input' | 'otp'>('input');
  const [newEmailInput, setNewEmailInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Change Password Modal (Better Auth OTP)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordStep, setPasswordStep] = useState<'send' | 'otp'>('send');
  const [passwordOtpInput, setPasswordOtpInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSendingPasswordOtp, setIsSendingPasswordOtp] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 2-Step Delete Account Modals
  const [isDeleteAlertModalOpen, setIsDeleteAlertModalOpen] = useState(false);
  const [isDeletePasswordModalOpen, setIsDeletePasswordModalOpen] = useState(false);
  const [deletePasswordInput, setDeletePasswordInput] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Notification states
  const [notifyNewEpisodes, setNotifyNewEpisodes] = useState(true);
  const [notifyRecommend, setNotifyRecommend] = useState(true);
  const [notifyPromo, setNotifyPromo] = useState(false);
  const [notifyAi, setNotifyAi] = useState(true);

  // Playback states
  const [quality, setQuality] = useState('Auto');
  const [autoplay, setAutoplay] = useState(true);
  const [subtitles, setSubtitles] = useState(true);

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
                  avatarId: PRESET_AVATARS[0].id
                })
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
          console.error('Failed to load profiles:', error);
        }
      };

      fetchProfiles();
    }
  }, [session]);

  const triggerAutoSaveToast = (fieldLabel: string) => {
    setToastMessage(`${fieldLabel} updated`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // -------------------------------------------------------------
  // HANDLERS FOR SECURITY (EMAIL, PASSWORD, DELETE ACCOUNT)
  // -------------------------------------------------------------

  // 1. Send OTP via Better Auth emailOTP plugin (requestEmailChange)
  const handleSendEmailOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newEmailInput.trim() || !newEmailInput.includes('@')) {
      toast.error('Please enter a valid new email address.');
      return;
    }
    if (newEmailInput.trim().toLowerCase() === email.toLowerCase()) {
      toast.error('New email must be different from your current email.');
      return;
    }

    setIsSendingOtp(true);
    try {
      let res = await (authClient as any).emailOtp.requestEmailChange({
        newEmail: newEmailInput.trim(),
      });

      if (res?.error) {
        res = await (authClient as any).emailOtp.sendVerificationOtp({
          email: newEmailInput.trim(),
          type: 'email-verification',
        });
      }

      if (res?.error) {
        toast.error(res.error.message || 'Failed to send OTP code.');
      } else {
        setEmailStep('otp');
        toast.success(`Verification code sent to ${newEmailInput.trim()}`);
      }
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      toast.error(err.message || 'Failed to send verification code.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // 2. Verify OTP & Change Email via Better Auth
  const handleVerifyEmailOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpInput.trim() || otpInput.trim().length < 4) {
      toast.error('Please enter the verification code.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await (authClient as any).emailOtp.changeEmail({
        newEmail: newEmailInput.trim(),
        otp: otpInput.trim(),
      });

      if (res?.error) {
        toast.error(res.error.message || 'Invalid or expired OTP code.');
      } else {
        setEmail(newEmailInput.trim());
        setIsEmailModalOpen(false);
        setEmailStep('input');
        setNewEmailInput('');
        setOtpInput('');
        toast.success('Email address updated successfully!');
      }
    } catch (err: any) {
      console.error('Error changing email:', err);
      toast.error(err.message || 'Failed to verify code.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // 3a. Send Password Reset OTP via Better Auth
  const handleSendPasswordOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSendingPasswordOtp(true);
    try {
      let res = await (authClient as any).emailOtp.requestPasswordReset({
        email: email,
      });

      if (res?.error) {
        res = await (authClient as any).emailOtp.sendVerificationOtp({
          email: email,
          type: 'forget-password',
        });
      }

      if (res?.error) {
        toast.error(res.error.message || 'Failed to send OTP code.');
      } else {
        setPasswordStep('otp');
        toast.success(`Verification code sent to ${email}`);
      }
    } catch (err: any) {
      console.error('Error sending password reset OTP:', err);
      toast.error(err.message || 'Failed to send verification code.');
    } finally {
      setIsSendingPasswordOtp(false);
    }
  };

  // 3b. Verify OTP & Reset Password via Better Auth
  const handleResetPasswordWithOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passwordOtpInput.trim() || passwordOtpInput.trim().length < 4) {
      toast.error('Please enter the 6-digit verification code.');
      return;
    }
    if (!newPasswordInput || newPasswordInput.trim().length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }
    if (newPasswordInput.trim() !== confirmPasswordInput.trim()) {
      toast.error('New password and repeat password do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      let res = await (authClient as any).emailOtp.resetPassword({
        email: email,
        otp: passwordOtpInput.trim(),
        password: newPasswordInput.trim(),
      });

      if (res?.error) {
        const apiRes = await fetch('/api/user/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            newPassword: newPasswordInput.trim(),
          }),
        });
        const apiData = await apiRes.json();
        if (!apiRes.ok || !apiData.success) {
          toast.error(res.error.message || apiData.message || 'Failed to reset password.');
          return;
        }
      }

      toast.success('Password updated successfully!');
      setIsPasswordModalOpen(false);
      setPasswordStep('send');
      setPasswordOtpInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    } catch (err: any) {
      console.error('Error resetting password:', err);
      toast.error(err.message || 'Failed to reset password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // 4. Delete Account (2-Step Authorization)
  const handleDeleteAccountConfirm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!deletePasswordInput) {
      toast.error('Please enter your password to authorize account deletion.');
      return;
    }

    setIsDeletingAccount(true);
    try {
      const res = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePasswordInput }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || 'Incorrect password. Account deletion failed.');
      } else {
        toast.success('Account permanently deleted.');
        setIsDeletePasswordModalOpen(false);
        await authClient.signOut();
        window.location.href = '/';
      }
    } catch (err: any) {
      console.error('Error deleting account:', err);
      toast.error(err.message || 'Failed to delete account.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  // Handle image file upload for avatar
  const handleCustomImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await res.json();
      if (data.url) {
        setEditAvatar(data.url);
        setEditAvatarId('custom_upload');
        toast.success('Custom avatar uploaded!');
      } else {
        throw new Error('No URL returned from upload server');
      }
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast.error(error.message || 'Failed to upload avatar image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Inline Profile Update Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    if (!session?.user?.id) {
      toast.error('You must be logged in to update profile');
      return;
    }

    try {
      let currentProfId = profiles[0]?._id;

      if (!currentProfId) {
        const createRes = await fetch(`${API_BASE}/api/profiles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: session.user.id,
            name: editName.trim(),
            avatar: editAvatar,
            avatarId: editAvatarId
          })
        });
        if (createRes.ok) {
          const newProf = await createRes.json();
          currentProfId = newProf._id;
        }
      }

      if (currentProfId) {
        const res = await fetch(`${API_BASE}/api/profiles/${currentProfId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editName.trim(),
            avatar: editAvatar,
            avatarId: editAvatarId
          })
        });

        if (!res.ok) {
          throw new Error('Failed to update profile details');
        }

        const updatedProfile = await res.json();
        setProfiles([updatedProfile]);
      }

      const roleOk = await updateRole();

      if (roleOk) {
        triggerAutoSaveToast('Profile settings');
      }
    } catch (error: any) {
      console.error('Failed to save profile settings:', error);
      toast.error(error.message || 'Failed to save settings');
    }
  };

  const SUB_TABS = [
    { id: 'profile', label: 'Profiles', icon: User },
    { id: 'account', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'playback', label: 'Playback', icon: Tv },
    { id: 'privacy', label: 'Privacy', icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-black font-sans text-white overflow-x-hidden w-full relative flex flex-col justify-between select-none">
      <main className="flex-grow pt-8 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {/* PAGE HEADER */}
        <div className="flex flex-col gap-2.5 mb-8">
          <div className="flex items-center gap-2.5">
            <Settings className="text-[#FF4C00] shrink-0" size={24} fill="currentColor" />
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
              Settings
            </h1>
          </div>
          <p className="text-xs md:text-sm text-zinc-550 font-medium max-w-2xl leading-relaxed border-b border-[#1A1A1A] pb-5">
            Manage your profiles, change passwords, and configure defaults.
          </p>
        </div>

        {/* SETTINGS MAIN CONTAINER */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT SUB-TAB NAVIGATION */}
          <div className="w-full lg:w-56 shrink-0 flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none border-b lg:border-b-0 lg:border-r border-[#1A1A1A] lg:pr-6">
            {SUB_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#141414] text-[#FF4C00] border-l-2 border-[#FF4C00] font-black shadow-md'
                      : 'text-zinc-450 hover:text-white hover:bg-zinc-950/60'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-[#FF4C00]' : 'text-zinc-500'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* RIGHT CONTENT PANEL */}
          <div className="flex-1 w-full bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl p-6 md:p-8 min-h-[500px]">
            {/* SUB-TAB 1: PROFILE MANAGEMENT */}
            {activeSubTab === 'profile' && (
              <div className="flex flex-col gap-8 animate-in fade-in duration-200">
                <form onSubmit={handleSaveProfile} className="flex flex-col gap-8">
                  {/* Avatar Picker Section */}
                  <div className="flex flex-col gap-4">
                    <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                      Select Account Avatar
                    </label>
                    <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-10 gap-3 max-h-[220px] overflow-y-auto p-2 bg-[#141414] border border-[#262626] rounded-xl custom-scrollbar">
                      {PRESET_AVATARS.map((avatar) => {
                        const isSelected = editAvatarId === avatar.id;
                        return (
                          <div
                            key={avatar.id}
                            onClick={() => {
                              setEditAvatar(avatar.url);
                              setEditAvatarId(avatar.id);
                            }}
                            className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
                              isSelected
                                ? 'border-[#FF4C00] scale-105 shadow-lg shadow-[#FF4C00]/30 z-10'
                                : 'border-transparent opacity-60 hover:opacity-100 hover:scale-102'
                            }`}
                            title={avatar.name}
                          >
                            <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-[#FF4C00]/20 flex items-center justify-center">
                                <Check size={14} className="text-white drop-shadow-md" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Custom Image Upload Option */}
                    <div className="flex items-center gap-4 mt-1">
                      <label className="border border-zinc-700 hover:border-[#FF4C00] text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2">
                        {uploadingImage ? <Loader2 size={14} className="animate-spin text-[#FF4C00]" /> : <Plus size={14} />}
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Custom Avatar'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCustomImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                      {editAvatarId === 'custom_upload' && (
                        <span className="text-[10px] text-[#FF4C00] font-bold uppercase tracking-wider">
                          Custom Avatar Selected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Profile Display Name */}
                  <div className="flex flex-col gap-2 max-w-md">
                    <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                      Profile Display Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter profile name..."
                      className="bg-[#141414] border border-[#262626] text-white text-sm font-semibold rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF4C00] transition-colors"
                      required
                    />
                  </div>

                  {/* Role Selector Dropdown */}
                  {(() => {
                    const currentRoleObj = ROLE_OPTIONS.find((r) => r.id === selectedRole) || ROLE_OPTIONS[0];
                    const CurrentIcon = currentRoleObj.icon;
                    return (
                      <div className="flex flex-col gap-2 max-w-md">
                        <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                          Account Character Tag / Role
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center justify-between w-full bg-[#141414] border border-[#262626] hover:border-zinc-700 text-white rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              <CurrentIcon size={14} className={currentRoleObj.color} />
                              <span>{currentRoleObj.name}</span>
                            </div>
                            <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
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
                  <p className="text-[10px] text-zinc-500 font-semibold mt-1 uppercase tracking-wide">
                    Manage primary access emails, passwords, and security options
                  </p>
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
                        className="w-full bg-[#141414] border border-[#262626] text-zinc-400 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none"
                      />
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setNewEmailInput('');
                      setOtpInput('');
                      setEmailStep('input');
                      setIsEmailModalOpen(true);
                    }}
                    className="border border-zinc-700 hover:border-white text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all cursor-pointer outline-none shrink-0"
                  >
                    Change Email
                  </button>
                </div>

                {/* Password management */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-3 border-b border-[#1A1A1A] pb-6">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        readOnly
                        value="••••••••••••••"
                        className="w-full bg-[#141414] border border-[#262626] text-zinc-400 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none"
                      />
                      <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setPasswordStep('send');
                      setPasswordOtpInput('');
                      setNewPasswordInput('');
                      setConfirmPasswordInput('');
                      setIsPasswordModalOpen(true);
                    }}
                    className="border border-zinc-700 hover:border-white text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all cursor-pointer outline-none shrink-0"
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
                    onChange={(e) => {
                      setTwoFactor(e.target.checked);
                      triggerAutoSaveToast('2FA settings');
                    }}
                    className="toggle toggle-[#FF4C00] checked:bg-[#FF4C00] checked:border-[#FF4C00]"
                  />
                </div>

                {/* Account deletion warning */}
                <div className="mt-4 pt-4 border-t border-red-950/20">
                  <span className="text-xs font-bold text-red-500 uppercase tracking-wide">Danger Zone</span>
                  <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed mt-1 uppercase tracking-wide">Permanently purge your Flixora account data</p>
                  <button
                    onClick={() => setIsDeleteAlertModalOpen(true)}
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
                    onChange={(e) => { setAutoplay(e.target.checked); triggerAutoSaveToast('Autoplay preference'); }}
                    className="toggle toggle-[#FF4C00] checked:bg-[#FF4C00] checked:border-[#FF4C00]"
                  />
                </div>

                {/* Default Subtitles toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-white uppercase tracking-wide">Enable Subtitles by Default</span>
                    <span className="text-[10px] text-zinc-500 font-semibold leading-relaxed">Loads English captions on playback</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={subtitles}
                    onChange={(e) => { setSubtitles(e.target.checked); triggerAutoSaveToast('Subtitle preference'); }}
                    className="toggle toggle-[#FF4C00] checked:bg-[#FF4C00] checked:border-[#FF4C00]"
                  />
                </div>
              </div>
            )}

            {/* SUB-TAB 5: PRIVACY */}
            {activeSubTab === 'privacy' && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-200 max-w-lg">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Privacy & Visibility</h3>
                  <p className="text-[10px] text-zinc-500 font-semibold mt-1 uppercase tracking-wide">Control your profile visibility and data collection</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1A1A1A]/40 pb-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-white uppercase tracking-wide">Public Activity Feed</span>
                      <span className="text-[10px] text-zinc-500 font-semibold leading-relaxed">Allow friends to view your movie reviews</span>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      onChange={() => triggerAutoSaveToast('Privacy feed settings')}
                      className="toggle toggle-[#FF4C00] checked:bg-[#FF4C00] checked:border-[#FF4C00]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-white uppercase tracking-wide">Watch History Data Sync</span>
                      <span className="text-[10px] text-zinc-500 font-semibold leading-relaxed">Store continue-watching progress in cloud</span>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      onChange={() => triggerAutoSaveToast('Data sync settings')}
                      className="toggle toggle-[#FF4C00] checked:bg-[#FF4C00] checked:border-[#FF4C00]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* AUTO-SAVE FLOATING TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-55 bg-[#FF4C00] text-black text-xs font-black uppercase tracking-wider px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200">
          <Check size={14} strokeWidth={3} />
          {toastMessage}
        </div>
      )}

      {/* =========================================================
          CHANGE EMAIL MODAL (Better Auth OTP Plugin Integration)
      ========================================================= */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl shadow-2xl p-6 flex flex-col gap-5 relative select-none animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setIsEmailModalOpen(false);
                setEmailStep('input');
                setNewEmailInput('');
                setOtpInput('');
              }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1 rounded-full cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00] shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Change Account Email
                </h3>
                <p className="text-[10px] text-zinc-500 font-medium">
                  {emailStep === 'input'
                    ? 'Enter your new email address to receive a 6-digit OTP'
                    : `Enter the 6-digit code sent to ${newEmailInput}`}
                </p>
              </div>
            </div>

            {emailStep === 'input' ? (
              <form onSubmit={handleSendEmailOtp} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                    Current Email
                  </label>
                  <input
                    type="email"
                    readOnly
                    value={email}
                    className="w-full bg-[#141414] border border-[#262626] text-zinc-500 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                    New Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmailInput}
                    onChange={(e) => setNewEmailInput(e.target.value)}
                    placeholder="Enter new email address..."
                    className="w-full bg-[#141414] border border-[#262626] text-white rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#FF4C00]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEmailModalOpen(false)}
                    className="border border-[#262626] hover:bg-zinc-900 text-zinc-400 hover:text-white py-3 px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="bg-[#FF4C00] hover:bg-[#e04300] text-black font-black py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#FF4C00]/20 disabled:opacity-50"
                  >
                    {isSendingOtp ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Send Verification OTP</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyEmailOtp} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                    6-Digit Verification Code (OTP)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-[#141414] border border-[#262626] text-center text-white text-lg font-mono font-bold tracking-[8px] rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF4C00]"
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                  <span>Didn't receive code?</span>
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    disabled={isSendingOtp}
                    className="text-[#FF4C00] hover:underline font-bold cursor-pointer disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEmailStep('input')}
                    className="border border-[#262626] hover:bg-zinc-900 text-zinc-400 hover:text-white py-3 px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifyingOtp || otpInput.length < 4}
                    className="bg-[#FF4C00] hover:bg-[#e04300] text-black font-black py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#FF4C00]/20 disabled:opacity-50"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Check size={14} strokeWidth={3} />
                        <span>Verify & Update Email</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          CHANGE PASSWORD MODAL (Better Auth OTP Integration)
      ========================================================= */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0E0E0E] border border-[#1A1A1A] rounded-2xl shadow-2xl p-6 flex flex-col gap-5 relative select-none animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setIsPasswordModalOpen(false);
                setPasswordStep('send');
                setPasswordOtpInput('');
                setNewPasswordInput('');
                setConfirmPasswordInput('');
              }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1 rounded-full cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00] shrink-0">
                <KeyRound size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Reset Password with OTP
                </h3>
                <p className="text-[10px] text-zinc-500 font-medium">
                  {passwordStep === 'send'
                    ? 'Receive a 6-digit OTP code to reset your account password'
                    : `Enter the 6-digit code sent to ${email} and set your new password`}
                </p>
              </div>
            </div>

            {passwordStep === 'send' ? (
              <form onSubmit={handleSendPasswordOtp} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                    Account Email
                  </label>
                  <input
                    type="email"
                    readOnly
                    value={email}
                    className="w-full bg-[#141414] border border-[#262626] text-zinc-400 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="border border-[#262626] hover:bg-zinc-900 text-zinc-400 hover:text-white py-3 px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingPasswordOtp}
                    className="bg-[#FF4C00] hover:bg-[#e04300] text-black font-black py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#FF4C00]/20 disabled:opacity-50"
                  >
                    {isSendingPasswordOtp ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Send Password Reset OTP</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordWithOtp} className="flex flex-col gap-4">
                {/* 6-Digit OTP */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                    6-Digit Verification Code (OTP)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={passwordOtpInput}
                    onChange={(e) => setPasswordOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-[#141414] border border-[#262626] text-center text-white text-lg font-mono font-bold tracking-[8px] rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF4C00]"
                  />
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                    New Password (min 8 characters)
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="Enter new password..."
                      className="w-full bg-[#141414] border border-[#262626] text-white rounded-xl pl-4 pr-10 py-3 text-xs font-semibold focus:outline-none focus:border-[#FF4C00]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Repeat New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                    Repeat New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      placeholder="Repeat new password..."
                      className="w-full bg-[#141414] border border-[#262626] text-white rounded-xl pl-4 pr-10 py-3 text-xs font-semibold focus:outline-none focus:border-[#FF4C00]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                  <span>Didn't receive code?</span>
                  <button
                    type="button"
                    onClick={handleSendPasswordOtp}
                    disabled={isSendingPasswordOtp}
                    className="text-[#FF4C00] hover:underline font-bold cursor-pointer disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPasswordStep('send')}
                    className="border border-[#262626] hover:bg-zinc-900 text-zinc-400 hover:text-white py-3 px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPassword || passwordOtpInput.length < 4}
                    className="bg-[#FF4C00] hover:bg-[#e04300] text-black font-black py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#FF4C00]/20 disabled:opacity-50"
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Resetting...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={14} />
                        <span>Verify OTP & Reset Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          2-STEP DELETE ACCOUNT STEP 1: WARNING ALERT MODAL
      ========================================================= */}
      {isDeleteAlertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0E0E0E] border border-red-900/50 rounded-2xl shadow-2xl p-6 flex flex-col gap-5 select-none animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-800/60 flex items-center justify-center text-red-500 shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-base font-black uppercase tracking-wider text-red-500">
                  Delete Account Warning
                </h3>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Permanent & Irreversible Action
                </p>
              </div>
            </div>

            <div className="bg-red-950/15 border border-red-900/30 rounded-xl p-4 text-xs text-zinc-300 leading-relaxed flex flex-col gap-2">
              <p className="font-bold text-white">
                Are you sure you want to permanently delete your Flixora account?
              </p>
              <ul className="list-disc pl-4 text-zinc-400 space-y-1 text-[11px]">
                <li>All profile avatars, custom nicknames, and roles will be purged.</li>
                <li>Saved playlists, watch history, and My List items will be deleted.</li>
                <li>Movie reviews and active plan subscriptions will be removed.</li>
              </ul>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setIsDeleteAlertModalOpen(false)}
                className="flex-1 border border-[#262626] hover:bg-zinc-900 text-zinc-400 hover:text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsDeleteAlertModalOpen(false);
                  setDeletePasswordInput('');
                  setIsDeletePasswordModalOpen(true);
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-red-600/20"
              >
                I Understand, Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          2-STEP DELETE ACCOUNT STEP 2: PASSWORD AUTHORIZATION MODAL
      ========================================================= */}
      {isDeletePasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0E0E0E] border border-red-900/50 rounded-2xl shadow-2xl p-6 flex flex-col gap-5 select-none animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => {
                setIsDeletePasswordModalOpen(false);
                setDeletePasswordInput('');
              }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1 rounded-full cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-950/40 border border-red-800/60 flex items-center justify-center text-red-500 shrink-0">
                <Lock size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Authorize Account Deletion
                </h3>
                <p className="text-[10px] text-zinc-400 font-semibold">
                  Please enter your account password to confirm permanent deletion
                </p>
              </div>
            </div>

            <form onSubmit={handleDeleteAccountConfirm} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                  Account Password
                </label>
                <div className="relative">
                  <input
                    type={showDeletePassword ? 'text' : 'password'}
                    required
                    value={deletePasswordInput}
                    onChange={(e) => setDeletePasswordInput(e.target.value)}
                    placeholder="Enter your account password..."
                    className="w-full bg-[#141414] border border-[#262626] text-white rounded-xl pl-4 pr-10 py-3 text-xs font-semibold focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    {showDeletePassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeletePasswordModalOpen(false);
                    setDeletePasswordInput('');
                  }}
                  className="flex-1 border border-[#262626] hover:bg-zinc-900 text-zinc-400 hover:text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDeletingAccount || !deletePasswordInput}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeletingAccount ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Deleting Account...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      <span>Permanently Delete</span>
                    </>
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
