import { CursorConfig } from './types';

export const DEFAULT_CURSOR_CONFIG: CursorConfig = {
  disabled: false,
  visual: {
    enableRing: true,
    size: 7,
    ringSize: 76,
    ringThickness: 0.8,
    ringColor: 'rgba(56, 189, 248, 1)',
    dotColor: 'rgb(56, 189, 248)',
    hoverColor: 'rgba(56, 189, 248, 1)',
    clickColor: 'rgba(125, 211, 252, 1)',
    hitPadding: 6,
    hitRadius: 0,
    overlayColor: 'rgba(56, 189, 248, 0.035)',
    targetOpacity: 0.34,
    targetRadius: 18,
    morphStyle: 'angular',
    meshPoints: 50,
    meshPointExponent: 2.35,
    morphDuration: 0.48,
    releaseDuration: 0.32,
    jellyStrokeWidth: 0.5,
    targetGlowColor: 'rgba(56, 189, 248, 0.62)',
    targetGlowWidth: 4,
    targetGlowOpacity: 0.28,
    flatTargetGlowColor: 'rgba(56, 189, 248, 0.76)',
    flatTargetGlowWidth: 6,
    flatTargetGlowOpacity: 0.72,
    enableDazzle: true,
    dazzleStyles: {
      pulse: {
        color: 'rgba(56, 189, 248, 1)',
        glowColor: 'rgba(56, 189, 248, 0.72)',
        strokeWidth: 1.1,
        dashArray: '6 10',
        duration: 0.7,
      },
      orbit: {
        color: 'rgba(125, 211, 252, 1)',
        glowColor: 'rgba(125, 211, 252, 0.72)',
        strokeWidth: 1,
        dashArray: '1 7',
        duration: 0.45,
      },
      spark: {
        color: 'rgba(240, 249, 255, 1)',
        glowColor: 'rgba(56, 189, 248, 0.75)',
        strokeWidth: 1.2,
        dashArray: '1 5 9 7',
        duration: 0.5,
      },
    },
  },
  mouse: {
    trailLength: 44,
    hitRadius: 58,
    trailLayers: [
      { percentage: 0.1, color: 'rgba(245, 158, 11, 0.95)', strokeWidth: 16 },
      { percentage: 0.2, color: 'rgba(168, 85, 247, 0.85)', strokeWidth: 12 },
      { percentage: 0.3, color: 'rgba(59, 130, 246, 0.75)', strokeWidth: 10 },
      { percentage: 0.4, color: 'rgba(245, 158, 11, 0.58)', strokeWidth: 8 },
      { percentage: 0.5, color: 'rgba(168, 85, 247, 0.48)', strokeWidth: 7 },
      { percentage: 0.6, color: 'rgba(59, 130, 246, 0.38)', strokeWidth: 6 },
      { percentage: 0.7, color: 'rgba(245, 158, 11, 0.28)', strokeWidth: 4 },
      { percentage: 0.8, color: 'rgba(168, 85, 247, 0.2)', strokeWidth: 3 },
      { percentage: 0.9, color: 'rgba(59, 130, 246, 0.14)', strokeWidth: 2 },
      { percentage: 1.0, color: 'rgba(59, 130, 246, 0.08)', strokeWidth: 1 },
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