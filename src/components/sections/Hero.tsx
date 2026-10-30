'use client';

import { useEffect, useLayoutEffect, useRef, useState, memo, useCallback, type MouseEvent, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageContainer } from '../ui/Container';
import SimplePreloader from '../ui/SimplePreloader';
import { taglines as heroCatchphrases } from '@/data/taglines';

// Tagline display and cycle. Change these; the hero reads them below.
const TAGLINE_HOLD_SECONDS = 5; // how long each line stays fully visible before the fade
const TAGLINE_CROSSFADE_SECONDS = 0.4; // fade-out and fade-in, overlapping
const TAGLINE_CROSSFADE_EASE = 'power1.inOut'; // GSAP ease for that crossfade
const TAGLINE_FONT_CLASS = 'font-display'; // same face as the name line (Bitter)
const TAGLINE_SIZE_CLASS = 'text-5xl'; // type size
const TAGLINE_WEIGHT_CLASS = 'font-normal'; // type weight
const TAGLINE_LEADING_CLASS = 'leading-tight'; // line height
const TAGLINE_GAP_CLASS = '-mt-2'; // space from the name line; negative moves it closer
const TAGLINE_COLOR_CLASS = 'text-neutral-900 dark:text-neutral-100'; // light and dark text color

interface HeroProps {
  className?: string;
  delay?: number;
  shouldAnimate?: boolean;
}

const heroTitle = {
  greeting: ['Hello,', "I'm"],
  name: ['Brandon'],
  subtitle: ['A', 'Creator', 'of', 'Sorts'],
};
const rainbowColors = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#4f46e5', // indigo
  '#8b5cf6', // violet
];

const getHeroTextColor = () => (
  document.documentElement.classList.contains('dark') ? '#f5f5f5' : '#171717'
);

const getHeroLineColor = () => (
  document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
);

const getRandomRainbowColor = () => (
  rainbowColors[Math.floor(Math.random() * rainbowColors.length)]
);

const Hero = memo(function Hero({ className = '', delay = 0.2, shouldAnimate = true }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const greetingRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const taglineOutRef = useRef<HTMLSpanElement>(null);
  const taglineInRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  
  // State for preloader - temporarily set to true to bypass
  const [preloaderComplete, setPreloaderComplete] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle preloader completion
  const handlePreloaderComplete = useCallback(() => {
    setPreloaderComplete(true);
  }, []);

  const handleCharacterEnter = useCallback((event: MouseEvent<HTMLSpanElement>) => {
    const target = event.currentTarget;

    gsap.killTweensOf(target);
    gsap.set(target, {
      color: getRandomRainbowColor(),
      duration: 0,
      // ease: 'power3.out',
    });
  }, []);

  const handleCharacterLeave = useCallback((event: MouseEvent<HTMLSpanElement>) => {
    const target = event.currentTarget;

    gsap.killTweensOf(target);
    gsap.to(target, {
      color: getHeroTextColor(),
      duration: 30,
      ease: 'power3.out',
      onComplete: () => {
        gsap.set(target, { clearProps: 'color' });
      },
    });
  }, []);

  const handleLineEnter = useCallback((event: MouseEvent<HTMLSpanElement>) => {
    const target = event.currentTarget;

    gsap.killTweensOf(target);
    gsap.to(target, {
      backgroundColor: getRandomRainbowColor(),
      duration: 0,
      ease: 'power3.out',
    });
  }, []);

  const handleLineLeave = useCallback((event: MouseEvent<HTMLSpanElement>) => {
    const target = event.currentTarget;

    gsap.killTweensOf(target);
    gsap.to(target, {
      backgroundColor: getHeroLineColor(),
      duration: 30,
      ease: 'power3.out',
      onComplete: () => {
        gsap.set(target, { clearProps: 'backgroundColor' });
      },
    });
  }, []);

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
          onMouseEnter={handleCharacterEnter}
          onMouseLeave={handleCharacterLeave}
        >
          {character}
        </span>
      ))}
    </span>
  ), [handleCharacterEnter, handleCharacterLeave]);

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
      { opacity: 0.35, scale: 1, duration: 1, ease: 'power2.out' }
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

  useLayoutEffect(() => {
    if (taglineOutRef.current) gsap.set(taglineOutRef.current, { opacity: 1 });
    if (taglineInRef.current) gsap.set(taglineInRef.current, { opacity: 0 });
  }, [taglineIndex]);

  useEffect(() => {
    const outgoing = taglineOutRef.current;
    const incoming = taglineInRef.current;
    if (!outgoing || !incoming || !preloaderComplete) return;

    const timeline = gsap.timeline();
    timeline.to(outgoing, { opacity: 0, duration: TAGLINE_CROSSFADE_SECONDS, ease: TAGLINE_CROSSFADE_EASE }, TAGLINE_HOLD_SECONDS);
    timeline.to(incoming, { opacity: 1, duration: TAGLINE_CROSSFADE_SECONDS, ease: TAGLINE_CROSSFADE_EASE }, TAGLINE_HOLD_SECONDS);
    timeline.call(() => {
      setTaglineIndex((current) => (current + 1) % heroCatchphrases.length);
    });

    return () => {
      timeline.kill();
    };
  }, [preloaderComplete, taglineIndex]);





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
        className={`relative flex cursor-none items-center justify-start overflow-x-hidden py-52 h-auto lg:min-h-screen ${className}`}
        style={{ 
          opacity: (isClient && preloaderComplete) ? 1 : 0,
          visibility: (isClient && preloaderComplete) ? 'visible' : 'hidden'
        }}
      >
        
        {/* <div className="relative inset-0 py-24 md:py-32 border border-red-500"> */}

        <div 
          ref={backgroundRef}
          className="fixed inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 transition-all duration-700 opacity-0 pointer-events-none"
        >
        </div>
          
          <PageContainer className="w-full">
            <div className="relative z-10 pl-4 text-left sm:pl-6">
              
              <div className="relative origin-left scale-75 md:scale-100 lg:scale-125">
                <h1 data-hero-section-title ref={textRef} className="
                    font-black text-neutral-900 dark:text-neutral-100 font-display whitespace-nowrap
                    leading-tight text-8xl "
                >
                  <span ref={greetingRef} className="relative z-20 block text-4xl font-normal left-16 top-8 "  >
                    {renderHighlightedWords(heroTitle.greeting)}
                  </span>
                  <span ref={nameRef} className="inline-block font-semibold">
                    {/* <HoverLetters  text="Brandon" className="inline-block" /> */}
                    {renderHighlightedWords(heroTitle.name)}
                    <span
                      id="theLine"
                      aria-hidden="true"
                      className="relative -top-4 block h-1 w-full bg-black dark:bg-white"
                      onMouseEnter={handleLineEnter}
                      onMouseLeave={handleLineLeave}
                    ></span>
                  </span>
                </h1>
                <span ref={subtitleRef} className={`relative ${TAGLINE_GAP_CLASS} block ${TAGLINE_FONT_CLASS} ${TAGLINE_SIZE_CLASS} ${TAGLINE_WEIGHT_CLASS} ${TAGLINE_LEADING_CLASS}`}>
                  <span ref={taglineOutRef} className={`block ${TAGLINE_COLOR_CLASS}`}>
                    {renderHighlightedWords(heroCatchphrases[taglineIndex].split(' '))}
                  </span>
                  <span
                    ref={taglineInRef}
                    className={`absolute left-0 top-0 block opacity-0 ${TAGLINE_COLOR_CLASS}`}
                  >
                    {renderHighlightedWords(heroCatchphrases[(taglineIndex + 1) % heroCatchphrases.length].split(' '))}
                  </span>
                </span>
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

          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="fixed inset-0 opacity-20 dark:opacity-20">
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