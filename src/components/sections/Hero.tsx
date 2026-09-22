'use client';

import { useEffect, useRef, useState, memo, useCallback, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { themeRestInk } from '@/lib/motion';
import { rainbowLetterHandlers } from '@/lib/rainbow-pointer';
import { ContentContainer } from '../ui/Container';
import SimplePreloader from '../ui/SimplePreloader';
import TaglineReveal from './TaglineReveal';
import { TransitionLink } from '../transitions/TransitionLink';

interface HeroProps {
  className?: string;
  delay?: number;
  shouldAnimate?: boolean;
}

const heroTitle = {
  greeting: ['Hello,', "I'm"],
  name: ['Brandon'],
};
const getHeroTextColor = () => themeRestInk('display');
const getHeroLineColor = () => themeRestInk('line');

const Hero = memo(function Hero({ className = '', delay = 0.2, shouldAnimate = true }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const greetingRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const resumeLinkRef = useRef<HTMLDivElement>(null);
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

    heroTimeline.fromTo(resumeLinkRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.2'
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
        className={`relative flex min-h-[100svh] w-full flex-col overflow-hidden ${className}`}
        style={{ 
          opacity: (isClient && preloaderComplete) ? 1 : 0,
          visibility: (isClient && preloaderComplete) ? 'visible' : 'hidden'
        }}
      >
        
        {/* <div className="relative inset-0 py-24 md:py-32 border border-red-500"> */}

        <div 
          ref={backgroundRef}
          className="fixed inset-0 z-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 transition-all duration-700 opacity-0"
        >
        </div>
          
          <ContentContainer className="relative z-10 flex min-h-[100svh] w-full flex-col pt-12 lg:pt-14">
            <div className="flex w-full flex-1 items-center text-left">
              <h1
                data-hero-section-title
                ref={textRef}
                className="w-full font-display font-black leading-tight text-left text-neutral-900 dark:text-neutral-100 text-[clamp(3.25rem,18vw,8rem)] md:text-9xl"
              >
                <span
                  ref={greetingRef}
                  className="relative z-20 block text-[clamp(1.5rem,6vw,3rem)] font-normal left-8 top-4 sm:left-10 md:left-28 md:top-6 md:text-5xl"
                >
                  {renderHighlightedWords(heroTitle.greeting)}
                </span>
                <span ref={nameRef} className="inline-block font-semibold whitespace-nowrap">
                  {renderHighlightedWords(heroTitle.name)}
                  <span
                    id="theLine"
                    aria-hidden="true"
                    className="relative -top-5 block h-2 w-full bg-black dark:bg-white md:-top-7"
                    {...lineHandlers}
                  />
                </span>
                <span className="relative -top-2 block w-full text-left text-[clamp(1.5rem,6vw,3rem)] font-normal md:text-5xl">
                  <TaglineReveal
                    characterHandlers={characterHandlers}
                    active={isClient && preloaderComplete}
                  />
                </span>
              </h1>
            </div>

            <div
              ref={resumeLinkRef}
              className="relative z-10 shrink-0 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4"
            >
              <TransitionLink
                href="/resume"
                data-cursor-hit="active"
                className="inline-flex min-h-11 items-center font-display text-3xl font-semibold text-neutral-900 dark:text-neutral-100 md:text-5xl"
              >
                Resume
              </TransitionLink>
            </div>
          </ContentContainer>
        {/* </div> */}
      </section>
    </>
  );
});

export default Hero;