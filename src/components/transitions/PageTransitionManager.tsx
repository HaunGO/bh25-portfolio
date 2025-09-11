'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { TransitionVariant, TransitionState } from './types';

export const usePageTransition = (overlayRef: React.RefObject<HTMLDivElement>) => {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<TransitionState>({
    isTransitioning: false,
    currentVariant: 'fade'
  });

  const isNavigatingRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Set overlay variant
  const setOverlayVariant = useCallback((variant: TransitionVariant) => {
    setState(prev => ({ ...prev, currentVariant: variant }));
  }, []);

  // Animation functions
  const animateOverlayIn = async (element: HTMLDivElement, variant: TransitionVariant): Promise<void> => {
    return new Promise((resolve) => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        resolve();
        return;
      }

      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const props = getVariantProperties(variant, true);
      timelineRef.current = gsap.timeline({ onComplete: () => resolve() });

      // Set initial state
      gsap.set(element, { autoAlpha: 0, pointerEvents: 'auto' });
      timelineRef.current.to(element, props);
    });
  };

  const animateOverlayOut = async (element: HTMLDivElement, variant: TransitionVariant): Promise<void> => {
    return new Promise((resolve) => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.set(element, { autoAlpha: 0, pointerEvents: 'none' });
        resolve();
        return;
      }

      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const props = getVariantProperties(variant, false);
      timelineRef.current = gsap.timeline({
        onComplete: () => {
          gsap.set(element, { pointerEvents: 'none' });
          resolve();
        }
      });

      timelineRef.current.to(element, props);
    });
  };

  const getVariantProperties = (variant: TransitionVariant, isIn: boolean) => {
    const baseProps = { duration: 0.4, ease: 'power2.inOut' };

    switch (variant) {
      case 'fade':
        return { ...baseProps, autoAlpha: isIn ? 1 : 0 };
      case 'topWipe':
        return { ...baseProps, y: isIn ? '0%' : '-100%' };
      case 'bottomWipe':
        return { ...baseProps, y: isIn ? '0%' : '100%' };
      case 'diagonalMask':
        return {
          ...baseProps,
          clipPath: isIn 
            ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
            : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
        };
      default:
        return { ...baseProps, autoAlpha: isIn ? 1 : 0 };
    }
  };

  // Main transition function
  const startTransition = useCallback(async (to: string) => {
    console.log('🚀 startTransition called:', { to, pathname, isTransitioning: state.isTransitioning, overlayRef, overlayRefCurrent: overlayRef?.current });
    
    // Prevent rapid double clicks
    if (isNavigatingRef.current || state.isTransitioning) {
      console.log('❌ Transition blocked - already transitioning');
      return;
    }

    // Don't transition to the same route
    if (to === pathname) {
      console.log('❌ Transition blocked - same route');
      return;
    }

    // Check if overlay is ready
    if (!overlayRef || !overlayRef.current) {
      console.log('❌ Transition blocked - overlay not ready, falling back to direct navigation');
      // Fallback to direct navigation if overlay isn't ready
      router.push(to);
      return;
    }

    console.log('✅ Starting transition...');
    isNavigatingRef.current = true;
    setState(prev => ({ ...prev, isTransitioning: true }));

    try {
      // Animate overlay in
      await animateOverlayIn(overlayRef.current, state.currentVariant);
      
      // Navigate to new route
      router.push(to);
      
      // Wait for pathname to change
      await new Promise<void>((resolve) => {
        const checkPathname = () => {
          if (window.location.pathname === to) {
            resolve();
          } else {
            requestAnimationFrame(checkPathname);
          }
        };
        checkPathname();
      });
      
      // Animate overlay out
      await animateOverlayOut(overlayRef.current, state.currentVariant);
      
    } catch (error) {
      console.error('Transition error:', error);
      // Ensure overlay is hidden on error
      if (overlayRef.current) {
        gsap.set(overlayRef.current, { autoAlpha: 0, pointerEvents: 'none' });
      }
    } finally {
      isNavigatingRef.current = false;
      setState(prev => ({ ...prev, isTransitioning: false }));
    }
  }, [state.currentVariant, state.isTransitioning, pathname, router, overlayRef]);

  return {
    startTransition,
    setOverlayVariant,
    isTransitioning: state.isTransitioning,
    currentVariant: state.currentVariant
  };
};
