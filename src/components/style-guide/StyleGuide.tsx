'use client';

import { useEffect, useState } from 'react';
import { useDashboard } from '@/components/dashboard/Dashboard';
import ColorSection from './ColorSection';
import LayoutSection from './LayoutSection';
import MotionSection from './MotionSection';
import PatternsSection from './PatternsSection';
import TypographySection from './TypographySection';
import { styleGuideSections } from './tokens';

export default function StyleGuide() {
  const [activeId, setActiveId] = useState<string>(styleGuideSections[0].id);
  const { settings } = useDashboard();

  useEffect(() => {
    const observers = styleGuideSections.map((section) => {
      const element = document.getElementById(section.id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(section.id);
          }
        },
        { rootMargin: '-25% 0px -60% 0px', threshold: 0 }
      );

      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen pb-24 pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header
          data-rainbow-text={settings.rainbow.masthead ? 'on' : 'off'}
          className="mb-16 max-w-3xl"
        >
          <div className="mb-6">
            <h1 className="font-display text-4xl font-bold text-neutral-900 dark:text-white md:text-6xl">
              Style Guide
            </h1>
          </div>
          <p className="font-script text-5xl leading-none tracking-tight text-neutral-900 dark:text-neutral-100 md:text-6xl">
            a sampling of the system
          </p>
          <p className="mt-6 font-body text-xl text-neutral-600 dark:text-neutral-400">
            Color, type, layout, surfaces, and motion as this site actually uses them — a specimen,
            not a lab.
          </p>
        </header>

        <nav
          data-rainbow-skip
          aria-label="Style guide sections"
          className="sticky top-12 z-40 -mx-4 mb-12 overflow-x-auto border-y border-neutral-200 bg-white/80 px-4 py-2 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80 lg:hidden"
        >
          <ul className="flex gap-2">
            {styleGuideSections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 font-mono text-xs transition-colors ${
                    activeId === section.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                  }`}
                >
                  {section.number} {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden lg:block">
            <nav
              data-rainbow-skip
              aria-label="Style guide sections"
              className="sticky top-20 space-y-1"
            >
              {styleGuideSections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`block rounded-md px-3 py-2 font-mono text-xs tracking-wide transition-colors ${
                    activeId === section.id
                      ? 'bg-primary-600 text-white'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
                  }`}
                >
                  {section.number} / {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-24">
            <ColorSection />
            <TypographySection />
            <LayoutSection />
            <PatternsSection />
            <MotionSection />
          </div>
        </div>
      </div>
    </div>
  );
}
