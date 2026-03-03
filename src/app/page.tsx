'use client';

import { useState, useEffect } from 'react';
import { HeroSlider } from '@/components/home/HeroSlider';
import { CategoryBar } from '@/components/home/CategoryBar';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { NewArrivals } from '@/components/home/NewArrivals';
import { TestimonialMarquee } from '@/components/home/TestimonialMarquee';
import { BrandExperience } from '@/components/home/BrandExperience';
import { HeroSlide, CuratedCategory, FeaturedCollection, Product } from '@/lib/types';
import { getHeroSlides, getCuratedCategories, getFeaturedCollections, getProducts } from '@/lib/firestore';

export default function HomePage() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [categories, setCategories] = useState<CuratedCategory[]>([]);
  const [featured, setFeatured] = useState<FeaturedCollection[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [slides, cats, feat] = await Promise.all([
          getHeroSlides(),
          getCuratedCategories(),
          getFeaturedCollections()
        ]);

        setHeroSlides(slides);
        setCategories(cats);
        setFeatured(feat);
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadHomeData();
  }, []);

  return (
    <>
      {/* Hero Section - Loads from Firebase or shows defaults */}
      <HeroSlider slides={heroSlides} isLoading={isLoading} />

      {/* Category Navigation - Horizontal Scrolling */}
      <CategoryBar categories={categories} />

      {/* Featured Collections - Bento Grid */}
      <FeaturedCollections collections={featured} />

      {/* New Arrivals Carousel - Products with newArrival flag */}
      <NewArrivals />

      {/* Reviews Details Section (Marquee from Image) */}
      <TestimonialMarquee />

      {/* Brand Experience Section */}
      <BrandExperience />

      {/* Trust Badges merged into Footer for Home */}
    </>
  );
}
