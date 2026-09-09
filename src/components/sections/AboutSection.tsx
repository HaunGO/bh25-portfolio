'use client';

import { PageContainer } from '../ui/Container';
import { TransitionLink } from '../transitions/TransitionLink';

export default function AboutSection() {
  return (
    <section id="about" className="relative z-10 scroll-mt-24 pt-24 pb-32 md:pb-48">
      <PageContainer>
        <div className="mx-auto max-w-6xl text-center">
          <p className="font-script text-5xl leading-none tracking-tight text-neutral-900 dark:text-neutral-100 md:text-6xl">
            A human in the loop.
          </p>
          <div className="mt-10">
            <TransitionLink
              href="/resume"
              className="btn-primary inline-flex min-h-11 items-center justify-center px-6 py-3"
            >
              Resume
            </TransitionLink>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
