'use client';

import { Skill } from '@/types/resume';
import { FEATURED_SKILL_IDS } from '@/lib/resume-skills';
import { themeRestInk } from '@/lib/motion';
import { rainbowLetterHandlers } from '@/lib/rainbow-pointer';
import { useState } from 'react';

interface SkillsSectionProps {
  skills: Skill[];
}

const DISPLAY_NAME: Record<string, string> = {
  html: 'HTML',
  css: 'CSS',
  js: 'JavaScript',
  nextjs: 'Next',
  vue: 'Vue',
  tailwind: 'Tailwind',
  wcag: 'A11y',
};

function skillLabel(skill: Skill) {
  return DISPLAY_NAME[skill.id] ?? skill.name.replace(/\s*\(.*\)\s*/g, '');
}

const SkillsSection = ({ skills }: SkillsSectionProps) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const featuredIds = new Set<string>(FEATURED_SKILL_IDS);
  const featured = FEATURED_SKILL_IDS.map((id) => skills.find((skill) => skill.id === id)).filter(
    (skill): skill is Skill => Boolean(skill),
  );
  const extra = skills.filter((skill) => !featuredIds.has(skill.id));
  const wordHandlers = rainbowLetterHandlers(() => themeRestInk('display'));

  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-4 gap-y-3 font-display text-2xl font-semibold leading-tight text-neutral-900 dark:text-neutral-100 md:text-3xl">
        {featured.map((skill) => (
          <span key={skill.id} aria-label={skill.name}>
            {Array.from(skillLabel(skill)).map((character, index) =>
              character === ' ' ? (
                <span key={`${skill.id}-space-${index}`}> </span>
              ) : (
                <span
                  key={`${skill.id}-${index}`}
                  aria-hidden="true"
                  className="inline-block"
                  {...wordHandlers}
                >
                  {character}
                </span>
              ),
            )}
          </span>
        ))}
      </p>
      {extra.length > 0 && (
        <div className="mt-6">
          <button
            type="button"
            className="font-body text-sm text-neutral-500 underline-offset-4 hover:text-neutral-800 hover:underline dark:text-neutral-400 dark:hover:text-neutral-200"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen((open) => !open)}
          >
            {moreOpen ? 'Less tooling' : `More tooling (${extra.length})`}
          </button>
          {moreOpen && (
            <div className="mt-4 flex flex-wrap gap-2">
              {extra.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
