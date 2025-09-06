import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface CursorConfig {
  size?: number;
  ringSize?: number;
  ringThickness?: number;
  color?: string;
  hoverColor?: string;
  clickColor?: string;
  disabled?: boolean;
}

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  isClicking: boolean;
  target: HTMLElement | null;
}

export function useCustomCursor(config: CursorConfig = {}) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  const {
    size = 24,
    ringSize = 72,
    ringThickness = 2,
    color = 'rgba(255, 255, 255, 0.8)',
    hoverColor = 'rgba(59, 130, 246, 0.8)',
    clickColor = 'rgba(239, 68, 68, 0.8)',
    disabled = false
  } = config;

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

  // Create ripple effect on click
  const createRipple = (x: number, y: number) => {
    if (!ringRef.current) return;

    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = `${x - ringSize / 2}px`;
    ripple.style.top = `${y - ringSize / 2}px`;
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
          document.body.removeChild(ripple);
        }
      }
    );
  };

  // Update cursor position and state
  const updateCursor = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isHovering = isHoverable(target);
    const isClickable = isClickable(target);
    
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
      // Create ripple effect
      createRipple(e.clientX, e.clientY);
      
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
    // Reset any click states if needed
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    // Reset hover states if needed
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

  return {
    cursorRef,
    ringRef,
    size,
    ringSize,
    ringThickness,
    color,
    hoverColor,
    clickColor
  };
}
