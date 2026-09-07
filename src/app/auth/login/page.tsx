"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';

import { toast } from "react-hot-toast";
import { authClient } from "@/app/(auth)/lib/auth-client";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 30; // seconds

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        <div className="text-center mb-8 flex flex-col items-center justify-center">
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
            Welcome back! Sign in to continue streaming.
          </p>
        </div>

        {/* Lockout Banner Banner */}
        {lockoutTimer > 0 && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-500 text-xs font-semibold">
            <Lock className="w-4 h-4 shrink-0 animate-pulse" />
            <span>
              Too many failed attempts. Please wait{" "}
              <strong className="underline">{lockoutTimer}s</strong> before trying again.
            </span>
          </div>
        )}

        {/* Google Login Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={lockoutTimer > 0 || googleLoading}
            className="w-full bg-[#141414] hover:bg-[#1E1E1E] text-white border border-[#262626] hover:border-zinc-700 font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="w-full bg-[#FF4C00] hover:bg-[#e04300] text-white font-bold py-4 rounded-xl text-sm uppercase tracking-widest transition-all duration-300 hover:scale-[1.01] shadow-lg shadow-[#FF4C00]/10 focus:outline-none focus:ring-2 focus:ring-[#FF4C00]/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
