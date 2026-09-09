'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/motion';
import { rainbowLetterHandlers } from '@/lib/rainbow-pointer';
import { taglines } from '@/data/taglines';

/** First-pass letter reveal. Reopen this object when we tune it. */
export const taglineReveal = {
  firstDelay: 1.85,
  hold: 1.75,
  inDuration: 0.42,
  inStagger: 0.03,
  inEase: 'power3.out',
  inYPercent: 115,
  outDuration: 0.28,
  outStagger: 0.016,
  outEase: 'power2.in',
  outYPercent: -90,
} as const;

type CharacterHandlers = ReturnType<typeof rainbowLetterHandlers>;

interface TaglineRevealProps {
  characterHandlers: CharacterHandlers;
  active?: boolean;
}

export default function TaglineReveal({
  characterHandlers,
  active = true,
}: TaglineRevealProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const tagline = taglines[index];
  const words = tagline.split(' ');

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const chars = root.querySelectorAll<HTMLElement>('[data-tagline-char]');
    if (chars.length === 0) {
      return;
    }

    if (!active || prefersReducedMotion()) {
      gsap.set(chars, { yPercent: 0, opacity: 1 });
      return;
    }

    const timeline = gsap.timeline({
      delay: index === 0 ? taglineReveal.firstDelay : 0.06,
      onComplete: () => {
        setIndex((current) => (current + 1) % taglines.length);
      },
    });

    gsap.set(chars, {
      yPercent: taglineReveal.inYPercent,
      opacity: 0,
    });

    timeline.to(chars, {
      yPercent: 0,
      opacity: 1,
      duration: taglineReveal.inDuration,
      stagger: taglineReveal.inStagger,
      ease: taglineReveal.inEase,
    });

    timeline.to(
      chars,
      {
        yPercent: taglineReveal.outYPercent,
        opacity: 0,
        duration: taglineReveal.outDuration,
        stagger: taglineReveal.outStagger,
        ease: taglineReveal.outEase,
      },
      `+=${taglineReveal.hold}`,
    );

    return () => {
      timeline.kill();
    };
  }, [active, index]);

  return (
    <span
      ref={rootRef}
      className="block text-left"
      aria-live="polite"
      aria-atomic="true"
    >
      {words.map((word, wordIndex) => (
        <span key={`${tagline}-${wordIndex}`} className="inline-block whitespace-nowrap">
          {Array.from(word).map((character, characterIndex) => (
            <span
              key={`${character}-${characterIndex}`}
              className="inline-block overflow-hidden align-bottom"
            >
              <span
                data-tagline-char
                aria-hidden="true"
                className="inline-block"
                {...characterHandlers}
              >
                {character}
              </span>
            </span>
          ))}
          {wordIndex < words.length - 1 ? (
            <span data-tagline-char aria-hidden="true" className="inline-block">
              {'\u00A0'}
            </span>
          ) : null}
        </span>
      ))}
      <span className="sr-only">{tagline}</span>
    </span>
  );
}
