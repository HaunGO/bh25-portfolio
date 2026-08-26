import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/motion';

export const cursorFocusConfig = {
  inset: 4,
  radius: 12,
  durationMs: 280,
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  ringWidth: 1.15,
  ringColor: 'rgba(56, 189, 248, 0.42)',
  glowBlur: 10,
  glowSpread: 0,
  glowDistance: 1,
  glowOpacity: 0.16,
  colors: ['#38bdf8', '#e879f9'] as const,
  spread: {
    ease: 'power2.out',
    coreDuration: 0.72,
    spillDuration: 0.92,
    strokeDuration: 1.05,
    settleDelay: 0.52,
    settleDuration: 0.4,
    leaveDuration: 0.36,
    trailHandoff: true,
    handoffLingerMs: 280,
    coreScale: 1.8,
    spillScale: 1.7,
    corePeak: { dark: 0.22, light: 0.14 },
    coreSettle: { dark: 0.08, light: 0.05 },
    spillPeak: { dark: 0.14, light: 0.09 },
    spillSettle: { dark: 0.05, light: 0.03 },
    // Same idea as the cursor trail: short/thick at the pointer, long/thin at the tail.
    // Shared rounded-rect path + dash, so corners stay true arcs.
    outlineLayers: [
      { percentage: 0.12, strokeWidth: 3, color: 'rgba(245, 158, 11, 0.72)' },
      { percentage: 0.24, strokeWidth: 2.4, color: 'rgba(168, 85, 247, 0.58)' },
      { percentage: 0.4, strokeWidth: 1.8, color: 'rgba(56, 189, 248, 0.52)' },
      { percentage: 0.58, strokeWidth: 1.25, color: 'rgba(245, 158, 11, 0.28)' },
      { percentage: 0.78, strokeWidth: 1, color: 'rgba(168, 85, 247, 0.16)' },
      { percentage: 1, strokeWidth: 1, color: 'rgba(56, 189, 248, 0.2)' },
    ],
  },
} as const;

type Point = { x: number; y: number };
type CornerRadii = { tl: number; tr: number; br: number; bl: number };

type FocusChrome = {
  back: HTMLSpanElement;
  over: HTMLSpanElement;
  core: HTMLSpanElement;
  spill: HTMLSpanElement;
  front: HTMLSpanElement;
  svg: SVGSVGElement;
  cwLayers: SVGPathElement[];
  ccwLayers: SVGPathElement[];
  startT: number;
  proxy: { progress: number };
  timeline: gsap.core.Timeline | null;
};

const enhancedRoots = new WeakSet<HTMLElement>();
const chromeMap = new WeakMap<HTMLElement, FocusChrome>();
const outlineLayers = cursorFocusConfig.spread.outlineLayers;
const maxStrokeWidth = Math.max(...outlineLayers.map((layer) => layer.strokeWidth));

export function isCursorFocusEnabled(value: string | null) {
  return value === '' || value === 'on' || value === 'true';
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const value = parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function isDarkTheme() {
  return document.documentElement.classList.contains('dark');
}

function themeValue(pair: { dark: number; light: number }) {
  return isDarkTheme() ? pair.dark : pair.light;
}

function readRadius(value: string) {
  return Number.parseFloat(value) || 0;
}

function parseCornerRadii(root: HTMLElement): CornerRadii {
  const style = getComputedStyle(root);
  return {
    tl: readRadius(style.borderTopLeftRadius),
    tr: readRadius(style.borderTopRightRadius),
    br: readRadius(style.borderBottomRightRadius),
    bl: readRadius(style.borderBottomLeftRadius),
  };
}

function scaleRadii(width: number, height: number, radii: CornerRadii): CornerRadii {
  const { tl, tr, br, bl } = radii;
  const scale = Math.min(
    1,
    tl + tr > 0 ? width / (tl + tr) : 1,
    bl + br > 0 ? width / (bl + br) : 1,
    tl + bl > 0 ? height / (tl + bl) : 1,
    tr + br > 0 ? height / (tr + br) : 1,
  );
  return {
    tl: tl * scale,
    tr: tr * scale,
    br: br * scale,
    bl: bl * scale,
  };
}

function roundedRectPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radii: CornerRadii,
) {
  const r = scaleRadii(width, height, radii);
  return [
    `M ${x + r.tl} ${y}`,
    `H ${x + width - r.tr}`,
    `A ${r.tr} ${r.tr} 0 0 1 ${x + width} ${y + r.tr}`,
    `V ${y + height - r.br}`,
    `A ${r.br} ${r.br} 0 0 1 ${x + width - r.br} ${y + height}`,
    `H ${x + r.bl}`,
    `A ${r.bl} ${r.bl} 0 0 1 ${x} ${y + height - r.bl}`,
    `V ${y + r.tl}`,
    `A ${r.tl} ${r.tl} 0 0 1 ${x + r.tl} ${y}`,
    'Z',
  ].join(' ');
}

function wrapPad() {
  return maxStrokeWidth / 2;
}

function focusOutlinePath(width: number, height: number, radii: CornerRadii) {
  return roundedRectPath(0, 0, width, height, radii);
}

function pinToBorderBox(root: HTMLElement, front: HTMLElement) {
  const extra = wrapPad();
  front.style.top = `${-extra}px`;
  front.style.right = `${-extra}px`;
  front.style.bottom = `${-extra}px`;
  front.style.left = `${-extra}px`;
}

function localBox(root: HTMLElement, event: PointerEvent) {
  const visual = root.getBoundingClientRect();
  const width = root.offsetWidth || visual.width;
  const height = root.offsetHeight || visual.height;
  return {
    width,
    height,
    x: ((event.clientX - visual.left) / (visual.width || 1)) * width,
    y: ((event.clientY - visual.top) / (visual.height || 1)) * height,
  };
}

function nearestPathT(path: SVGPathElement, point: Point) {
  const length = path.getTotalLength() || 1;
  const steps = Math.max(48, Math.round(length / 4));
  let start = 0;
  let closest = Infinity;

  for (let index = 0; index <= steps; index += 1) {
    const sample = path.getPointAtLength((index / steps) * length);
    const distance = (sample.x - point.x) ** 2 + (sample.y - point.y) ** 2;
    if (distance < closest) {
      closest = distance;
      start = (index / steps) * length;
    }
  }

  return start / length;
}

function coverScale(origin: Point, width: number, height: number, blobSize: number) {
  const farthest = Math.max(
    Math.hypot(origin.x, origin.y),
    Math.hypot(width - origin.x, origin.y),
    Math.hypot(origin.x, height - origin.y),
    Math.hypot(width - origin.x, height - origin.y),
  );
  return Math.max(1.2, (farthest / (blobSize / 2)) * 1.12);
}

function applyTrailDash(chrome: FocusChrome, progress: number) {
  const start = chrome.startT;
  outlineLayers.forEach((layer, index) => {
    const drawn = 0.5 * progress * layer.percentage;
    const dash = `${drawn} 1`;
    const cw = chrome.cwLayers[index];
    const ccw = chrome.ccwLayers[index];
    cw.setAttribute('stroke-dasharray', dash);
    cw.setAttribute('stroke-dashoffset', `${-start}`);
    ccw.setAttribute('stroke-dasharray', dash);
    ccw.setAttribute('stroke-dashoffset', `${drawn - start}`);
  });
}

function clearStrokes(chrome: FocusChrome) {
  chrome.proxy.progress = 0;
  strokeTargets(chrome).forEach((node) => {
    node.setAttribute('stroke-linecap', 'butt');
    node.setAttribute('stroke-dasharray', '0 1');
    node.setAttribute('stroke-dashoffset', '0');
    gsap.set(node, { opacity: 0 });
  });
}

function isTrailHandoffEnabled() {
  return (
    cursorFocusConfig.spread.trailHandoff &&
    document.documentElement.dataset.trailHandoff !== 'off'
  );
}

let trailHandoffFrame = 0;

function trailHandoffPath(root: HTMLElement) {
  const rect = root.getBoundingClientRect();
  const scaleX = rect.width / (root.offsetWidth || rect.width || 1);
  const scaleY = rect.height / (root.offsetHeight || rect.height || 1);
  const scale = Math.min(scaleX, scaleY);
  const pad = wrapPad() * scale;
  const radii = parseCornerRadii(root);
  return roundedRectPath(rect.left - pad, rect.top - pad, rect.width + pad * 2, rect.height + pad * 2, {
    tl: radii.tl * scale + pad,
    tr: radii.tr * scale + pad,
    br: radii.br * scale + pad,
    bl: radii.bl * scale + pad,
  });
}

export function paintTrailHandoff() {
  const holes = document.querySelector('[data-trail-handoff-holes]');
  if (!holes) {
    return;
  }

  holes.replaceChildren();
  if (!isTrailHandoffEnabled()) {
    return;
  }

  document.querySelectorAll<HTMLElement>('[data-cursor-focus-handoff]').forEach((root) => {
    const path = svgEl('path');
    path.setAttribute('d', trailHandoffPath(root));
    path.setAttribute('fill', 'black');
    holes.append(path);
  });
}

const handoffLinger = new WeakMap<HTMLElement, number>();

function holdTrailHandoff(root: HTMLElement) {
  const pending = handoffLinger.get(root);
  if (pending) {
    window.clearTimeout(pending);
    handoffLinger.delete(root);
  }
  root.setAttribute('data-cursor-focus-handoff', '');
}

function releaseTrailHandoff(root: HTMLElement) {
  const pending = handoffLinger.get(root);
  if (pending) {
    window.clearTimeout(pending);
  }

  const delay = cursorFocusConfig.spread.handoffLingerMs;
  const id = window.setTimeout(() => {
    root.removeAttribute('data-cursor-focus-handoff');
    handoffLinger.delete(root);
    startTrailHandoff();
  }, delay);
  handoffLinger.set(root, id);
}

function startTrailHandoff() {
  if (trailHandoffFrame) {
    return;
  }

  const tick = () => {
    paintTrailHandoff();
    if (
      isTrailHandoffEnabled() &&
      document.querySelector('[data-cursor-focus-handoff], [data-cursor-focus-active]')
    ) {
      trailHandoffFrame = requestAnimationFrame(tick);
      return;
    }
    trailHandoffFrame = 0;
    paintTrailHandoff();
  };

  trailHandoffFrame = requestAnimationFrame(tick);
}

export function syncTrailHandoff(on?: boolean) {
  if (typeof on === 'boolean') {
    document.documentElement.dataset.trailHandoff = on ? 'on' : 'off';
  }

  if (trailHandoffFrame) {
    cancelAnimationFrame(trailHandoffFrame);
    trailHandoffFrame = 0;
  }

  startTrailHandoff();
}

function svgEl<K extends keyof SVGElementTagNameMap>(name: K) {
  return document.createElementNS('http://www.w3.org/2000/svg', name);
}

function makeLayerPath(layer: (typeof outlineLayers)[number]) {
  const path = svgEl('path');
  path.setAttribute('class', 'cursor-focus-stroke');
  path.setAttribute('stroke', layer.color);
  path.setAttribute('stroke-width', `${layer.strokeWidth}`);
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('fill', 'none');
  path.setAttribute('pathLength', '1');
  return path;
}

function teardownChrome(root: HTMLElement, chrome?: FocusChrome) {
  chrome?.timeline?.kill();
  chrome?.front.remove();
  chrome?.back.remove();
  root.querySelectorAll('.cursor-focus-back, .cursor-focus-front').forEach((node) => node.remove());
}

function ensureChrome(root: HTMLElement): FocusChrome {
  const existing = chromeMap.get(root);
  if (existing && existing.cwLayers.length === outlineLayers.length) {
    return existing;
  }

  teardownChrome(root, existing);

  const back = document.createElement('span');
  back.className = 'cursor-focus-back';
  back.setAttribute('aria-hidden', 'true');

  const spill = document.createElement('span');
  spill.className = 'cursor-focus-blob cursor-focus-blob-spill';

  const over = document.createElement('span');
  over.className = 'cursor-focus-over';

  const core = document.createElement('span');
  core.className = 'cursor-focus-blob cursor-focus-blob-core';

  over.append(core);
  back.append(spill, over);

  const front = document.createElement('span');
  front.className = 'cursor-focus-front';
  front.setAttribute('aria-hidden', 'true');

  const svg = svgEl('svg');
  svg.setAttribute('class', 'cursor-focus-around');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('preserveAspectRatio', 'none');

  const cwLayers = outlineLayers.map((layer) => makeLayerPath(layer));
  const ccwLayers = outlineLayers.map((layer) => makeLayerPath(layer));

  // Longest/thinnest first so the thick head paints on top, same as the cursor trail.
  [...cwLayers].reverse().forEach((path) => svg.append(path));
  [...ccwLayers].reverse().forEach((path) => svg.append(path));
  front.append(svg);

  root.prepend(back);
  root.append(front);

  const chrome: FocusChrome = {
    back,
    over,
    core,
    spill,
    front,
    svg,
    cwLayers,
    ccwLayers,
    startT: 0,
    proxy: { progress: 0 },
    timeline: null,
  };
  chromeMap.set(root, chrome);
  return chrome;
}

function killTimeline(chrome: FocusChrome) {
  chrome.timeline?.kill();
  chrome.timeline = null;
}

function strokeTargets(chrome: FocusChrome) {
  return [...chrome.cwLayers, ...chrome.ccwLayers];
}

const wrapWatch = new WeakMap<HTMLElement, (event: PointerEvent) => void>();
let trackedFocus: HTMLElement | null = null;

function screenWrapPad(root: HTMLElement) {
  const rect = root.getBoundingClientRect();
  const scale = Math.min(
    rect.width / (root.offsetWidth || rect.width || 1),
    rect.height / (root.offsetHeight || rect.height || 1),
  );
  return wrapPad() * scale;
}

function isInsideFocusWrap(root: HTMLElement, event: PointerEvent) {
  const rect = root.getBoundingClientRect();
  const pad = screenWrapPad(root);
  return (
    event.clientX >= rect.left - pad &&
    event.clientX <= rect.right + pad &&
    event.clientY >= rect.top - pad &&
    event.clientY <= rect.bottom + pad
  );
}

function stopWrapWatch(root: HTMLElement) {
  const handler = wrapWatch.get(root);
  if (handler) {
    window.removeEventListener('pointermove', handler);
    wrapWatch.delete(root);
  }
  if (trackedFocus === root) {
    trackedFocus = null;
  }
}

function startWrapWatch(root: HTMLElement) {
  stopWrapWatch(root);
  trackedFocus = root;
  const handler = (event: PointerEvent) => {
    if (isInsideFocusWrap(root, event)) {
      return;
    }
    playLeave(root);
  };
  wrapWatch.set(root, handler);
  window.addEventListener('pointermove', handler);
}

function fadeFocusOut(root: HTMLElement, chrome: FocusChrome) {
  killTimeline(chrome);
  chrome.timeline = gsap.timeline({
    onComplete: () => {
      clearStrokes(chrome);
      releaseTrailHandoff(root);
    },
  });
  chrome.timeline.to(
    [chrome.core, chrome.spill],
    {
      opacity: 0,
      scale: 0.72,
      duration: cursorFocusConfig.spread.leaveDuration,
      ease: cursorFocusConfig.spread.ease,
    },
    0,
  );
  chrome.timeline.to(
    strokeTargets(chrome),
    {
      opacity: 0,
      duration: cursorFocusConfig.spread.leaveDuration,
      ease: cursorFocusConfig.spread.ease,
    },
    0,
  );
}

function playLeave(root: HTMLElement) {
  stopWrapWatch(root);
  root.removeAttribute('data-cursor-focus-active');
  const chrome = chromeMap.get(root);
  if (!chrome) {
    releaseTrailHandoff(root);
    startTrailHandoff();
    return;
  }

  startTrailHandoff();
  fadeFocusOut(root, chrome);
}

function playEnter(root: HTMLElement, event: PointerEvent) {
  if (prefersReducedMotion()) {
    holdTrailHandoff(root);
    root.setAttribute('data-cursor-focus-active', '');
    startTrailHandoff();
    return;
  }

  const chrome = ensureChrome(root);
  killTimeline(chrome);
  holdTrailHandoff(root);
  const box = localBox(root, event);
  const origin = { x: box.x, y: box.y };
  pinToBorderBox(root, chrome.front);
  const pad = wrapPad();
  const path = focusOutlinePath(box.width, box.height, parseCornerRadii(root));

  chrome.over.style.borderRadius = getComputedStyle(root).borderRadius;
  chrome.svg.setAttribute(
    'viewBox',
    `${-pad} ${-pad} ${box.width + pad * 2} ${box.height + pad * 2}`,
  );
  strokeTargets(chrome).forEach((node) => {
    node.setAttribute('d', path);
  });

  chrome.startT = nearestPathT(chrome.cwLayers[0], origin);
  chrome.proxy.progress = 0;
  applyTrailDash(chrome, 0);

  gsap.set([chrome.core, chrome.spill], {
    left: origin.x,
    top: origin.y,
    scale: 0.2,
    opacity: 0,
  });
  gsap.set(strokeTargets(chrome), { opacity: 1, attr: { 'stroke-linecap': 'round' } });

  const spread = cursorFocusConfig.spread;
  const corePeak = themeValue(spread.corePeak);
  const spillPeak = themeValue(spread.spillPeak);
  const coreSize = chrome.core.offsetWidth || 128;
  const coreScale = Math.min(
    4.2,
    Math.max(spread.coreScale, coverScale(origin, box.width, box.height, coreSize)),
  );

  root.setAttribute('data-cursor-focus-active', '');
  holdTrailHandoff(root);
  startTrailHandoff();

  chrome.timeline = gsap.timeline();
  chrome.timeline.fromTo(
    chrome.core,
    { scale: 0.2, opacity: 0 },
    {
      scale: coreScale,
      opacity: corePeak,
      duration: spread.coreDuration,
      ease: spread.ease,
    },
    0,
  );
  chrome.timeline.to(
    chrome.core,
    {
      opacity: themeValue(spread.coreSettle),
      duration: spread.settleDuration,
      ease: spread.ease,
    },
    spread.settleDelay,
  );
  chrome.timeline.fromTo(
    chrome.spill,
    { scale: 0.28, opacity: 0 },
    {
      scale: spread.spillScale,
      opacity: spillPeak,
      duration: spread.spillDuration,
      ease: spread.ease,
    },
    0.05,
  );
  chrome.timeline.to(
    chrome.spill,
    {
      opacity: themeValue(spread.spillSettle),
      duration: spread.settleDuration,
      ease: spread.ease,
    },
    spread.settleDelay + 0.08,
  );
  chrome.timeline.to(
    chrome.proxy,
    {
      progress: 1,
      duration: spread.strokeDuration,
      ease: spread.ease,
      onUpdate: () => {
        applyTrailDash(chrome, chrome.proxy.progress);
      },
    },
    0.04,
  );
}

export function buildCursorFocusGlow() {
  const { colors, glowBlur, glowSpread, glowDistance, glowOpacity } = cursorFocusConfig;
  return colors
    .map((hex, index) => {
      const angle = (index / colors.length) * Math.PI * 2;
      const x = Math.round(Math.cos(angle) * glowDistance);
      const y = Math.round(Math.sin(angle) * glowDistance);
      return `${x}px ${y}px ${glowBlur}px ${glowSpread}px ${hexToRgba(hex, glowOpacity)}`;
    })
    .join(', ');
}

export function applyCursorFocusVars(root: HTMLElement) {
  const config = cursorFocusConfig;
  root.style.setProperty('--cursor-focus-inset', `${config.inset}px`);
  root.style.setProperty('--cursor-focus-radius', `${config.radius}px`);
  root.style.setProperty('--cursor-focus-duration', `${config.durationMs}ms`);
  root.style.setProperty('--cursor-focus-ease', config.ease);
  root.style.setProperty('--cursor-focus-ring', `${config.ringWidth}px`);
  root.style.setProperty('--cursor-focus-ring-color', config.ringColor);
  root.style.setProperty('--cursor-focus-glow', buildCursorFocusGlow());
}

function bindCursorFocus(root: HTMLElement) {
  if (enhancedRoots.has(root)) {
    return;
  }

  root.addEventListener('pointerenter', (event) => {
    if (!isCursorFocusEnabled(root.getAttribute('data-cursor-focus'))) {
      return;
    }
    if (trackedFocus && trackedFocus !== root) {
      playLeave(trackedFocus);
    }
    playEnter(root, event);
    startWrapWatch(root);
  });

  root.addEventListener('pointerleave', (event) => {
    if (isInsideFocusWrap(root, event)) {
      return;
    }
    playLeave(root);
  });

  root.addEventListener('pointercancel', () => {
    playLeave(root);
  });

  enhancedRoots.add(root);
}

export function enableCursorFocus(root: HTMLElement) {
  applyCursorFocusVars(root);
  bindCursorFocus(root);
}

export function syncCursorFocus(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLElement>('[data-cursor-focus]').forEach((root) => {
    if (isCursorFocusEnabled(root.getAttribute('data-cursor-focus'))) {
      enableCursorFocus(root);
      return;
    }

    playLeave(root);
  });
}
