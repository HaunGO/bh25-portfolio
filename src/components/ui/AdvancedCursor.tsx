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
  ringColor?: string;
  dotColor?: string;
  hoverColor?: string;
  clickColor?: string;
  disabled?: boolean;
  magneticStrength?: number;
}

export default function AdvancedCursor({
  size = 8,
  ringSize = 72, // 3x the pointer size
  ringThickness = 1,
  ringColor = 'rgba(178, 178, 178, 0.8)',
  dotColor = 'rgb(11, 132, 218)',
  hoverColor = 'rgba(59, 130, 246, 0.8)', 
  clickColor = 'rgba(59, 130, 246, 0.8)', 
  disabled = false,
  magneticStrength = 0.9
}: AdvancedCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<CursorState>({
    x: 0,
    y: 0,
    isHovering: false,
    isClicking: false,
    target: null,
    isVisible: false
  });


  // Check if element should trigger hover state
  const isHoverable = (element: HTMLElement | null): boolean => {
    if (!element) return false;
    
    const hoverableSelectors = ['a', 'button'];
    
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
    ripple.style.border = `5px solid ${clickColor}`;
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
    if (cursorRef.current && ringRef.current) {
      gsap.to(cursorRef.current, {
        left: finalX,
        top: finalY,
        duration: 0,
        ease: 'power2.out'
      });

      gsap.to(ringRef.current, {
        left: finalX,
        top: finalY,
        duration: 0,
        ease: 'power2.out'
      });
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
      if (ringRef.current) {
        gsap.set(ringRef.current, { opacity:0 });
        gsap.to(ringRef.current, {
          opacity: 0.5,
          duration: 2,
          ease: 'power1.in',
          // yoyo: true,
          // repeat: 1
        });
      }
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
    if (cursorRef.current && ringRef.current) {
      gsap.to([cursorRef.current, ringRef.current], {
        opacity: 0.3,
        duration: 0.2,
        ease: 'power2.out'
      });
    }
  };

  const handleScrollEnd = () => {
    if (cursorRef.current && ringRef.current) {
      gsap.to([cursorRef.current, ringRef.current], {
        opacity: 0.5,
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
      

      // Keep default cursor visible
      // document.body.style.cursor = 'auto';
    };
  }, [disabled, size, ringSize, magneticStrength]);




  // Animate ring based on state
  useEffect(() => {
    if (!ringRef.current) return;

    const currentColor = cursorState.isClicking 
      ? clickColor 
      : cursorState.isHovering 
        ? hoverColor 
        : ringColor;

    gsap.to(ringRef.current, {
      scale: cursorState.isHovering ? 1.1 : 1,
      borderColor: currentColor,
      duration: 0.5,
      ease: 'power1.out'
    });
  }, [cursorState.isHovering, cursorState.isClicking, ringColor, hoverColor, clickColor]);





  if (disabled) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          width: size,
          height: size,
          backgroundColor: cursorState.isClicking ? clickColor : dotColor,
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
          width: ringSize,
          height: ringSize,
          border: `${ringThickness}px solid ${ringColor}`,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'border-color 0.3s ease, transform 0.3s ease',
          left: 0,
          top: 0
        }}
      />
    </>
  );
}
