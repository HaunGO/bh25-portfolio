'use client';

import { useEffect } from 'react';
import { applyPointerMode, getPointerMode, subscribePointerMode } from '@/lib/pointer-mode';

export default function PointerModeRuntime() {
  useEffect(() => {
    applyPointerMode(getPointerMode());
    return subscribePointerMode(() => undefined);
  }, []);

  return null;
}
