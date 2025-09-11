'use client';

import { ReactNode, MouseEvent } from 'react';

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  [key: string]: any;
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
    
    if (!e.defaultPrevented) {
      e.preventDefault();
      const startTransition = (window as any).startTransition;
      if (startTransition) {
        await startTransition(href);
      }
    }
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