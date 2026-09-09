'use client';

import { useEffect, useRef, useState, memo, useCallback, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, themeRestInk } from '@/lib/motion';
import { rainbowLetterHandlers } from '@/lib/rainbow-pointer';
import { PageContainer } from '../ui/Container';
import SimplePreloader from '../ui/SimplePreloader';

interface HeroProps {
  className?: string;
  delay?: number;
  shouldAnimate?: boolean;
}

const heroTitle = {
  greeting: ['Hello,', "I'm"],
  name: ['Brandon'],
  subtitle: ['A', 'Creator', 'of', 'Great', '&', 'Many'],
};
const getHeroTextColor = () => themeRestInk('display');
const getHeroLineColor = () => themeRestInk('line');

const Hero = memo(function Hero({ className = '', delay = 0.2, shouldAnimate = true }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const greetingRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
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

  const characterHandlers = rainbowLetterHandlers(getHeroTextColor);
  const lineHandlers = rainbowLetterHandlers(getHeroLineColor, 'backgroundColor');

  const renderHighlightedWord = useCallback((word: string) => (
    <span
      key={word}
      aria-label={word}
      className="inline-block"
    >
      {Array.from(word).map((character, index) => (
        <span
          key={`${word}-${character}-${index}`}
          aria-hidden="true"
          className="inline-block"
          {...characterHandlers}
        >
          {character}
        </span>
      ))}
    </span>
  ), [characterHandlers]);

  const renderHighlightedWords = useCallback((words: string[]) => (
    words.map((word) => renderHighlightedWord(word)).reduce((acc, word, index) => (
      index === 0 ? [word] : [...acc, ' ', word]
    ), [] as ReactNode[])
  ), [renderHighlightedWord]);

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
        className={`relative flex items-center justify-start overflow-hidden py-32 sm:py-40 lg:py-52 min-h-[100svh] lg:min-h-dvh ${className}`}
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
              
              <div className="relative origin-left md:origin-center lg:scale-125">
                <h1 data-hero-section-title ref={textRef} className="
                    font-black text-neutral-900 dark:text-neutral-100 font-display
                    leading-tight text-[clamp(2.75rem,14vw,6rem)] md:text-8xl whitespace-normal md:whitespace-nowrap "
                >
                  <span ref={greetingRef} className="relative z-20 block text-[clamp(1.25rem,5vw,2.25rem)] md:text-4xl font-normal left-4 sm:left-10 md:left-16 top-4 md:top-6 "  >
                    {renderHighlightedWords(heroTitle.greeting)}
                  </span>
                  <span ref={nameRef} className="inline-block font-semibold">
                    {renderHighlightedWords(heroTitle.name)}
                    <span
                      id="theLine"
                      aria-hidden="true"
                      className="relative -top-2 md:-top-5 block h-1 w-full bg-black dark:bg-white"
                      {...lineHandlers}
                    ></span>
                  </span>
                  <span ref={subtitleRef} className="block text-[clamp(1.25rem,5vw,2.25rem)] md:text-4xl font-normal relative -top-2 ">
                    {renderHighlightedWords(heroTitle.subtitle)}
                  </span>
                </h1>
              </div>


 
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