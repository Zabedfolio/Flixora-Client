"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';

import { toast } from "react-hot-toast";
import { authClient } from "@/app/(auth)/lib/auth-client";
import { Eye, EyeOff, Loader2, Lock, Shield, Sparkles, User, KeyRound } from "lucide-react";
import { z } from "zod";
import { useKidsStore } from "@/lib/store/kidsStore";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 30; // seconds

export const LoginForm: React.FC = () => {
  // Login Mode Tab State: 'parent' | 'kids'
  const [loginMode, setLoginMode] = useState<'parent' | 'kids'>('parent');

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Kids Login State
  const [kidsUsername, setKidsUsername] = useState("");
  const [kidsPin, setKidsPin] = useState("");
  const [kidsLoading, setKidsLoading] = useState(false);

  // Rate Limiting States
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Load persisted lockout state on client mount
  useEffect(() => {
    const savedAttempts = localStorage.getItem("failedAttempts");
    if (savedAttempts) {
      setFailedAttempts(parseInt(savedAttempts, 10));
    }
    const savedUntil = localStorage.getItem("lockoutUntil");
    if (savedUntil) {
      const remaining = Math.ceil((parseInt(savedUntil, 10) - Date.now()) / 1000);
      if (remaining > 0) {
        setLockoutTimer(remaining);
      } else {
        localStorage.removeItem("lockoutUntil");
        localStorage.removeItem("failedAttempts");
        setFailedAttempts(0);
      }
    }
  }, []);

  // Forgot Password State & Modal Control
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Countdown timer effect for lockout
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutTimer > 0) {
      timer = setInterval(() => {
        const savedUntil = localStorage.getItem("lockoutUntil");
        if (savedUntil) {
          const remaining = Math.ceil((parseInt(savedUntil, 10) - Date.now()) / 1000);
          if (remaining <= 0) {
            setLockoutTimer(0);
            setFailedAttempts(0);
            localStorage.removeItem("lockoutUntil");
            localStorage.removeItem("failedAttempts");
            toast.success("You can now try signing in again.");
          } else {
            setLockoutTimer(remaining);
          }
        } else {
          setLockoutTimer((prev) => {
            const next = prev - 1;
            if (next <= 0) {
              setFailedAttempts(0);
              localStorage.removeItem("lockoutUntil");
              localStorage.removeItem("failedAttempts");
              toast.success("You can now try signing in again.");
              return 0;
            }
            return next;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTimer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;
    const updatedData = {
      ...formData,
      [name]: updatedValue,
    };
    
    setFormData(updatedData);

    // Instant validation on input change
    const result = loginSchema.safeParse(updatedData);
    if (!result.success) {
      const issue = result.error.issues.find((issue) => issue.path[0] === name);
      if (issue) {
        setErrors((prev) => ({
          ...prev,
          [name]: issue.message,
        }));
      } else {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy[name];
          return copy;
        });
      }
    } else {
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutTimer > 0) {
      toast.error(`Too many failed attempts. Try again in ${lockoutTimer}s.`);
      return;
    }

    setErrors({});

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (typeof path === "string") {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/",
        rememberMe: formData.rememberMe,
      });

      if (error) {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        localStorage.setItem("failedAttempts", newAttempts.toString());

        if (newAttempts >= MAX_ATTEMPTS) {
          const until = Date.now() + LOCKOUT_TIME * 1000;
          localStorage.setItem("lockoutUntil", until.toString());
          setLockoutTimer(LOCKOUT_TIME);
          toast.error(
            `Too many failed attempts. Your account login is locked for ${LOCKOUT_TIME} seconds.`
          );
        } else {
          toast.error(
            `${error.message || "Invalid credentials."} (${MAX_ATTEMPTS - newAttempts} attempt(s) remaining)`
          );
        }
        return;
      }

      // Ensure standard login exits Kids Mode
      useKidsStore.getState().setActiveKidsProfile(null);

      toast.success("Logged in successfully!");
      setFailedAttempts(0);
      localStorage.removeItem("failedAttempts");
      localStorage.removeItem("lockoutUntil");
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Kids Profile Login Handler (DB & 4-digit PIN integrated)
  const handleKidsLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kidsUsername.trim()) {
      toast.error("Please enter your Kids Username or Handle");
      return;
    }

    if (!kidsPin.trim() || !/^\d{4}$/.test(kidsPin.trim())) {
      toast.error("Please enter your 4-digit Security PIN");
      return;
    }

    setKidsLoading(true);
    try {
      const res = await fetch("/api/kids/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: kidsUsername.trim(),
          pin: kidsPin.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Invalid Kids Username or 4-digit PIN");
        return;
      }

      // Enter Kids Mode in Zustand state
      useKidsStore.getState().enterKidsMode(data.profile);

      toast.success(data.message || `Welcome, ${data.profile.name}! Kids Mode Activated.`);
      window.location.href = "/";
    } catch (err) {
      console.error("Kids login error:", err);
      toast.error("Network error during Kids login. Please try again.");
    } finally {
      setKidsLoading(false);
    }
  };

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.error("Google Login Error:", err);
      toast.error("Failed to sign in with Google.");
      setGoogleLoading(false);
    }
  };

  // Handle Password Reset Request
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    setForgotLoading(true);
    try {

      const { error } = await authClient.requestPasswordReset({
        email: forgotEmail,
        redirectTo: "/auth/reset-password",
      });

      if (error) {
        toast.error(error.message || "Something went wrong.");
        return;
      }

      toast.success("Password reset link sent to your email!");
      setIsForgotModalOpen(false);
      setForgotEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 selection:bg-[#FF4C00] selection:text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF4C00]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl shadow-2xl p-8 z-10 hover:border-zinc-800/80 transition-colors duration-300">
        <div className="text-center mb-6 flex flex-col items-center justify-center">
          <Link
            href="/"
            className="inline-block mb-3 focus:outline-none rounded outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00]"
          >
            <Image
              width={160}
              height={60}
              src="/logo.png"
              alt="FLIXORA Logo"
              className="h-10 w-auto object-contain hover:opacity-90 transition-opacity"
              priority
            />
          </Link>
          <p className="text-zinc-400 text-xs mt-1">
            {loginMode === 'parent' 
              ? "Welcome back! Sign in to continue streaming."
              : "Safe & Fun Streaming for Kids — Enter PIN to start!"}
          </p>
        </div>

        {/* LOGIN MODE TABS: Standard vs Kids Mode */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#121212] border border-[#222222] rounded-xl mb-6 select-none">
          <button
            type="button"
            onClick={() => setLoginMode('parent')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              loginMode === 'parent'
                ? 'bg-[#1F1F1F] text-white shadow-md border border-zinc-700/60'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <User size={14} className={loginMode === 'parent' ? 'text-[#FF4C00]' : ''} />
            <span>Parent / Adult</span>
          </button>

          <button
            type="button"
            onClick={() => setLoginMode('kids')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              loginMode === 'kids'
                ? 'bg-gradient-to-r from-amber-500/20 to-[#FF4C00]/20 text-amber-400 border border-amber-500/40 shadow-md'
                : 'text-zinc-400 hover:text-amber-400 hover:bg-zinc-900'
            }`}
          >
            <Shield size={14} className="text-amber-400" />
            <span className="flex items-center gap-1">
              Kids Login
              <Sparkles size={11} className="text-amber-400 animate-pulse" />
            </span>
          </button>
        </div>

        {/* Lockout Banner */}
        {lockoutTimer > 0 && loginMode === 'parent' && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-500 text-xs font-semibold">
            <Lock className="w-4 h-4 shrink-0 animate-pulse" />
            <span>
              Too many failed attempts. Please wait{" "}
              <strong className="underline">{lockoutTimer}s</strong> before trying again.
            </span>
          </div>
        )}

        {/* CONDITIONAL FORM RENDERING */}
        {loginMode === 'parent' ? (
          <>
            {/* Google Login Button */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={lockoutTimer > 0 || googleLoading}
                className="w-full bg-[#141414] hover:bg-[#1E1E1E] text-white border border-[#262626] hover:border-zinc-700 font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                    />
                  </svg>
                )}
                {googleLoading ? "Connecting..." : "Continue with Google"}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-[#262626] w-full" />
              <span className="bg-[#0A0A0A] px-3 text-[10px] uppercase font-bold tracking-widest text-zinc-500 absolute">
                Or continue with
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={lockoutTimer > 0}
                  required
                  className={`w-full bg-[#141414] border ${errors.email ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/10' : 'border-[#262626] focus:border-[#FF4C00] focus:ring-[#FF4C00]/20'} text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 hover:border-zinc-700 transition-all placeholder:text-zinc-650 disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                {errors.email && (
                  <span className="text-xs font-semibold text-red-500 mt-1">{errors.email}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={lockoutTimer > 0}
                    required
                    className={`w-full bg-[#141414] border ${errors.password ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/10' : 'border-[#262626] focus:border-[#FF4C00] focus:ring-[#FF4C00]/20'} text-white rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 hover:border-zinc-700 transition-all placeholder:text-zinc-650 disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={lockoutTimer > 0}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-xs font-semibold text-red-500 mt-1">{errors.password}</span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={lockoutTimer > 0}
                    className="w-4 h-4 rounded border-[#262626] bg-[#141414] checked:bg-[#FF4C00] checked:border-[#FF4C00] transition-colors focus:ring-0 cursor-pointer accent-[#FF4C00] disabled:opacity-50"
                  />
                  <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    Remember me
                  </span>
                </label>

                {/* Forgot Password Trigger */}
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-[#FF4C00] font-bold hover:underline bg-transparent border-0 cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || lockoutTimer > 0}
                className="w-full bg-[#FF4C00] hover:bg-[#e04300] text-white font-bold py-4 rounded-xl text-sm uppercase tracking-widest transition-all duration-300 hover:scale-[1.01] shadow-lg shadow-[#FF4C00]/10 focus:outline-none focus:ring-2 focus:ring-[#FF4C00]/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : lockoutTimer > 0 ? (
                  `Locked (${lockoutTimer}s)`
                ) : (
                  "SIGN IN"
                )}
              </button>
            </form>
          </>
        ) : (
          /* KIDS MODE LOGIN FORM WITH 4-DIGIT PIN */
          <form onSubmit={handleKidsLogin} className="space-y-5">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-200 block">Kids Mode Login</strong>
                Enter your Kids username (e.g. <span className="font-mono text-amber-400">@tom_kids</span>) and your 4-digit PIN code to enter Kids Mode.
              </div>
            </div>

            {/* Kids Username / Handle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Kids Username or Handle
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-amber-400 font-bold text-sm">
                  @
                </span>
                <input
                  type="text"
                  placeholder="tom_kids"
                  value={kidsUsername.replace(/^@/, '')}
                  onChange={(e) => setKidsUsername(e.target.value)}
                  required
                  className="w-full bg-[#141414] border border-[#262626] focus:border-amber-500 focus:ring-amber-500/20 text-white rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-1 hover:border-zinc-700 transition-all placeholder:text-zinc-650"
                />
              </div>
            </div>

            {/* 4-Digit Security PIN */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound size={13} className="text-amber-400" />
                  4-Digit Security PIN
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">4 NUMERIC DIGITS</span>
              </div>
              <input
                type="password"
                maxLength={4}
                pattern="\d{4}"
                inputMode="numeric"
                placeholder="••••"
                value={kidsPin}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setKidsPin(val);
                }}
                required
                className="w-full bg-[#141414] border border-[#262626] focus:border-amber-500 focus:ring-amber-500/20 text-amber-400 font-mono tracking-[0.6em] text-center font-black rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-1 hover:border-zinc-700 transition-all placeholder:text-zinc-700 placeholder:tracking-normal"
              />
            </div>

            <button
              type="submit"
              disabled={kidsLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-[#FF4C00] hover:from-amber-600 hover:to-[#e04300] text-black font-black py-4 rounded-xl text-sm uppercase tracking-widest transition-all duration-300 hover:scale-[1.01] shadow-lg shadow-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {kidsLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-black" />
              ) : (
                <>
                  <Shield size={16} />
                  <span>ENTER KIDS MODE</span>
                </>
              )}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-zinc-400 mt-6 select-none">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-[#FF4C00] font-black hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2">Reset Password</h3>
            <p className="text-xs text-zinc-400 mb-5">
              Enter your registered email address to receive a password reset link.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#FF4C00] focus:ring-[#FF4C00]/20 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-zinc-650"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-1/2 bg-[#141414] hover:bg-[#1E1E1E] text-zinc-300 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-1/2 bg-[#FF4C00] hover:bg-[#e04300] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  {forgotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
