'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface HeroProps {
  className?: string;
  delay?: number;
  shouldAnimate?: boolean;
}

export default function Hero({ className = '', delay = 0.2, shouldAnimate = true }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const greetingRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  // const ctaRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  
  // Preloader refs
  const preloaderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  
  // State for preloader
  const [showPreloader, setShowPreloader] = useState(true);
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  useEffect(() => {
    // Check if this is the first visit in this session
    // const hasVisited = sessionStorage.getItem('hasVisited');
    
    // if (hasVisited) {
    //   // Return visit in this session - skip preloader immediately
    //   setShowPreloader(false);
    //   setPreloaderComplete(true);
    //   return;
    // }

    // if (!heroRef.current || !shouldAnimate) return;




    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Create master timeline that includes both preloader and hero
    const masterTimeline = gsap.timeline();

    // PRELOADER PHASE (0-2 seconds)
    if (preloaderRef.current && barRef.current) {
      // Phase 1: Fade in preloader (0.2s)
      masterTimeline.set(preloaderRef.current, { opacity: 0 })
        .to(preloaderRef.current, {
          opacity: 1,
          duration: 0.2,
          ease: 'power2.out'
        });

      // Phase 2: Loading bar animation (1.2s from 0 to 100%)
      masterTimeline.to(barRef.current, {
        scaleX: 1,
        duration: 1.2, // THIS WILL SOMEHOW EVENTUALLY RELECT ACTUAL PRELOADING OF THE SITE. PROBABLY SOME LARGE 3D LIBRARY FILES AND FUNCTIONALITY
        ease: 'power2.inOut'
      }, '-=0.1');

      // Phase 3: Fade out preloader (0.6s)
      masterTimeline.to(preloaderRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in',
        onComplete: () => {
          setPreloaderComplete(true);
          setShowPreloader(false);
          sessionStorage.setItem('hasVisited', 'true');
        }
      }, '-=0.1');
    }

    // HERO PHASE (starts after preloader)
    // Background animation
    masterTimeline.fromTo(backgroundRef.current,
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' },
      '-=0.3' // Start slightly before preloader ends
    );

    // Title animation with text reveal effect
    // masterTimeline.fromTo(titleRef.current,
    //   { opacity: 0, y: 50, scale: 0.9 },
    //   { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' },
    //   '-=1.2' // Start after background begins
    // );

    // Greeting text animation
    masterTimeline.fromTo(greetingRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.3' // Start after title begins
    );

    // Subtitle animation
    masterTimeline.fromTo(nameRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.3' // Start after title begins
    );

    // Subtitle animation
    masterTimeline.fromTo(subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.3' // Start after title begins
    );




    // // Add floating animation to background elements (continuous)
    // masterTimeline.to(backgroundRef.current, {
    //   y: -20,
    //   duration: 6,
    //   ease: 'power1.inOut',
    //   yoyo: true,
    //   repeat: -1
    // }, '-=0.5'); // Start floating after main animations

    // Cleanup function
    return () => {
      masterTimeline.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [shouldAnimate, delay]);





  return (
    <>
      {/* Preloader - integrated into Hero component */}
      {showPreloader && !preloaderComplete && (
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
      )}

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className={`relative h-screen flex items-center pl-16 pb-32 pt-32 justify-start overflow-hidden ${className}`}
        style={{ 
          opacity: preloaderComplete ? 1 : 0,
          visibility: preloaderComplete ? 'visible' : 'hidden'
        }}
      >
        {/* Animated Background */}
        <div 
          ref={backgroundRef}
          className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 transition-all duration-700 opacity-0"
        >
          {/* Floating geometric shapes */}
          {/* <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200/20 dark:bg-primary-800/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-40 right-32 w-24 h-24 bg-accent-200/20 dark:bg-accent-800/20 rounded-full blur-lg animate-pulse delay-1000" />
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-neutral-200/20 dark:bg-neutral-700/20 rounded-full blur-xl animate-pulse delay-500" /> */}
        </div>

        {/* Content Container */}
        <div className="relative z-10 text-left space-y-8 px-4 ">
          {/* Main Title */}
          <h1 
            ref={textRef}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-neutral-900 dark:text-neutral-100 leading-tight font-display "
          >
            <span ref={greetingRef} className="block text-4xl font-normal relative left-16 top-4" >Hello, I&apos;m</span>
            <span ref={nameRef} className="block font-semibold">Brandon</span>
            <span ref={subtitleRef} className="block text-5xl font-normal relative -top-2">A Creator of Sorts</span>
          </h1>

          {/* Subtitle */}
          {/* <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl lg:text-3xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed font-body opacity-0"
          >
            Building beautiful, interactive experiences that combine{' '}
            <span className="text-primary-600 dark:text-primary-400 font-semibold">
              technical excellence
            </span>{' '}
            with{' '}
            <span className="text-accent-600 dark:text-accent-400 font-semibold">
              artistic vision
            </span>
          </p> */}

          {/* Call to Action Buttons */}
          {/* <div 
            ref={ctaRef}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="group relative overflow-hidden bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              <span className="relative z-10">View Portfolio</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            
            <button className="group relative overflow-hidden bg-transparent border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
              <span className="relative z-10">Download Resume</span>
              <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div> */}
        </div>

        {/* Interactive Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10 dark:opacity-1">
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 10px 10px, currentColor 1px, transparent 0)`,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0'
            }} />
          </div>
        </div>
      </section>
    </>
  );
}