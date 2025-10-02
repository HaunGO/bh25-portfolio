import { useEffect, useState } from 'react';

/**
 * Hook to detect if device supports touch
 */
export const useTouchSupport = (): boolean => {
  const [hasTouch, setHasTouch] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkTouchSupport = () => {
      const touchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setHasTouch(touchSupported);
    };

    checkTouchSupport();
  }, []);

  return isClient ? hasTouch : false;
};
