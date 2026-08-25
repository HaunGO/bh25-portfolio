import type { TrailPoint } from './types';

export const TRAIL_CHOREOGRAPHY_EVENT = 'cursor-trail-choreography';
export const TRAIL_POINT_SPACING = 6;

export type TrailChoreographySide = 'top' | 'right' | 'bottom' | 'left';

export type ScribbleOptions = {
  entrySide?: TrailChoreographySide;
  clockwise?: boolean;
};

export type TrailChoreographyRequest = {
  id: string;
  target: string | HTMLElement;
  travelDuration?: number;
  scribbleDuration?: number;
  loops?: number;
  holdDuration?: number;
  returnDuration?: number;
  padding?: number;
  entrySide?: TrailChoreographySide;
  clockwise?: boolean;
};

const SIDE_ANGLE: Record<TrailChoreographySide, number> = {
  right: 0,
  bottom: Math.PI / 2,
  left: Math.PI,
  top: -Math.PI / 2,
};

export const playTrailChoreography = (request: TrailChoreographyRequest) => {
  window.dispatchEvent(
    new CustomEvent<TrailChoreographyRequest>(TRAIL_CHOREOGRAPHY_EVENT, {
      detail: request,
    })
  );
};

export const resolveChoreographyTarget = (
  target: string | HTMLElement
): HTMLElement | null => (
  typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
);

const lerp = (start: number, end: number, amount: number) => (
  start + (end - start) * amount
);

export const sampleScribbleAroundRect = (
  rect: DOMRect,
  progress: number,
  loops: number,
  padding: number,
  options: ScribbleOptions = {}
): TrailPoint => {
  const entrySide = options.entrySide ?? 'left';
  const clockwise = options.clockwise ?? entrySide !== 'left';
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const radiusX = rect.width / 2 + padding;
  const radiusY = rect.height / 2 + padding;
  const turns = progress * loops;
  const angle = SIDE_ANGLE[entrySide] + (clockwise ? 1 : -1) * turns * Math.PI * 2;
  const loopDrift = turns;
  const settle = Math.min(1, progress * 5);
  const wobble = 1 + settle * (
    Math.sin(angle * 2.2 + 0.35) * 0.08
    + Math.sin(angle * 5.1 + loopDrift) * 0.05
    + Math.sin(angle * 0.65) * 0.03
  );
  const grow = 1 + Math.min(turns, loops) * 0.028 * settle;
  const driftX = Math.sin(loopDrift * 1.15) * 6 * settle;
  const driftY = Math.cos(loopDrift * 0.85) * 4 * settle;

  return {
    x: centerX + driftX + Math.cos(angle) * radiusX * wobble * grow,
    y: centerY + driftY + Math.sin(angle) * radiusY * wobble * grow,
  };
};

export const getScribbleEntryPoint = (
  rect: DOMRect,
  padding: number,
  options: ScribbleOptions = {}
): TrailPoint => sampleScribbleAroundRect(rect, 0, 1, padding, options);

export const clampTrailPointToViewport = (
  point: TrailPoint,
  inset = 28
): TrailPoint => ({
  x: Math.min(Math.max(point.x, inset), window.innerWidth - inset),
  y: Math.min(Math.max(point.y, inset), window.innerHeight - inset),
});

export const sampleCubicPoint = (
  start: TrailPoint,
  controlA: TrailPoint,
  controlB: TrailPoint,
  end: TrailPoint,
  progress: number
): TrailPoint => {
  const inverse = 1 - progress;
  const inverseSq = inverse * inverse;
  const progressSq = progress * progress;

  return {
    x:
      inverseSq * inverse * start.x
      + 3 * inverseSq * progress * controlA.x
      + 3 * inverse * progressSq * controlB.x
      + progressSq * progress * end.x,
    y:
      inverseSq * inverse * start.y
      + 3 * inverseSq * progress * controlA.y
      + 3 * inverse * progressSq * controlB.y
      + progressSq * progress * end.y,
  };
};

export const getTravelControlPoints = (
  start: TrailPoint,
  end: TrailPoint,
  tangent: TrailPoint,
  rect: DOMRect
): { controlA: TrailPoint; controlB: TrailPoint } => {
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  const tangentLength = Math.hypot(tangent.x, tangent.y) || 1;
  const nx = tangent.x / tangentLength;
  const ny = tangent.y / tangentLength;
  const approach = Math.min(Math.max(distance * 0.34, 88), 200);
  const fromLeft = Math.max(36, rect.width * 0.2);

  return {
    controlA: {
      x: lerp(start.x, end.x, 0.14) - fromLeft * 0.4,
      y: lerp(start.y, end.y, 0.5),
    },
    controlB: {
      x: end.x - nx * approach - fromLeft,
      y: end.y - ny * approach,
    },
  };
};

export const getReturnControlPoints = (
  start: TrailPoint,
  end: TrailPoint,
  tangent: TrailPoint
): { controlA: TrailPoint; controlB: TrailPoint } => {
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  const tangentLength = Math.hypot(tangent.x, tangent.y) || 1;
  const nx = tangent.x / tangentLength;
  const ny = tangent.y / tangentLength;
  const exit = Math.min(Math.max(distance * 0.32, 80), 190);

  return {
    controlA: {
      x: start.x + nx * exit,
      y: start.y + ny * exit,
    },
    controlB: {
      x: lerp(start.x + nx * exit * 0.2, end.x, 0.68),
      y: lerp(start.y + ny * exit * 0.2, end.y, 0.62),
    },
  };
};

const FINAL_PASS_TURNS = 0.5;
const FINAL_PASS_PEEL = 0.48;

export const estimateScribbleTrailBudget = (
  rect: DOMRect,
  loops: number,
  padding: number,
  baseTrailLength: number
): number => {
  const radiusX = rect.width / 2 + padding;
  const radiusY = rect.height / 2 + padding;
  const perimeter = Math.PI * (
    3 * (radiusX + radiusY)
    - Math.sqrt((3 * radiusX + radiusY) * (radiusX + 3 * radiusY))
  );
  const needed = Math.ceil(
    (perimeter * (loops + FINAL_PASS_TURNS) * 1.15) / TRAIL_POINT_SPACING
  );
  return Math.max(baseTrailLength, Math.min(480, needed));
};

export const sampleFinalPassToPointer = (
  rect: DOMRect,
  progress: number,
  loops: number,
  padding: number,
  pointer: TrailPoint,
  options: ScribbleOptions = {}
): TrailPoint => {
  const extraProgress = FINAL_PASS_TURNS / Math.max(loops, 0.001);

  if (progress < FINAL_PASS_PEEL) {
    const extraTurns = FINAL_PASS_TURNS * (progress / FINAL_PASS_PEEL);
    return sampleScribbleAroundRect(
      rect,
      1 + extraTurns / loops,
      loops,
      padding,
      options
    );
  }

  const rightPoint = sampleScribbleAroundRect(
    rect,
    1 + extraProgress,
    loops,
    padding,
    options
  );
  const beforeRight = sampleScribbleAroundRect(
    rect,
    1 + extraProgress - 0.02,
    loops,
    padding,
    options
  );
  const { controlA, controlB } = getReturnControlPoints(
    rightPoint,
    pointer,
    { x: rightPoint.x - beforeRight.x, y: rightPoint.y - beforeRight.y }
  );

  return sampleCubicPoint(
    rightPoint,
    controlA,
    controlB,
    pointer,
    (progress - FINAL_PASS_PEEL) / (1 - FINAL_PASS_PEEL)
  );
};

export const interpolateTrailSegment = (
  from: TrailPoint,
  to: TrailPoint,
  spacing = TRAIL_POINT_SPACING
): TrailPoint[] => {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const steps = Math.max(1, Math.min(8, Math.ceil(distance / spacing)));

  return Array.from({ length: steps }, (_, index) => {
    const amount = (index + 1) / steps;
    return {
      x: lerp(from.x, to.x, amount),
      y: lerp(from.y, to.y, amount),
    };
  });
};
