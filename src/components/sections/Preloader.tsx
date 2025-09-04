'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!preloaderRef.current || !barRef.current) return;

    // Create the main timeline - easily extensible for future complexity
    const tl = gsap.timeline({
      onComplete: onComplete
    });

    // Phase 1: Fade in preloader (1 second)
    // tl.set(preloaderRef.current, { opacity: 0 })
    //   .to(preloaderRef.current, {
    //     opacity: 1,
    //     duration: 1.0,
    //     ease: 'power2.out'
    //   });

    // Phase 2: Loading bar animation (1 second from 0 to 100%)
    tl.to(barRef.current, {
      scaleX: 1,
      duration: 1.0,
      ease: 'power2.inOut'
    }, '-=0.1'); // Slight overlap for smooth transition

    // Phase 3: Fade out preloader (1 second)
    tl.to(preloaderRef.current, {
      opacity: 0,
      duration: 1.0,
      ease: 'power2.in'
    }, '-=0.1'); // Slight overlap for smooth transition

    // Cleanup function
    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={preloaderRef}
      className="fixed inset-0 z-[99999] bg-white dark:bg-neutral-900 flex items-center justify-center"
    >
      <div className="w-full max-w-md px-8">
        {/* Loading Bar Container */}
        <div className="relative">
          {/* Background Bar */}
          <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            {/* Animated Bar - starts at 0, animates to 100% */}
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
