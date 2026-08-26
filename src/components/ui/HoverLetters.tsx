'use client';

import { applyRainbowEnter, applyRainbowLeave, themeRestInk } from '@/lib/motion';

interface HoverLettersProps {
  text: string;
  className?: string;
}

export default function HoverLetters({ text, className = '' }: HoverLettersProps) {
  return (
    <span className={className}>
      {text.split('').map((character, index) => (
        <span
          key={`${character}-${index}`}
          className="inline-block"
          onMouseEnter={(event) => applyRainbowEnter(event.currentTarget)}
          onMouseLeave={(event) =>
            applyRainbowLeave(event.currentTarget, themeRestInk('display'))
          }
        >
          {character === ' ' ? '\u00A0' : character}
        </span>
      ))}
    </span>
  );
}
