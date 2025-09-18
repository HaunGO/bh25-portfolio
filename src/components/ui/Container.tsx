'use client';

import { ReactNode } from 'react';
import { containerClasses, getContainerClass } from '@/lib/design-system';

interface ContainerProps {
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  variant?: 'page' | 'content' | 'narrow' | 'wide';
  className?: string;
  as?: 'div' | 'section' | 'main' | 'article' | 'header' | 'footer';
}

export default function Container({ 
  children, 
  size = '7xl', 
  variant,
  className = '',
  as: Component = 'div'
}: ContainerProps) {
  // Use variant if provided, otherwise use size
  const containerClass = variant 
    ? containerClasses[variant]
    : getContainerClass(size);

  return (
    <Component className={`${containerClass} ${className}`}>
      {children}
    </Component>
  );
}

// Convenience components for common patterns
export function PageContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <Container variant="page" className={className}>
      {children}
    </Container>
  );
}

export function ContentContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <Container variant="content" className={className}>
      {children}
    </Container>
  );
}

export function NarrowContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <Container variant="narrow" className={className}>
      {children}
    </Container>
  );
}

export function WideContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <Container variant="wide" className={className}>
      {children}
    </Container>
  );
}
