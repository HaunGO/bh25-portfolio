import { ViewportSize } from '../types';

/**
 * Convert screen coordinates to SVG coordinates
 * Currently using direct 1:1 mapping - no conversion needed
 */
export const screenToSVG = (screenX: number, screenY: number): { x: number; y: number } => {
  return { x: screenX, y: screenY };
};

/**
 * Update viewport size state
 */
export const getViewportSize = (): ViewportSize => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

/**
 * Check if element should trigger hover state
 */
export const isHoverable = (element: HTMLElement | null): boolean => {
  if (!element) return false;
  
  const hoverableSelectors = ['a', 'button'];
  
  return hoverableSelectors.some(selector => 
    element.matches(selector) || element.closest(selector)
  );
};

/**
 * Check if element should trigger click state
 */
export const isClickable = (element: HTMLElement | null): boolean => {
  if (!element) return false;
  
  const clickableSelectors = [
    'a', 'button', '[role="button"]'
  ];
  
  return clickableSelectors.some(selector => 
    element.matches(selector) || element.closest(selector)
  );
};

/**
 * Determine which touch zone a point is in
 */
export const getTouchZone = (
  clientX: number, 
  viewportWidth: number, 
  touchZones: { trailZone: { left: number; right: number }; scrollZone: { left: number; right: number } }
): 'trail' | 'scroll' => {
  const relativeX = clientX / viewportWidth;
  
  if (relativeX >= touchZones.trailZone.left && relativeX < touchZones.trailZone.right) {
    return 'trail';
  } else if (relativeX >= touchZones.scrollZone.left && relativeX <= touchZones.scrollZone.right) {
    return 'scroll';
  }
  
  // Default to trail zone if outside defined zones
  return 'trail';
};
