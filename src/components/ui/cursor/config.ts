import { CursorConfig } from './types';

export const DEFAULT_CURSOR_CONFIG: CursorConfig = {
  disabled: false,
  visual: {
    size: 8,
    ringSize: 72,
    ringThickness: 1,
    ringColor: 'rgba(59, 130, 246, 1)',
    dotColor: 'rgb(59, 130, 246)',
    hoverColor: 'rgba(59, 130, 246, 1)',
    clickColor: 'rgba(59, 130, 246, 1)',
    hitPadding: 0,
    hitRadius: 0,
    overlayColor: 'rgba(59, 130, 246, 0.06)',
    targetOpacity: 0.2,
    morphStyle: 'angular',
    meshPoints: 50,
    meshPointExponent: 2.35,
    morphDuration: 0.48,
    releaseDuration: 0.32,
    jellyStrokeWidth: 1,
    enableDazzle: false,
    dazzleStyles: {
      pulse: {
        color: 'rgba(59, 130, 246, 1)',
        glowColor: 'rgba(59, 130, 246, 0.75)',
        strokeWidth: 3,
        dashArray: '10 12',
        duration: 0.9,
      },
      orbit: {
        color: 'rgba(168, 85, 247, 1)',
        glowColor: 'rgba(168, 85, 247, 0.8)',
        strokeWidth: 2.5,
        dashArray: '2 9',
        duration: 0.55,
      },
      spark: {
        color: 'rgba(245, 158, 11, 1)',
        glowColor: 'rgba(245, 158, 11, 0.85)',
        strokeWidth: 3.5,
        dashArray: '1 6 14 8',
        duration: 0.7,
      },
    },
  },
  mouse: {
    trailLength: 30,
    hitRadius: 44,
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
    hitRadius: 56,
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