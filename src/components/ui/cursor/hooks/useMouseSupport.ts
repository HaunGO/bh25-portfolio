import { useEffect, useState } from 'react';

/**
 * Hook to detect if device supports mouse
 */
export const useMouseSupport = (): boolean => {
  const [hasMouse, setHasMouse] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if device supports mouse (not touch-only)
    const checkMouseSupport = () => {
      // Primary check: CSS media query for hover capability
      const hasHover = window.matchMedia('(hover: hover)').matches;
      
      // Secondary check: pointer type detection
      const hasPointer = window.matchMedia('(pointer: fine)').matches;
      
      // Tertiary check: no touch capability or touch + mouse
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Device has mouse if it supports hover AND (fine pointer OR no touch)
      const mouseSupported = hasHover && (hasPointer || !hasTouch);
      
      setHasMouse(mouseSupported);
    };

    checkMouseSupport();
    
    // Listen for changes (e.g., if user connects/disconnects mouse)
    const mediaQuery = window.matchMedia('(hover: hover)');
    mediaQuery.addEventListener('change', checkMouseSupport);
    
    return () => mediaQuery.removeEventListener('change', checkMouseSupport);
  }, []);

  return isClient ? hasMouse : false;
};
