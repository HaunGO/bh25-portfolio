'use client';

import Hero from '@/components/sections/Hero';
import QuickNavigation from '@/components/sections/QuickNavigation';
import PageTransition from '@/components/ui/PageTransition';

export default function HomePage() {
  return (
    <PageTransition 
      transition="fade" 
      config={{ 
        duration: 1.0,
        ease: 'power2.out',
        delay: 0.2 
      }}
    >
      
      
      <Hero />


      {/* <QuickNavigation /> */}
    </PageTransition>
  );
}
