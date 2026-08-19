'use client';

import React from 'react';
import HeroBanner from '@/components/home/Hero-Section';
import RecommendedSection from '@/components/home/RecommendedSection';
import FAQ from '@/components/home/FAQ';

export default function Home() {
  return (
    <div className="min-h-screen bg-black font-sans text-white overflow-x-hidden w-full relative">
      <HeroBanner />
      <RecommendedSection />
      <FAQ />
    </div>
  );
}
