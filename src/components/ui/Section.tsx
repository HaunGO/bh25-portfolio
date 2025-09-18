'use client';

import { ReactNode } from 'react';
import { getSectionClass, getContainerClass } from '@/lib/design-system';

interface SectionProps {
  children: ReactNode;
  containerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  spacing?: 'small' | 'default' | 'large';
  className?: string;
  id?: string;
  background?: 'white' | 'neutral' | 'primary' | 'accent' | 'transparent';
}

export default function Section({ 
  children, 
  containerSize = '7xl',
  spacing = 'default',
  className = '',
  id,
  background = 'transparent'
}: SectionProps) {
  const sectionClass = getSectionClass(spacing);
  const containerClass = getContainerClass(containerSize);
  
  const backgroundClasses = {
    white: 'bg-white dark:bg-neutral-900',
    neutral: 'bg-neutral-50 dark:bg-neutral-900',
    primary: 'bg-primary-50 dark:bg-primary-950',
    accent: 'bg-accent-50 dark:bg-accent-950',
    transparent: '',
  };

  return (
    <section 
      id={id}
      className={`${sectionClass} ${backgroundClasses[background]} ${className}`}
    >
      <div className={containerClass}>
        {children}
      </div>
    </section>
  );
}

// Convenience components for common section patterns
export function PageSection({ 
  children, 
  className = '', 
  id,
  background = 'transparent' 
}: { 
  children: ReactNode; 
  className?: string; 
  id?: string;
  background?: 'white' | 'neutral' | 'primary' | 'accent' | 'transparent';
}) {
  return (
    <Section 
      containerSize="7xl" 
      spacing="default" 
      className={className}
      id={id}
      background={background}
    >
      {children}
    </Section>
  );
}

export function ContentSection({ 
  children, 
  className = '', 
  id,
  background = 'transparent' 
}: { 
  children: ReactNode; 
  className?: string; 
  id?: string;
  background?: 'white' | 'neutral' | 'primary' | 'accent' | 'transparent';
}) {
  return (
    <Section 
      containerSize="4xl" 
      spacing="default" 
      className={className}
      id={id}
      background={background}
    >
      {children}
    </Section>
  );
}

export function NarrowSection({ 
  children, 
  className = '', 
  id,
  background = 'transparent' 
}: { 
  children: ReactNode; 
  className?: string; 
  id?: string;
  background?: 'white' | 'neutral' | 'primary' | 'accent' | 'transparent';
}) {
  return (
    <Section 
      containerSize="3xl" 
      spacing="default" 
      className={className}
      id={id}
      background={background}
    >
      {children}
    </Section>
  );
}
