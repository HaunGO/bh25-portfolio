export interface TrailLayer {
  percentage: number;
  color: string;
  strokeWidth: number;
}

export interface TrailPoint {
  x: number;
  y: number;
}

export interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  isClicking: boolean;
  isVisible: boolean;
  target: HTMLElement | null;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export interface MouseTrailConfig {
  trailLength: number;
  trailLayers: TrailLayer[];
}

export interface TouchTrailConfig {
  trailLength: number;
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
  onCursorUpdate: (position: { x: number; y: number }) => void;
  disabled?: boolean;
}

export interface TouchTrailManagerProps {
  config: TouchTrailConfig;
  onTrailUpdate: (layers: TrailPoint[][]) => void;
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
