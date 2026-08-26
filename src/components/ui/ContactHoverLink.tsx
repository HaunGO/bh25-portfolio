'use client';

import { type ReactNode } from 'react';
import { useViewportClamp } from './useViewportClamp';

interface ContactHoverLinkProps {
  href: string;
  label: string;
  icon: ReactNode;
  children: ReactNode;
  cardAlign?: 'center' | 'end';
  interactive?: boolean;
}

export const CONTACT_ICON_SIZE = 32;

export default function ContactHoverLink({
  href,
  label,
  icon,
  children,
  cardAlign = 'center',
  interactive = false,
}: ContactHoverLinkProps) {
  const popoverRef = useViewportClamp<HTMLDivElement>();

  return (
    <div className="group relative z-10 hover:z-30 focus-within:z-30">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        data-cursor="external"
        className="relative inline-flex rounded-full p-2.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
      >
        {icon}
      </a>
      <div
        ref={popoverRef}
        data-align={cardAlign}
        className={`contact-hover-card absolute bottom-full z-30 max-w-[calc(100vw-2rem)] pb-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 ${
          cardAlign === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2'
        } ${
          interactive
            ? 'pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto'
            : 'pointer-events-none'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
