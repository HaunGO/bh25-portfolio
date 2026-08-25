import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MouseTrailManagerProps, TrailPoint } from '../types';
import { screenToSVG, isClickable, findCursorHitTarget } from '../utils/coordinateUtils';
import {
  TRAIL_CHOREOGRAPHY_EVENT,
  estimateScribbleTrailBudget,
  getTravelControlPoints,
  interpolateTrailSegment,
  resolveChoreographyTarget,
  sampleCubicPoint,
  sampleFinalPassToPointer,
  sampleScribbleAroundRect,
  clampTrailPointToViewport,
  type TrailChoreographyRequest,
} from '../choreography';

/**
 * Desktop mouse event handling + trail generation
 */
const MouseTrailManager = memo(function MouseTrailManager({ 
  config, 
  onTrailUpdate, 
  onCursorUpdate, 
  disabled = false 
}: MouseTrailManagerProps) {
  const [trailLayers, setTrailLayers] = useState<TrailPoint[][]>(
    config.trailLayers.map(() => [])
  );
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const configRef = useRef(config);
  const hijackActiveRef = useRef(false);
  const lastHijackPointRef = useRef<TrailPoint | null>(null);
  const choreographyTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const pendingResumeRef = useRef(false);
  const resumeOriginRef = useRef<{ x: number; y: number } | null>(null);
  const trailBudgetRef = useRef(config.trailLength);
  const choreographyCapRef = useRef(config.trailLength);

  configRef.current = config;

  const sliceTrail = useCallback((layers: TrailPoint[][], budget: number) => (
    layers.map((layer, index) => {
      const layerLength = Math.floor(
        configRef.current.trailLayers[index].percentage * budget
      );
      return layer.slice(-Math.max(2, layerLength));
    })
  ), []);

  const stopChoreography = useCallback(() => {
    choreographyTimelineRef.current?.kill();
    choreographyTimelineRef.current = null;
    hijackActiveRef.current = false;
    pendingResumeRef.current = false;
    resumeOriginRef.current = null;
    lastHijackPointRef.current = null;
    trailBudgetRef.current = configRef.current.trailLength;
    choreographyCapRef.current = configRef.current.trailLength;
  }, []);

  const appendTrailPoints = useCallback((points: TrailPoint[]) => {
    if (points.length === 0) return;

    lastHijackPointRef.current = points[points.length - 1];

    setTrailLayers((prev) => {
      const nextLayers = prev.map((layer) => layer.concat(points));
      const longest = Math.max(...nextLayers.map((layer) => layer.length), 0);
      const budget = Math.min(
        choreographyCapRef.current,
        Math.max(longest, configRef.current.trailLength)
      );
      trailBudgetRef.current = budget;
      return sliceTrail(nextLayers, budget);
    });
  }, [sliceTrail]);

  const playChoreography = useCallback((request: TrailChoreographyRequest) => {
    const target = resolveChoreographyTarget(request.target);
    const start = lastPointerRef.current ?? lastHijackPointRef.current ?? {
      x: window.innerWidth - 56,
      y: 40,
    };
    if (!target) return;

    const travelDuration = request.travelDuration ?? 1;
    const scribbleDuration = request.scribbleDuration ?? 1;
    const loops = request.loops ?? 2;
    const holdDuration = request.holdDuration ?? 0;
    const returnDuration = request.returnDuration ?? 0.9;
    const padding = request.padding ?? 22;
    const scribbleOptions = {
      entrySide: request.entrySide ?? 'left',
      clockwise: request.clockwise ?? false,
    };

    stopChoreography();
    hijackActiveRef.current = true;
    lastHijackPointRef.current = start;
    choreographyCapRef.current = estimateScribbleTrailBudget(
      target.getBoundingClientRect(),
      loops,
      padding,
      configRef.current.trailLength
    );

    const travel = { progress: 0 };
    const scribble = { progress: 0 };
    const home = { progress: 0 };

    const timeline = gsap.timeline({
      onComplete: () => {
        choreographyTimelineRef.current = null;
        hijackActiveRef.current = false;
        lastHijackPointRef.current = null;
        pendingResumeRef.current = true;
        resumeOriginRef.current = lastPointerRef.current;
      },
    });

    timeline.to(travel, {
      progress: 1,
      duration: travelDuration,
      ease: 'power2.in',
      onUpdate: () => {
        const liveTarget = resolveChoreographyTarget(request.target);
        if (!liveTarget || !lastHijackPointRef.current) return;

        const rect = liveTarget.getBoundingClientRect();
        const destination = clampTrailPointToViewport(
          sampleScribbleAroundRect(rect, 0, loops, padding, scribbleOptions)
        );
        const ahead = clampTrailPointToViewport(
          sampleScribbleAroundRect(rect, 0.02, loops, padding, scribbleOptions)
        );
        const { controlA, controlB } = getTravelControlPoints(
          start,
          destination,
          { x: ahead.x - destination.x, y: ahead.y - destination.y },
          rect
        );
        const nextPoint = sampleCubicPoint(
          start,
          controlA,
          controlB,
          destination,
          travel.progress
        );
        appendTrailPoints(
          interpolateTrailSegment(lastHijackPointRef.current, nextPoint)
        );
      },
    });

    timeline.to(scribble, {
      progress: 1,
      duration: scribbleDuration,
      ease: 'none',
      onUpdate: () => {
        const liveTarget = resolveChoreographyTarget(request.target);
        if (!liveTarget || !lastHijackPointRef.current) return;

        const nextPoint = sampleScribbleAroundRect(
          liveTarget.getBoundingClientRect(),
          scribble.progress,
          loops,
          padding,
          scribbleOptions
        );
        appendTrailPoints(
          interpolateTrailSegment(lastHijackPointRef.current, nextPoint)
        );
      },
    });

    if (holdDuration > 0) {
      timeline.to({}, { duration: holdDuration });
    }

    timeline.to(home, {
      progress: 1,
      duration: returnDuration,
      ease: 'power1.out',
      onUpdate: () => {
        const pointer = lastPointerRef.current;
        const liveTarget = resolveChoreographyTarget(request.target);
        if (!pointer || !lastHijackPointRef.current) return;

        const destination = clampTrailPointToViewport(pointer);
        const nextPoint = liveTarget
          ? sampleFinalPassToPointer(
              liveTarget.getBoundingClientRect(),
              home.progress,
              loops,
              padding,
              destination,
              scribbleOptions
            )
          : destination;

        appendTrailPoints(
          interpolateTrailSegment(lastHijackPointRef.current, nextPoint)
        );
      },
    });

    choreographyTimelineRef.current = timeline;
  }, [appendTrailPoints, stopChoreography]);

  // Create ripple effect on click
  const createRipple = useCallback((x: number, y: number) => {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '72px';
    ripple.style.height = '72px';
    ripple.style.border = '5px solid rgba(59, 130, 246, 0.8)';
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9997';
    ripple.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(ripple);
    gsap.fromTo(ripple, 
      { scale: 0, opacity: 1 },
      { 
        scale: 1.5, 
        opacity: 0, 
        duration: 0.3, 
        ease: 'power1.out',
        onComplete: () => {
          if (document.body.contains(ripple)) {
            document.body.removeChild(ripple);
          }
        }
      }
    );
  }, []);

  const syncCursorTarget = useCallback((x: number, y: number, sourceElement?: HTMLElement | null) => {
    const hitTarget = findCursorHitTarget(
      x,
      y,
      config.hitRadius,
      sourceElement
    );

    onCursorUpdate({
      x,
      y,
      isHovering: Boolean(hitTarget),
      isVisible: true,
      target: hitTarget,
    });
  }, [config.hitRadius, onCursorUpdate]);

  const updateCursor = useCallback((e: MouseEvent) => {
    lastPointerRef.current = { x: e.clientX, y: e.clientY };

    syncCursorTarget(
      e.clientX,
      e.clientY,
      e.target instanceof HTMLElement ? e.target : null
    );

    if (hijackActiveRef.current) return;

    if (pendingResumeRef.current) {
      const origin = resumeOriginRef.current ?? lastPointerRef.current;
      const distance = origin
        ? Math.hypot(e.clientX - origin.x, e.clientY - origin.y)
        : Number.POSITIVE_INFINITY;
      if (distance < 8) return;
      pendingResumeRef.current = false;
      resumeOriginRef.current = null;
    }

    const svgPoint = screenToSVG(e.clientX, e.clientY);

    setTrailLayers((prev) => {
      const nextLayers = prev.map((layer) => [...layer, svgPoint]);
      const normalLength = configRef.current.trailLength;
      const longest = Math.max(...nextLayers.map((layer) => layer.length), 0);
      const excess = Math.max(0, longest - normalLength);
      const drop = Math.max(3, Math.round(excess * 0.1));
      const budget = longest > normalLength
        ? Math.max(normalLength, longest - drop)
        : normalLength;
      trailBudgetRef.current = budget;
      return sliceTrail(nextLayers, budget);
    });
  }, [sliceTrail, syncCursorTarget]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isClickableElement = isClickable(target);
    
    if (isClickableElement && !hijackActiveRef.current) {
      createRipple(e.clientX, e.clientY);
    }
    
    onCursorUpdate({ isClicking: true });
  }, [createRipple, onCursorUpdate]);

  const handleMouseUp = useCallback(() => {
    onCursorUpdate({ isClicking: false });
  }, [onCursorUpdate]);

  const handleMouseLeave = useCallback(() => {
    if (hijackActiveRef.current) return;

    lastPointerRef.current = null;
    onCursorUpdate({
      isHovering: false,
      isVisible: false,
      target: null,
    });
  }, [onCursorUpdate]);

  const handleScroll = useCallback(() => {
    if (hijackActiveRef.current) return;

    const lastPointer = lastPointerRef.current;
    if (!lastPointer || scrollFrameRef.current !== null) return;

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = null;
      const sourceElement = document.elementFromPoint(lastPointer.x, lastPointer.y);

      syncCursorTarget(
        lastPointer.x,
        lastPointer.y,
        sourceElement instanceof HTMLElement ? sourceElement : null
      );
    });
  }, [syncCursorTarget]);

  const handleScrollEnd = useCallback(() => {
    // Scroll end logic if needed
  }, []);

  const handleResize = useCallback(() => {
    if (hijackActiveRef.current) {
      stopChoreography();
    }
    setTrailLayers(config.trailLayers.map(() => []));
  }, [config.trailLayers, stopChoreography]);

  useEffect(() => {
    if (disabled) return;

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scrollend', handleScrollEnd, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }

      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scrollend', handleScrollEnd);
      window.removeEventListener('resize', handleResize);
    };
  }, [disabled, updateCursor, handleMouseDown, handleMouseUp, handleMouseLeave, handleScroll, handleScrollEnd, handleResize]);

  useEffect(() => {
    const handleChoreography = (event: Event) => {
      const request = (event as CustomEvent<TrailChoreographyRequest>).detail;
      if (!request?.target) return;
      playChoreography(request);
    };

    window.addEventListener(TRAIL_CHOREOGRAPHY_EVENT, handleChoreography);

    return () => {
      window.removeEventListener(TRAIL_CHOREOGRAPHY_EVENT, handleChoreography);
      stopChoreography();
    };
  }, [playChoreography, stopChoreography]);

  useEffect(() => {
    onTrailUpdate(trailLayers);
  }, [trailLayers, onTrailUpdate]);

  return null;
});

export default MouseTrailManager;
