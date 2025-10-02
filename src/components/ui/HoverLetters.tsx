'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

interface HoverLettersProps {
  text: string;
  className?: string;
  animationDuration?: number;
}

const rainbowColors = [
  '#FF0000', // Red
  '#FF7F00', // Orange  
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#0000FF', // Blue
  '#4B0082', // Indigo
  '#9400D3'  // Violet
];

export default function HoverLetters({ 
  text, 
  className = '',
  animationDuration = 3, 
}: HoverLettersProps) {
  const [hoveredLetter, setHoveredLetter] = useState<number | null>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  
  // Generate random colors for each letter
  const getRandomColor = (index: number) => {
    return rainbowColors[index % rainbowColors.length];
  };

  // Handle hover with GSAP animations
  const handleMouseEnter = (index: number) => {
    const element = letterRefs.current[index];
    if (!element) return;
    
    setHoveredLetter(index);
    
    gsap.to(element, {
      color: getRandomColor(index),
      duration: 0.1,
      ease: 'none'
    });
  };

  const handleMouseLeave = (index: number) => {
    const element = letterRefs.current[index];
    if (!element) return;
    
    setHoveredLetter(null);
    
    gsap.to(element, {
      color: 'inherit',
      duration: 0.1,
      ease: 'power2.out'
    });
  };

  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            letterRefs.current[i] = el;
          }}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={() => handleMouseLeave(i)}
          style={{ 
            cursor: 'pointer',
            display: 'inline-block',
            padding: '2px'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}
