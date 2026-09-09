import type { PointerEvent as ReactPointerEvent } from 'react';
import { applyRainbowEnter, applyRainbowLeave } from '@/lib/motion';

type RainbowProperty = 'color' | 'backgroundColor';

function isTouchLike(event: ReactPointerEvent<HTMLElement>) {
  return event.pointerType === 'touch' || event.pointerType === 'pen';
}

export function rainbowLetterHandlers(
  restColor: () => string,
  property: RainbowProperty = 'color',
) {
  return {
    onPointerEnter: (event: ReactPointerEvent<HTMLElement>) => {
      if (isTouchLike(event)) {
        return;
      }
      applyRainbowEnter(event.currentTarget, property);
    },
    onPointerLeave: (event: ReactPointerEvent<HTMLElement>) => {
      applyRainbowLeave(event.currentTarget, restColor(), property);
    },
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
      if (!isTouchLike(event)) {
        return;
      }
      applyRainbowEnter(event.currentTarget, property);
    },
    onPointerUp: (event: ReactPointerEvent<HTMLElement>) => {
      if (!isTouchLike(event)) {
        return;
      }
      applyRainbowLeave(event.currentTarget, restColor(), property);
    },
  };
}
