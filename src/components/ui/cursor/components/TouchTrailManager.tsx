import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { TouchTrailManagerProps, TrailPoint } from '../types';
import { screenToSVG, getTouchZone } from '../utils/coordinateUtils';

/**
 * Mobile touch event handling + trail generation
 */
const TouchTrailManager = memo(function TouchTrailManager({ 
  config, 
  onTrailUpdate, 
  disabled = false 
}: TouchTrailManagerProps) {
  const [mobileTrailPoints, setMobileTrailPoints] = useState<TrailPoint[]>([]);
  const [mobileTrailLayers, setMobileTrailLayers] = useState<TrailPoint[][]>(
    config.trailLayers.map(() => [])
  );
  const [isTouching, setIsTouching] = useState(false);
  const [currentTouchZone, setCurrentTouchZone] = useState<'trail' | 'scroll' | null>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  
  const mobileTrailLayerRefs = useRef<Array<SVGPathElement | null>>(
    config.trailLayers.map(() => null)
  );

  // Touch event handlers for mobile trails
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const touchZone = getTouchZone(touch.clientX, viewportWidth, config.touchZones);
    
    setCurrentTouchZone(touchZone);
    setIsTouching(true);
    
    // Only generate trails in the trail zone
    if (touchZone === 'trail') {
      // Prevent default scrolling behavior in trail zone
      e.preventDefault();
      
      const svgPoint = screenToSVG(touch.clientX, touch.clientY);
      
      // Initialize mobile trail points
      setMobileTrailPoints([svgPoint]);
      setMobileTrailLayers(prev => 
        prev.map(() => [svgPoint])
      );
    }
    // In scroll zone, allow default behavior (scrolling)
  }, [viewportWidth, config.touchZones]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isTouching || currentTouchZone !== 'trail') return;
    
    const touch = e.touches[0];
    const svgPoint = screenToSVG(touch.clientX, touch.clientY);
    
    // Update mobile trail points
    setMobileTrailPoints(prev => {
      const newPoints = [...prev, svgPoint];
      return newPoints.slice(-config.trailLength);
    });
    
    // Update mobile trail layers
    setMobileTrailLayers(prev => 
      prev.map((layer, index) => {
        const newPoints = [...layer, svgPoint];
        const layerLength = Math.floor(config.trailLayers[index].percentage * config.trailLength);
        return newPoints.slice(-layerLength);
      })
    );
  }, [isTouching, currentTouchZone, config.trailLength, config.trailLayers]);

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false);
    setCurrentTouchZone(null);
    
    // Start fade out animation only if we were in trail zone
    if (currentTouchZone === 'trail') {
      mobileTrailLayerRefs.current.forEach((pathElement) => {
        if (pathElement) {
          gsap.to(pathElement, {
            opacity: 0,
            duration: config.fadeDuration,
            ease: "power2.out",
            onComplete: () => {
              // Clear the trail after fade
              setMobileTrailPoints([]);
              setMobileTrailLayers(prev => 
                prev.map(() => [])
              );
            }
          });
        }
      });
    }
  }, [config.fadeDuration, currentTouchZone]);

  // Update viewport width
  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };
    
    updateViewportWidth();
    window.addEventListener('resize', updateViewportWidth);
    
    return () => window.removeEventListener('resize', updateViewportWidth);
  }, []);

  // Touch event listeners for mobile
  useEffect(() => {
    if (disabled) return;

    // Add touch event listeners
    // touchstart: passive for trail zone, non-passive for scroll zone detection
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Update parent with trail layers
  useEffect(() => {
    onTrailUpdate(mobileTrailLayers);
  }, [mobileTrailLayers, onTrailUpdate]);

  return null; // This component only handles events, no rendering
});

export default TouchTrailManager;
