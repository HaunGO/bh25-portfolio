'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { TransitionLink } from '../transitions/TransitionLink';
import { PageContainer } from '../ui/Container';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface FooterProps {
  className?: string;
}

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/yourusername',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/yourusername',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'Email',
    href: 'mailto:hello@brandonhaun.com',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const myNameRef = useRef<HTMLSpanElement>(null);


  // DO NOT DELETE THIS COMMENTED OUT CODE. I WANT TO KEEP IT FOR LATER.
  // useEffect(() => {
  //   // Register ScrollTrigger plugin
  //   gsap.registerPlugin(ScrollTrigger);

  //   if (myNameRef.current) {
  //     const spans = myNameRef.current.querySelectorAll('span');
  //     console.log(`Found ${spans.length} spans in #myName`);
      
  //     // Create a timeline for sequential animation
  //     const tl = gsap.timeline();
      
  //     // Set initial state for all spans
  //     spans.forEach(span => {
  //       gsap.set(span, { width: 0, overflow: 'hidden' });
  //     });
  //   }


  //   // Add a small delay to ensure the footer is rendered
  //   const timer = setTimeout(() => {
  //     if (footerRef.current) {
  //       console.log("Setting up ScrollTrigger for footer");
        
  //       // Create timeline outside of ScrollTrigger for reuse
  //       let tl: gsap.core.Timeline | null = null;
        
  //       if (myNameRef.current) {
  //         const spans = myNameRef.current.querySelectorAll('span');
  //         console.log(`Found ${spans.length} spans in #myName`);
          
  //         // Create timeline for sequential animation
  //         tl = gsap.timeline({ paused: true });
          
  //         // Animate each span sequentially
  //         spans.forEach((span, index) => {
  //           // Calculate the natural width by temporarily setting to auto
  //           const tempWidth = span.style.width;
  //           span.style.width = 'auto';
  //           const autoWidth = span.offsetWidth;
  //           span.style.width = tempWidth;
            
  //           tl!.to(span, {
  //             width: autoWidth,
  //             duration: 0.3,
  //             ease: "power2.inOut",
  //           }, index * 0.1); // Stagger each span by 0.1s
  //         });
  //       }

  //       // Create ScrollTrigger that controls the timeline
  //       if (tl) {
  //         const trigger = ScrollTrigger.create({
  //           trigger: footerRef.current,
  //           start: "top bottom-=250px",
  //           end: "bottom bottom",
  //           markers: true,
  //           animation: tl,
  //           toggleActions: "play none play reverse", // play on enter, reverse on leave, play on enter back, reverse on leave back
  //           // onEnter: () => console.log("🎯 Footer entered - playing timeline"),
  //           // onLeave: () => console.log("📤 Footer left - reversing timeline"),
  //           // onEnterBack: () => console.log("📥 Footer back - playing timeline"),
  //           // onLeaveBack: () => console.log("📤 Footer left back - reversing timeline")
  //         });
          
  //         // console.log("ScrollTrigger created:", trigger);
  //       } else {
  //         // console.log("❌ Timeline is null, cannot create ScrollTrigger");
  //       }
  //     } else {
  //       // console.log("Footer ref is null");
  //     }
  //   }, 100);

  //   // Cleanup function
  //   return () => {
  //     clearTimeout(timer);
  //     ScrollTrigger.getAll().forEach(trigger => {
  //       if (trigger.trigger === footerRef.current) {
  //         trigger.kill();
  //       }
  //     });
  //   };
  // }, []);
// h-[95vh]
  return (
    <footer 
      ref={footerRef}
      className={`relative mt-12 z-20 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 ${className}`}
    >
      <PageContainer className="relative flex flex-col justify-between pt-10 pb-4 bg-neutral-50 dark:bg-neutral-900 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2">
              <span ref={myNameRef} className="text-2xl font-bold text-primary-600 dark:text-primary-400 font-display">
                B<span className="inline-block opacity-70 w-0 overflow-hidden h-6">randon &nbsp;</span>H<span className="inline-block opacity-70 w-0 h-6 overflow-hidden">aun &nbsp;</span><span className="inline-block opacity-70 w-0 h-6 overflow-hidden"><sup>20</sup></span><sup className="opacity-90 w-0 h-6 overflow-hidden">25</sup>
              </span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg "> 
              {/* Senior Frontend Engineer &amp; Creative Developer passionate about building beautiful, interactive experiences 
              that combine artistic vision with technical excellence. */}
              Me do good for happy people .. .. <em><strong>Yaaaay !!</strong></em>
            </p>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 font-display">                {/* Links to other pages */}
            </h3>

            <nav>
              <ul className="flex flex-row justify-between flex-wrap items-center gap-4 list-none m-0 p-0">
                <li>
                  <TransitionLink href="/portfolio">Portfolio</TransitionLink>
                </li>
                <li>
                  <TransitionLink href="/resume">Resume</TransitionLink>
                </li>
                <li>LinkedIn</li>
                <li>GitHub</li>
                <li>Contact</li>
              </ul>
            </nav>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 cursor-default ">
          <div className="text-center flex flex-col items-center md:flex-row md:justify-between">
            <p className="text-purple-800 dark:text-purple-400 text-sm">
              Brandon-Davis: Haun <sup className="opacity-50">{currentYear}</sup> ALL RIGHTS RESERVED
            </p>



            
            <blockquote 
              className="text-yellow-600 relative group pt-4 md:pt-0 font-['Schoolbell']"
              cite="https://www.biblegateway.com/passage/?search=Psalm+118%3A24&version=KJV"
            >
              This is the day which the LORD hath made; we will rejoice and be glad in it.
              <span 
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-yellow-600 dark:bg-yellow-600 text-neutral-100 dark:text-neutral-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 "
                role="tooltip"
                aria-hidden="true"
              >
                Psalm 118:24
              </span>
            </blockquote>
            
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
