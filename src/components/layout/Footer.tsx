'use client';

import { Fragment, useCallback, useRef, type MouseEvent } from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { PageContainer } from '../ui/Container';
import ContactHoverLink, { CONTACT_ICON_SIZE } from '../ui/ContactHoverLink';
import CopyEmail from '../ui/CopyEmail';
import LogoBH from '../ui/LogoBH';
import TennesseeOutline from '../ui/TennesseeOutline';
import { applyRainbowEnter, applyRainbowLeave, themeRestInk } from '@/lib/motion';
import { resumeData } from '@/data/resume';

interface FooterProps {
  className?: string;
}

const footerTaglineItems = [
  '• A Creator of Great & Many',
  '• Frontend UX & Design System Engineer',
  '• Creative Developer',
  '• Electro-Magnetic Tinkerer',
  '• Experienced Bushcrafter',
  '• Proper Goofball',
  '• American',
  '• Follower of the Way',
];

const getFooterTextColor = () => themeRestInk('muted');

export default function Footer({ className = '' }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);

  const handleTaglineItemEnter = useCallback((event: MouseEvent<HTMLSpanElement>) => {
    applyRainbowEnter(event.currentTarget);
  }, []);

  const handleTaglineItemLeave = useCallback((event: MouseEvent<HTMLSpanElement>) => {
    applyRainbowLeave(event.currentTarget, getFooterTextColor());
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

          <div className="flex md:justify-end">
            <div
              id="contact"
              className="relative flex w-fit flex-wrap items-center gap-1 px-2 py-2 text-sm text-neutral-600 dark:text-neutral-400"
            >
              <h2 className="sr-only">Contact</h2>
              <CopyEmail variant="icon" />
              {resumeData.personalInfo.linkedin && (
                <ContactHoverLink
                  href={resumeData.personalInfo.linkedin}
                  label="LinkedIn"
                  interactive
                  icon={<LinkedInIcon sx={{ fontSize: CONTACT_ICON_SIZE }} aria-hidden="true" />}
                >
                  <span className="block w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-neutral-200 bg-white text-left shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
                    <span className="block h-8 bg-gradient-to-r from-[#0a66c2] to-[#004182]" />
                    <span className="flex items-center justify-between gap-3 px-3 py-3">
                      <span className="min-w-0">
                        <span className="block font-display text-sm font-bold text-neutral-900 dark:text-neutral-100">
                          {resumeData.personalInfo.name}
                        </span>
                        <span className="mt-0.5 block text-xs leading-snug text-neutral-500 dark:text-neutral-400">
                          {resumeData.personalInfo.title}
                        </span>
                      </span>
                      <a
                        href={resumeData.personalInfo.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="external"
                        className="inline-flex shrink-0 rounded-full bg-[#0a66c2] px-3 py-1 text-xs font-medium text-white hover:bg-[#004182]"
                      >
                        Connect
                      </a>
                    </span>
                  </span>
                </ContactHoverLink>
              )}
              <ContactHoverLink
                href="https://www.google.com/maps/place/Tennessee"
                label="Tennessee on Google Maps"
                cardAlign="end"
                icon={<LocationOnIcon sx={{ fontSize: CONTACT_ICON_SIZE }} aria-hidden="true" />}
              >
                <TennesseeOutline className="h-12 w-auto max-w-[min(20rem,calc(100vw-2rem))] text-primary-500 drop-shadow-[0_8px_14px_rgba(14,165,233,0.35)] dark:text-primary-400 dark:drop-shadow-[0_8px_14px_rgba(56,189,248,0.35)]" />
              </ContactHoverLink>
            </div>
          </div>



        </div>

        {/* Bottom Section */}  
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 cursor-default ">
          <div className="text-center flex flex-col-reverse items-center md:flex-row md:justify-between">

            <blockquote 
              className="relative group text-purple-800 dark:text-purple-400 text-md w-full md:w-1/2 md:pr-4"
              cite="https://www.law.cornell.edu/ucc/1/1-308"
            >
              <span className="opacity-60">&copy; {new Date().getFullYear()} Brandon Haun. All Rights Reserved.</span>
              <span 
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-purple-600 dark:bg-purple-400 text-neutral-100 dark:text-neutral-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 "
                role="tooltip"
                aria-hidden="true"
              >
                UCC 1-308
              </span>
            </blockquote>

            <blockquote 
              className="text-yellow-600 relative group md:pt-0 text-lg font-script w-full md:w-1/2 md:pl-4"
              cite="https://www.biblegateway.com/passage/?search=Psalm+118%3A24&version=KJV"
            >
              <span className="opacity-80">This is the day which the LORD hath made; <br />we will rejoice and be glad in it.</span>
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
