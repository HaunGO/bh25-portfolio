export interface TrailLayer {
  percentage: number;
  color: string;
  strokeWidth: number;
}

export interface TrailPoint {
  x: number;
  y: number;
}

export type CursorDazzleStyle = 'pulse' | 'orbit' | 'spark';
export type CursorMorphStyle = 'gooey' | 'angular';

export interface CursorHitRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

export interface CursorHitTarget {
  element: HTMLElement;
  rect: CursorHitRect;
  dazzleStyle: CursorDazzleStyle;
}

export interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  isClicking: boolean;
  isVisible: boolean;
  target: CursorHitTarget | null;
}

export interface CursorUpdate {
  x?: number;
  y?: number;
  isHovering?: boolean;
  isClicking?: boolean;
  isVisible?: boolean;
  target?: CursorHitTarget | null;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export interface MouseTrailConfig {
  trailLength: number;
  hitRadius: number;
  trailLayers: TrailLayer[];
}

export interface TouchTrailConfig {
  trailLength: number;
  hitRadius: number;
  trailLayers: TrailLayer[];
  fadeDuration: number;
  touchZones: {
    trailZone: {
      left: number;    // 0 = left edge
      right: number;   // 1 = right edge
    };
    scrollZone: {
      left: number;    // 0 = left edge  
      right: number;   // 1 = right edge
    };
  };
}

export interface CursorVisualConfig {
  size: number;
  ringSize: number;
  ringThickness: number;
  ringColor: string;
  dotColor: string;
  hoverColor: string;
  clickColor: string;
  hitPadding: number;
  hitRadius: number;
  overlayColor: string;
  targetOpacity: number;
  morphStyle: CursorMorphStyle;
  meshPoints: number;
  meshPointExponent: number;
  morphDuration: number;
  releaseDuration: number;
  jellyStrokeWidth: number;
  enableDazzle: boolean;
  dazzleStyles: Record<CursorDazzleStyle, {
    color: string;
    glowColor: string;
    strokeWidth: number;
    dashArray: string;
    duration: number;
  }>;
}

export interface CursorConfig {
  disabled: boolean;
  mouse: MouseTrailConfig;
  touch: TouchTrailConfig;
  visual: CursorVisualConfig;
}

export interface TrailRendererProps {
  layers: TrailLayer[];
  trailData: TrailPoint[][];
  viewportSize: ViewportSize;
  className?: string;
}

export interface MouseTrailManagerProps {
  config: MouseTrailConfig;
  onTrailUpdate: (layers: TrailPoint[][]) => void;
  onCursorUpdate: (update: CursorUpdate) => void;
  disabled?: boolean;
}

export interface TouchTrailManagerProps {
  config: TouchTrailConfig;
  onTrailUpdate: (layers: TrailPoint[][]) => void;
  onCursorUpdate: (update: CursorUpdate) => void;
  disabled?: boolean;
}

export interface CursorVisualProps {
  position: { x: number; y: number };
  state: CursorState;
  config: CursorVisualConfig;
  viewportSize: ViewportSize;
}

export interface AdvancedCursorProps {
  disabled?: boolean;
  config?: Partial<CursorConfig>;
}
