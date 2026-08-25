'use client'
import { Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function SignupModal() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {

        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#121212] border border-zinc-800 p-6 shadow-2xl transition-all">
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
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
                        onClick={() => setIsOpen(false)}
                        className="w-full text-center rounded-lg bg-[#FF4C00] py-3 font-semibold text-white shadow-lg transition-all hover:bg-[#e04300] focus:ring-2 focus:ring-[#FF4C00]/50 active:scale-[0.98]"
                    >
                        Create Free Account
                    </Link>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full text-center rounded-lg py-2 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
}