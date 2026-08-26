'use client';

import { useEffect } from 'react';
import { syncRainbowText } from '@/lib/rainbow-text';

export default function RainbowTextRuntime() {
  useEffect(() => {
    syncRainbowText();

    const observer = new MutationObserver(() => {
      syncRainbowText();
    });

    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-rainbow-text'],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
