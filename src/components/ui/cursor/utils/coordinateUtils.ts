import { CursorDazzleStyle, CursorHitRect, CursorHitTarget, ViewportSize } from '../types';

const CURSOR_HIT_SELECTOR = '[data-cursor-hit], [data-advanced-cursor="true"]';
const DAZZLE_STYLES: CursorDazzleStyle[] = ['pulse', 'orbit', 'spark'];

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

const normalizeDazzleStyle = (value: string | undefined): CursorDazzleStyle => {
  if (value && DAZZLE_STYLES.includes(value as CursorDazzleStyle)) {
    return value as CursorDazzleStyle;
  }

  return 'pulse';
};

const toHitRect = (rect: DOMRect): CursorHitRect => ({
  top: rect.top,
  right: rect.right,
  bottom: rect.bottom,
  left: rect.left,
  width: rect.width,
  height: rect.height,
});

const getDistanceToRect = (x: number, y: number, rect: DOMRect): number => {
  const closestX = Math.max(rect.left, Math.min(x, rect.right));
  const closestY = Math.max(rect.top, Math.min(y, rect.bottom));
  const distanceX = x - closestX;
  const distanceY = y - closestY;

  return Math.hypot(distanceX, distanceY);
};

const createHitTarget = (element: HTMLElement): CursorHitTarget | null => {
  if (element.dataset.cursorHit === 'false') return null;

  const rect = element.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;

  return {
    element,
    rect: toHitRect(rect),
    dazzleStyle: normalizeDazzleStyle(element.dataset.cursorDazzle),
  };
};

/**
 * Find the nearest opted-in element that overlaps the cursor halo.
 */
export const findCursorHitTarget = (
  x: number,
  y: number,
  hitRadius: number,
  sourceElement?: HTMLElement | null
): CursorHitTarget | null => {
  const hoveredTarget = sourceElement?.closest<HTMLElement>(CURSOR_HIT_SELECTOR);

  if (hoveredTarget) {
    const target = createHitTarget(hoveredTarget);

    if (target && getDistanceToRect(x, y, hoveredTarget.getBoundingClientRect()) <= hitRadius) {
      return target;
    }
  }

  const candidates = Array.from(document.querySelectorAll<HTMLElement>(CURSOR_HIT_SELECTOR));
  let nearestTarget: CursorHitTarget | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  candidates.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const target = createHitTarget(element);

    if (!target) return;

    const distance = getDistanceToRect(x, y, rect);
    if (distance > hitRadius || distance >= nearestDistance) return;

    nearestDistance = distance;
    nearestTarget = target;
  });

  return nearestTarget;
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
