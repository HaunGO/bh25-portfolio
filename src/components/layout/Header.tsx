'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationItem } from '@/types';
import { TransitionLink } from '../transitions/TransitionLink';
import { PageContainer } from '../ui/Container';
import LogoBH from '../ui/LogoBH';

interface HeaderProps {
  className?: string;
}

const navigationItems: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
];

const Header = memo(function Header({ className = '' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle navigation - memoized to prevent re-renders
  const handleNavigation = useCallback(async (href: string) => {
    if (href === pathname) return; // Don't navigate to current page
    
    // Close mobile menu
    setIsMenuOpen(false);
    
    // Navigate with transition
    const startTransition = (window as any).startTransition;
    if (startTransition) {
      await startTransition(href);
    }
  }, [pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Get header background classes based on scroll state - memoized
  const getHeaderBackground = useCallback(() => {
    if (isScrolled) {
      return 'bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-lg';
    }
    // When not scrolled, use subtle backgrounds that work in both themes
    return 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm';
  }, [isScrolled]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${getHeaderBackground()}
        ${className}
      `}
    >
      <PageContainer className="mr-10 md:mr-auto">
        <div className="relative flex justify-end md:justify-center items-center h-16 lg:h-20">
          {/* Logo */}
          <TransitionLink
            href="/"
            className="absolute left-0 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <LogoBH autoAnimate={false} />
          </TransitionLink>

          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={`
                  relative px-3 py-2 text-sm font-medium transition-colors duration-200
                  ${pathname === item.href
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400'
                  }
                `}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-neutral-400" />
                )}
              </button>
            ))}
          </nav> */}

          {/* Mobile menu button - DO NOT DELETE.*/}
          {/* <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button> */}

        </div>

        {/* Mobile Navigation - DO NOT DELETE.*/}
        {/* <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'opacity-100 max-h-96' 
            : 'opacity-0 max-h-0 overflow-hidden'
        }`}>
          <div className="px-2 pt-2 pb-3 mb-4 space-y-1 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-lg shadow-lg mt-2 border border-neutral-200 dark:border-neutral-700">
            {navigationItems.map((item, index) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={`
                  block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-200 transform
                  ${pathname === item.href
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 scale-105'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:scale-102'
                  }
                `}
                style={{ 
                  transitionDelay: `${index * 50}ms`,
                  transform: isMenuOpen ? 'translateX(0)' : 'translateX(-20px)'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div> */}
      </PageContainer>
    </header>
  );
});

export default Header;
