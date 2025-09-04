'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/sections/Hero';
import QuickNavigation from '@/components/sections/QuickNavigation';
import PageTransition from '@/components/ui/PageTransition';
import Preloader from '@/components/sections/Preloader';

export default function HomePage() {
  const [showPreloader, setShowPreloader] = useState(true); // Always start with preloader
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  useEffect(() => {
    // Check if this is the first visit in this session
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (hasVisited) {
      // Return visit in this session - skip preloader immediately
      setShowPreloader(false);
      setPreloaderComplete(true);
    }
    // If first visit in this session, preloader stays true and will show
  }, []);

  const handlePreloaderComplete = () => {
    setPreloaderComplete(true);
    sessionStorage.setItem('hasVisited', 'true');
  };

  return (
    <>
      {/* Show preloader on first visit - blocks everything */}
      {showPreloader && !preloaderComplete && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}
      
      {/* Main content - always render but control visibility */}
      <div 
        className="min-h-screen"
        style={{ 
          opacity: preloaderComplete ? 1 : 0,
          visibility: preloaderComplete ? 'visible' : 'hidden'
        }}
      >
        <PageTransition 
          transition="fade" 
          config={{ 
            duration: 1.0,
            ease: 'power2.out',
            delay: 0.2 
          }}
        >
          <Hero delay={0.1} shouldAnimate={preloaderComplete} />
          {/* <QuickNavigation /> */}
        </PageTransition>
      </div>
    </>
  );
}
