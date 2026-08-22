'use client';


import HeroBanner from '@/components/home/Hero-Section';
import GenreRows from '@/components/home/GenreRows';
import RecommendedSection from '@/components/home/RecommendedSection';
import FAQ from '@/components/home/FAQ';

export default function Home() {
  return (
    <div className="min-h-screen bg-black font-sans text-white overflow-x-hidden w-full relative">
      <HeroBanner />
     

<GenreRows />
      <RecommendedSection />
      <FAQ />
    </div>
  );
}
