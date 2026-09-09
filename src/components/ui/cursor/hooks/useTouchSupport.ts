import { useEffect, useState } from 'react';
import { getPointerMode, subscribePointerMode } from '@/lib/pointer-mode';

/**
 * True when the primary pointing method is a coarse pointer (finger / no hover).
 */
export const useTouchSupport = (): boolean => {
  const [hasTouch, setHasTouch] = useState(false);

  useEffect(() => {
    const sync = () => setHasTouch(getPointerMode() === 'coarse');
    sync();
    return subscribePointerMode((mode) => setHasTouch(mode === 'coarse'));
  }, []);

  return hasTouch;
};
