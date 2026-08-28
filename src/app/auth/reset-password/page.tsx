"use client";

import { useState, Suspense } from "react";
import { authClient } from "@/app/(auth)/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";


function ResetPasswordForm() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);

        try {
            const { error } = await authClient.resetPassword({
                newPassword: newPassword,
                token: token || undefined,
            });

            if (error) {
                toast.error(error.message || "Failed to reset password.");
                return;
            }

            toast.success("Password reset successfully! Please log in.");
            router.push("/auth/login");
        } catch (err) {
            console.error("Reset password error:", err);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black/90 px-4 py-12 text-white">
            <div className="w-full max-w-md space-y-6 rounded-xl border border-gray-800 bg-gray-900/80 p-8 shadow-2xl backdrop-blur-md">
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Reset Password</h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Please enter your new password below.
                    </p>
                </div>

                <form onSubmit={handleResetPassword} className="mt-8 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? "Updating Password..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-white">Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}