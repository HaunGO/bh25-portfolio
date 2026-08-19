import { CursorBorderEdge, CursorHitRect, CursorMorphStyle, TrailPoint } from '../types';

const MIN_MESH_POINTS = 12;

const normalizeMeshPointCount = (pointCount: number): number => (
  Math.max(MIN_MESH_POINTS, Math.round(pointCount))
);

const formatCoord = (value: number): string => (
  Number(value.toFixed(3)).toString()
);

const signedPower = (value: number, power: number): number => (
  Math.sign(value) * Math.pow(Math.abs(value), power)
);

const biasTowardMidpoint = (progress: number, exponent: number): number => {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const clampedExponent = Math.max(1, exponent);
  const offset = clampedProgress - 0.5;

  return 0.5 + Math.sign(offset) * Math.pow(Math.abs(offset) * 2, clampedExponent) / 2;
};

const createExponentiallyBiasedAngle = (
  index: number,
  pointCount: number,
  exponent: number
): number => {
  const quadrantPosition = (index / pointCount) * 4;
  const quadrant = Math.floor(quadrantPosition);
  const quadrantProgress = quadrantPosition - quadrant;
  const biasedProgress = biasTowardMidpoint(quadrantProgress, exponent);

  return -Math.PI / 2 + (quadrant + biasedProgress) * (Math.PI / 2);
};

/**
 * Create circle path for ring at specified size
 */
export const createCirclePath = (
  radius: number, 
  centerX: number = radius, 
  centerY: number = radius
): string => {
  return [
    `M ${centerX - radius} ${centerY}`,
    `A ${radius} ${radius} 0 1 1 ${centerX + radius} ${centerY}`,
    `A ${radius} ${radius} 0 1 1 ${centerX - radius} ${centerY}`,
    'Z',
  ].join(' ');
};

export const createHaloPath = (
  centerX: number,
  centerY: number,
  size: number
): string => {
  const radius = size / 2;

  return createRoundedRectPath({
    top: centerY - radius,
    right: centerX + radius,
    bottom: centerY + radius,
    left: centerX - radius,
    width: size,
    height: size,
  }, 0, radius);
};

const createCircleMeshPoints = (
  centerX: number,
  centerY: number,
  size: number,
  pointCount: number
): TrailPoint[] => {
  const radius = size / 2;
  const normalizedPointCount = normalizeMeshPointCount(pointCount);

  return Array.from({ length: normalizedPointCount }, (_, index) => {
    const angle = -Math.PI / 2 + (index / normalizedPointCount) * Math.PI * 2;

    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  });
};

const createRectangleMeshPoints = (
  rect: CursorHitRect,
  pointCount: number
): TrailPoint[] => {
  const normalizedPointCount = normalizeMeshPointCount(pointCount);
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  const halfWidth = width / 2;
  const perimeter = width * 2 + height * 2;
  const centerX = rect.left + width / 2;
  const top = rect.top;
  const right = rect.right;
  const bottom = rect.bottom;
  const left = rect.left;

  return Array.from({ length: normalizedPointCount }, (_, index) => {
    let distance = (index / normalizedPointCount) * perimeter;

    if (distance <= halfWidth) {
      return { x: centerX + distance, y: top };
    }

    distance -= halfWidth;

    if (distance <= height) {
      return { x: right, y: top + distance };
    }

    distance -= height;

    if (distance <= width) {
      return { x: right - distance, y: bottom };
    }

    distance -= width;

    if (distance <= height) {
      return { x: left, y: bottom - distance };
    }

    distance -= height;

    return { x: left + distance, y: top };
  });
};

const createFlatLineMeshPoints = (
  rect: CursorHitRect,
  pointCount: number,
  yOffset: number = 4
): TrailPoint[] => {
  const normalizedPointCount = normalizeMeshPointCount(pointCount);
  const halfPointCount = Math.ceil(normalizedPointCount / 2);
  const remainingPointCount = normalizedPointCount - halfPointCount;
  const minWidth = 24;
  const targetWidth = Math.max(minWidth, rect.width);
  const centerX = rect.left + rect.width / 2;
  const left = centerX - targetWidth / 2;
  const right = centerX + targetWidth / 2;
  const y = rect.bottom + yOffset;

  return Array.from({ length: normalizedPointCount }, (_, index) => {
    if (index < halfPointCount) {
      const progress = halfPointCount === 1 ? 1 : index / (halfPointCount - 1);
      return {
        x: left + (right - left) * progress,
        y,
      };
    }

    const progress = remainingPointCount <= 1 ? 1 : (index - halfPointCount) / (remainingPointCount - 1);
    return {
      x: right - (right - left) * progress,
      y,
    };
  });
};

const createSuperellipseMeshPoints = (
  rect: CursorHitRect,
  pointCount: number,
  morphStyle: CursorMorphStyle,
  pointExponent: number
): TrailPoint[] => {
  if (morphStyle === 'angular') {
    return createRectangleMeshPoints(rect, pointCount);
  }

  const normalizedPointCount = normalizeMeshPointCount(pointCount);
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const radiusX = rect.width / 2;
  const radiusY = rect.height / 2;
  const exponent = morphStyle === 'gooey' ? 3.4 : 18;
  const power = 2 / exponent;

  return Array.from({ length: normalizedPointCount }, (_, index) => {
    const angle = createExponentiallyBiasedAngle(index, normalizedPointCount, pointExponent);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return {
      x: centerX + signedPower(cos, power) * radiusX,
      y: centerY + signedPower(sin, power) * radiusY,
    };
  });
};

const createClosedMeshPath = (
  points: TrailPoint[],
  tension: number
): string => {
  if (points.length === 0) return '';

  const commands = [`M ${formatCoord(points[0].x)} ${formatCoord(points[0].y)}`];
  const controlScale = tension / 6;

  if (tension <= 0) {
    points.slice(1).forEach((point) => {
      commands.push(`L ${formatCoord(point.x)} ${formatCoord(point.y)}`);
    });
    commands.push('Z');

    return commands.join(' ');
  }

  points.forEach((point, index) => {
    const previous = points[(index - 1 + points.length) % points.length];
    const next = points[(index + 1) % points.length];
    const afterNext = points[(index + 2) % points.length];

    const controlOneX = point.x + (next.x - previous.x) * controlScale;
    const controlOneY = point.y + (next.y - previous.y) * controlScale;
    const controlTwoX = next.x - (afterNext.x - point.x) * controlScale;
    const controlTwoY = next.y - (afterNext.y - point.y) * controlScale;

    commands.push([
      'C',
      formatCoord(controlOneX),
      formatCoord(controlOneY),
      formatCoord(controlTwoX),
      formatCoord(controlTwoY),
      formatCoord(next.x),
      formatCoord(next.y),
    ].join(' '));
  });

  commands.push('Z');

  return commands.join(' ');
};

export const createMeshHaloPath = (
  centerX: number,
  centerY: number,
  size: number,
  pointCount: number,
  morphStyle: CursorMorphStyle
): string => (
  createClosedMeshPath(
    createCircleMeshPoints(centerX, centerY, size, pointCount),
    morphStyle === 'gooey' ? 1 : 0
  )
);

export const createFlatLineTargetPath = (
  targetRect: CursorHitRect,
  pointCount: number
): string => (
  createClosedMeshPath(
    createFlatLineMeshPoints(targetRect, pointCount),
    0
  )
);

export const createBorderLineTargetPath = (
  targetRect: CursorHitRect,
  pointCount: number,
  edge: CursorBorderEdge
): string => {
  const y = edge === 'bottom' ? targetRect.bottom : targetRect.top;

  return createClosedMeshPath(
    createFlatLineMeshPoints({
      ...targetRect,
      top: y,
      bottom: y,
      height: 0,
    }, pointCount, 0),
    0
  );
};

/**
 * Create a morph target that keeps the cursor halo inside the active outline.
 */
export const createCursorAwareTargetPath = (
  targetRect: CursorHitRect,
  cursorX: number,
  cursorY: number,
  cursorSize: number,
  padding: number,
  radius: number,
  morphStyle: CursorMorphStyle
): string => {
  const cursorRadius = cursorSize / 2;
  const left = Math.min(targetRect.left, cursorX - cursorRadius);
  const top = Math.min(targetRect.top, cursorY - cursorRadius);
  const right = Math.max(targetRect.right, cursorX + cursorRadius);
  const bottom = Math.max(targetRect.bottom, cursorY + cursorRadius);
  const cornerRadius = morphStyle === 'gooey'
    ? Math.max(radius, Math.min(cursorRadius, 24))
    : 0;

  return createRoundedRectPath({
    top,
    right,
    bottom,
    left,
    width: right - left,
    height: bottom - top,
  }, padding, cornerRadius);
};

export const createMeshCursorAwareTargetPath = (
  targetRect: CursorHitRect,
  cursorX: number,
  cursorY: number,
  cursorSize: number,
  padding: number,
  morphStyle: CursorMorphStyle,
  pointCount: number,
  pointExponent: number
): string => {
  const cursorRadius = cursorSize / 2;
  const left = Math.min(targetRect.left, cursorX - cursorRadius) - padding;
  const top = Math.min(targetRect.top, cursorY - cursorRadius) - padding;
  const right = Math.max(targetRect.right, cursorX + cursorRadius) + padding;
  const bottom = Math.max(targetRect.bottom, cursorY + cursorRadius) + padding;
  const targetBounds = {
    top,
    right,
    bottom,
    left,
    width: right - left,
    height: bottom - top,
  };
  const points = createSuperellipseMeshPoints(targetBounds, pointCount, morphStyle, pointExponent);
  const tension = morphStyle === 'gooey' ? 0.95 : 0;

  return createClosedMeshPath(points, tension);
};

/**
 * Create filled circle path for cursor dot
 */
export const createCursorPath = (
  radius: number, 
  centerX: number = radius, 
  centerY: number = radius
): string => {
  return createCirclePath(radius, centerX, centerY);
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
 * Create a rounded rectangle path around an active hit target.
 */
export const createRoundedRectPath = (
  rect: CursorHitRect,
  padding: number,
  radius: number
): string => {
  const left = rect.left - padding;
  const top = rect.top - padding;
  const right = rect.right + padding;
  const bottom = rect.bottom + padding;
  const cornerRadius = Math.min(radius, (right - left) / 2, (bottom - top) / 2);

  return [
    `M ${left + cornerRadius} ${top}`,
    `H ${right - cornerRadius}`,
    `A ${cornerRadius} ${cornerRadius} 0 0 1 ${right} ${top + cornerRadius}`,
    `V ${bottom - cornerRadius}`,
    `A ${cornerRadius} ${cornerRadius} 0 0 1 ${right - cornerRadius} ${bottom}`,
    `H ${left + cornerRadius}`,
    `A ${cornerRadius} ${cornerRadius} 0 0 1 ${left} ${bottom - cornerRadius}`,
    `V ${top + cornerRadius}`,
    `A ${cornerRadius} ${cornerRadius} 0 0 1 ${left + cornerRadius} ${top}`,
    'Z',
  ].join(' ');
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
