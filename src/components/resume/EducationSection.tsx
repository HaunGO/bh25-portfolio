'use client';

import { Education } from '@/types/resume';

interface EducationSectionProps {
  education: Education[];
}

const EducationSection = ({ education }: EducationSectionProps) => {
  return (
    <div className="space-y-8">
      {education.map((edu) => (
        <article
          key={edu.id}
          data-cursor-hit="active"
          className="rounded-xl border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
        >
          <h3 className="font-display text-xl font-bold text-primary-600 dark:text-primary-400">
            {edu.degree}
          </h3>
          <p className="text-lg font-medium text-neutral-500 dark:text-neutral-400">{edu.field}</p>
          <p className="mt-1 text-lg text-neutral-700 dark:text-neutral-300">{edu.institution}</p>
          <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            <span>
              {edu.startDate} – {edu.endDate}
            </span>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            <span>{edu.location}</span>
          </div>

          {edu.achievements && edu.achievements.length > 0 && (
            <ul className="mt-4 space-y-1">
              {edu.achievements.map((achievement) => (
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
        </article>
      ))}
    </div>
  );
};

export default EducationSection;
