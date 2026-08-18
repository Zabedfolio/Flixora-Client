"use client"
import React, { useState } from 'react';
import Link from 'next/link';

export const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login Form Submitted:', formData);
    };

    return (
        <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#181818] border border-zinc-800 rounded-2xl shadow-2xl p-8">
                {/* Brand Logo Header */}
                <div className="text-center mb-8 flex flex-col items-center justify-center">
                    <Link href="/" className="inline-block mb-3 focus:outline-none">
                        <img
                            src="/logo.png"
                            alt="FLIXORA Logo"
                            className="h-12 w-auto object-contain hover:opacity-90 transition-opacity"
                        />
                    </Link>
                    <p className="text-zinc-400 text-sm mt-1">
                        Welcome back! Sign in to continue streaming.
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div className="form-control">
                        <label className="label mb-1 block">
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
                            className="input input-bordered w-full bg-[#222222] border-zinc-700 text-white rounded-lg p-3 focus:outline-none focus:border-[#FF4C00] transition-colors"
                        />
                    </div>

                    {/* Password */}
                    <div className="form-control">
                        <label className="label mb-1 block">
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
                            className="input input-bordered w-full bg-[#222222] border-zinc-700 text-white rounded-lg p-3 focus:outline-none focus:border-[#FF4C00] transition-colors"
                        />
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="checkbox checkbox-sm border-zinc-600 rounded checked:bg-[#FF4C00] checked:border-[#FF4C00]"
                            />
                            <span className="text-zinc-400 text-xs">Remember me</span>
                        </label>
                        <Link href="/forgot-password" className="text-xs text-[#FF4C00] hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn w-full border-none bg-[#FF4C00] hover:bg-[#e04300] text-white font-bold py-3 rounded-lg text-base tracking-wide transition-colors"
                    >
                        Sign In
                    </button>
                </form>

                {/* Footer Link */}
                <p className="text-center text-sm text-zinc-400 mt-6">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-[#FF4C00] font-semibold hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;