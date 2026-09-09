'use client';

import { useRef, type ReactNode } from 'react';
import { Experience } from '@/types/resume';

interface ExperienceSectionProps {
  experience: Experience[];
  className?: string;
  children?: ReactNode;
}

export function TimelineDot() {
  return (
    <div className="absolute left-4 top-0 z-10 h-4 w-4 rounded-full border-4 border-white bg-primary-500 dark:border-neutral-900 dark:bg-primary-400 md:left-6" />
  );
}

const ExperienceSection = ({ experience, className, children }: ExperienceSectionProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={timelineRef} className={`relative ${className ?? ''}`}>
      <div className="absolute bottom-0 left-6 top-0 w-[1px] bg-gradient-to-b from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400 md:left-8" />

      <div className="space-y-12">
        {experience.map((exp, index) => (
          <div key={exp.id} className="relative pl-14 md:pl-20">
            <TimelineDot />

            <div
              data-cursor-hit="active"
              data-cursor-level="featured-experience"
              data-cursor-dazzle={index % 3 === 0 ? 'spark' : index % 2 === 0 ? 'pulse' : 'orbit'}
              className="rounded-xl border border-neutral-200 bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl dark:border-neutral-700 dark:bg-neutral-800"
            >
              <div className="mb-4 flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-primary-600 dark:text-primary-400">
                    {exp.position}
                  </h3>
                  <p className="text-lg font-medium text-neutral-500 dark:text-neutral-400">
                    {exp.company}
                  </p>
                </div>
                <div className="mt-2 text-left text-sm md:mt-0 md:text-right">
                  <div className="text-neutral-500 dark:text-neutral-400">
                    {exp.startDate} - {exp.endDate}
                  </div>
                  <div className="text-neutral-600 dark:text-neutral-300">
                    {exp.location}
                  </div>
                </div>
              </div>

              <p className="mb-4 font-body text-neutral-700 dark:text-neutral-300">
                {exp.description}
              </p>

              {exp.achievements.length > 0 && (
                <ul className="mb-4 space-y-1">
                  {exp.achievements.map((achievement) => (
                    <li
                      key={achievement}
                      className="flex items-start text-sm text-neutral-600 dark:text-neutral-400"
                    >
                      <span className="mr-2 mt-1 text-primary-500 dark:text-primary-400">•</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              )}

              {exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
};

export default ExperienceSection;
