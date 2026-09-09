'use client';

import { ReactNode, MouseEvent } from 'react';

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  [key: string]: unknown;
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({ 
  href, 
  children, 
  className = '', 
  onClick,
  ...props 
}) => {
  const handleClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented) {
      return;
    }

    const startTransition = (window as { startTransition?: (href: string) => Promise<void> }).startTransition;
    if (!startTransition) {
      return;
    }

    e.preventDefault();
    await startTransition(href);
  };

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
};