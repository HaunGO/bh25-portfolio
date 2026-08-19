import { memo, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { CursorVisualProps } from '../types';
import { createBorderLineTargetPath, createCursorPath, createFlatLineTargetPath, createMeshCursorAwareTargetPath, createMeshHaloPath } from '../utils/pathHelpers';

/**
 * Cursor ring and dot rendering component
 */
const CursorVisual = memo(function CursorVisual({ 
  position, 
  state, 
  config, 
  viewportSize 
}: CursorVisualProps) {
  const cursorRef = useRef<SVGPathElement>(null);
  const jellyRef = useRef<SVGPathElement>(null);
  const ringRef = useRef<SVGPathElement>(null);
  const dazzleTweenRef = useRef<gsap.core.Tween | null>(null);

  // Animate cursor position
  useEffect(() => {
    if (!cursorRef.current) return;

    // Debug logging (only log occasionally to avoid spam)
    if (Math.random() < 0.01) {
      console.log('CursorVisual: Updating position', { x: position.x, y: position.y });
    }

    // Create cursor path directly at pointer position
    const cursorPath = createCursorPath(config.size / 2, position.x, position.y);
    gsap.to(cursorRef.current, {
      attr: { d: cursorPath },
      duration: 0,
      ease: 'power2.out'
    });

    if (!ringRef.current || !jellyRef.current) return;

    if (!config.enableRing) {
      gsap.set([ringRef.current, jellyRef.current], { opacity: 0 });
      return;
    }

    const target = state.target;
    const isLineTarget = target?.morphVariant === 'line';
    const isBorderTarget = target?.morphVariant === 'border';
    const ringPath = target
      ? isBorderTarget
        ? createBorderLineTargetPath(target.rect, config.meshPoints, target.borderEdge)
        : isLineTarget
        ? createFlatLineTargetPath(target.rect, config.meshPoints)
        : createMeshCursorAwareTargetPath(
            target.rect,
            position.x,
            position.y,
            config.ringSize,
            config.hitPadding,
            config.morphStyle,
            config.meshPoints,
            config.meshPointExponent
          )
      : createMeshHaloPath(position.x, position.y, config.ringSize, config.meshPoints, config.morphStyle);
    const morphDuration = target ? config.morphDuration : config.releaseDuration;
    const isGooey = config.morphStyle === 'gooey';
    const isFlatTarget = isLineTarget || isBorderTarget;
    const ringOpacity = target
      ? isFlatTarget ? 0.7 : config.targetOpacity
      : 1;

    gsap.to(ringRef.current, {
      attr: { d: ringPath },
      duration: morphDuration,
      opacity: ringOpacity,
      ease: target ? 'power3.out' : 'power2.out',
    });

    gsap.to(jellyRef.current, {
      attr: { d: ringPath },
      fill: target && !isFlatTarget ? config.overlayColor : 'rgba(59, 130, 246, 0)',
      opacity: target && !isFlatTarget ? config.targetOpacity : 0,
      stroke: target ? config.hoverColor : config.ringColor,
      strokeWidth: target ? config.jellyStrokeWidth : config.ringThickness,
      duration: target ? config.morphDuration * (isGooey ? 1.35 : 1) : config.releaseDuration * 1.2,
      ease: target && isGooey ? 'elastic.out(1, 0.7)' : 'power3.out',
    });
  }, [
    position.x,
    position.y,
    state.target,
    config.enableRing,
    config.hitPadding,
    config.ringSize,
    config.size,
    config.morphStyle,
    config.meshPoints,
    config.meshPointExponent,
    config.overlayColor,
    config.targetOpacity,
    config.morphDuration,
    config.releaseDuration,
    config.jellyStrokeWidth,
    config.hoverColor,
    config.ringColor,
    config.ringThickness,
  ]);

  // Animate ring based on state
  useEffect(() => {
    if (!ringRef.current || !jellyRef.current) return;

    if (!config.enableRing) {
      dazzleTweenRef.current?.kill();
      dazzleTweenRef.current = null;
      gsap.set([ringRef.current, jellyRef.current], { opacity: 0 });
      return;
    }

    const dazzleStyle = config.enableDazzle && state.target
      ? config.dazzleStyles[state.target.dazzleStyle]
      : null;
    const currentColor = dazzleStyle
      ? dazzleStyle.color
      : state.isClicking 
      ? config.clickColor 
      : state.isHovering 
        ? config.hoverColor 
        : config.ringColor;

    dazzleTweenRef.current?.kill();
    gsap.set(ringRef.current, {
      filter: dazzleStyle ? 'url(#cursor-dazzle-glow)' : 'none',
      strokeDasharray: dazzleStyle?.dashArray ?? 'none',
      strokeDashoffset: 0,
    });
    gsap.set(jellyRef.current, {
      strokeDasharray: 'none',
      strokeDashoffset: 0,
    });

    gsap.to(ringRef.current, {
      scale: 1,
      stroke: currentColor,
      strokeWidth: dazzleStyle?.strokeWidth ?? config.ringThickness,
      duration: 0.5,
      ease: 'power1.out'
    });
    gsap.to(jellyRef.current, {
      stroke: currentColor,
      duration: 0.5,
      ease: 'power1.out',
    });

    if (dazzleStyle) {
      dazzleTweenRef.current = gsap.to(ringRef.current, {
        strokeDashoffset: -64,
        duration: dazzleStyle.duration,
        ease: 'none',
        repeat: -1,
      });
    }

    return () => {
      dazzleTweenRef.current?.kill();
      dazzleTweenRef.current = null;
    };
  }, [state.isHovering, state.isClicking, state.target, config.enableRing, config.ringColor, config.hoverColor, config.clickColor, config.ringThickness, config.enableDazzle, config.dazzleStyles]);

  // Animate cursor based on state
  useEffect(() => {
    if (!cursorRef.current) return;

    const currentColor = state.isClicking 
      ? config.clickColor 
      : config.dotColor;

    gsap.to(cursorRef.current, {
      fill: currentColor,
      duration: 0.3,
      ease: 'power1.out'
    });
  }, [state.isClicking, config.clickColor, config.dotColor]);

  // Initial setup: keep hidden until first cursor move
  useEffect(() => {
    if (cursorRef.current && ringRef.current && jellyRef.current) {
      gsap.set(cursorRef.current, { opacity: 0 });
      gsap.set(ringRef.current, { opacity: 0 });
      gsap.set(jellyRef.current, { opacity: 0 });
    }
  }, []);

  // Fade in on first move (when cursor becomes visible)
  useEffect(() => {
    if (!state.isVisible || !cursorRef.current || !ringRef.current) return;

    gsap.to(cursorRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    });

    if (config.enableRing) {
      gsap.to(ringRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  }, [state.isVisible, config.enableRing]);

  return (
    <svg 
      width="100%" 
      height="100%"
      viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
      preserveAspectRatio="none"
      className="fixed top-0 left-0 pointer-events-none z-[9999] w-full h-full"
    >
      <defs>
        <filter id="cursor-dazzle-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={config.enableDazzle && state.target ? config.dazzleStyles[state.target.dazzleStyle].glowColor : config.hoverColor} />
        </filter>
        <filter id="cursor-jelly-soften" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.35" />
        </filter>
      </defs>

      {/* Soft viscous overlay that lags behind the crisp ring */}
      <path
        ref={jellyRef}
        fill="rgba(59, 130, 246, 0)"
        d={createMeshHaloPath(0, 0, config.ringSize, config.meshPoints, config.morphStyle)}
        stroke={config.ringColor}
        strokeWidth={config.jellyStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#cursor-jelly-soften)"
      />

      {/* Ring around cursor */}
      <path 
        ref={ringRef} 
        fill="none"
        d={createMeshHaloPath(0, 0, config.ringSize, config.meshPoints, config.morphStyle)} 
        stroke={config.ringColor}
        strokeWidth={config.ringThickness}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Main cursor dot */}
      <path 
        ref={cursorRef} 
        fill={state.isClicking ? config.clickColor : config.dotColor}
        d={createCursorPath(5, 0, 0)} 
        stroke="none"
      />
    </svg>
  );
});

export default CursorVisual;
