'use client';

import { useEffect, useState } from 'react';
import {
  applyPointerMode,
  getPointerMode,
  readPointerMode,
  subscribePointerMode,
  type PointerMode,
} from '@/lib/pointer-mode';

export function usePointerMode(): PointerMode {
  const [mode, setMode] = useState<PointerMode>('none');

  useEffect(() => {
    setMode(applyPointerMode(readPointerMode() === 'none' ? getPointerMode() : readPointerMode()));
    return subscribePointerMode(setMode);
  }, []);

  return mode;
}

export function useIsCoarsePointer() {
  return usePointerMode() === 'coarse';
}
