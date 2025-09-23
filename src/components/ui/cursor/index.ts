// Main component
export { default as AdvancedCursor } from './components/AdvancedCursor';

// Individual components
export { default as TrailRenderer } from './components/TrailRenderer';
export { default as MouseTrailManager } from './components/MouseTrailManager';
export { default as TouchTrailManager } from './components/TouchTrailManager';
export { default as CursorVisual } from './components/CursorVisual';

// Hooks
export { useMouseSupport } from './hooks/useMouseSupport';
export { useTouchSupport } from './hooks/useTouchSupport';

// Types
export type * from './types';

// Configuration
export { DEFAULT_CURSOR_CONFIG } from './config';

// Utilities
export * from './utils/coordinateUtils';
export * from './utils/pathHelpers';
