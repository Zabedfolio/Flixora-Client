'use client';

import HeroBanner from '@/components/home/Hero-Section';
import TrendingNow from '@/components/home/Trending-Section';
import RecommendedSection from '@/components/home/RecommendedSection';
import NewReleases from '@/components/home/NewReleases';
import TitleRow from '@/components/home/TitleRow';
import MoodBasedPicks from '@/components/home/ModeBasedSection';
import GenreRows from '@/components/home/GenreRows';
import TopRated from '@/components/home/TopReatedSection';
import FeaturedActors from '@/components/home/FeatureBased';
import ReviewSection from "@/components/home/ReviewSection";
import FAQ from '@/components/home/FAQ';

export default function Home() {
  return (
    <div className="min-h-screen bg-black font-sans text-white overflow-x-hidden w-full relative">
      <HeroBanner />
      <TrendingNow />
      <RecommendedSection />
      <NewReleases />
      
      <MoodBasedPicks />
      <GenreRows />
      <TopRated />
       <TitleRow />
      <FeaturedActors />
      <ReviewSection />
      <FAQ />
    </div>
  );
}
