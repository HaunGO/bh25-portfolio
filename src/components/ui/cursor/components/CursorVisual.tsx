import { memo, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { CursorVisualProps } from '../types';
import { createCirclePath, createCursorPath } from '../utils/pathHelpers';

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
  const ringRef = useRef<SVGPathElement>(null);

  // Animate cursor position
  useEffect(() => {
    if (cursorRef.current && ringRef.current) {
      // Debug logging (only log occasionally to avoid spam)
      if (Math.random() < 0.01) {
        console.log('CursorVisual: Updating position', { x: position.x, y: position.y });
      }
      
      // Create cursor path directly at mouse position
      const cursorPath = createCursorPath(5, position.x, position.y + 5);
      gsap.to(cursorRef.current, {
        attr: { d: cursorPath },
        duration: 0,
        ease: 'power2.out'
      });

      gsap.to(ringRef.current, {
        attr: { transform: `translate(${position.x - 80}, ${position.y})` },
        duration: 0,
        ease: 'power2.out'
      });
    }
  }, [position.x, position.y]);

  // Animate ring based on state
  useEffect(() => {
    if (!ringRef.current) return;

    const currentColor = state.isClicking 
      ? config.clickColor 
      : state.isHovering 
        ? config.hoverColor 
        : config.ringColor;

    gsap.to(ringRef.current, {
      scale: state.isHovering ? 1.1 : 1,
      stroke: currentColor,
      duration: 0.5,
      ease: 'power1.out'
    });
  }, [state.isHovering, state.isClicking, config.ringColor, config.hoverColor, config.clickColor]);

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

  // Initial setup
  useEffect(() => {
    if (cursorRef.current && ringRef.current) {
      gsap.set(cursorRef.current, { opacity: 0 });
      gsap.set(ringRef.current, { opacity: 0 });
      
      gsap.to([cursorRef.current, ringRef.current], {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, []);

  return (
    <svg 
      width="100%" 
      height="100%"
      viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
      preserveAspectRatio="none"
      className="fixed top-0 left-0 pointer-events-none z-[9999] w-full h-full"
    >
      {/* Ring around cursor */}
      <path 
        ref={ringRef} 
        fill="none"
        d={createCirclePath(40, 80, 40)} 
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
