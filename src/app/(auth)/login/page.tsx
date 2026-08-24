"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { toast } from "react-hot-toast";
import { authClient } from "../lib/auth-client";

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log('Login Form Submitted:', formData);
    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/",
        rememberMe: formData.rememberMe,
      });

      if (error) {
        toast.error(error.message || "Invalid credentials. Please try again.");
        return;
      }
      toast.success("Form submitted successfully!");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An unexpected error occurred. Please try again later.");
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
              required
              className="w-full bg-[#141414] border border-[#262626] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF4C00] focus:ring-1 focus:ring-[#FF4C00]/20 hover:border-zinc-700 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-[#141414] border border-[#262626] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF4C00] focus:ring-1 focus:ring-[#FF4C00]/20 hover:border-zinc-700 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none group">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded border-[#262626] bg-[#141414] checked:bg-[#FF4C00] checked:border-[#FF4C00] transition-colors focus:ring-0 cursor-pointer accent-[#FF4C00]"
              />
              <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                Remember me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-[#FF4C00] font-bold hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF4C00] hover:bg-[#e04300] text-white font-bold py-4 rounded-xl text-sm uppercase tracking-widest transition-all duration-300 hover:scale-[1.01] shadow-lg shadow-[#FF4C00]/10 focus:outline-none focus:ring-2 focus:ring-[#FF4C00]/50"
          >
            SIGN IN
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
    </div>
  );
};

export default LoginForm;
