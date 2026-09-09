import { memo, useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TouchTrailManagerProps, TrailPoint } from '../types';
import { screenToSVG } from '../utils/coordinateUtils';
import { interpolateTrailSegment } from '../choreography';
import { prefersReducedMotion } from '@/lib/motion';

const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, summary, [role="button"], [contenteditable="true"]';

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR));
}

function pulseAt(x: number, y: number) {
  const pulse = document.createElement('div');
  pulse.style.cssText = [
    'position:fixed',
    `left:${x}px`,
    `top:${y}px`,
    'width:64px',
    'height:64px',
    'border:3px solid rgba(56, 189, 248, 0.85)',
    'border-radius:50%',
    'pointer-events:none',
    'z-index:9997',
    'transform:translate(-50%,-50%)',
  ].join(';');
  document.body.appendChild(pulse);
  gsap.fromTo(
    pulse,
    { scale: 0.35, opacity: 0.9 },
    {
      scale: 1.35,
      opacity: 0,
      duration: 0.38,
      ease: 'power2.out',
      onComplete: () => pulse.remove(),
    },
  );
}

/**
 * Hold-to-draw. Flick scrolls natively. Press still, then paint.
 * Draw mode skips the hold and locks the gesture immediately.
 * Non-passive touchmove is attached only while drawing so scroll stays cheap.
 */
const TouchTrailManager = memo(function TouchTrailManager({
  config,
  onTrailUpdate,
  onCursorUpdate,
  disabled = false,
  drawMode = false,
}: TouchTrailManagerProps) {
  const drawingRef = useRef(false);
  const holdTimerRef = useRef(0);
  const startRef = useRef<TrailPoint | null>(null);
  const lastPointRef = useRef<TrailPoint | null>(null);
  const layersRef = useRef<TrailPoint[][]>(config.trailLayers.map(() => []));
  const configRef = useRef(config);
  const drawModeRef = useRef(drawMode);
  const drawMoveRef = useRef<((event: TouchEvent) => void) | null>(null);

  configRef.current = config;
  drawModeRef.current = drawMode;

  const clearHold = useCallback(() => {
    window.clearTimeout(holdTimerRef.current);
    holdTimerRef.current = 0;
  }, []);

  const detachDrawMove = useCallback(() => {
    if (!drawMoveRef.current) {
      return;
    }
    document.removeEventListener('touchmove', drawMoveRef.current);
    drawMoveRef.current = null;
  }, []);

  const sliceLayers = useCallback((layers: TrailPoint[][]) => {
    const { trailLayers, trailLength } = configRef.current;
    return layers.map((layer, index) => {
      const layerLength = Math.max(
        2,
        Math.floor(trailLayers[index].percentage * trailLength),
      );
      return layer.slice(-layerLength);
    });
  }, []);

  const publish = useCallback(
    (layers: TrailPoint[][]) => {
      layersRef.current = layers;
      onTrailUpdate(layers);
    },
    [onTrailUpdate],
  );

  const appendPoint = useCallback(
    (point: TrailPoint) => {
      const last = lastPointRef.current;
      if (!last) {
        lastPointRef.current = point;
        return;
      }

      const moved = Math.hypot(point.x - last.x, point.y - last.y);
      if (moved < configRef.current.minMove) {
        return;
      }

      const segment = interpolateTrailSegment(last, point);
      lastPointRef.current = point;
      publish(
        sliceLayers(
          layersRef.current.map((layer) => layer.concat(segment)),
        ),
      );
    },
    [publish, sliceLayers],
  );

  const attachDrawMove = useCallback(() => {
    if (drawMoveRef.current) {
      return;
    }

    const onDrawMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch || !drawingRef.current) {
        return;
      }
      event.preventDefault();
      appendPoint(screenToSVG(touch.clientX, touch.clientY));
    };

    drawMoveRef.current = onDrawMove;
    document.addEventListener('touchmove', onDrawMove, { passive: false });
  }, [appendPoint]);

  const arm = useCallback(
    (point: TrailPoint) => {
      if (drawingRef.current || prefersReducedMotion()) {
        return;
      }

      drawingRef.current = true;
      lastPointRef.current = point;
      const svg = document.querySelector<SVGElement>('[data-cursor-trail]');
      if (svg) {
        gsap.killTweensOf(svg);
        gsap.set(svg, { opacity: 1 });
      }
      pulseAt(point.x, point.y);
      onCursorUpdate({
        x: point.x,
        y: point.y,
        isVisible: true,
        isHovering: false,
        target: null,
      });
      publish(configRef.current.trailLayers.map(() => [point]));
      attachDrawMove();
    },
    [attachDrawMove, onCursorUpdate, publish],
  );

  const fadeOut = useCallback(() => {
    const svg = document.querySelector<SVGElement>('[data-cursor-trail]');
    if (!svg || layersRef.current.every((layer) => layer.length === 0)) {
      publish(configRef.current.trailLayers.map(() => []));
      return;
    }

    gsap.killTweensOf(svg);
    gsap.set(svg, { opacity: 1 });
    gsap.to(svg, {
      opacity: 0,
      duration: configRef.current.fadeDuration,
      ease: 'power2.out',
      onComplete: () => {
        publish(configRef.current.trailLayers.map(() => []));
        gsap.set(svg, { opacity: 1 });
      },
    });
  }, [publish]);

  const resetGesture = useCallback(() => {
    const wasDrawing = drawingRef.current;
    clearHold();
    detachDrawMove();
    drawingRef.current = false;
    startRef.current = null;
    lastPointRef.current = null;
    onCursorUpdate({
      isHovering: false,
      isVisible: false,
      target: null,
    });
    if (wasDrawing) {
      fadeOut();
    }
  }, [clearHold, detachDrawMove, fadeOut, onCursorUpdate]);

  useEffect(() => {
    if (disabled) {
      return;
    }

    const handleTouchStart = (event: TouchEvent) => {
      if (prefersReducedMotion() || event.touches.length !== 1) {
        return;
      }

      if (isInteractiveTarget(event.target)) {
        return;
      }

      const touch = event.touches[0];
      const point = screenToSVG(touch.clientX, touch.clientY);
      startRef.current = point;
      lastPointRef.current = point;
      drawingRef.current = false;
      clearHold();
      detachDrawMove();

      if (drawModeRef.current) {
        event.preventDefault();
        arm(point);
        return;
      }

      holdTimerRef.current = window.setTimeout(() => {
        const start = startRef.current;
        if (start) {
          arm(start);
        }
      }, configRef.current.holdMs);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (drawingRef.current || !startRef.current) {
        return;
      }

      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      const point = screenToSVG(touch.clientX, touch.clientY);
      const drifted = Math.hypot(
        point.x - startRef.current.x,
        point.y - startRef.current.y,
      );
      if (drifted > configRef.current.cancelMove) {
        clearHold();
        startRef.current = null;
      }
    };

    const handleTouchEnd = () => {
      resetGesture();
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      clearHold();
      detachDrawMove();
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [arm, clearHold, detachDrawMove, disabled, resetGesture]);

  return null;
});

export default TouchTrailManager;
