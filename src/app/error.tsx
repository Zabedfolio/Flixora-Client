'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw, Search } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Error tracking service integration (e.g., Sentry)
        console.error(error);
    }, [error]);

    return (
        <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black px-4 py-16 sm:px-6">
            {/* Background Glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF4C00]/10 blur-[130px]" />
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:40px_40px]" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
                {/* Error Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 backdrop-blur-md"
                >
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-[10px] font-bold tracking-[0.25em] text-red-400 sm:text-xs">
                        SYSTEM INTERRUPTION
                    </span>
                </motion.div>

                {/* 500 / Error Indicator */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="relative mx-auto mb-6"
                >
                    <div className="absolute left-1/2 top-1/2 h-32 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF4C00]/20 blur-[70px]" />
                    <h1 className="relative text-[50px] font-black leading-none tracking-[-0.08em] text-white sm:text-[100px] md:text-[110px]">
                        5<span className="text-[#FF4C00]">0</span>0
                    </h1>
                </motion.div>

                {/* Separator Line */}
                <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: '100%' }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mx-auto mb-8 h-px max-w-md bg-gradient-to-r from-transparent via-[#FF4C00] to-transparent"
                />

                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl"
                >
                    Action Cut! Something Went Wrong.
                </motion.h2>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mx-auto mb-9 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base"
                >
                    We encountered an unexpected error on this scene. Try re-shooting the page or head back to safety.
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="flex flex-col items-center justify-center gap-3 sm:flex-row"
                >
                    {/* Retry Button */}
                    <button
                        onClick={() => reset()}
                        className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#FF4C00] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF4C00]/20 transition-all duration-300 hover:scale-105 hover:bg-[#E04300] sm:w-auto cursor-pointer"
                    >
                        <RefreshCw size={17} className="transition-transform duration-500 group-hover:rotate-180" />
                        <span>TRY AGAIN</span>
                    </button>

                    {/* Go Home Button */}
                    <Link
                        href="/"
                        className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#FF4C00]/40 hover:bg-white/10 sm:w-auto"
                    >
                        <Home size={17} />
                        <span>GO HOME</span>
                    </Link>
                </motion.div>

                {/* Bottom Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="mt-12 flex items-center justify-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-zinc-600 sm:text-xs"
                >
                    <Search size={13} />
                    <span>TECHNICAL DIFFICULTIES DETECTED</span>
                </motion.div>
            </div>

            {/* Bottom Vignette */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </main>
    );
}