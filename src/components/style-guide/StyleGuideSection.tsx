'use client';

import { type ReactNode } from 'react';
import { useDashboard } from '@/components/dashboard/Dashboard';
import type { RainbowSectionId } from '@/lib/dashboard-settings';

interface StyleGuideSectionProps {
  id: string;
  number: string;
  title: string;
  note: string;
  children: ReactNode;
}

export default function StyleGuideSection({
  id,
  number,
  title,
  note,
  children,
}: StyleGuideSectionProps) {
  const { settings, setBlock, ready } = useDashboard();
  const sectionId = id as RainbowSectionId;
  const rainbowOn = settings.rainbow.sections[sectionId] ?? true;

  return (
    <section
      id={id}
      data-rainbow-text={rainbowOn ? 'on' : 'off'}
      className="group/rainbow scroll-mt-40 lg:scroll-mt-28"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="font-mono text-xs tracking-widest text-primary-600 dark:text-primary-400">
          {number} / {title}
        </p>
        <button
          type="button"
          data-rainbow-skip
          onClick={() => setBlock('rainbow', sectionId, !rainbowOn)}
          className="font-mono text-[11px] text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"
          disabled={!ready}
        >
          {rainbowOn ? 'rainbow on' : 'rainbow off'}
        </button>
      </div>
      <h2 className="mb-3 font-display text-3xl font-bold text-neutral-900 dark:text-white md:text-4xl">
        {title}
      </h2>
      <p className="mb-10 max-w-2xl font-body text-neutral-600 dark:text-neutral-400">
        {note}
      </p>
      {children}
    </section>
  );
}
