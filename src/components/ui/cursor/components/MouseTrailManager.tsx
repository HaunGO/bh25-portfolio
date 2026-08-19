import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MouseTrailManagerProps, TrailPoint } from '../types';
import { screenToSVG, isClickable, findCursorHitTarget } from '../utils/coordinateUtils';

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

  // Update cursor position and state
  const updateCursor = useCallback((e: MouseEvent) => {
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    syncCursorTarget(
      e.clientX,
      e.clientY,
      e.target instanceof HTMLElement ? e.target : null
    );

    // Update trail points for path animation (only when not hovering over links)
    const svgPoint = screenToSVG(e.clientX, e.clientY);
    
    // Update trail layers
    setTrailLayers(prev => 
      prev.map((layer, index) => {
        const newPoints = [...layer, svgPoint];
        const layerLength = Math.floor(config.trailLayers[index].percentage * config.trailLength);
        return newPoints.slice(-layerLength);
      })
    );
  }, [config.trailLength, config.trailLayers, syncCursorTarget]);

  // Handle mouse down
  const handleMouseDown = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isClickableElement = isClickable(target);
    
    if (isClickableElement) {
      // Create ripple effect
      createRipple(e.clientX, e.clientY);
    }
    
    onCursorUpdate({ isClicking: true });
  }, [createRipple, onCursorUpdate]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    onCursorUpdate({ isClicking: false });
  }, [onCursorUpdate]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    lastPointerRef.current = null;
    onCursorUpdate({
      isHovering: false,
      isVisible: false,
      target: null,
    });
  }, [onCursorUpdate]);

  // Handle scroll
  const handleScroll = useCallback(() => {
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

  // Handle window resize
  const handleResize = useCallback(() => {
    // Clear trail points on resize
    setTrailLayers(config.trailLayers.map(() => []));
  }, [config.trailLayers]);

  // Main effect for event listeners
  useEffect(() => {
    if (disabled) return;

    // Add event listeners
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

  // Update parent with trail layers
  useEffect(() => {
    onTrailUpdate(trailLayers);
  }, [trailLayers, onTrailUpdate]);

  return null; // This component only handles events, no rendering
});

export default MouseTrailManager;
