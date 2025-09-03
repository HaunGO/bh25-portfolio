import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Performance optimization: reduce motion for users who prefer it
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Common animation presets
export const animations = {
  // Fade in animations
  fadeIn: (element: string | Element, duration = 0.6, delay = 0) => {
    if (prefersReducedMotion) return;
    
    return gsap.fromTo(element, 
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration, 
        delay,
        ease: 'power2.out'
      }
    );
  },

  // Slide up animations
  slideUp: (element: string | Element, duration = 0.8, delay = 0) => {
    if (prefersReducedMotion) return;
    
    return gsap.fromTo(element,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: 'power3.out'
      }
    );
  },

  // Scale in animations
  scaleIn: (element: string | Element, duration = 0.5, delay = 0) => {
    if (prefersReducedMotion) return;
    
    return gsap.fromTo(element,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration,
        delay,
        ease: 'back.out(1.7)'
      }
    );
  },

  // Stagger animations for multiple elements
  stagger: (elements: string | Element[], duration = 0.3, stagger = 0.1) => {
    if (prefersReducedMotion) return;
    
    return gsap.fromTo(elements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        ease: 'power2.out'
      }
    );
  },

  // Text reveal animations
  textReveal: (element: string | Element, duration = 1, delay = 0) => {
    if (prefersReducedMotion) return;
    
    return gsap.fromTo(element,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: 'power2.out'
      }
    );
  },

  // Parallax effect
  parallax: (element: string | Element, speed = 0.5) => {
    if (prefersReducedMotion) return;
    
    return gsap.to(element, {
      yPercent: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }
};

// ScrollTrigger defaults
ScrollTrigger.defaults({
  scroller: 'body',
  markers: process.env.NODE_ENV === 'development'
});

// Performance optimization: batch DOM updates
gsap.set('.gsap-batch', { clearProps: 'all' });

export default gsap;
