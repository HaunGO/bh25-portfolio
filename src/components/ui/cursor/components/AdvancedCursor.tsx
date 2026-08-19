import { memo, useState, useCallback, useEffect } from 'react';
import { AdvancedCursorProps, CursorConfig, CursorState, CursorUpdate, TrailPoint, ViewportSize } from '../types';
import { DEFAULT_CURSOR_CONFIG } from '../config';
import { useMouseSupport } from '../hooks/useMouseSupport';
import { useTouchSupport } from '../hooks/useTouchSupport';
import { getViewportSize } from '../utils/coordinateUtils';
import TrailRenderer from './TrailRenderer';
import MouseTrailManager from './MouseTrailManager';
import TouchTrailManager from './TouchTrailManager';
import CursorVisual from './CursorVisual';

/**
 * Main AdvancedCursor component - orchestration and device detection
 */
const AdvancedCursor = memo(function AdvancedCursor({ 
  disabled = false, 
  config = {} 
}: AdvancedCursorProps) {
  const hasMouse = useMouseSupport();
  const hasTouch = useTouchSupport();
  
  // Merge default config with provided config
  const finalConfig: CursorConfig = {
    ...DEFAULT_CURSOR_CONFIG,
    ...config,
    mouse: {
      ...DEFAULT_CURSOR_CONFIG.mouse,
      ...config.mouse,
      trailLayers: config.mouse?.trailLayers ?? DEFAULT_CURSOR_CONFIG.mouse.trailLayers,
    },
    touch: {
      ...DEFAULT_CURSOR_CONFIG.touch,
      ...config.touch,
      trailLayers: config.touch?.trailLayers ?? DEFAULT_CURSOR_CONFIG.touch.trailLayers,
      touchZones: {
        ...DEFAULT_CURSOR_CONFIG.touch.touchZones,
        ...config.touch?.touchZones,
      },
    },
    visual: {
      ...DEFAULT_CURSOR_CONFIG.visual,
      ...config.visual,
      dazzleStyles: {
        ...DEFAULT_CURSOR_CONFIG.visual.dazzleStyles,
        ...config.visual?.dazzleStyles,
      },
    },
  };
  const [cursorState, setCursorState] = useState<CursorState>({
    x: 0,
    y: 0,
    isHovering: false,
    isClicking: false,
    isVisible: false,
    target: null,
  });

  const [trailLayers, setTrailLayers] = useState<TrailPoint[][]>([]);
  const [viewportSize, setViewportSize] = useState<ViewportSize>({ width: 1920, height: 1080 });

  // Handle cursor position updates from mouse manager
  const handleCursorUpdate = useCallback((update: CursorUpdate) => {
    setCursorState(prev => ({
      ...prev,
      ...update,
      x: update.x ?? prev.x,
      y: update.y ?? prev.y,
      isVisible: update.isVisible ?? true,
    }));
  }, []);

  // Handle trail updates from managers
  const handleTrailUpdate = useCallback((layers: TrailPoint[][]) => {
    setTrailLayers(layers);
  }, []);

  // Handle window resize
  const handleResize = useCallback(() => {
    setViewportSize(getViewportSize());
  }, []);

  // Setup viewport size and resize listener
  useEffect(() => {
    setViewportSize(getViewportSize());
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Don't render if disabled or no device support
  if (finalConfig.disabled || disabled || (!hasMouse && !hasTouch)) {
    return null;
  }

  return (
    <>
      {/* Mouse trail system */}
      {hasMouse && (
        <>
          <MouseTrailManager
            config={finalConfig.mouse}
            onTrailUpdate={handleTrailUpdate}
            onCursorUpdate={handleCursorUpdate}
            disabled={disabled}
          />
          <TrailRenderer
            layers={finalConfig.mouse.trailLayers}
            trailData={trailLayers}
            viewportSize={viewportSize}
          />
          <CursorVisual
            position={{ x: cursorState.x, y: cursorState.y }}
            state={cursorState}
            config={finalConfig.visual}
            viewportSize={viewportSize}
          />
        </>
      )}

      {/* Touch trail system */}
      {hasTouch && !hasMouse && (
        <>
          <TouchTrailManager
            config={finalConfig.touch}
            onTrailUpdate={handleTrailUpdate}
            onCursorUpdate={handleCursorUpdate}
            disabled={disabled}
          />
          <TrailRenderer
            layers={finalConfig.touch.trailLayers}
            trailData={trailLayers}
            viewportSize={viewportSize}
          />
          <CursorVisual
            position={{ x: cursorState.x, y: cursorState.y }}
            state={cursorState}
            config={finalConfig.visual}
            viewportSize={viewportSize}
          />
        </>
      )}
    </>
  );
});

export default AdvancedCursor;
