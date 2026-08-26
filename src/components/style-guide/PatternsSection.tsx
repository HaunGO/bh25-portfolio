'use client';

import StyleGuideSection from './StyleGuideSection';
import { useDashboard } from '@/components/dashboard/Dashboard';

const proficiencyBadges = [
  { label: 'beginner', classes: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
  {
    label: 'intermediate',
    classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  },
  { label: 'advanced', classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
  { label: 'expert', classes: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
] as const;

export default function PatternsSection() {
  const { settings } = useDashboard();
  const focus = settings.cursorFocus ? 'on' : 'off';

  return (
    <>
      <StyleGuideSection
        id="surfaces"
        number="04"
        title="Surfaces"
        note="Cards, pills, and radii as they appear on resume and contact. Hover a card — color spreads from the pointer."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card" data-cursor-focus={focus}>
            <p className="mb-2 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
              .card
            </p>
            <h3 className="font-display text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Standard card
            </h3>
            <p className="mt-2 font-body leading-relaxed text-neutral-700 dark:text-neutral-300">
              White / dark-800, rounded-xl, shadow-lg, hairline border. The default content panel.
            </p>
          </div>

          <div className="card card-enhanced" data-cursor-focus={focus}>
            <p className="mb-2 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
              .card.card-enhanced
            </p>
            <h3 className="font-display text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Enhanced card
            </h3>
            <p className="mt-2 font-body leading-relaxed text-neutral-700 dark:text-neutral-300">
              Same shell, plus a hover lift and scale. Used as a utility, not a React component.
            </p>
          </div>
        </div>

        <div
          className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
          data-cursor-focus={focus}
        >
          <p className="mb-1 text-sm font-semibold tracking-wide text-neutral-500 dark:text-neutral-400">
            2022 — Present
          </p>
          <h3 className="font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Experience-style card
          </h3>
          <p className="mt-2 font-body text-neutral-700 dark:text-neutral-300">
            Timeline panels on the home and resume pages. Tech stacks sit in pills underneath.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['React', 'Next.js', 'GSAP', 'TypeScript'].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="mb-3 text-sm font-semibold tracking-wide text-neutral-500 dark:text-neutral-400">
            Proficiency badges
          </p>
          <p className="mb-3 font-body text-sm text-neutral-600 dark:text-neutral-400">
            Skills section uses raw Tailwind red / yellow / blue / green — not the semantic theme
            scales.
          </p>
          <div className="flex flex-wrap gap-2">
            {proficiencyBadges.map((badge) => (
              <span
                key={badge.label}
                className={`rounded-full px-3 py-1 text-xs font-medium ${badge.classes}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div
            className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800"
            data-cursor-focus={focus}
          >
            <div className="mb-3 h-10 rounded-lg bg-primary-600" />
            <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
              rounded-lg · buttons
            </p>
          </div>
          <div
            className="rounded-xl border border-neutral-200 bg-white p-4 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
            data-cursor-focus={focus}
          >
            <div className="mb-3 h-10 rounded-xl bg-primary-600" />
            <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
              rounded-xl · shadow-lg · cards
            </p>
          </div>
          <div
            className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xl dark:border-neutral-700 dark:bg-neutral-800"
            data-cursor-focus={focus}
          >
            <div className="mb-3 h-10 rounded-full bg-primary-600" />
            <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
              rounded-full · shadow-xl · pills
            </p>
          </div>
        </div>
      </StyleGuideSection>

      <StyleGuideSection
        id="controls"
        number="05"
        title="Controls"
        note="CSS utilities, not React atoms. Hover and focus them — there is no fake state matrix."
      >
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" className="btn-primary">
            Primary
          </button>
          <button type="button" className="btn-secondary">
            Secondary
          </button>
          <button type="button" className="btn-primary btn-enhanced">
            <span className="relative z-10">Enhanced</span>
          </button>
          <button
            type="button"
            className="rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-primary-700"
          >
            Page CTA
          </button>
        </div>
        <p className="mt-3 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
          .btn-primary · .btn-secondary · .btn-primary.btn-enhanced · inline py-3 px-6 (404)
        </p>
        <p className="mt-2 font-body text-sm text-neutral-600 dark:text-neutral-400">
          Secondary has no dark variant in globals.css — it stays a light chip in both themes.
        </p>

        <div className="mt-8 max-w-md">
          <label
            htmlFor="style-guide-input"
            className="mb-1 block text-sm font-semibold tracking-wide text-neutral-500 dark:text-neutral-400"
          >
            Input
          </label>
          <input
            id="style-guide-input"
            className="input-field"
            placeholder="Focus for the primary ring"
          />
          <p className="mt-2 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
            .input-field
          </p>
        </div>

        <div className="mt-8">
          <a
            href="/resume"
            className="font-body text-primary-600 hover:underline dark:text-primary-400"
          >
            Text link to Resume
          </a>
          <p className="mt-2 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
            text-primary-600 dark:text-primary-400 hover:underline
          </p>
        </div>
      </StyleGuideSection>
    </>
  );
}
