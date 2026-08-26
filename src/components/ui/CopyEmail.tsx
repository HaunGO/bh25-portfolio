'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import MailIcon from '@mui/icons-material/Mail';
import {
  copyContactEmail,
  getContactEmail,
  writeContactEmailToClipboard,
} from '@/lib/contact-email';
import { prefersReducedMotion } from '@/lib/motion';
import { CONTACT_ICON_SIZE } from './ContactHoverLink';
import { useViewportClamp } from './useViewportClamp';

interface CopyEmailProps {
  className?: string;
  showIcon?: boolean;
  variant?: 'inline' | 'icon';
}

type CopyStatus = 'idle' | 'copied' | 'select';

function copyShortcutHint() {
  const mac = /Mac|iPhone|iPad/.test(navigator.userAgent);
  return mac ? 'Press ⌘C to copy' : 'Press Ctrl+C to copy';
}

export default function CopyEmail({
  className,
  showIcon = true,
  variant = 'inline',
}: CopyEmailProps) {
  const isIcon = variant === 'icon';
  const tooltipRef = useViewportClamp<HTMLSpanElement>();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<CopyStatus>('idle');
  const [pinging, setPinging] = useState(false);
  const labelRef = useRef<HTMLSpanElement>(null);
  const resetTimer = useRef(0);
  const pingTimer = useRef(0);

  useEffect(() => {
    setEmail(getContactEmail());

    return () => {
      window.clearTimeout(resetTimer.current);
      window.clearTimeout(pingTimer.current);
    };
  }, []);

  const showStatus = useCallback((next: CopyStatus) => {
    setStatus(next);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      setStatus('idle');
    }, 1600);
  }, []);

  const ping = useCallback(() => {
    if (prefersReducedMotion()) {
      return;
    }

    setPinging(true);
    window.clearTimeout(pingTimer.current);
    pingTimer.current = window.setTimeout(() => {
      setPinging(false);
    }, 600);
  }, []);

  const selectLabel = useCallback(() => {
    const selection = window.getSelection();
    const labelNode = labelRef.current;
    if (!selection || !labelNode) {
      return;
    }

    const range = document.createRange();
    range.selectNodeContents(labelNode);
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  const handleCopy = useCallback(() => {
    ping();

    if (copyContactEmail()) {
      showStatus('copied');
      return;
    }

    if (!isIcon) {
      selectLabel();
    }

    showStatus('select');
    void writeContactEmailToClipboard().then(
      () => showStatus('copied'),
      () => undefined,
    );
  }, [isIcon, ping, selectLabel, showStatus]);

  const tooltipLabel =
    status === 'copied'
      ? 'Copied'
      : status === 'select'
        ? copyShortcutHint()
        : 'Copy my email';

  const statusMessage =
    status === 'copied'
      ? 'Copied to clipboard'
      : status === 'select'
        ? copyShortcutHint()
        : '';

  if (isIcon) {
    return (
      <button
        type="button"
        onClick={handleCopy}
        data-rainbow-skip=""
        aria-label="Copy email address"
        className={`group relative z-10 inline-flex rounded-full p-2.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 ${className ?? ''}`}
      >
        {pinging && (
          <span
            aria-hidden="true"
            className="contact-copy-ping pointer-events-none absolute inset-0 rounded-full border-2 border-primary-500 dark:border-primary-400"
          />
        )}
        <MailIcon sx={{ fontSize: CONTACT_ICON_SIZE }} aria-hidden="true" />
        <span
          ref={tooltipRef}
          data-align="center"
          className={`contact-hover-card pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-30 -translate-x-1/2 max-w-[calc(100vw-2rem)] whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-medium tracking-wide text-neutral-800 shadow-md ring-1 ring-neutral-200/80 dark:bg-primary-400 dark:text-neutral-900 dark:ring-0 ${
            status === 'idle'
              ? 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
              : 'opacity-100'
          }`}
        >
          {tooltipLabel}
        </span>
        <span className="sr-only" role="status" aria-live="polite">
          {statusMessage}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      data-rainbow-skip=""
      title="Copy email address"
      aria-label="Copy email address"
      className={`relative inline-flex items-center gap-2 text-left ${
        className ?? 'z-10 text-primary-600 hover:underline dark:text-primary-400'
      }`}
    >
      {showIcon && (
        <MailIcon className="shrink-0" sx={{ fontSize: 24 }} aria-hidden="true" />
      )}
      <span ref={labelRef}>{email || 'Email'}</span>
      {status !== 'idle' && (
        <span
          className="pointer-events-none absolute bottom-full left-0 z-20 mb-1 whitespace-nowrap rounded-lg bg-primary-600 px-2 py-1 text-neutral-100 opacity-100 dark:bg-primary-400 dark:text-neutral-900"
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </span>
      )}
    </button>
  );
}
