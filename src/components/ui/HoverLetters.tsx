'use client';

import { themeRestInk } from '@/lib/motion';
import { rainbowLetterHandlers } from '@/lib/rainbow-pointer';

interface HoverLettersProps {
  text: string;
  className?: string;
}

export default function HoverLetters({ text, className = '' }: HoverLettersProps) {
  const handlers = rainbowLetterHandlers(() => themeRestInk('display'));

  return (
    <span className={className}>
      {text.split('').map((character, index) => (
        <span
          key={`${character}-${index}`}
          className="inline-block"
          {...handlers}
        >
          {character === ' ' ? '\u00A0' : character}
        </span>
      ))}
    </span>
  );
}
