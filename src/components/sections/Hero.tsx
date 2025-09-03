'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface HeroProps {
  className?: string;
}

export default function Hero({ className = '' }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Create a timeline for coordinated animations
    const tl = gsap.timeline({ delay: 0.2 });

    // Background animation
    tl.fromTo(backgroundRef.current,
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' },
      0
    );

    // Title animation with text reveal effect
    tl.fromTo(titleRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' },
      0.3
    );

    // Subtitle animation
    tl.fromTo(subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      0.6
    );

    // CTA buttons staggered animation
    if (ctaRef.current?.children) {
      tl.fromTo(Array.from(ctaRef.current.children),
        { opacity: 0, y: 20, scale: 0.8 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.1,
          ease: 'back.out(1.4)' 
        },
        0.9
      );
    }

    // Add floating animation to background elements
    gsap.to(backgroundRef.current, {
      y: -20,
      duration: 6,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1
    });

    // Header slide-down effect when hero bottom reaches top of screen
    // Use a small delay to ensure header is fully rendered
    setTimeout(() => {
      // Try multiple methods to find the header
      let header = document.querySelector('header');
      if (!header) {
        header = document.querySelector('[data-header]'); // Fallback to data attribute
      }
      if (!header) {
        header = document.querySelector('.header'); // Fallback to class
      }
      
      console.log('Header element found:', header); // Debug log
      
      if (header) {
          // Check if header already has transforms and preserve them
          const currentTransform = window.getComputedStyle(header).transform;
          const hasTransform = currentTransform && currentTransform !== 'none';
          
          // Start with header hidden (moved up)
          gsap.set(header, { 
            y:'-100%',
            immediateRender: true,
            force3D: true,
            clearProps: hasTransform ? 'none' : 'transform' // Don't clear existing transforms
          });
          console.log('Header set to hidden position, current transform:', currentTransform); // Debug log
        
        // Create ScrollTrigger for header animation
        const headerTrigger = ScrollTrigger.create({
          trigger: titleRef.current, 
          start: 'bottom top', // When bottom of hero reaches top of viewport
          end: 'bottom top',   // End immediately when it starts
          markers: true,
          onEnter: () => {
            console.log('ScrollTrigger onEnter - sliding header down'); // Debug log
            // Slide header down into place
            gsap.to(header, {
              y: '0%',
              duration: 0.2,
              ease: 'power2.in',
              force3D: true
            });
          },
          onLeaveBack: () => {
            console.log('ScrollTrigger onLeaveBack - sliding header up'); // Debug log
            // Slide header back up when scrolling back to hero
            gsap.to(header, {
              y: '-100%',
              duration: 0.2,
              ease: 'power1.out',
              force3D: true
            });
          },
          onUpdate: (self) => {
            // Debug: log scroll progress
            if (self.progress > 0) {
              console.log('ScrollTrigger progress:', self.progress);
            }
          }
        });
        
        console.log('Header ScrollTrigger created:', headerTrigger); // Debug log
      } else {
        console.warn('Header element not found!'); // Debug warning
      }
    }, 100); // Small delay to ensure DOM is ready

    // Cleanup function
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className={`relative h-screen flex items-center pl-16 pb-32 pt-32 justify-start  overflow-hidden ${className}`}
    >
      {/* Animated Background */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 transition-all duration-700"
      >
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200/20 dark:bg-primary-800/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-accent-200/20 dark:bg-accent-800/20 rounded-full blur-lg animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-neutral-200/20 dark:bg-neutral-700/20 rounded-full blur-xl animate-pulse delay-500" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 text-left space-y-8 px-4 ">
        {/* Main Title */}
        <h1 
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-neutral-900 dark:text-neutral-100 leading-tight font-display"
        >
          {/* <span className="inline bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">
            Creative&nbsp;
          </span>
          <span className="inline text-neutral-800 dark:text-neutral-200">
            Developer
          </span> */}

            <span className="block text-3xl font-normal" >Hello, I&apos;m</span>
            {/* <span className="block font-semibold">Brandog the Magnificent</span> */}
            <span className="block font-semibold">Brandon Haun</span>
            <span className="block text-4xl font-normal">A Creator of Great &amp; Many</span>
        </h1>
            {/* <p className="block text-3xl font-normal">A Creator of Great &amp; Many Things</p> */}

        {/* Subtitle */}
        {/* <p 
          ref={subtitleRef}
          className="text-xl md:text-2xl lg:text-3xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed font-body"
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

        {/* Call to Action Buttons
        // <div 
        //   ref={ctaRef}
        //   className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        // >
        //   <button className="group relative overflow-hidden bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
        //     <span className="relative z-10">View Portfolio</span>
        //     <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        //   </button>
          
        //   <button className="group relative overflow-hidden bg-transparent border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
        //     <span className="relative z-10">Download Resume</span>
        //     <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        //   </button>
        // </div> */}

      </div>

      {/* Interactive Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>
    </section>
  );
}
