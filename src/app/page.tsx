'use client';


import HeroBanner from '@/components/home/Hero-Section';
import GenreRows from '@/components/home/GenreRows';
import NewReleases from '@/components/home/NewReleases';
import RecommendedSection from '@/components/home/RecommendedSection';
import FAQ from '@/components/home/FAQ';
import TrendingNow from '@/components/home/Trending-Section';
import TopRated from '@/components/home/TopReatedSection';
import MoodBasedPicks from '@/components/home/ModeBasedSection';
import FeaturedActors from '@/components/home/FeatureBased';

export default function Home() {
  return (
    <div className="min-h-screen bg-black font-sans text-white overflow-x-hidden w-full relative">
      <HeroBanner />
     
<NewReleases />
<GenreRows />
      <TrendingNow/>
      <TopRated/>
      <MoodBasedPicks/>
      <FeaturedActors/>
      <RecommendedSection />
      <FAQ />
    </div>
  );
}
