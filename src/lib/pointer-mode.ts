export type PointerMode = 'fine' | 'coarse' | 'none';

export const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';
export const COARSE_POINTER_QUERY = '(pointer: coarse)';
export const HOVER_QUERY = '(hover: hover)';

export function getPointerMode(): PointerMode {
  if (typeof window === 'undefined') {
    return 'none';
  }

  const hasHover = window.matchMedia(HOVER_QUERY).matches;
  const hasFine = window.matchMedia('(pointer: fine)').matches;
  const hasCoarse = window.matchMedia(COARSE_POINTER_QUERY).matches;
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (hasHover && hasFine) {
    return 'fine';
  }

  if (hasCoarse || hasTouch) {
    return 'coarse';
  }

  return 'none';
}

export function applyPointerMode(mode: PointerMode = getPointerMode()) {
  if (typeof document === 'undefined') {
    return mode;
  }

  document.documentElement.dataset.pointer = mode;
  return mode;
}

export function readPointerMode(): PointerMode {
  if (typeof document === 'undefined') {
    return 'none';
  }

  const fromDom = document.documentElement.dataset.pointer;
  if (fromDom === 'fine' || fromDom === 'coarse' || fromDom === 'none') {
    return fromDom;
  }

  return getPointerMode();
}

export function subscribePointerMode(onChange: (mode: PointerMode) => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const notify = () => {
    onChange(applyPointerMode());
  };

  const hoverQuery = window.matchMedia(HOVER_QUERY);
  const fineQuery = window.matchMedia('(pointer: fine)');
  const coarseQuery = window.matchMedia(COARSE_POINTER_QUERY);

  hoverQuery.addEventListener('change', notify);
  fineQuery.addEventListener('change', notify);
  coarseQuery.addEventListener('change', notify);

  return () => {
    hoverQuery.removeEventListener('change', notify);
    fineQuery.removeEventListener('change', notify);
    coarseQuery.removeEventListener('change', notify);
  };
}
