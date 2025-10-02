'use client';

import { useEffect, useRef, useState, memo, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageContainer } from '../ui/Container';
import SimplePreloader from '../ui/SimplePreloader';

interface HeroProps {
  className?: string;
  delay?: number;
  shouldAnimate?: boolean;
}

const Hero = memo(function Hero({ className = '', delay = 0.2, shouldAnimate = true }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const greetingRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  
  // State for preloader - temporarily set to true to bypass
  const [preloaderComplete, setPreloaderComplete] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle preloader completion
  const handlePreloaderComplete = useCallback(() => {
    setPreloaderComplete(true);
  }, []);

  useEffect(() => {
    if (!heroRef.current || !shouldAnimate || !preloaderComplete) return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Create hero animation timeline
    const heroTimeline = gsap.timeline();

    // Background animation
    heroTimeline.fromTo(backgroundRef.current,
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
    );

    // Greeting text animation
    heroTimeline.fromTo(greetingRef.current,
      { opacity: 0, x: -10 },
      { opacity: 1, x: 0, duration: 1, ease: 'power2.out' },
      '-=0.3'
    );

    // Name animation
    heroTimeline.fromTo(nameRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.3'
    );

    // Subtitle animation
    heroTimeline.fromTo(subtitleRef.current,
      { opacity: 0, y: -5 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    );

    // Cleanup function
    return () => {
      heroTimeline.kill();
    };
  }, [shouldAnimate, delay, preloaderComplete]);





  return (
    <>
      {/* Temporarily disabled preloader for debugging */}
      {false && (
        <SimplePreloader 
          onComplete={handlePreloaderComplete}
          duration={2000}
        />
      )}

      <section 
        ref={heroRef}
        data-hero-section
        className={`relative flex items-center justify-start overflow-hidden py-52 h-auto lg:h-screen ${className}`}
        style={{ 
          opacity: (isClient && preloaderComplete) ? 1 : 0,
          visibility: (isClient && preloaderComplete) ? 'visible' : 'hidden'
        }}
      >
        
        {/* <div className="relative inset-0 py-24 md:py-32 border border-red-500"> */}

        <div 
          ref={backgroundRef}
          className="fixed inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 transition-all duration-700 opacity-0"
        >
        </div>
          
          <PageContainer className="">
            <div className="relative z-10 text-left ">  
              
              <div className="relative scale-75 md:scale-100 lg:scale-125 origin-center">
                <h1 data-hero-section-title ref={textRef} className="
                    font-black text-neutral-900 dark:text-neutral-100 font-display whitespace-nowrap
                    leading-tight text-8xl "
                >
                  <span ref={greetingRef} className="block text-4xl font-normal relative left-16 top-8 "  >
                    Hello, I&apos;m
                  </span>
                  <span ref={nameRef} className="inline-block font-semibold">
                    {/* <HoverLetters  text="Brandon" className="inline-block" /> */}
                    Brandon
                    <span id="theLine" className="relative -top-4 block h-1 w-full bg-black dark:bg-white"></span>
                  </span>
                  <span ref={subtitleRef} className="block text-5xl font-normal relative -top-2 ">
                    A Creator of Sorts
                  </span>
                </h1>
              </div>


              {/* Subtitle */}
              {/* <p 
                ref={subtitleRef}
                className="text-xl md:text-2xl lg:text-3xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed font-body opacity-0"
              >
                Building beautiful, interactive experiences that combine{' '}
                <span className="text-primary-600 dark:text-primary-400 font-semibold">
                artistic vision
                </span>{' '}
                with{' '}
                <span className="text-accent-600 dark:text-accent-400 font-semibold">
                technical excellence
                </span>
              </p> */}

              {/* Call to Action Buttons */}
              {/* <div 
                ref={ctaRef}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <button 
                  className="group relative overflow-hidden bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl "
                >
                  <span className="relative z-10">View Portfolio</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                
                <button 
                  className="group relative overflow-hidden bg-transparent border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <span className="relative z-10">Download Resume</span>
                  <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div> */}
            </div>
          </PageContainer>



        {/* Interactive Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid pattern */}
          {/* <div className="absolute inset-0 opacity-10 dark:opacity-1 ">
            <div className="w-full h-full fixed" style={{
              backgroundImage: `radial-gradient(circle at 10px 10px, currentColor 1px, transparent 0)`,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0'
              }} />
              </div> */}

          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="fixed inset-0  ">
            <defs>
              <pattern id="dotGrid"
                      x="0" y="0"
                      width="15" height="15"
                      patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" className="fill-neutral-300 dark:fill-neutral-700" >
                  {/* <animate attributeName="r"
                          values="1;3;1"
                          dur="2s"
                          repeatCount="indefinite" /> */}
                </circle>
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#dotGrid)" />
          </svg>


        </div>  
        {/* </div> */}
      </section>
    </>
  );
});

export default Hero;