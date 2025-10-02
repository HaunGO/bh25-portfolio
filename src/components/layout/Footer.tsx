'use client';

import { useRef } from 'react';
import { PageContainer } from '../ui/Container';
import LogoBH from '../ui/LogoBH';

interface FooterProps {
  className?: string;
}


export default function Footer({ className = '' }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);

  return (
    <footer 
      ref={footerRef}
      className={`relative mt-12 md:mt-32 z-20 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 ${className}`}
    >
      <PageContainer className="relative flex flex-col justify-between pt-10 pb-4 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2">
              <LogoBH autoAnimate={false} triggerRef={footerRef} triggerStart="45% bottom" triggerEnd="top top" />
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg "> 
              Creative Engineer passionate in building 
              {/* Me do good for happy people .. .. <em><strong>Yaaaay !!</strong></em> */}
            </p>
          </div>

          {/* Social Links */}
          {/* 
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 font-display"></h3>

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
          */}


        </div>

        {/* Bottom Section */}
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 cursor-default ">
          <div className="text-center flex flex-col-reverse items-center md:flex-row md:justify-between">

            <blockquote 
              className="relative group text-purple-800 dark:text-purple-400 text-md "
              cite="https://www.law.cornell.edu/ucc/1/1-308"
            >
              <span className="opacity-60">All Rights Reserved. Without Prejudice.</span>
              <span 
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-purple-600 dark:bg-purple-400 text-neutral-100 dark:text-neutral-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 "
                role="tooltip"
                aria-hidden="true"
              >
                UCC 1-308
              </span>
            </blockquote>



            
            <blockquote 
              className="text-yellow-600 relative group md:pt-0 text-lg font-['Schoolbell']"
              cite="https://www.biblegateway.com/passage/?search=Psalm+118%3A24&version=KJV"
            >
              <span className="opacity-80">This is the day which the LORD hath made; we will rejoice and be glad in it.</span>
              <span 
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-yellow-600 dark:bg-yellow-600 text-neutral-100 dark:text-neutral-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 "
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
