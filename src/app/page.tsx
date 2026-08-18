'use client';

import React, { useState } from 'react';
import Navbar from '@/components/common/Navbar';
import HeroBanner from '@/components/home/Hero-Section';
import RecommendedSection from '@/components/home/RecommendedSection';
import Footer from '@/components/common/Footer';

import FAQ from '@/components/home/FAQ';

export default function Home() {
  const [activeTab, setActiveTab] = useState('');

  return (
    <div className="min-h-screen bg-black font-sans text-white overflow-x-hidden w-full relative">
      <Navbar
        myListCount={5}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <HeroBanner />
      <RecommendedSection />
      <FAQ />
      <Footer />
    </div>
  );
}
