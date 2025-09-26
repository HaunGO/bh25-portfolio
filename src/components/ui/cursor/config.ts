import { CursorConfig } from './types';

export const DEFAULT_CURSOR_CONFIG: CursorConfig = {
  disabled: false,
  visual: {
    size: 8,
    ringSize: 72,
    ringThickness: 2,
    ringColor: 'rgba(59, 130, 246, 1)',
    dotColor: 'rgb(59, 130, 246)',
    hoverColor: 'rgba(59, 130, 246, 1)',
    clickColor: 'rgba(59, 130, 246, 1)',
  },
  mouse: {
    trailLength: 30,
    trailLayers: [
      { percentage: 0.1, color: 'rgba(59, 130, 246, 1)', strokeWidth: 15 },
      { percentage: 0.2, color: 'rgba(59, 130, 246, 0.9)', strokeWidth: 10 },
      { percentage: 0.3, color: 'rgba(59, 130, 246, 0.8)', strokeWidth: 8 },
      { percentage: 0.4, color: 'rgba(59, 130, 246, 0.7)', strokeWidth: 7 },
      { percentage: 0.5, color: 'rgba(59, 130, 246, 0.6)', strokeWidth: 6 },
      { percentage: 0.6, color: 'rgba(59, 130, 246, 0.5)', strokeWidth: 5 },
      { percentage: 0.7, color: 'rgba(59, 130, 246, 0.4)', strokeWidth: 4 },
      { percentage: 0.8, color: 'rgba(59, 130, 246, 0.3)', strokeWidth: 3 },
      { percentage: 0.9, color: 'rgba(59, 130, 246, 0.2)', strokeWidth: 2 },
      { percentage: 1.0, color: 'rgba(59, 130, 246, 0.1)', strokeWidth: 1 },
    ],
  },
  touch: {
    trailLength: 40,
    trailLayers: [
      { percentage: 0.3, color: 'rgba(59, 130, 246, 1)', strokeWidth: 20 },
      { percentage: 0.5, color: 'rgba(59, 130, 246, 1)', strokeWidth: 16 },
      { percentage: 0.7, color: 'rgba(59, 130, 246, 1)', strokeWidth: 12 },
      { percentage: 0.9, color: 'rgba(59, 130, 246, 1)', strokeWidth: 7 },
      { percentage: 1.0, color: 'rgba(59, 130, 246, 1)', strokeWidth: 4 },
    ],
    fadeDuration: 2.0,
    touchZones: {
      trailZone: {
        left: 0,      // Start from left edge
        right: 0.67,  // End at 2/3 of screen width
      },
      scrollZone: {
        left: 0.67,   // Start at 2/3 of screen width
        right: 1,     // End at right edge
      },
    },
  },
};