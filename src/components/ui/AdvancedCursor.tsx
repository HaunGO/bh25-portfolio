'use client';

import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { gsap } from 'gsap';

// Hook to detect if device supports mouse
const useMouseSupport = () => {
  const [hasMouse, setHasMouse] = useState(false);

  useEffect(() => {
    // Check if device supports mouse (not touch-only)
    const checkMouseSupport = () => {
      // Primary check: CSS media query for hover capability
      const hasHover = window.matchMedia('(hover: hover)').matches;
      
      // Secondary check: pointer type detection
      const hasPointer = window.matchMedia('(pointer: fine)').matches;
      
      // Tertiary check: no touch capability or touch + mouse
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Device has mouse if it supports hover AND (fine pointer OR no touch)
      const mouseSupported = hasHover && (hasPointer || !hasTouch);
      
      setHasMouse(mouseSupported);
    };

    checkMouseSupport();
    
    // Listen for changes (e.g., if user connects/disconnects mouse)
    const mediaQuery = window.matchMedia('(hover: hover)');
    mediaQuery.addEventListener('change', checkMouseSupport);
    
    return () => mediaQuery.removeEventListener('change', checkMouseSupport);
  }, []);

  return hasMouse;
};

// Cursor configuration - adjust these values to customize the cursor behavior
const CURSOR_CONFIG = {
  // Visual settings
  size: 8,
  ringSize: 72,
  ringThickness: 1,
  ringColor: 'rgba(178, 178, 178, 0.8)',
  dotColor: 'rgb(11, 132, 218)',
  hoverColor: 'rgba(59, 130, 246, 0.8)',
  clickColor: 'rgba(59, 130, 246, 0.8)',
  
  // Behavior settings
  disabled: false
};

const AdvancedCursor = memo(function AdvancedCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const hasMouse = useMouseSupport();
  
  const [cursorState, setCursorState] = useState({
    x: 0,
    y: 0,
    isHovering: false,
    isClicking: false,
    target: null as HTMLElement | null,
    isVisible: false
  });


  // Check if element should trigger hover state
  const isHoverable = useCallback((element: HTMLElement | null): boolean => {
    if (!element) return false;
    
    const hoverableSelectors = ['a', 'button', '[data-cursor-hover]'];
    
    return hoverableSelectors.some(selector => 
      element.matches(selector) || element.closest(selector)
    );
  }, []);

  // Check if element should trigger click state
  const isClickable = useCallback((element: HTMLElement | null): boolean => {
    if (!element) return false;
    
    const clickableSelectors = [
      'a', 'button', '[role="button"]',
      '[data-cursor-click]', '.cursor-click'
    ];
    
    return clickableSelectors.some(selector => 
      element.matches(selector) || element.closest(selector)
    );
  }, []);


  // Create ripple effect on click
  const createRipple = useCallback((x: number, y: number) => {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = `${CURSOR_CONFIG.ringSize}px`;
    ripple.style.height = `${CURSOR_CONFIG.ringSize}px`;
    ripple.style.border = `5px solid ${CURSOR_CONFIG.clickColor}`;
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
    const target = e.target as HTMLElement;
    const isHovering = isHoverable(target);
    const isClickableElement = isClickable(target);
    
    setCursorState(prev => ({
      ...prev,
      x: e.clientX,
      y: e.clientY,
      isHovering,
      isClicking: false,
      target,
      isVisible: true
    }));

    // Animate cursor position
    if (cursorRef.current && ringRef.current) {
      gsap.to(cursorRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0,
        ease: 'power2.out'
      });

      gsap.to(ringRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0,
        ease: 'power2.out'
      });
    }
  }, [isHoverable, isClickable]);

  // Handle mouse down
  const handleMouseDown = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isClickableElement = isClickable(target);
    
    if (isClickableElement) {
      setCursorState(prev => ({ ...prev, isClicking: true }));
      
      // Create ripple effect
      createRipple(e.clientX, e.clientY);
      
      // Physics click effects disabled for better performance
      
      // Animate click effect
      if (ringRef.current) {
        gsap.set(ringRef.current, { opacity: 0 });
        gsap.to(ringRef.current, { opacity: 0.5, duration: 1.5, ease: 'power1.in' });
      }
    }
  }, [isClickable, createRipple]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setCursorState(prev => ({ ...prev, isClicking: false }));
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setCursorState(prev => ({ ...prev, isHovering: false, isClicking: false, isVisible: false }));
  }, []);

  // Handle scroll
  const handleScroll = useCallback(() => {
    if (cursorRef.current && ringRef.current) {
      gsap.to([cursorRef.current, ringRef.current], {
        opacity: 0.3,
        duration: 0.2,
        ease: 'power2.out'
      });
    }
  }, []);

  const handleScrollEnd = useCallback(() => {
    if (cursorRef.current && ringRef.current) {
      gsap.to([cursorRef.current, ringRef.current], {
        opacity: 0.5,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, []);


  // Main effect for event listeners
  useEffect(() => {
    if (CURSOR_CONFIG.disabled || !hasMouse) return;

    // Add event listeners
    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scrollend', handleScrollEnd, { passive: true });

    // Initial setup
    if (cursorRef.current && ringRef.current) {
      gsap.set(cursorRef.current, { opacity: 0 });
      gsap.set(ringRef.current, { opacity: 0 });
      
      gsap.to([cursorRef.current, ringRef.current], {
        opacity: 0.5,
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
    };
  }, [hasMouse, updateCursor, handleMouseDown, handleMouseUp, handleMouseLeave, handleScroll, handleScrollEnd]);

  // Animate ring based on state
  useEffect(() => {
    if (!ringRef.current || !hasMouse) return;

    const currentColor = cursorState.isClicking 
      ? CURSOR_CONFIG.clickColor 
      : cursorState.isHovering 
        ? CURSOR_CONFIG.hoverColor 
        : CURSOR_CONFIG.ringColor;

    gsap.to(ringRef.current, {
      scale: cursorState.isHovering ? 1.1 : 1,
      borderColor: currentColor,
      duration: 0.5,
      ease: 'power1.out'
    });
  }, [hasMouse, cursorState.isHovering, cursorState.isClicking]);

  if (CURSOR_CONFIG.disabled || !hasMouse) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          width: CURSOR_CONFIG.size,
          height: CURSOR_CONFIG.size,
          backgroundColor: cursorState.isClicking ? CURSOR_CONFIG.clickColor : CURSOR_CONFIG.dotColor,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'background-color 0.3s ease',
          left: 0,
          top: 0
        }}
      />
      
      {/* Ring around cursor */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998]"
        style={{
          width: CURSOR_CONFIG.ringSize,
          height: CURSOR_CONFIG.ringSize,
          border: `${CURSOR_CONFIG.ringThickness}px solid ${CURSOR_CONFIG.ringColor}`,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'border-color 0.3s ease, transform 0.3s ease',
          left: 0,
          top: 0
        }}
      />
    </>
  );
});

export default AdvancedCursor;