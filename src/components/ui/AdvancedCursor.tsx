'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  isClicking: boolean;
  target: HTMLElement | null;
  isVisible: boolean;
}

interface AdvancedCursorProps {
  size?: number;
  ringSize?: number;
  ringThickness?: number;
  color?: string;
  hoverColor?: string;
  clickColor?: string;
  disabled?: boolean;
  showTrail?: boolean;
  trailLength?: number;
  magneticStrength?: number;
}

export default function AdvancedCursor({
  size = 5,
  ringSize = 72, // 3x the pointer size
  ringThickness = 1,
  color = 'rgba(255, 255, 255, 0.8)',
  hoverColor = 'rgba(59, 130, 246, 0.8)',
  clickColor = 'rgba(239, 68, 68, 0.8)',
  disabled = false,
  showTrail = false,
  trailLength = 0,
  magneticStrength = 0.9
}: AdvancedCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
//   const ringRef = useRef<HTMLDivElement>(null);
//   const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cursorState, setCursorState] = useState<CursorState>({
    x: 0,
    y: 0,
    isHovering: false,
    isClicking: false,
    target: null,
    isVisible: false
  });

  // Initialize trail elements
//   useEffect(() => {
//     if (!showTrail) return;
    
//     trailRefs.current = Array.from({ length: trailLength }, (_, i) => {
//       const trail = document.createElement('div');
//       trail.style.position = 'fixed';
//       trail.style.left = '0px';
//       trail.style.top = '0px';
//       trail.style.width = `${size - i * 2}px`;
//       trail.style.height = `${size - i * 2}px`;
//       trail.style.backgroundColor = color;
//       trail.style.borderRadius = '50%';
//       trail.style.pointerEvents = 'none';
//       trail.style.zIndex = '9996';
//       trail.style.opacity = `${1 - i / trailLength}`;
//       trail.style.transform = 'translate(-50%, -50%)';
//       document.body.appendChild(trail);
//       return trail;
//     });
//   }, [showTrail, trailLength, size, color]);

  // Check if element should trigger hover state
  const isHoverable = (element: HTMLElement | null): boolean => {
    if (!element) return false;
    
    const hoverableSelectors = [
      'a', 'button', '[role="button"]', 
      'input', 'textarea', 'select',
      '[data-cursor-hover]', '[data-cursor-click]',
      '.cursor-hover', '.cursor-click',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'span', 'div[data-interactive]'
    ];
    
    return hoverableSelectors.some(selector => 
      element.matches(selector) || element.closest(selector)
    );
  };

  // Check if element should trigger click state
  const isClickable = (element: HTMLElement | null): boolean => {
    if (!element) return false;
    
    const clickableSelectors = [
      'a', 'button', '[role="button"]',
      '[data-cursor-click]', '.cursor-click'
    ];
    
    return clickableSelectors.some(selector => 
      element.matches(selector) || element.closest(selector)
    );
  };

  // Check if element has magnetic effect
  const isMagnetic = (element: HTMLElement | null): boolean => {
    if (!element) return false;
    
    const magneticSelectors = [
      '[data-cursor-magnetic]', '.cursor-magnetic',
      'button', 'a', '[role="button"]'
    ];
    
    return magneticSelectors.some(selector => 
      element.matches(selector) || element.closest(selector)
    );
  };

  // Get magnetic target position
  const getMagneticPosition = (element: HTMLElement, mouseX: number, mouseY: number) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = centerX - mouseX;
    const deltaY = centerY - mouseY;
    
    return {
      x: mouseX + deltaX * magneticStrength,
      y: mouseY + deltaY * magneticStrength
    };
  };

  // Create ripple effect on click
  const createRipple = (x: number, y: number) => {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = `${ringSize}px`;
    ripple.style.height = `${ringSize}px`;
    ripple.style.border = `${ringThickness}px solid ${clickColor}`;
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9997';
    ripple.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(ripple);

    gsap.fromTo(ripple, 
      { scale: 0, opacity: 1 },
      { 
        scale: 2, 
        opacity: 0, 
        duration: 0.6, 
        ease: 'power2.out',
        onComplete: () => {
          if (document.body.contains(ripple)) {
            document.body.removeChild(ripple);
          }
        }
      }
    );
  };

  // Update cursor position and state
  const updateCursor = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isHovering = isHoverable(target);
    const isClickableElement = isClickable(target);
    const isMagneticElement = isMagnetic(target);
    
    let finalX = e.clientX;
    let finalY = e.clientY;
    
    // Apply magnetic effect
    // if (isMagneticElement && target) {
    //   const magneticPos = getMagneticPosition(target, e.clientX, e.clientY);
    //   finalX = magneticPos.x;
    //   finalY = magneticPos.y;
    // }
    
    setCursorState({
      x: finalX,
      y: finalY,
      isHovering,
      isClicking: false,
      target,
      isVisible: true
    });

    // Animate cursor position - align with actual pointer
    // if (cursorRef.current && ringRef.current) {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        left: finalX,
        top: finalY,
        // duration: isMagneticElement ? 0.3 : 0.1,
        duration: 0,
        ease: isMagneticElement ? 'power2.out' : 'power2.out'
      });

    //   gsap.to(ringRef.current, {
    //     left: finalX,
    //     top: finalY,
    //     // duration: isMagneticElement ? 0.5 : 0.3,
    //     duration: 1,
    //     ease: isMagneticElement ? 'power2.out' : 'power2.out'
    //   });

      // Animate trail
    //   if (showTrail && trailRefs.current.length > 0) {
    //     trailRefs.current.forEach((trail, index) => {
    //       if (trail) {
    //         gsap.to(trail, {
    //           left: finalX,
    //           top: finalY,
    //           duration: 0.1 + index * 0.02,
    //           ease: 'power2.out'
    //         });
    //       }
    //     });
    //   }
    }
  };

  // Handle mouse down
  const handleMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isClickableElement = isClickable(target);
    
    if (isClickableElement) {
      setCursorState(prev => ({ ...prev, isClicking: true }));
      
      // Create ripple effect
      createRipple(e.clientX, e.clientY);
      
      // Animate click effect
    //   if (ringRef.current) {
    //     gsap.to(ringRef.current, {
    //       scale: 0.8,
    //       duration: 0.1,
    //       ease: 'power2.out',
    //       yoyo: true,
    //       repeat: 1
    //     });
    //   }
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setCursorState(prev => ({ ...prev, isClicking: false }));
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setCursorState(prev => ({ ...prev, isHovering: false, isClicking: false, isVisible: false }));
  };

  // Handle scroll
  const handleScroll = () => {
    // if (cursorRef.current && ringRef.current) {
    //   gsap.to([cursorRef.current, ringRef.current], {
    if (cursorRef.current) {
      gsap.to([cursorRef.current], {
        opacity: 0.3,
        duration: 0.2,
        ease: 'power2.out'
      });
    }
  };

  const handleScrollEnd = () => {
    // if (cursorRef.current && ringRef.current) {
    //   gsap.to([cursorRef.current, ringRef.current], {
    if (cursorRef.current) {
      gsap.to([cursorRef.current], {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  useEffect(() => {
    if (disabled) return;

    // Add event listeners
    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scrollend', handleScrollEnd, { passive: true });

    // Keep default cursor visible
    // document.body.style.cursor = 'none';

    // Initial setup
    // if (cursorRef.current && ringRef.current) {
    if (cursorRef.current) {
      gsap.set(cursorRef.current, { opacity: 0 });
    //   gsap.set(ringRef.current, { opacity: 0 });
      
    //   gsap.to([cursorRef.current, ringRef.current], {
      gsap.to([cursorRef.current], {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      });
    }

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scrollend', handleScrollEnd);
      
      // Clean up trail elements
    //   trailRefs.current.forEach(trail => {
    //     if (trail && document.body.contains(trail)) {
    //       document.body.removeChild(trail);
    //     }
    //   });
      
      // Keep default cursor visible
      // document.body.style.cursor = 'auto';
    };
  }, [disabled, size, ringSize, showTrail, trailLength, magneticStrength]);

  // Animate ring based on state
  useEffect(() => {
    // if (!ringRef.current) return;

    const currentColor = cursorState.isClicking 
      ? clickColor 
      : cursorState.isHovering 
        ? hoverColor 
        : color;

    // gsap.to(ringRef.current, {
    //   scale: cursorState.isHovering ? 1.2 : 1,
    //   borderColor: currentColor,
    //   duration: 0.3,
    //   ease: 'power2.out'
    // });
  }, [cursorState.isHovering, cursorState.isClicking, color, hoverColor, clickColor]);

  if (disabled) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          width: '10px',
          height: '10px',
          backgroundColor: cursorState.isClicking ? clickColor : color,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'background-color 0.3s ease',
          left: 0,
          top: 0
        }}
      />
      
      {/* Ring around cursor */}
      {/* <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998]"
        style={{
          width: ringSize,
          height: ringSize,
          border: `1px solid ${color}`,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'border-color 0.3s ease, transform 0.3s ease',
          left: 0,
          top: 0
        }}
      /> */}
    </>
  );
}
