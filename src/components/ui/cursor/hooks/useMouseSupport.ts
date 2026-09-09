import { useEffect, useState } from 'react';
import { getPointerMode, subscribePointerMode } from '@/lib/pointer-mode';

/**
 * True when the device has a fine pointer with hover (mouse / trackpad).
 */
export const useMouseSupport = (): boolean => {
  const [hasMouse, setHasMouse] = useState(false);

  useEffect(() => {
    const sync = () => setHasMouse(getPointerMode() === 'fine');
    sync();
    return subscribePointerMode((mode) => setHasMouse(mode === 'fine'));
  }, []);

  return hasMouse;
};
