'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface SimplePreloaderProps {
  onComplete?: () => void;
  duration?: number;
}

export default function SimplePreloader({ 
  onComplete, 
  duration = 2000
}: SimplePreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    console.log('SimplePreloader: Starting');
    
    // Add a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      console.log('SimplePreloader: Timeout triggered - checking refs');
      
      if (!preloaderRef.current || !barRef.current) {
        console.log('SimplePreloader: Missing refs - preloaderRef:', !!preloaderRef.current, 'barRef:', !!barRef.current);
        return;
      }

      console.log('SimplePreloader: Creating timeline');
      // Create simple timeline
      const timeline = gsap.timeline();

    // Fade in preloader
    console.log('SimplePreloader: Setting initial opacity and starting fade in');
    timeline.set(preloaderRef.current, { opacity: 0 })
      .to(preloaderRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => console.log('SimplePreloader: Fade in complete')
      });

    // Loading bar animation
    console.log('SimplePreloader: Starting loading bar animation');
    timeline.to(barRef.current, {
      scaleX: 1,
      duration: duration * 0.6,
      ease: 'power1.inOut',
      onComplete: () => console.log('SimplePreloader: Loading bar complete')
    });

    // Fade out preloader
    console.log('SimplePreloader: Starting fade out');
    timeline.to(preloaderRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        console.log('SimplePreloader: Complete');
        setShowPreloader(false);
        onComplete?.();
      }
    }, '-=0.2');

    }, 100); // 100ms delay

    return () => {
      clearTimeout(timeoutId);
      // timeline will be scoped within the timeout
    };
  }, [duration, onComplete]);

  if (!showPreloader) return null;

  return (
    <div 
      ref={preloaderRef} 
      className="fixed inset-0 z-[99999] bg-white dark:bg-neutral-900 flex items-center justify-center"
    >
      <div className="w-full max-w-md px-8">
        <div className="relative">
          <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div 
              ref={barRef}
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full origin-left"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
