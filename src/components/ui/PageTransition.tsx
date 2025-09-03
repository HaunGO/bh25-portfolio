'use client';

import { ReactNode, forwardRef, useRef, useEffect } from 'react';
import { usePageTransition } from '@/hooks/usePageTransition';
import gsap from 'gsap';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  transition?: 'fade' | 'slide' | 'scale' | 'custom';
  config?: {
    duration?: number;
    ease?: string;
    delay?: number;
  };
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
}

const PageTransition = forwardRef<HTMLDivElement, PageTransitionProps>(
  ({ 
    children, 
    className = '', 
    transition = 'fade',
    config = {},
    onTransitionStart,
    onTransitionEnd 
  }, ref) => {
    const { pageRef, isTransitioning } = usePageTransition({
      duration: config.duration || 0.4,
      ease: config.ease || 'power2.out',
      onTransitionStart,
      onTransitionEnd
    });

    // Use the forwarded ref if provided, otherwise use the hook's ref
    const finalRef = ref || pageRef;

    // Listen for page transition events from the Header
    useEffect(() => {
      const handlePageTransition = (event: CustomEvent) => {
        const element = finalRef && typeof finalRef === 'object' && 'current' in finalRef ? finalRef.current : null;
        if (event.detail.direction === 'out' && element) {
          // Use page-specific duration for exit animation, or default to 0.4s
          const exitDuration = config.duration || 0.4;
          
          // Trigger fade out animation with page-specific timing
          gsap.to(element, {
            opacity: 0,
            y: -20,
            duration: exitDuration,
            ease: config.ease || 'power2.out',
            onComplete: () => {
              // Signal that the exit animation is complete
              const completeEvent = new CustomEvent('pageTransitionComplete', {
                detail: { href: event.detail.href }
              });
              window.dispatchEvent(completeEvent);
            }
          });
        }
      };

      // Add event listener
      window.addEventListener('pageTransition', handlePageTransition as EventListener);

      // Cleanup
      return () => {
        window.removeEventListener('pageTransition', handlePageTransition as EventListener);
      };
    }, [finalRef, config.duration, config.ease]);

    return (
      <div
        ref={finalRef}
        className={`page-transition ${className}`}
        data-transitioning={isTransitioning}
      >
        {children}
      </div>
    );
  }
);

PageTransition.displayName = 'PageTransition';

export default PageTransition;
