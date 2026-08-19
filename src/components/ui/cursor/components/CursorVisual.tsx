import { memo, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { CursorVisualProps } from '../types';
import { createBorderLineTargetPath, createCursorPath, createFlatLineTargetPath, createMeshHaloPath, createMeshRoundedTargetPath } from '../utils/pathHelpers';

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
  const flatGlowRef = useRef<SVGPathElement>(null);
  const dazzleTweenRef = useRef<gsap.core.Tween | null>(null);

  // Animate cursor position
  useEffect(() => {
    if (!cursorRef.current) return;

    // Create cursor path directly at pointer position
    const cursorPath = createCursorPath(config.size / 2, position.x, position.y);
    gsap.to(cursorRef.current, {
      attr: { d: cursorPath },
      duration: 0,
      ease: 'power2.out'
    });

    if (!ringRef.current || !jellyRef.current || !flatGlowRef.current) return;

    if (!config.enableRing) {
      gsap.set([ringRef.current, jellyRef.current, flatGlowRef.current], { opacity: 0 });
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
        : createMeshRoundedTargetPath(
            target.rect,
            config.hitPadding,
            config.targetRadius,
            config.morphStyle,
            config.meshPoints
          )
      : createMeshHaloPath(position.x, position.y, config.ringSize, config.meshPoints, config.morphStyle);
    const morphDuration = target ? config.morphDuration : config.releaseDuration;
    const isGooey = config.morphStyle === 'gooey';
    const isFlatTarget = isLineTarget || isBorderTarget;
    const targetGlowWidth = isFlatTarget ? config.flatTargetGlowWidth : config.targetGlowWidth;
    const targetGlowOpacity = isFlatTarget ? config.flatTargetGlowOpacity : config.targetGlowOpacity;
    const ringOpacity = target
      ? isFlatTarget ? 1 : config.targetOpacity
      : 1;

    gsap.to(ringRef.current, {
      attr: { d: ringPath },
      duration: morphDuration,
      opacity: ringOpacity,
      ease: target ? 'power3.out' : 'power2.out',
    });

    gsap.to(flatGlowRef.current, {
      attr: { d: ringPath },
      opacity: target ? targetGlowOpacity : 0,
      strokeWidth: target ? targetGlowWidth : config.ringThickness,
      duration: morphDuration,
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
    config.targetRadius,
    config.morphDuration,
    config.releaseDuration,
    config.jellyStrokeWidth,
    config.targetGlowOpacity,
    config.targetGlowWidth,
    config.flatTargetGlowOpacity,
    config.flatTargetGlowWidth,
    config.hoverColor,
    config.ringColor,
    config.ringThickness,
  ]);

  // Animate ring based on state
  useEffect(() => {
    if (!ringRef.current || !jellyRef.current || !flatGlowRef.current) return;

    if (!config.enableRing) {
      dazzleTweenRef.current?.kill();
      dazzleTweenRef.current = null;
      gsap.set([ringRef.current, jellyRef.current, flatGlowRef.current], { opacity: 0 });
      return;
    }

    const dazzleStyle = config.enableDazzle && state.target
      ? config.dazzleStyles[state.target.dazzleStyle]
      : null;
    const isFlatTarget = state.target?.morphVariant === 'line' || state.target?.morphVariant === 'border';
    const glowColor = isFlatTarget ? config.flatTargetGlowColor : config.targetGlowColor;
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
    gsap.set(flatGlowRef.current, {
      filter: 'url(#cursor-target-glow)',
      strokeDasharray: 'none',
      strokeDashoffset: 0,
    });

    gsap.set(ringRef.current, {
      scale: 1,
      stroke: currentColor,
      strokeWidth: dazzleStyle?.strokeWidth ?? config.ringThickness,
    });
    gsap.set(jellyRef.current, {
      stroke: currentColor,
    });
    gsap.set(flatGlowRef.current, {
      stroke: glowColor,
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
  }, [state.isHovering, state.isClicking, state.target, config.enableRing, config.ringColor, config.hoverColor, config.clickColor, config.ringThickness, config.targetGlowColor, config.flatTargetGlowColor, config.enableDazzle, config.dazzleStyles]);

  // Animate cursor based on state
  useEffect(() => {
    if (!cursorRef.current) return;

    const currentColor = state.isClicking 
      ? config.clickColor 
      : config.dotColor;

    gsap.set(cursorRef.current, {
      fill: currentColor,
    });
  }, [state.isClicking, config.clickColor, config.dotColor]);

  // Initial setup: keep hidden until first cursor move
  useEffect(() => {
    if (cursorRef.current && ringRef.current && jellyRef.current && flatGlowRef.current) {
      gsap.set(cursorRef.current, { opacity: 0 });
      gsap.set(ringRef.current, { opacity: 0 });
      gsap.set(jellyRef.current, { opacity: 0 });
      gsap.set(flatGlowRef.current, { opacity: 0 });
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
          <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={config.enableDazzle && state.target ? config.dazzleStyles[state.target.dazzleStyle].glowColor : config.hoverColor} />
        </filter>
        <filter id="cursor-target-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={state.target?.morphVariant === 'line' || state.target?.morphVariant === 'border' ? config.flatTargetGlowColor : config.targetGlowColor} />
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={state.target?.morphVariant === 'line' || state.target?.morphVariant === 'border' ? config.flatTargetGlowColor : config.targetGlowColor} />
        </filter>
        <filter id="cursor-jelly-soften" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.35" />
        </filter>
      </defs>

      {/* Strong outer glow for active cursor targets */}
      <path
        ref={flatGlowRef}
        fill="none"
        d={createMeshHaloPath(0, 0, config.ringSize, config.meshPoints, config.morphStyle)}
        stroke={config.targetGlowColor}
        strokeWidth={config.targetGlowWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#cursor-target-glow)"
      />

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
