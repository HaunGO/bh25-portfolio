'use client';

import { resumeData } from '@/data/resume';
import ExperienceSection from '@/components/resume/ExperienceSection';
import CopyEmail from '@/components/ui/CopyEmail';

export default function ResumePage() {
  const { personalInfo, experience } = resumeData;

  return (
    <div className="min-h-dvh py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="mb-16">
          <h1 className="font-display text-4xl font-bold text-neutral-900 dark:text-neutral-100 md:text-6xl">
            {personalInfo.name}
          </h1>
          <p className="mt-3 text-lg font-medium text-primary-600 dark:text-primary-400">
            {personalInfo.title}
          </p>
          <p className="mt-6 max-w-2xl font-body leading-relaxed text-neutral-700 dark:text-neutral-300">
            {personalInfo.summary}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-body text-sm text-neutral-600 dark:text-neutral-400">
            <CopyEmail
              showIcon={false}
              className="text-neutral-700 transition-colors hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400"
            />
            <span>{personalInfo.location}</span>
          </div>
        </header>

        <section id="experience">
          <h2 className="mb-8 font-display text-3xl font-bold text-neutral-900 dark:text-neutral-100 md:text-4xl">
            Experience
          </h2>
          <ExperienceSection experience={experience} />
        </section>
      </div>
    </div>
  );
}
