'use client';

import { useCallback, useState, type MouseEvent } from 'react';
import Loading, { ButtonLoading, Skeleton } from '@/components/ui/Loading';
import {
  allowedMotion,
  applyRainbowEnter,
  applyRainbowLeave,
  gsapEasings,
  motionDurations,
  motionRules,
  rainbowHover,
  rainbowSpectrum,
  themeRestInk,
} from '@/lib/motion';
import StyleGuideSection from './StyleGuideSection';

function RainbowHoverText({ text }: { text: string }) {
  const handleEnter = useCallback((event: MouseEvent<HTMLSpanElement>) => {
    applyRainbowEnter(event.currentTarget);
  }, []);

  const handleLeave = useCallback((event: MouseEvent<HTMLSpanElement>) => {
    applyRainbowLeave(event.currentTarget, themeRestInk('display'));
  }, []);

  return (
    <p
      data-rainbow-skip
      className="font-display text-5xl font-semibold leading-tight text-neutral-900 dark:text-neutral-100 md:text-6xl"
    >
      {text.split('').map((character, index) => (
        <span
          key={`${character}-${index}`}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className="inline-block"
        >
          {character === ' ' ? '\u00A0' : character}
        </span>
      ))}
    </p>
  );
}

function AnimationSpecimen({
  label,
  className,
  children,
}: {
  label: string;
  className: string;
  children: string;
}) {
  const [generation, setGeneration] = useState(0);

  return (
    <div className="card flex flex-col items-center justify-center gap-4 py-8">
      <span key={generation} className={`font-display text-lg font-bold ${className}`}>
        {children}
      </span>
      <button
        type="button"
        onClick={() => setGeneration((value) => value + 1)}
        className="font-mono text-[11px] text-primary-600 hover:underline dark:text-primary-400"
      >
        replay · {label}
      </button>
    </div>
  );
}

const statusStyles = {
  canonical:
    'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
  utility: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200',
  avoid: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
} as const;

export default function MotionSection() {
  return (
    <>
      <StyleGuideSection
        id="motion"
        number="06"
        title="Motion"
        note="Personality is a snap of color that lingers. Choreography is GSAP. Chrome is CSS. This section is the spec, not a bag of leftovers."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {motionRules.map((rule) => (
            <div
              key={rule.title}
              className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {rule.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {rule.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h3 className="mb-3 font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Rainbow hover
          </h3>
          <p className="mb-4 max-w-2xl font-body text-sm text-neutral-600 dark:text-neutral-400">
            Instant snap, random hue from the spectrum, {rainbowHover.restoreDuration}s restore
            with {rainbowHover.restoreEase}, then clearProps. Leave a letter — it really takes
            half a minute.
          </p>
          <p className="mb-4 max-w-2xl font-body text-sm text-neutral-600 dark:text-neutral-400">
            Proof of concept: any block with{' '}
            <code className="font-mono text-xs">data-rainbow-text=&quot;on&quot;</code> wraps
            its characters. This page is on. Use the per-section toggle, or{' '}
            <span className="font-mono text-xs">rainbow all</span> in the masthead. Skip a
            subtree with <code className="font-mono text-xs">data-rainbow-skip</code>.
          </p>
          <p className="mb-4 max-w-2xl font-body text-sm text-neutral-600 dark:text-neutral-400">
            Container glow: Surfaces cards use{' '}
            <code className="font-mono text-xs">data-cursor-focus=&quot;on&quot;</code>. Color
            spreads from the pointer, hugs the card edge, then fades on leave. No scale.
            Tune in{' '}
            <code className="font-mono text-xs">src/lib/cursor-focus.ts</code>.
          </p>
          <RainbowHoverText text="Great & Many" />
          <div className="mt-4 flex flex-wrap gap-2">
            {rainbowSpectrum.map((swatch) => (
              <span
                key={swatch.hex}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 dark:border-neutral-700"
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span className="font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                  {swatch.name} {swatch.hex}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h3 className="mb-3 font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Allowed vs one-off
          </h3>
          <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {allowedMotion.map((item) => (
              <li
                key={item.name}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3"
              >
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${statusStyles[item.status]}`}
                >
                  {item.status}
                </span>
                <span className="font-display font-bold text-neutral-900 dark:text-neutral-100">
                  {item.name}
                </span>
                <span className="font-body text-sm text-neutral-600 dark:text-neutral-400">
                  {item.usedOn}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12">
          <h3 className="mb-3 font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Duration scale
          </h3>
          <ul className="space-y-3">
            {motionDurations.map((item) => (
              <li key={item.name} className="grid gap-1 sm:grid-cols-[7rem_5rem_1fr] sm:items-baseline">
                <span className="font-mono text-xs text-neutral-800 dark:text-neutral-200">
                  {item.name}
                </span>
                <span className="font-mono text-xs text-primary-600 dark:text-primary-400">
                  {item.value}
                </span>
                <span className="font-body text-sm text-neutral-600 dark:text-neutral-400">
                  {item.usedOn}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12">
          <h3 className="mb-3 font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
            CSS utilities
          </h3>
          <p className="mb-4 font-body text-sm text-neutral-600 dark:text-neutral-400">
            Optional. Not used on live pages yet. Replay to see the entrance again.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimationSpecimen label="fade-in" className="animate-fade-in">
              fade-in
            </AnimationSpecimen>
            <AnimationSpecimen label="slide-up" className="animate-slide-up">
              slide-up
            </AnimationSpecimen>
            <AnimationSpecimen label="slide-down" className="animate-slide-down">
              slide-down
            </AnimationSpecimen>
            <AnimationSpecimen label="scale-in" className="animate-scale-in">
              scale-in
            </AnimationSpecimen>
            <AnimationSpecimen label="bounce-gentle" className="animate-bounce-gentle">
              bounce-gentle
            </AnimationSpecimen>
            <div className="card flex items-center justify-center py-8">
              <span className="floating inline-block rounded-full bg-primary-500 px-4 py-2 font-display text-sm font-bold text-white">
                .floating
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="card" data-cursor-hit="active" data-cursor-dazzle="pulse">
            <p className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
              dazzle=pulse
            </p>
            <h3 className="mt-2 font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Pulse
            </h3>
            <p className="mt-2 font-body text-sm text-neutral-700 dark:text-neutral-300">
              Default hit emphasis.
            </p>
          </div>
          <div className="card" data-cursor-hit="active" data-cursor-dazzle="orbit">
            <p className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
              dazzle=orbit
            </p>
            <h3 className="mt-2 font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Orbit
            </h3>
            <p className="mt-2 font-body text-sm text-neutral-700 dark:text-neutral-300">
              Secondary hit emphasis.
            </p>
          </div>
          <div className="card" data-cursor-hit="active" data-cursor-dazzle="spark">
            <p className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
              dazzle=spark
            </p>
            <h3 className="mt-2 font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Spark
            </h3>
            <p className="mt-2 font-body text-sm text-neutral-700 dark:text-neutral-300">
              Brightest hit. Use sparingly.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="mb-3 font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
            GSAP easings
          </h3>
          <ul className="space-y-2">
            {gsapEasings.map((easing) => (
              <li
                key={easing.name}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-neutral-100 py-2 dark:border-neutral-800"
              >
                <span className="font-mono text-sm text-neutral-800 dark:text-neutral-200">
                  {easing.name}
                </span>
                <span className="font-body text-sm text-neutral-600 dark:text-neutral-400">
                  {easing.usedOn}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </StyleGuideSection>

      <StyleGuideSection
        id="components"
        number="07"
        title="Components"
        note="A few reusable pieces. LogoBH, the cursor, and footer contact are already live in the chrome of this page — they are not remounted here."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(['spinner', 'dots', 'pulse', 'skeleton'] as const).map((variant) => (
            <div key={variant} className="card flex flex-col items-center gap-3 py-8">
              <Loading variant={variant} size="md" />
              <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">{variant}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <div key={size} className="card flex flex-col items-center gap-3 py-6">
              <Loading variant="spinner" size={size} />
              <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                spinner · {size}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="card">
            <p className="mb-4 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
              Skeleton
            </p>
            <Skeleton lines={4} />
          </div>
          <div className="card flex items-center">
            <ButtonLoading />
          </div>
        </div>
      </StyleGuideSection>
    </>
  );
}
