import { memo, useCallback, useEffect, useState } from 'react';
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

  // Update cursor position and state
  const updateCursor = useCallback((e: MouseEvent) => {
    // Debug logging (only log occasionally to avoid spam)
    if (Math.random() < 0.01) {
      console.log('MouseTrailManager: Mouse move', { x: e.clientX, y: e.clientY });
    }

    const hitTarget = findCursorHitTarget(
      e.clientX,
      e.clientY,
      config.hitRadius,
      e.target instanceof HTMLElement ? e.target : null
    );
    
    onCursorUpdate({
      x: e.clientX,
      y: e.clientY,
      isHovering: Boolean(hitTarget),
      isVisible: true,
      target: hitTarget,
    });

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
  }, [config.hitRadius, config.trailLength, config.trailLayers, onCursorUpdate]);

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
    onCursorUpdate({
      isHovering: false,
      isVisible: false,
      target: null,
    });
  }, [onCursorUpdate]);

  // Handle scroll
  const handleScroll = useCallback(() => {
    // Scroll logic if needed
  }, []);

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
