'use client'
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from '@/app/(auth)/lib/auth-client';

export default function SignupModal() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        // If loading session state, wait
        if (isPending) return;

        // If user is already logged in, do not show the popup at all
        if (session) return;

        // Check if the user has already seen/dismissed this popup in localStorage
        const hasSeenPopup = localStorage.getItem('flixora_welcome_popup_shown');
        if (hasSeenPopup === 'true') return;

        // Display popup after 10 seconds on first unregistered page load
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 10000);

        return () => clearTimeout(timer);
    }, [session, isPending]);

    const handleClose = () => {
        setIsOpen(false);
        // Save flag in localStorage so it doesn't show up again
        localStorage.setItem('flixora_welcome_popup_shown', 'true');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#121212] border border-zinc-800 p-6 shadow-2xl transition-all">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                    aria-label="Close Modal"
                >
                    <X size={20} />
                </button>

                {/* Header Icon / Logo */}
                <div className="mb-4 flex justify-center">
                    <Image
                        src="/logo.png"
                        alt="Flixora Logo"
                        width={64}
                        height={64}
                        className="object-contain"
                        priority
                    />
                </div>
                
                {/* Content */}
                <div className="text-center">
                    <h3 className="text-2xl font-bold tracking-tight text-white">
                        Welcome to <span className="text-[#FF4C00]">Flixora</span>
                    </h3>
                    <p className="mt-2 text-sm text-zinc-400">
                        Create an account to build your personalized watchlist, switch profiles, and stream unlimited movies & TV shows.
                    </p>
                </div>

                {/* Call to Action Buttons */}
                <div className="mt-6 flex flex-col gap-3">
                    <Link
                        href="/auth/signup"
                        onClick={handleClose}
                        className="w-full text-center rounded-lg bg-[#FF4C00] py-3 font-semibold text-white shadow-lg transition-all hover:bg-[#e04300] focus:ring-2 focus:ring-[#FF4C00]/50 active:scale-[0.98]"
                    >
                        Create Free Account
                    </Link>

                    <button
                        onClick={handleClose}
                        className="w-full text-center rounded-lg py-2 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
}