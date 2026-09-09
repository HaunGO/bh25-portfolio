'use client';

import { PageContainer } from '../ui/Container';
import { TransitionLink } from '../transitions/TransitionLink';
import HoverLetters from '../ui/HoverLetters';

export default function AboutSection() {
  return (
    <section id="about" className="relative z-10 scroll-mt-24 pb-28 pt-8 md:pb-40">
      <PageContainer>
        <div className="mx-auto max-w-6xl text-center">
          <TransitionLink
            href="/resume"
            data-cursor-hit="active"
            data-cursor-dazzle="orbit"
            className="inline-flex min-h-11 items-center font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100 md:text-3xl"
          >
            <HoverLetters text="Resume" />
          </TransitionLink>
        </div>
      </PageContainer>
    </section>
  );
}
