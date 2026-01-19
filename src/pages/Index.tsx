import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import SpotlightBanner from '@/components/home/SpotlightBanner';
import ComingSoonSection from '@/components/home/ComingSoonSection';
import SpecialOffers from '@/components/home/SpecialOffers';

const Index: React.FC = () => {
  return (
    <Layout>
      <SpotlightBanner />
      <HeroSection />
      <FeaturedSection />
      <ComingSoonSection />
      <SpecialOffers />
    </Layout>
  );
};

export default Index;
