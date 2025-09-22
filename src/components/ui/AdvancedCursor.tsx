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
  
  // Trail settings
  trailLength: 60, // Number of points to keep in the main trail
  trailLayers: [
    { percentage: 0.33, opacity: 0.3 }, // First layer: 33% of trailLength
    { percentage: 0.66, opacity: 0.3 }, // Second layer: 66% of trailLength  
    { percentage: 1.0, opacity: 0.3 }   // Third layer: 100% of trailLength
  ],
  
  // Behavior settings
  disabled: false
};

const AdvancedCursor = memo(function AdvancedCursor() {
  const cursorRef = useRef<SVGPathElement>(null);
  const ringRef = useRef<SVGPathElement>(null);
  const hasMouse = useMouseSupport();
  const pathRef = useRef<SVGPathElement>(null);
  const trailLayerRefs = useRef<Array<SVGPathElement | null>>(
    CURSOR_CONFIG.trailLayers.map(() => null)
  );

  const [cursorState, setCursorState] = useState({
    x: 0,
    y: 0,
    isHovering: false,
    isClicking: false,
    target: null as HTMLElement | null,
    isVisible: false
  });

  // Store cursor trail points
  const [trailPoints, setTrailPoints] = useState<Array<{x: number, y: number}>>([]);
  const [trailLayers, setTrailLayers] = useState<Array<Array<{x: number, y: number}>>>(
    CURSOR_CONFIG.trailLayers.map(() => [])
  );
  
  // Track if we're hovering over a link
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  
  // Track viewport dimensions for dynamic viewBox
  const [viewportSize, setViewportSize] = useState({ width: 1920, height: 1080 });

  // Convert screen coordinates to SVG coordinates
  const screenToSVG = useCallback((screenX: number, screenY: number) => {
    // Direct 1:1 mapping - no conversion needed
    return { x: screenX, y: screenY };
  }, []);

  // Update path with trail points
  const updatePath = useCallback((points: Array<{x: number, y: number}>) => {
    if (!pathRef.current || points.length < 2) return;
    
    const pathData = points.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      } else {
        return `${path} L ${point.x} ${point.y}`;
      }
    }, '');
    
    pathRef.current.setAttribute('d', pathData);
  }, []);

  // Update trail layer paths
  const updateTrailLayers = useCallback((layers: Array<Array<{x: number, y: number}>>) => {
    layers.forEach((layer, index) => {
      const pathElement = trailLayerRefs.current[index];
      const colors = ['RED', 'GREEN', 'BLUE'];
      console.log(`${colors[index]} Layer ${index}: ${layer.length} points`);
      
      if (!pathElement || layer.length < 2) {
        // Clear the path if no data
        if (pathElement) pathElement.setAttribute('d', '');
        return;
      }
      
      const pathData = layer.reduce((path, point, pointIndex) => {
        if (pointIndex === 0) {
          return `M ${point.x} ${point.y}`;
        } else {
          return `${path} L ${point.x} ${point.y}`;
        }
      }, '');
      
      console.log(`${colors[index]} Layer ${index} path:`, pathData.substring(0, 50) + '...');
      pathElement.setAttribute('d', pathData);
    });
  }, []);

  // Create circle path for ring at specified size
  const createCirclePath = useCallback((radius: number, centerX: number = radius, centerY: number = radius) => {
    return `M ${centerX} ${centerY} A ${radius} ${radius} 0 1 1 ${centerX + 0.1} ${centerY} Z`;
  }, []);

  // Create filled circle path for cursor dot
  const createCursorPath = useCallback((radius: number, centerX: number = radius, centerY: number = radius) => {
    return `M ${centerX} ${centerY} A ${radius} ${radius} 0 1 1 ${centerX + 0.1} ${centerY} Z`;
  }, []);

  // Create rectangle path for link hover effect
  const createRectanglePath = useCallback((rect: DOMRect) => {
    const topLeft = screenToSVG(rect.left, rect.top);
    const topRight = screenToSVG(rect.right, rect.top);
    const bottomRight = screenToSVG(rect.right, rect.bottom);
    const bottomLeft = screenToSVG(rect.left, rect.bottom);
    
    return `M ${topLeft.x} ${topLeft.y} L ${topRight.x} ${topRight.y} L ${bottomRight.x} ${bottomRight.y} L ${bottomLeft.x} ${bottomLeft.y} Z`;
  }, [screenToSVG]);

  // Check if element should trigger hover state
  const isHoverable = useCallback((element: HTMLElement | null): boolean => {
    if (!element) return false;
    
    const hoverableSelectors = ['a', 'button'];
    
    return hoverableSelectors.some(selector => 
      element.matches(selector) || element.closest(selector)
    );
  }, []);

  // Check if element should trigger click state
  const isClickable = useCallback((element: HTMLElement | null): boolean => {
    if (!element) return false;
    
    const clickableSelectors = [
      'a', 'button', '[role="button"]'
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






  // Update cursor position and state ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  const updateCursor = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isHovering = isHoverable(target);
    const isClickableElement = isClickable(target);
    
    setCursorState(prev => ({
      ...prev,
      x: e.clientX,
      y: e.clientY,
      isHovering: false,
      isClicking: false,
      target,
      isVisible: true
    }));

    // Animate cursor position
    if (cursorRef.current && ringRef.current) {
      // Create cursor path directly at mouse position
      const cursorPath = createCursorPath(5, e.clientX, e.clientY + 5);
      gsap.to(cursorRef.current, {
        attr: { d: cursorPath },
        duration: 0,
        ease: 'power2.out'
      });

      gsap.to(ringRef.current, {
        attr: { transform: `translate(${e.clientX - 80}, ${e.clientY})` },
        duration: 0,
        ease: 'power2.out'
      });
    }








    
    // Update trail points for path animation (only when not hovering over links)
    if (!isHoveringLink) {
      const svgPoint = screenToSVG(e.clientX, e.clientY);
      
      // Update main trail
      setTrailPoints(prev => {
        const newPoints = [...prev, svgPoint];
        return newPoints.slice(-CURSOR_CONFIG.trailLength);
      });
      
      // Update trail layers
      setTrailLayers(prev => 
        prev.map((layer, index) => {
          const newPoints = [...layer, svgPoint];
          const layerLength = Math.floor(CURSOR_CONFIG.trailLayers[index].percentage * CURSOR_CONFIG.trailLength);
          return newPoints.slice(-layerLength);
        })
      );
    }

  }, [isHoverable, isClickable, screenToSVG, isHoveringLink]);








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
      gsap.to(cursorRef.current, {
        opacity: 0.3,
        duration: 0.2,
        ease: 'power2.out'
      });
      gsap.to(ringRef.current, {
        opacity: 0.3,
        duration: 0.2,
        ease: 'power2.out'
      });
    }
  }, []);

  const handleScrollEnd = useCallback(() => {
    if (cursorRef.current && ringRef.current) {
      gsap.to(cursorRef.current, {
        opacity: 0.5,
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.to(ringRef.current, {
        opacity: 0.5,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, []);

  // Handle window resize
  const handleResize = useCallback(() => {
    // Update viewport size and clear trail points on resize
    setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    setTrailPoints([]);
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
    window.addEventListener('resize', handleResize);

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
    
    // Set initial viewport size
    setViewportSize({ width: window.innerWidth, height: window.innerHeight });

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scrollend', handleScrollEnd);
      window.removeEventListener('resize', handleResize);
    };
  }, [hasMouse, updateCursor, handleMouseDown, handleMouseUp, handleMouseLeave, handleScroll, handleScrollEnd, handleResize]);

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
      stroke: currentColor,
      duration: 0.5,
      ease: 'power1.out'
    });
  }, [hasMouse, cursorState.isHovering, cursorState.isClicking]);

  // Animate cursor based on state
  useEffect(() => {
    if (!cursorRef.current || !hasMouse) return;

    const currentColor = cursorState.isClicking 
      ? CURSOR_CONFIG.clickColor 
      : CURSOR_CONFIG.dotColor;

    gsap.to(cursorRef.current, {
      fill: currentColor,
      duration: 0.3,
      ease: 'power1.out'
    });
  }, [hasMouse, cursorState.isClicking]);


  // Update path when trail points change
  useEffect(() => {
    if (!isHoveringLink) {
      updatePath(trailPoints);
      updateTrailLayers(trailLayers);
    }
  }, [trailPoints, trailLayers, updatePath, updateTrailLayers, isHoveringLink]);

  // Setup advanced cursor hover effects (disabled for now)
  useEffect(() => {
    if (!hasMouse) return;

    // TODO: Re-enable hover effects later
    // const advancedCursorElements = document.querySelectorAll('[data-advanced-cursor="true"]');
    
    // const handleElementMouseEnter = (e: Event) => {
    //   const element = e.target as HTMLElement;
    //   const rect = element.getBoundingClientRect();
    //   const rectPath = createRectanglePath(rect);
      
    //   setIsHoveringLink(true);
      
    //   if (pathRef.current) {
    //     gsap.fromTo(pathRef.current, {
    //       d: "M0,0 m-4,0 a4,4 0 1,0 8,0 a4,4 0 1,0 -8,0"
    //     }, {
    //       attr: { d: rectPath },
    //       duration: 0.4,
    //       ease: "power3.out",
    //     });
    //   }
    // };

    // const handleElementMouseLeave = () => {
    //   setIsHoveringLink(false);
      
    //   if (pathRef.current) {
    //     gsap.to(pathRef.current, {
    //       attr: { d: "M0,0 m-4,0 a4,4 0 1,0 8,0 a4,4 0 1,0 -8,0" },
    //       duration: 0.4,
    //       ease: "power3.inOut",
    //     });
    //   }
    // };

    // // Add event listeners to all advanced cursor elements
    // advancedCursorElements.forEach(element => {
    //   element.addEventListener('mouseenter', handleElementMouseEnter);
    //   element.addEventListener('mouseleave', handleElementMouseLeave);
    // });

    // // Cleanup function
    // return () => {
    //   advancedCursorElements.forEach(element => {
    //     element.removeEventListener('mouseenter', handleElementMouseEnter);
    //     element.removeEventListener('mouseleave', handleElementMouseLeave);
    //   });
    // };
  }, [hasMouse, createRectanglePath]);

  if (CURSOR_CONFIG.disabled || !hasMouse) return null;

  return (
    <>
      {/* Main cursor dot */}
      {/* <div
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
      /> */}
      
      {/* Ring around cursor */}
      {/* <div
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
      /> */}

      {/* Animation Layer SVG */}
      <svg 
        id="animation-layer"
        width="100%" 
        height="100%"
        viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
        preserveAspectRatio="none"
        className="fixed top-0 left-0 pointer-events-none z-[9996] w-full h-full"
      >
        {/* Trail layers (rendered in reverse order so shortest appears on top) */}
        {CURSOR_CONFIG.trailLayers.map((layer, index) => {
          // const colors = ['rgba(255, 0, 0, 1)', 'rgba(0, 255, 0, 1)', 'rgba(0, 0, 255, 1)'];
          const colors = ['rgba(59, 130, 246, 1)', 'rgba(59, 130, 246, 0.8)', 'rgba(59, 130, 246, 0.4)'];
          // Longer trails = thinner strokes (reverse relationship)
          const strokeWidths = [6, 4, 3]; // Layer 0 (shortest) = thickest, Layer 2 (longest) = thinnest
          const reverseIndex = CURSOR_CONFIG.trailLayers.length - 1 - index; // Reverse the order
          return (
            <path 
              key={`trail-layer-${reverseIndex}`}
              ref={(el) => { trailLayerRefs.current[reverseIndex] = el; }}
              fill="none" 
              stroke={colors[reverseIndex]}
              strokeWidth={strokeWidths[reverseIndex]}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: layer.opacity }}
            />
          );
        })}
        
        {/* Main trail (rendered on top) - temporarily hidden for debugging */}
        <path 
          ref={pathRef} 
          fill="none" 
          stroke="rgba(59, 130, 246, 0.6)" 
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0"
        />
        
        {/* Ring around cursor */}
        <path 
          ref={ringRef} 
          fill="none"
          d={createCirclePath(40, 80, 40)} 
          stroke="rgba(19, 110, 146, 0.9)" 
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Main cursor dot */}
        <path 
          ref={cursorRef} 
          fill={cursorState.isClicking ? CURSOR_CONFIG.clickColor : CURSOR_CONFIG.dotColor}
          d={createCursorPath(5, 0, 0)} 
          stroke="none"
        />
      </svg>


    </>
  );
});

export default AdvancedCursor;