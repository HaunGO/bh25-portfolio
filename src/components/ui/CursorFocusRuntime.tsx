'use client';

import { useEffect } from 'react';
import { syncCursorFocus } from '@/lib/cursor-focus';

export default function CursorFocusRuntime() {
  useEffect(() => {
    syncCursorFocus();

    const observer = new MutationObserver(() => {
      syncCursorFocus();
    });

    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-cursor-focus'],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
