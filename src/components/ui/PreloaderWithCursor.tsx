'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { AdvancedCursor } from './cursor';

interface PreloaderWithCursorProps {
  onComplete?: () => void;
  duration?: number;
  showCursorAfter?: number; // When to show cursor during preloader (0-1)
}

export default function PreloaderWithCursor({ 
  onComplete, 
  duration = 2000,
  showCursorAfter = 0.7 // Show cursor at 70% of preloader progress
}: PreloaderWithCursorProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const cursorContainerRef = useRef<HTMLDivElement>(null);
  
  const [showPreloader, setShowPreloader] = useState(true);
  const [showCursor, setShowCursor] = useState(false);
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  useEffect(() => {
    console.log('PreloaderWithCursor: useEffect triggered');
    
    // Check if this is a return visit
    const hasVisited = sessionStorage.getItem('hasVisited');
    console.log('PreloaderWithCursor: hasVisited =', hasVisited);
    
    if (hasVisited) {
      // Return visit - skip preloader, show cursor immediately
      console.log('PreloaderWithCursor: Return visit - skipping preloader');
      setShowPreloader(false);
      setShowCursor(true);
      setPreloaderComplete(true);
      onComplete?.();
      return;
    }

    if (!preloaderRef.current || !barRef.current || !cursorContainerRef.current) return;

    // Create master timeline
    const masterTimeline = gsap.timeline();

    // Phase 1: Fade in preloader
    masterTimeline.set(preloaderRef.current, { opacity: 0 })
      .to(preloaderRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });

    // Phase 2: Loading bar animation
    const barDuration = duration * 0.6; // 60% of total time for loading bar
    masterTimeline.to(barRef.current, {
      scaleX: 1,
      duration: barDuration,
      ease: 'power1.inOut',
      onUpdate: function() {
        const progress = this.progress();
        console.log('PreloaderWithCursor: Loading bar progress =', progress);
        // Show cursor at specified progress point
        if (progress >= showCursorAfter && !showCursor) {
          console.log('PreloaderWithCursor: Showing cursor at progress', progress);
          setShowCursor(true);
        }
      }
    });

    // Phase 3: Fade out preloader while cursor is already active
    masterTimeline.to(preloaderRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        setPreloaderComplete(true);
        setShowPreloader(false);
        sessionStorage.setItem('hasVisited', 'true');
        onComplete?.();
      }
    }, '-=0.2');

    // Cleanup
    return () => {
      masterTimeline.kill();
    };
  }, [duration, showCursorAfter, onComplete, showCursor]);

  return (
    <>
      {/* Preloader */}
      {showPreloader && (
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
      )}

      {/* AdvancedCursor - temporarily disabled for debugging */}
      {false && showCursor && (
        <AdvancedCursor disabled={!showCursor} />
      )}
    </>
  );
}
