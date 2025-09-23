import { TrailPoint, ViewportSize } from '../types';

/**
 * Create circle path for ring at specified size
 */
export const createCirclePath = (
  radius: number, 
  centerX: number = radius, 
  centerY: number = radius
): string => {
  return `M ${centerX} ${centerY} A ${radius} ${radius} 0 1 1 ${centerX + 0.1} ${centerY} Z`;
};

/**
 * Create filled circle path for cursor dot
 */
export const createCursorPath = (
  radius: number, 
  centerX: number = radius, 
  centerY: number = radius
): string => {
  return `M ${centerX} ${centerY} A ${radius} ${radius} 0 1 1 ${centerX + 0.1} ${centerY} Z`;
};

/**
 * Create rectangle path for link hover effect
 */
export const createRectanglePath = (rect: DOMRect): string => {
  const topLeft = { x: rect.left, y: rect.top };
  const topRight = { x: rect.right, y: rect.top };
  const bottomRight = { x: rect.right, y: rect.bottom };
  const bottomLeft = { x: rect.left, y: rect.bottom };
  
  return `M ${topLeft.x} ${topLeft.y} L ${topRight.x} ${topRight.y} L ${bottomRight.x} ${bottomRight.y} L ${bottomLeft.x} ${bottomLeft.y} Z`;
};

/**
 * Generate SVG path data from trail points
 */
export const generatePathData = (points: TrailPoint[]): string => {
  if (points.length < 2) return '';
  
  return points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    } else {
      return `${path} L ${point.x} ${point.y}`;
    }
  }, '');
};

/**
 * Update SVG path element with trail points
 */
export const updatePath = (pathElement: SVGPathElement | null, points: TrailPoint[]): void => {
  if (!pathElement || points.length < 2) {
    if (pathElement) pathElement.setAttribute('d', '');
    return;
  }
  
  const pathData = generatePathData(points);
  pathElement.setAttribute('d', pathData);
};

/**
 * Update multiple trail layer paths
 */
export const updateTrailLayers = (
  pathElements: Array<SVGPathElement | null>, 
  layers: TrailPoint[][]
): void => {
  layers.forEach((layer, index) => {
    const pathElement = pathElements[index];
    updatePath(pathElement, layer);
  });
};
