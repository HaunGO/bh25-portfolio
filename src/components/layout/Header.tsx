'use client';

import { useEffect, memo, useCallback, useRef, type MouseEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { TransitionLink } from '../transitions/TransitionLink';
import { PageContainer } from '../ui/Container';
import LogoBH from '../ui/LogoBH';
import { playTrailChoreography } from '@/components/ui/cursor';
import { getPointerMode } from '@/lib/pointer-mode';

interface HeaderProps {
  className?: string;
}

const Header = memo(function Header({ className = '' }: HeaderProps) {
  const triggerRef = useRef<HTMLElement | null>(null);

  const scrollToHash = useCallback((href: string, duration = 1) => {
    gsap.registerPlugin(ScrollToPlugin);

    const finish = () => {
      window.history.replaceState(null, '', href);
    };

    if (href === '#contact') {
      if (getPointerMode() === 'fine') {
        playTrailChoreography({
          id: 'contact',
          target: '#contact',
          travelDuration: duration,
          scribbleDuration: 1,
          loops: 2,
          holdDuration: 0,
          returnDuration: 0.9,
          padding: 24,
          entrySide: 'left',
          clockwise: false,
        });
      }

      gsap.to(window, {
        duration,
        ease: 'power1.inOut',
        scrollTo: { y: 'max' },
        onComplete: finish,
      });
      return;
    }

    const target = document.querySelector(href);
    if (!target) return;

    gsap.to(window, {
      duration,
      ease: 'power1.inOut',
      scrollTo: {
        y: target,
        offsetY: 72,
      },
      onComplete: finish,
    });
  }, []);

  const handleContactNavigation = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToHash('#contact');
  }, [scrollToHash]);

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin);

    const triggerElement = document.querySelector('[data-hero-section-title]') as HTMLElement;
    if (triggerElement) {
      triggerRef.current = triggerElement;
    }

    if (window.location.hash === '#contact') {
      const frame = window.requestAnimationFrame(() => scrollToHash('#contact', 0.85));
      return () => window.cancelAnimationFrame(frame);
    }
  }, [scrollToHash]);

  const getHeaderBackground = useCallback(() => {
    return 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm';
  }, []);

  return (
    <header
      data-cursor-hit="active"
      data-cursor-level="header"
      data-cursor-morph="border"
      data-cursor-border-edge="bottom"
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 pt-[env(safe-area-inset-top)]
        ${getHeaderBackground()}
        ${className}
      `}
    >
      <PageContainer>
        <div className="relative flex justify-end items-center h-12 lg:h-14">
          <TransitionLink href="/" aria-label="Home" className="absolute left-0 top-0 bottom-0 flex items-center hover:text-primary-700 dark:hover:text-primary-300 transition-colors" >
            <span className="relative top-1 inline-block origin-left scale-110">
              <LogoBH
                logoKey="header"
                autoAnimate={false}
                triggerRef={triggerRef}
                triggerStart="center top"
                triggerEnd="bottom bottom"
              />
            </span>
          </TransitionLink>

          <a
            href="#contact"
            onClick={handleContactNavigation}
            className="inline-flex min-h-11 min-w-11 items-center justify-center px-3 py-2 text-neutral-700 transition-colors duration-200 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400"
            aria-label="Contact"
          >
            <ContactMailIcon className="shrink-0" sx={{ fontSize: 28 }} aria-hidden="true" />
          </a>
        </div>
      </PageContainer>
    </header>
  );
});

export default Header;
