'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Form Submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#181818] border border-zinc-800 rounded-2xl shadow-2xl p-8">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-3 focus:outline-none">
            <Image
              width={25}
              height={25}
              src="/logo.png"
              alt="FLIXORA Logo"
              className="h-12 w-auto object-cover hover:opacity-90 transition-opacity"
            />
          </Link>
          <p className="text-zinc-400 text-sm mt-2">
            Create an account to start streaming unlimited movies.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-zinc-300 font-medium">
                Full Name
              </span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="input input-bordered w-full bg-[#222222] border-zinc-700 text-white focus:outline-none focus:border-[#FF4C00]"
            />
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-zinc-300 font-medium">
                Email Address
              </span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="input input-bordered w-full bg-[#222222] border-zinc-700 text-white focus:outline-none focus:border-[#FF4C00]"
            />
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-zinc-300 font-medium">
                Password
              </span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="input input-bordered w-full bg-[#222222] border-zinc-700 text-white focus:outline-none focus:border-[#FF4C00]"
            />
          </div>

          {/* Confirm Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-zinc-300 font-medium">
                Confirm Password
              </span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="input input-bordered w-full bg-[#222222] border-zinc-700 text-white focus:outline-none focus:border-[#FF4C00]"
            />
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
                className="checkbox checkbox-sm border-zinc-600 checked:bg-[#FF4C00] checked:border-[#FF4C00]"
              />
              <span className="label-text text-zinc-400 text-xs">
                I agree to the{' '}
                <a href="#" className="text-[#FF4C00] hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#FF4C00] hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn w-full border-none bg-[#FF4C00] hover:bg-[#e04300] text-white font-bold text-base tracking-wide"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-400 mt-6">
          Already have an account?{' '}
          <a href="#" className="text-[#FF4C00] font-semibold hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
