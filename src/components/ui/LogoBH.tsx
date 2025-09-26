'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface LogoBHProps {
  className?: string;
  autoAnimate?: boolean;
  triggerRef?: React.RefObject<HTMLElement | null>;
  triggerStart?: string;
  triggerEnd?: string;
  showMarkers?: boolean;
}

export default function LogoBH({ 
  className = '',
  autoAnimate,
  triggerRef,
  triggerStart,
  triggerEnd,
  showMarkers = false
}: LogoBHProps) {
  const myNameRef = useRef<HTMLSpanElement>(null);
  const hoverTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

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

        // If autoAnimate is true, play immediately
        if (autoAnimate) {
          tl.play();
        } else if (triggerRef?.current) {

          const trigger = ScrollTrigger.create({
            trigger: triggerRef.current,
            // start: "45% bottom", // When middle of footer hits bottom of viewport
            // end: "top top", // When top of footer reaches top of viewport (footer completely out of view)
            start: triggerStart,
            end: triggerEnd,
            markers: showMarkers,
            animation: tl,
            toggleActions: "play none none reverse"
          });
          
          // console.log("ScrollTrigger created:", trigger);
        } else {
          // console.log("❌ LogoBH: triggerRef.current is null");
        }
      }
    }, 100);

    // Handle window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    // Hover event handlers
    const handleMouseEnter = () => {
      if (hoverTimelineRef.current) {
        hoverTimelineRef.current.play();
      }
    };

    const handleMouseLeave = () => {
      if (hoverTimelineRef.current) {
        hoverTimelineRef.current.reverse();
      }
    };

    // Add hover listeners to the logo element
    if (myNameRef.current) {
      myNameRef.current.addEventListener('mouseenter', handleMouseEnter);
      myNameRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    // Cleanup function
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      
      // Remove hover listeners
      if (myNameRef.current) {
        myNameRef.current.removeEventListener('mouseenter', handleMouseEnter);
        myNameRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
      
      ScrollTrigger.getAll().forEach(trigger => {
        if (triggerRef?.current && trigger.trigger === triggerRef.current) {
          trigger.kill();
        }
      });
    };
  }, [triggerRef, triggerStart, triggerEnd, autoAnimate]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent TransitionLink from handling the event
    if (hoverTimelineRef.current) {
      if (isAnimating) {
        hoverTimelineRef.current.reverse();
      } else {
        hoverTimelineRef.current.play();
      }
      setIsAnimating(!isAnimating);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    e.stopPropagation(); // Prevent parent TransitionLink from handling the event
    if (hoverTimelineRef.current) {
      if (isAnimating) {
        hoverTimelineRef.current.reverse();
      } else {
        hoverTimelineRef.current.play();
      }
      setIsAnimating(!isAnimating);
    }
  };

  return (
    <span 
      ref={myNameRef} 
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
      className={`text-2xl font-bold text-primary-600 dark:text-primary-400 font-display cursor-pointer ${className}`}
    >
      B<span className="inline-block opacity-70 w-0 overflow-hidden h-6">randon &nbsp;</span>H<span className="inline-block opacity-70 w-0 h-6 overflow-hidden">aun &nbsp;</span><span className="inline-block opacity-70 w-0 h-6 overflow-hidden"><sup>20</sup></span><sup className="opacity-90 w-0 h-6 overflow-hidden">25</sup>
    </span>
  );
}
