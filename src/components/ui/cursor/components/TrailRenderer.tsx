import { memo, useRef, useEffect } from 'react';
import { TrailRendererProps } from '../types';
import { updateTrailLayers } from '../utils/pathHelpers';

const TrailHandoffMask = memo(function TrailHandoffMask({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  return (
    <defs>
      <mask
        id="cursor-trail-handoff-mask"
        maskUnits="userSpaceOnUse"
        maskContentUnits="userSpaceOnUse"
      >
        <rect x="0" y="0" width={width} height={height} fill="white" />
        <g data-trail-handoff-holes />
      </mask>
    </defs>
  );
});

/**
 * Pure SVG trail rendering component
 * Handles rendering of trail layers with proper reverse order
 */
const TrailRenderer = memo(function TrailRenderer({
  layers,
  trailData,
  viewportSize,
  className = '',
}: TrailRendererProps) {
  const trailLayerRefs = useRef<Array<SVGPathElement | null>>(layers.map(() => null));

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
      <TrailHandoffMask width={viewportSize.width} height={viewportSize.height} />
      <g className="opacity-50" mask="url(#cursor-trail-handoff-mask)">
        {layers.map((layer, index) => {
          const reverseIndex = layers.length - 1 - index;
          return (
            <path
              key={`trail-layer-${reverseIndex}`}
              ref={(el) => {
                trailLayerRefs.current[reverseIndex] = el;
              }}
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
