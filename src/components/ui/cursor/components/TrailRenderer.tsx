import { memo, useRef, useEffect, useState } from 'react';
import { TrailRendererProps, TrailPoint } from '../types';
import { updateTrailLayers } from '../utils/pathHelpers';

/**
 * Pure SVG trail rendering component
 * Handles rendering of trail layers with proper reverse order
 */
const TrailRenderer = memo(function TrailRenderer({ 
  layers, 
  trailData,
  viewportSize, 
  className = '' 
}: TrailRendererProps) {
  const trailLayerRefs = useRef<Array<SVGPathElement | null>>(
    layers.map(() => null)
  );

  // Update trail layer paths when trail data changes
  useEffect(() => {
    updateTrailLayers(trailLayerRefs.current, trailData);
  }, [trailData]);

  return (
    <svg 
      width="100%" 
      height="100%"
      viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
      preserveAspectRatio="none"
      className={`fixed top-0 left-0 pointer-events-none z-[9998] w-full h-full ${className}`}
    >
      <g className='opacity-50'> 
      {/* Trail layers (rendered in reverse order so shortest appears on top) */}
      {layers.map((layer, index) => {
        const reverseIndex = layers.length - 1 - index; // Reverse the order
        return (
          <path 
            key={`trail-layer-${reverseIndex}`}
            ref={(el) => { trailLayerRefs.current[reverseIndex] = el; }}
            fill="none" 
            stroke={layers[reverseIndex].color}
            strokeWidth={layers[reverseIndex].strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
      </g>
    </svg>
  );
});

export default TrailRenderer;
