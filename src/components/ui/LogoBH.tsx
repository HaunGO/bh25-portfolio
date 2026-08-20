'use client';

import { useCallback, useEffect, useRef, useState, type MouseEvent, type RefObject, type TouchEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface LogoBHProps {
  className?: string;
  logoKey?: string;
  autoAnimate?: boolean;
  triggerRef?: RefObject<HTMLElement | null>;
  triggerStart?: string;
  triggerEnd?: string;
  reopenLogoKeyOnClose?: string;
  showMarkers?: boolean;
}

type LogoRegistryEntry = {
  id: symbol;
  key?: string;
  open: () => void;
  close: () => void;
};

const openLogoTimelines = new Set<LogoRegistryEntry>();

const closeOtherLogos = (currentLogoId: symbol) => {
  openLogoTimelines.forEach((logo) => {
    if (logo.id !== currentLogoId) {
      logo.close();
    }
  });
};

const openLogoByKey = (targetLogoKey: string, currentLogoId: symbol) => {
  openLogoTimelines.forEach((logo) => {
    if (logo.key === targetLogoKey && logo.id !== currentLogoId) {
      closeOtherLogos(logo.id);
      logo.open();
    }
  });
};

export default function LogoBH({ 
  className = '',
  logoKey,
  autoAnimate = false,
  triggerRef,
  triggerStart,
  triggerEnd,
  reopenLogoKeyOnClose,
  showMarkers = false
}: LogoBHProps) {
  const myNameRef = useRef<HTMLSpanElement>(null);
  const hoverTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const logoIdRef = useRef(Symbol('LogoBH'));
  const [isAnimating, setIsAnimating] = useState(false);

  const reverseClosed = useCallback(() => {
    scrollTimelineRef.current?.reverse();
    hoverTimelineRef.current?.reverse();
    setIsAnimating(false);
  }, []);

  const playOpen = useCallback(() => {
    closeOtherLogos(logoIdRef.current);

    if (hoverTimelineRef.current) {
      hoverTimelineRef.current.play();
      setIsAnimating(true);
    }
  }, []);

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    if (myNameRef.current) {
      const spans = myNameRef.current.querySelectorAll('span');
      spans.forEach(span => {
        gsap.set(span, { width: 0, overflow: 'hidden' });
      });
    }

    // Add a small delay to ensure the element is rendered
    const timer = setTimeout(() => {
      if (myNameRef.current) {
        const spans = myNameRef.current.querySelectorAll('span');
        
        // Create timeline for sequential animation
        const tl = gsap.timeline({ paused: true });
        // console.log("📝 Created timeline:", tl);
        
        // Animate each span sequentially
        spans.forEach((span, index) => {
          // Calculate the natural width by temporarily setting to auto
          const tempWidth = span.style.width;
          span.style.width = 'auto';
          const autoWidth = span.offsetWidth;
          span.style.width = tempWidth;
          
          // console.log(`📏 Span ${index}: natural width = ${autoWidth}px`);
          
          tl.to(span, {
            width: autoWidth,
            duration: 0.6,
            ease: "power2.inOut",
          }, index * 0.1); // Stagger each span by 0.1s
        });
        
        // console.log("📝 Timeline duration:", tl.duration());

        // Create hover timeline for quick animation
        const hoverTl = gsap.timeline({ paused: true });
        spans.forEach((span, index) => {
          const tempWidth = span.style.width;
          span.style.width = 'auto';
          const autoWidth = span.offsetWidth;
          span.style.width = tempWidth;
          
          hoverTl.to(span, {
            width: autoWidth,
            duration: 0.3,
            ease: "power2.inOut",
          }, index * 0.05); // Faster stagger for hover
        });
        hoverTimelineRef.current = hoverTl;
        const registryEntry: LogoRegistryEntry = {
          id: logoIdRef.current,
          key: logoKey,
          open: () => {
            hoverTl.pause(0);
            tl.play();
            setIsAnimating(true);
          },
          close: () => {
            tl.reverse();
            hoverTl.reverse();
            setIsAnimating(false);
          },
        };
        openLogoTimelines.add(registryEntry);

        // If autoAnimate is true, play immediately
        if (autoAnimate) {
          closeOtherLogos(logoIdRef.current);
          tl.play();
        } else if (triggerRef?.current) {

          scrollTimelineRef.current = tl;
          scrollTriggerRef.current = ScrollTrigger.create({
            trigger: triggerRef.current,
            // start: "45% bottom", // When middle of footer hits bottom of viewport
            // end: "top top", // When top of footer reaches top of viewport (footer completely out of view)
            start: triggerStart,
            end: triggerEnd,
            markers: showMarkers,
            animation: tl,
            toggleActions: "none none none none",
            onEnter: () => {
              closeOtherLogos(logoIdRef.current);
              tl.play();
              setIsAnimating(true);
            },
            onLeaveBack: () => {
              tl.reverse();
              setIsAnimating(false);

              if (reopenLogoKeyOnClose) {
                openLogoByKey(reopenLogoKeyOnClose, logoIdRef.current);
              }
            },
          });
        } else {
          // console.log("❌ LogoBH: triggerRef.current is null");
        }
      }
    }, 100);

    // Handle window resize
    const handleResize = () => {
      try {
        if (typeof window !== 'undefined' && ScrollTrigger) {
          ScrollTrigger.refresh();
        }
      } catch (error) {
        console.warn('LogoBH: ScrollTrigger refresh failed:', error);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }

    // Hover event handlers
    const handleMouseEnter = () => {
      playOpen();
    };

    const handleMouseLeave = () => {
      reverseClosed();
    };

    const myNameElement = myNameRef.current;
    const logoId = logoIdRef.current;

    // Add hover listeners to the logo element
    if (myNameElement) {
      myNameElement.addEventListener('mouseenter', handleMouseEnter);
      myNameElement.addEventListener('mouseleave', handleMouseLeave);
    }

    // Cleanup function
    return () => {
      clearTimeout(timer);
      
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
      
      if (myNameElement) {
        myNameElement.removeEventListener('mouseenter', handleMouseEnter);
        myNameElement.removeEventListener('mouseleave', handleMouseLeave);
      }

      openLogoTimelines.forEach((logo) => {
        if (logo.id === logoId) {
          openLogoTimelines.delete(logo);
        }
      });
      
      try {
        if (scrollTriggerRef.current) {
          scrollTriggerRef.current.kill();
          scrollTriggerRef.current = null;
        }
      } catch (error) {
        console.warn('LogoBH: ScrollTrigger cleanup failed:', error);
      }
    };
  }, [triggerRef, triggerStart, triggerEnd, autoAnimate, showMarkers, logoKey, reopenLogoKeyOnClose, playOpen, reverseClosed]);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation(); // Prevent parent TransitionLink from handling the event
    if (isAnimating) {
      reverseClosed();
    } else {
      playOpen();
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    e.stopPropagation(); // Prevent parent TransitionLink from handling the event
    if (isAnimating) {
      reverseClosed();
    } else {
      playOpen();
    }
  };

  return (
    <span 
      ref={myNameRef} 
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
      className={`text-2xl font-bold text-primary-600 dark:text-primary-400 font-display cursor-pointer ${className}`}
    >
      B<span className="inline-block opacity-70 w-0 overflow-hidden h-6">randon &nbsp;</span>H<span className="inline-block opacity-70 w-0 h-6 overflow-hidden">aun &nbsp;</span><span className="inline-block opacity-70 w-0 h-6 overflow-hidden"><sup>20</sup></span><sup className="opacity-90 w-0 h-6 overflow-hidden">26</sup>
    </span>
  );
}
