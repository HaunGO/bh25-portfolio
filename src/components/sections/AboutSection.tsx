'use client';

import { PageContainer } from '../ui/Container';

export default function AboutSection() {
  return (
    <section id="about" className="relative z-10 scroll-mt-24 pb-44 md:pb-64">
      <PageContainer>
        <div className="mx-auto max-w-6xl text-center">
          <p className="font-script text-5xl leading-none tracking-tight text-neutral-900 dark:text-neutral-100 md:text-6xl">
            A human in the loop.
          </p>

        </div>
      </PageContainer>
    </section>
  );
}
