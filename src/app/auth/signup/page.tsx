'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';

import { toast } from 'react-hot-toast';
import { authClient } from '@/app/(auth)/lib/auth-client';
import { useRouter } from 'next/navigation';

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
    agreeTerms: z.boolean().refine(val => val === true, {
      message: 'You must agree to the Terms & Conditions',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;
    const updatedData = {
      ...formData,
      [name]: updatedValue,
    };

    setFormData(updatedData);

    // Instant validation on input change
    const result = registerSchema.safeParse(updatedData);
    if (!result.success) {
      const issue = result.error.issues.find(issue => issue.path[0] === name);
      if (issue) {
        setErrors(prev => ({
          ...prev,
          [name]: issue.message,
        }));
      } else {
        setErrors(prev => {
          const copy = { ...prev };
          delete copy[name];
          return copy;
        });
      }

      // Sync mismatch password validation
      if (name === 'password' || name === 'confirmPassword') {
        const confirmIssue = result.error.issues.find(
          issue => issue.path[0] === 'confirmPassword',
        );
        if (confirmIssue) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: confirmIssue.message,
          }));
        } else {
          setErrors(prev => {
            const copy = { ...prev };
            delete copy.confirmPassword;
            return copy;
          });
        }
      }
    } else {
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const path = issue.path[0];
        if (typeof path === 'string') {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const { data, error } = await authClient.signUp.email(
      {
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
        callbackURL: '/dashboard',
      },
      {
        onRequest: ctx => {
          // Optional: handle loading state
        },
        onSuccess: ctx => {
          toast.success('Account created successfully!');
          router.push('/dashboard');
        },
        onError: ctx => {
          toast.error(ctx.error.message);
        },
      },
    );
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
            Create an account to start streaming unlimited movies.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
              className={`w-full bg-[#141414] border ${errors.fullName ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/10' : 'border-[#262626] focus:border-[#FF4C00] focus:ring-[#FF4C00]/20'} text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 hover:border-zinc-700 transition-all placeholder:text-zinc-650`}
            />
            {errors.fullName && (
              <span className="text-xs font-semibold text-red-500 mt-1">
                {errors.fullName}
              </span>
            )}
          </div>

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
              className={`w-full bg-[#141414] border ${errors.email ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/10' : 'border-[#262626] focus:border-[#FF4C00] focus:ring-[#FF4C00]/20'} text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 hover:border-zinc-700 transition-all placeholder:text-zinc-650`}
            />
            {errors.email && (
              <span className="text-xs font-semibold text-red-500 mt-1">
                {errors.email}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full bg-[#141414] border ${errors.password ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/10' : 'border-[#262626] focus:border-[#FF4C00] focus:ring-[#FF4C00]/20'} text-white rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 hover:border-zinc-700 transition-all placeholder:text-zinc-650`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs font-semibold text-red-500 mt-1">
                {errors.password}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full bg-[#141414] border ${errors.confirmPassword ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/10' : 'border-[#262626] focus:border-[#FF4C00] focus:ring-[#FF4C00]/20'} text-white rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 hover:border-zinc-700 transition-all placeholder:text-zinc-650`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-xs font-semibold text-red-500 mt-1">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="flex items-start gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
                className="w-4 h-4 mt-0.5 rounded border-[#262626] bg-[#141414] checked:bg-[#FF4C00] checked:border-[#FF4C00] transition-colors focus:ring-0 cursor-pointer accent-[#FF4C00]"
              />
              <span className="text-zinc-400 text-xs leading-normal">
                I agree to the{' '}
                <a
                  href="#"
                  className="text-[#FF4C00] font-bold hover:underline"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#"
                  className="text-[#FF4C00] font-bold hover:underline"
                >
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreeTerms && (
              <span className="text-xs font-semibold text-red-500 mt-1">
                {errors.agreeTerms}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF4C00] hover:bg-[#e04300] text-white font-bold py-4 rounded-xl text-sm uppercase tracking-widest transition-all duration-300 hover:scale-[1.01] shadow-lg shadow-[#FF4C00]/10 focus:outline-none focus:ring-2 focus:ring-[#FF4C00]/50"
          >
            CREATE ACCOUNT
          </button>
        </form>

        <p className="text-center text-xs text-zinc-400 mt-6 select-none">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-[#FF4C00] font-black hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
