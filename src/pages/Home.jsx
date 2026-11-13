import React from 'react';
import Hero from '@/components/portfolio/Hero';
import FeaturedProjects from '@/components/portfolio/FeaturedProjects';
import BlogSection from '@/components/portfolio/BlogSection';
import ContactStrip from '@/components/portfolio/ContactStrip';

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedProjects />
      <BlogSection />
      <ContactStrip />
    </div>
  );
}
