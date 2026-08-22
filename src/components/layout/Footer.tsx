'use client';

import { Fragment, useCallback, useRef, type MouseEvent } from 'react';
import gsap from 'gsap';
import { ExternalLink, Mail } from 'lucide-react';
import { PageContainer } from '../ui/Container';
import LogoBH from '../ui/LogoBH';
import { resumeData } from '@/data/resume';

interface FooterProps {
  className?: string;
}

const footerTaglineItems = [
  '• A Creator of Great and Many',
  '• Frontend UX & Design System Engineer',
  '• Creative Developer',
  '• Electro-Magnetic Tinkerer',
  '• Bushcraft Master',
  '• Proper Goofball',
  '• Natural American',
];

const rainbowColors = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#4f46e5',
  '#8b5cf6',
];

const getFooterTextColor = () => (
  document.documentElement.classList.contains('dark') ? '#a3a3a3' : '#525252'
);

const getRandomRainbowColor = () => (
  rainbowColors[Math.floor(Math.random() * rainbowColors.length)]
);

export default function Footer({ className = '' }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);

  const handleTaglineItemEnter = useCallback((event: MouseEvent<HTMLSpanElement>) => {
    const target = event.currentTarget;

    gsap.killTweensOf(target);
    gsap.to(target, {
      color: getRandomRainbowColor(),
      duration: 0,
      ease: 'power3.out',
    });
  }, []);

  const handleTaglineItemLeave = useCallback((event: MouseEvent<HTMLSpanElement>) => {
    const target = event.currentTarget;

    gsap.killTweensOf(target);
    gsap.to(target, {
      color: getFooterTextColor(),
      duration: 30,
      ease: 'power3.out',
      onComplete: () => {
        gsap.set(target, { clearProps: 'color' });
      },
    });
  }, []);

  const renderHighlightedItem = useCallback((item: string) => (
    <span
      aria-label={item}
      className="inline-block"
      onMouseEnter={handleTaglineItemEnter}
      onMouseLeave={handleTaglineItemLeave}
    >
      {item}
    </span>
  ), [handleTaglineItemEnter, handleTaglineItemLeave]);

  return (
    <footer 
      ref={footerRef}
      data-cursor-hit="active"
      data-cursor-level="footer"
      data-cursor-morph="border"
      data-cursor-border-edge="top"
      className={`relative mt-12 md:mt-32 z-20 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 ${className}`}
    >
      <PageContainer className="relative flex flex-col justify-between pt-10 pb-4 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2">
              <LogoBH
                logoKey="footer"
                autoAnimate={false}
                triggerRef={footerRef}
                triggerStart="45% bottom"
                triggerEnd="top top"
                reopenLogoKeyOnClose="header"
              />
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg ">
              {footerTaglineItems.map((item, index) => (
                <Fragment key={`${item}-${index}`}>
                  {index > 0 && ' '}
                  {renderHighlightedItem(item)}
                </Fragment>
              ))}
            </p>

          </div>

          <div className="space-y-2 text-left text-sm text-neutral-600 dark:text-neutral-400 md:pt-12">
            <a
              href={`mailto:${resumeData.personalInfo.email}`}
              className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline break-all"
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{resumeData.personalInfo.email}</span>
            </a>
            {resumeData.personalInfo.linkedin && (
              <a
                href={resumeData.personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline break-all"
              >
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{resumeData.personalInfo.linkedin.replace('https://', '')}</span>
              </a>
            )}
            {/* {resumeData.personalInfo.github && (
              <a
                href={resumeData.personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline break-all"
              >
                <Code2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{resumeData.personalInfo.github.replace('https://', '')}</span>
              </a>
            )} */}
            {/* <p className="flex items-center gap-2 ">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{resumeData.personalInfo.location}</span>
            </p> */}
          </div>



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
              className="text-yellow-600 relative group md:pt-0 text-lg font-script"
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
