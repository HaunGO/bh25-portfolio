'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useCustomCursor } from '@/hooks/useCustomCursor';

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  isClicking: boolean;
  target: HTMLElement | null;
}

interface CustomCursorProps {
  size?: number;
  ringSize?: number;
  ringThickness?: number;
  color?: string;
  hoverColor?: string;
  clickColor?: string;
  disabled?: boolean;
}

export default function CustomCursor({
  size = 24,
  ringSize = 72, // 3x the pointer size
  ringThickness = 2,
  color = 'rgba(255, 255, 255, 0.8)',
  hoverColor = 'rgba(59, 130, 246, 0.8)',
  clickColor = 'rgba(239, 68, 68, 0.8)',
  disabled = false
}: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<CursorState>({
    x: 0,
    y: 0,
    isHovering: false,
    isClicking: false,
    target: null
  });

  // Check if element should trigger hover state
  const isHoverable = (element: HTMLElement | null): boolean => {
    if (!element) return false;
    
    const hoverableSelectors = [
      'a', 'button', '[role="button"]', 
      'input', 'textarea', 'select',
      '[data-cursor-hover]', '[data-cursor-click]',
      '.cursor-hover', '.cursor-click'
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

  // Update cursor position and state
  const updateCursor = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isHovering = isHoverable(target);
    const isClickable = isClickable(target);
    
    setCursorState({
      x: e.clientX,
      y: e.clientY,
      isHovering,
      isClicking: false,
      target
    });

    // Animate cursor position
    if (cursorRef.current && ringRef.current) {
      gsap.to(cursorRef.current, {
        x: e.clientX - size / 2,
        y: e.clientY - size / 2,
        duration: 0.1,
        ease: 'power2.out'
      });

      gsap.to(ringRef.current, {
        x: e.clientX - ringSize / 2,
        y: e.clientY - ringSize / 2,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  // Handle mouse down
  const handleMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isClickable = isClickable(target);
    
    if (isClickable) {
      setCursorState(prev => ({ ...prev, isClicking: true }));
      
      // Animate click effect
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          scale: 0.8,
          duration: 0.1,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1
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
    setCursorState(prev => ({ ...prev, isHovering: false, isClicking: false }));
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

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Initial setup
    if (cursorRef.current && ringRef.current) {
      gsap.set(cursorRef.current, { opacity: 0 });
      gsap.set(ringRef.current, { opacity: 0 });
      
      gsap.to([cursorRef.current, ringRef.current], {
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
      
      // Restore default cursor
      document.body.style.cursor = 'auto';
    };
  }, [disabled, size, ringSize]);

  // Animate ring based on state
  useEffect(() => {
    if (!ringRef.current) return;

    const currentColor = cursorState.isClicking 
      ? clickColor 
      : cursorState.isHovering 
        ? hoverColor 
        : color;

    gsap.to(ringRef.current, {
      scale: cursorState.isHovering ? 1.2 : 1,
      borderColor: currentColor,
      duration: 0.3,
      ease: 'power2.out'
    });
  }, [cursorState.isHovering, cursorState.isClicking, color, hoverColor, clickColor]);

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
          backgroundColor: cursorState.isClicking ? clickColor : color,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'background-color 0.3s ease'
        }}
      />
      
      {/* Ring around cursor */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998]"
        style={{
          width: ringSize,
          height: ringSize,
          border: `${ringThickness}px solid ${color}`,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'border-color 0.3s ease, transform 0.3s ease'
        }}
      />
    </>
  );
}
