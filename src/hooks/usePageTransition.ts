import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

interface PageTransitionOptions {
  duration?: number;
  ease?: string;
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
}

export function usePageTransition(options: PageTransitionOptions = {}) {
  const {
    duration = 0.3,
    ease = 'power2.inOut',
    onTransitionStart,
    onTransitionEnd
  } = options;

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Set initial hidden state immediately
  useEffect(() => {
    if (pageRef.current) {
      // Immediately hide the page before any rendering
      gsap.set(pageRef.current, { 
        opacity: 0, 
        y: 20,
        immediateRender: true,
        force3D: true
      });
    }
  }, []);

  // Fade in animation when page mounts and is ready
  useEffect(() => {
    if (!pageRef.current || !isReady) return;

    // Small delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      if (pageRef.current) {
        // Fade in animation
        const tl = gsap.timeline({
          onComplete: () => {
            setIsTransitioning(false);
            onTransitionEnd?.();
          }
        });

        tl.to(pageRef.current, {
          opacity: 1,
          y: 0,
          duration,
          ease
        });
      }
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [isReady, duration, ease, onTransitionEnd]);

  // Mark as ready after a brief moment to prevent flash
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Function to trigger page transition out
  const transitionTo = (href: string) => {
    if (!pageRef.current || isTransitioning) return;

    setIsTransitioning(true);
    onTransitionStart?.();

    // Fade out animation
    const tl = gsap.timeline({
      onComplete: () => {
        router.push(href);
      }
    });

    tl.to(pageRef.current, {
      opacity: 0,
      y: -20,
      duration,
      ease
    });
  };

  return {
    pageRef,
    isTransitioning,
    transitionTo
  };
}
