export type TransitionVariant = 'fade' | 'topWipe' | 'bottomWipe' | 'diagonalMask';

export interface TransitionState {
  isTransitioning: boolean;
  currentVariant: TransitionVariant;
}

export interface PageTransitionContextType {
  startTransition: (to: string) => Promise<void>;
  setOverlayVariant: (variant: TransitionVariant) => void;
  isTransitioning: boolean;
  currentVariant: TransitionVariant;
}
