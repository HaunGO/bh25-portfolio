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
export type CursorMorphVariant = 'outline' | 'line' | 'border';
export type CursorBorderEdge = 'top' | 'bottom';

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
  morphVariant: CursorMorphVariant;
  borderEdge: CursorBorderEdge;
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
  minMove: number;
  holdMs: number;
  cancelMove: number;
}

export interface CursorVisualConfig {
  enableRing: boolean;
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
  targetRadius: number;
  morphStyle: CursorMorphStyle;
  meshPoints: number;
  meshPointExponent: number;
  morphDuration: number;
  releaseDuration: number;
  jellyStrokeWidth: number;
  targetGlowColor: string;
  targetGlowWidth: number;
  targetGlowOpacity: number;
  flatTargetGlowColor: string;
  flatTargetGlowWidth: number;
  flatTargetGlowOpacity: number;
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
  opacity?: number;
  vivid?: boolean;
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
  onTrailOpacity?: (opacity: number) => void;
  disabled?: boolean;
  drawMode?: boolean;
}

export interface CursorVisualProps {
  position: { x: number; y: number };
  state: CursorState;
  config: CursorVisualConfig;
  viewportSize: ViewportSize;
}

export interface AdvancedCursorProps {
  disabled?: boolean;
  drawMode?: boolean;
  config?: Partial<CursorConfig>;
}
