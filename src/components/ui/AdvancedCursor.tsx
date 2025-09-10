'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { CursorPhysicsEngine, createCursorTrail, createClickEffect, createHoverEffect } from '@/lib/physics';

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
  disabled: false,
  magneticStrength: 0.9,
  
  // Physics settings
  enablePhysics: true,
  enableTrail: true,
  enableParticles: true,
  particleIntensity: 3,
  
  // Performance settings
  trailFrequency: 50, // ms between trail particles
  particleFrequency: 200, // ms between hover particles
  maxParticles: 50
};

export default function AdvancedCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const physicsRef = useRef<CursorPhysicsEngine | null>(null);
  
  const [cursorState, setCursorState] = useState({
    x: 0,
    y: 0,
    isHovering: false,
    isClicking: false,
    target: null as HTMLElement | null,
    isVisible: false
  });

  const [lastTrailTime, setLastTrailTime] = useState(0);
  const [lastParticleTime, setLastParticleTime] = useState(0);

  // Check if element should trigger hover state
  const isHoverable = useCallback((element: HTMLElement | null): boolean => {
    if (!element) return false;
    
    const hoverableSelectors = ['a', 'button', '[data-cursor-hover]', '.cursor-hover'];
    
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

  // Check if element has magnetic effect
  const isMagnetic = useCallback((element: HTMLElement | null): boolean => {
    if (!element) return false;
    
    const magneticSelectors = [
      '[data-cursor-magnetic]', '.cursor-magnetic',
      'button', 'a', '[role="button"]'
    ];
    
    return magneticSelectors.some(selector => 
      element.matches(selector) || element.closest(selector)
    );
  }, []);

  // Get magnetic target position
  const getMagneticPosition = useCallback((element: HTMLElement, mouseX: number, mouseY: number) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = centerX - mouseX;
    const deltaY = centerY - mouseY;
    
    return {
      x: mouseX + deltaX * CURSOR_CONFIG.magneticStrength,
      y: mouseY + deltaY * CURSOR_CONFIG.magneticStrength
    };
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
    const isMagneticElement = isMagnetic(target);
    
    let finalX = e.clientX;
    let finalY = e.clientY;
    
    // Apply magnetic effect
    if (isMagneticElement && target) {
      const magneticPos = getMagneticPosition(target, e.clientX, e.clientY);
      finalX = magneticPos.x;
      finalY = magneticPos.y;
    }
    
    setCursorState(prev => ({
      ...prev,
      x: finalX,
      y: finalY,
      isHovering,
      isClicking: false,
      target,
      isVisible: true
    }));

    // Update physics engine
    if (physicsRef.current) {
      physicsRef.current.updateCursorPosition(finalX, finalY);
      
      // Apply magnetic force to particles
      physicsRef.current.applyMagneticForce();
    }

    // Create trail effect
    if (CURSOR_CONFIG.enableTrail && physicsRef.current) {
      const now = Date.now();
      if (now - lastTrailTime > CURSOR_CONFIG.trailFrequency) {
        createCursorTrail(physicsRef.current, finalX, finalY);
        setLastTrailTime(now);
      }
    }

    // Create hover particles
    if (CURSOR_CONFIG.enableParticles && isHovering && physicsRef.current) {
      const now = Date.now();
      if (now - lastParticleTime > CURSOR_CONFIG.particleFrequency) {
        createHoverEffect(physicsRef.current, finalX, finalY);
        setLastParticleTime(now);
      }
    }

    // Animate cursor position
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
  }, [isHoverable, isClickable, isMagnetic, getMagneticPosition, lastTrailTime, lastParticleTime]);

  // Handle mouse down
  const handleMouseDown = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isClickableElement = isClickable(target);
    
    if (isClickableElement) {
      setCursorState(prev => ({ ...prev, isClicking: true }));
      
      // Create ripple effect
      createRipple(e.clientX, e.clientY);
      
      // Create physics click effect
      if (CURSOR_CONFIG.enablePhysics && physicsRef.current) {
        createClickEffect(physicsRef.current, e.clientX, e.clientY);
      }
      
      // Animate click effect
      if (ringRef.current) {
        gsap.set(ringRef.current, { opacity: 0 });
        gsap.to(ringRef.current, {
          opacity: 0.5,
          duration: 2,
          ease: 'power1.in'
        });
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

  // Initialize physics engine
  useEffect(() => {
    if (!CURSOR_CONFIG.enablePhysics || CURSOR_CONFIG.disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize physics engine
    physicsRef.current = new CursorPhysicsEngine({
      gravity: 0.1,
      friction: 0.001,
      frictionAir: 0.01,
      restitution: 0.8,
      density: 0.001
    });

    physicsRef.current.initialize(canvas);
    physicsRef.current.start();

    return () => {
      if (physicsRef.current) {
        physicsRef.current.cleanup();
      }
    };
  }, []);

  // Main effect for event listeners
  useEffect(() => {
    if (CURSOR_CONFIG.disabled) return;

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
  }, [updateCursor, handleMouseDown, handleMouseUp, handleMouseLeave, handleScroll, handleScrollEnd]);

  // Animate ring based on state
  useEffect(() => {
    if (!ringRef.current) return;

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
  }, [cursorState.isHovering, cursorState.isClicking]);

  if (CURSOR_CONFIG.disabled) return null;

  return (
    <>
      {/* Physics Canvas - Hidden, used for Matter.js rendering */}
      {CURSOR_CONFIG.enablePhysics && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-[9996]"
          style={{ opacity: 0 }}
        />
      )}

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
}
