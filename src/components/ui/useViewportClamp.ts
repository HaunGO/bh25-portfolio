import { useCallback, useRef } from 'react';

const VIEWPORT_MARGIN = 16;

function viewportWidth() {
  return Math.round(window.visualViewport?.width ?? window.innerWidth);
}

export function useViewportClamp<T extends HTMLElement>() {
  const cleanupRef = useRef<(() => void) | null>(null);

  return useCallback((element: T | null) => {
    cleanupRef.current?.();
    cleanupRef.current = null;

    if (!element) {
      return;
    }

    const clamp = () => {
      element.style.setProperty('--contact-popover-shift', '0px');
      const rect = element.getBoundingClientRect();
      const width = viewportWidth();
      const limit = width - VIEWPORT_MARGIN;
      let shift = 0;

      if (rect.width >= width - VIEWPORT_MARGIN * 2) {
        shift = VIEWPORT_MARGIN - rect.left;
      } else if (rect.left < VIEWPORT_MARGIN) {
        shift = VIEWPORT_MARGIN - rect.left;
      } else if (rect.right > limit) {
        shift = limit - rect.right;
      }

      element.style.setProperty('--contact-popover-shift', `${Math.round(shift)}px`);
    };

    clamp();
    const frame = window.requestAnimationFrame(clamp);
    const observer = new ResizeObserver(clamp);
    observer.observe(element);
    window.addEventListener('resize', clamp);
    window.visualViewport?.addEventListener('resize', clamp);

    cleanupRef.current = () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', clamp);
      window.visualViewport?.removeEventListener('resize', clamp);
    };
  }, []);
}
