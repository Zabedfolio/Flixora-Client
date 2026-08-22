'use client';

import Image from 'next/image';
import { Film } from 'lucide-react';

interface LoadingScreenProps {
  variant?: 'intro' | 'route';
}

function LoadingCard() {
  return (
    <div className="rounded-2xl border border-[#1A1A1A] bg-[#0D0D0D] p-4 shadow-xl shadow-black/20">
      <div className="mb-4 aspect-[2/3] w-full animate-pulse rounded-xl bg-linear-to-br from-[#1A1A1A] via-[#0D0D0D] to-black" />

      <div className="space-y-2">
        <div className="h-3 w-4/5 rounded-full bg-[#1A1A1A] animate-pulse" />
        <div className="h-2.5 w-1/2 rounded-full bg-[#141414] animate-pulse" />

        <div className="flex gap-2 pt-2">
          <span className="h-6 flex-1 rounded-full bg-[#1A1A1A] animate-pulse" />
          <span className="h-6 w-14 rounded-full bg-[#141414] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function LoadingScreen({
  variant = 'route',
}: LoadingScreenProps) {
  const cardCount = variant === 'intro' ? 3 : 4;

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,76,0,0.18),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(255,106,42,0.12),_transparent_32%)]" />
      <div className="absolute inset-0 bg-linear-to-b from-black via-black/85 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:36px_36px] opacity-25" />

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <div className="relative mb-8 flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
          <div className="absolute inset-0 animate-spin rounded-full border border-[#FF4C00]/30 border-t-[#FF4C00] [animation-duration:1.8s]" />
          <div className="absolute inset-3 animate-pulse rounded-full border border-[#FF4C00]/20" />

          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#FF4C00]/35 bg-black/90 shadow-2xl shadow-[#FF4C00]/10 sm:h-24 sm:w-24">
            <Image
              src="/logo.png"
              alt="Flixora"
              width={72}
              height={72}
              className="h-12 w-12 object-contain sm:h-14 sm:w-14"
              priority
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-[#FF4C00]/20 bg-[#FF4C00]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.32em] text-[#FF6A2A]">
          <Film className="h-3.5 w-3.5" />
          {variant === 'intro' ? 'Opening Sequence' : 'Loading Sequence'}
        </div>

        <h1 className="mt-5 text-2xl font-black tracking-tight text-white sm:text-4xl">
          {variant === 'intro'
            ? 'Flixora is warming up'
            : 'Loading the next scene'}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
          {variant === 'intro'
            ? 'A cinematic intro keeps the project alive while the first view settles in.'
            : 'We are preparing the route before the content appears so the transition feels deliberate.'}
        </p>
      </div>
    </div>
  );
}
