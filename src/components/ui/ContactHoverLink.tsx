'use client';

import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { useViewportClamp } from './useViewportClamp';
import { useIsCoarsePointer } from '@/hooks/usePointerMode';

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
  const rootRef = useRef<HTMLDivElement>(null);
  const isCoarse = useIsCoarsePointer();
  const [open, setOpen] = useState(false);
  const cardId = useId();

  useEffect(() => {
    if (!isCoarse || !open) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isCoarse, open]);

  useEffect(() => {
    if (!isCoarse) {
      setOpen(false);
    }
  }, [isCoarse]);

  const handleIconClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isCoarse) {
      return;
    }
    if (open && !interactive) {
      return;
    }
    event.preventDefault();
    setOpen((value) => !value);
  };

  const cardVisible = isCoarse ? open : undefined;

  return (
    <div
      ref={rootRef}
      className={`group relative z-10 hover:z-30 focus-within:z-30 ${open ? 'z-30' : ''}`}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        aria-expanded={isCoarse ? open : undefined}
        aria-controls={isCoarse ? cardId : undefined}
        data-cursor="external"
        onClick={handleIconClick}
        className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full p-2.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
      >
        {icon}
      </a>
      <div
        id={cardId}
        ref={popoverRef}
        data-align={cardAlign}
        data-open={cardVisible ? 'true' : undefined}
        className={`contact-hover-card absolute bottom-full z-30 max-w-[calc(100vw-2rem)] pb-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 data-[open=true]:opacity-100 ${
          cardAlign === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2'
        } ${
          interactive || isCoarse
            ? 'pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto data-[open=true]:pointer-events-auto'
            : 'pointer-events-none'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
