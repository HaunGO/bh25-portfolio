'use client';

import { useRef, forwardRef, useImperativeHandle } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { TransitionVariant } from './types';

// Register GSAP React plugin
gsap.registerPlugin(useGSAP);

export interface OverlayRef {
  animateIn: (variant: TransitionVariant) => Promise<void>;
  animateOut: (variant: TransitionVariant) => Promise<void>;
  hide: () => void;
  show: () => void;
}

interface PageTransitionOverlayProps {
  className?: string;
}

const PageTransitionOverlay = forwardRef<OverlayRef, PageTransitionOverlayProps>(
  ({ className = '' }, ref) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    // Check for reduced motion preference
    const prefersReducedMotion = useRef(false);
    
    useGSAP(() => {
      // Initialize overlay as hidden
      if (overlayRef.current) {
        gsap.set(overlayRef.current, {
          autoAlpha: 0,
          pointerEvents: 'none'
        });
      }

      // Check for reduced motion
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotion.current = mediaQuery.matches;
    }, { scope: overlayRef });


    // Kill any existing timeline to prevent conflicts
    const killExistingTimeline = () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };

    // Get animation properties based on variant
    const getVariantProperties = (variant: TransitionVariant, isIn: boolean) => {
      const baseProps = {
        duration: 0.4,
        ease: 'power2.inOut'
      };

      switch (variant) {
        case 'fade':
          return {
            ...baseProps,
            autoAlpha: isIn ? 1 : 0
          };
        
        case 'topWipe':
          return {
            ...baseProps,
            y: isIn ? '0%' : '-100%'
          };
        
        case 'bottomWipe':
          return {
            ...baseProps,
            y: isIn ? '0%' : '100%'
          };
        
        case 'diagonalMask':
          return {
            ...baseProps,
            clipPath: isIn 
              ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
              : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
          };
        
        default:
          return {
            ...baseProps,
            autoAlpha: isIn ? 1 : 0
          };
      }
    };

    // Animate overlay in
    const animateIn = async (variant: TransitionVariant): Promise<void> => {
      return new Promise((resolve) => {
        console.log('🎬 animateIn called:', { variant, hasOverlay: !!overlayRef.current, reducedMotion: prefersReducedMotion.current });
        if (!overlayRef.current || prefersReducedMotion.current) {
          console.log('⏭️ Skipping animation - no overlay or reduced motion');
          resolve();
          return;
        }

        killExistingTimeline();
        
        const props = getVariantProperties(variant, true);
        timelineRef.current = gsap.timeline({
          onComplete: () => resolve()
        });

        // Set initial state based on variant
        switch (variant) {
          case 'fade':
            gsap.set(overlayRef.current, { autoAlpha: 0 });
            break;
          case 'topWipe':
            gsap.set(overlayRef.current, { y: '-100%' });
            break;
          case 'bottomWipe':
            gsap.set(overlayRef.current, { y: '100%' });
            break;
          case 'diagonalMask':
            gsap.set(overlayRef.current, { 
              clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' 
            });
            break;
        }

        // Enable pointer events and animate
        gsap.set(overlayRef.current, { pointerEvents: 'auto' });
        timelineRef.current.to(overlayRef.current, props);
      });
    };

    // Animate overlay out
    const animateOut = async (variant: TransitionVariant): Promise<void> => {
      return new Promise((resolve) => {
        if (!overlayRef.current || prefersReducedMotion.current) {
          if (overlayRef.current) {
            gsap.set(overlayRef.current, { 
              autoAlpha: 0, 
              pointerEvents: 'none',
              clearProps: 'all'
            });
          }
          resolve();
          return;
        }

        killExistingTimeline();
        
        const props = getVariantProperties(variant, false);
        timelineRef.current = gsap.timeline({
          onComplete: () => {
            if (overlayRef.current) {
              gsap.set(overlayRef.current, { 
                pointerEvents: 'none',
                clearProps: 'all'
              });
            }
            resolve();
          }
        });

        timelineRef.current.to(overlayRef.current, props);
      });
    };

    // Hide overlay immediately
    const hide = () => {
      if (overlayRef.current) {
        killExistingTimeline();
        gsap.set(overlayRef.current, { 
          autoAlpha: 0, 
          pointerEvents: 'none',
          clearProps: 'all'
        });
      }
    };

    // Show overlay immediately
    const show = () => {
      if (overlayRef.current) {
        killExistingTimeline();
        gsap.set(overlayRef.current, { 
          autoAlpha: 1, 
          pointerEvents: 'auto'
        });
      }
    };

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      animateIn,
      animateOut,
      hide,
      show
    }));

    return (
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-50 bg-black pointer-events-none ${className}`}
        style={{ 
          willChange: 'transform, opacity, clip-path'
        }}
        aria-hidden="true"
      />
    );
  }
);

PageTransitionOverlay.displayName = 'PageTransitionOverlay';

export default PageTransitionOverlay;
