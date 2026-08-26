import gsap from 'gsap';

export const rainbowSpectrum = [
  { hex: '#ef4444', name: 'red' },
  { hex: '#f97316', name: 'orange' },
  { hex: '#eab308', name: 'yellow' },
  { hex: '#22c55e', name: 'green' },
  { hex: '#3b82f6', name: 'blue' },
  { hex: '#4f46e5', name: 'indigo' },
  { hex: '#8b5cf6', name: 'violet' },
] as const;

export const rainbowHexes = rainbowSpectrum.map((swatch) => swatch.hex);

export function randomRainbowColor() {
  return rainbowHexes[Math.floor(Math.random() * rainbowHexes.length)];
}

export const rainbowHover = {
  snapDuration: 0,
  restoreDuration: 30,
  restoreEase: 'power3.out',
} as const;

export const restInk = {
  display: { dark: '#f5f5f5', light: '#171717' },
  line: { dark: '#ffffff', light: '#000000' },
  muted: { dark: '#a3a3a3', light: '#525252' },
} as const;

export type RestInkRole = keyof typeof restInk;

export function themeRestInk(role: RestInkRole) {
  const isDark = document.documentElement.classList.contains('dark');
  return restInk[role][isDark ? 'dark' : 'light'];
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function applyRainbowEnter(
  target: HTMLElement,
  property: 'color' | 'backgroundColor' = 'color',
) {
  if (prefersReducedMotion()) {
    return;
  }

  gsap.killTweensOf(target);
  gsap.set(target, { [property]: randomRainbowColor() });
}

export function applyRainbowLeave(
  target: HTMLElement,
  restColor: string,
  property: 'color' | 'backgroundColor' = 'color',
) {
  if (prefersReducedMotion()) {
    gsap.killTweensOf(target);
    gsap.set(target, { clearProps: property });
    return;
  }

  gsap.killTweensOf(target);
  gsap.to(target, {
    [property]: restColor,
    duration: rainbowHover.restoreDuration,
    ease: rainbowHover.restoreEase,
    onComplete: () => {
      gsap.set(target, { clearProps: property });
    },
  });
}

export const motionDurations = [
  { name: 'instant', value: '0ms', usedOn: 'Rainbow snap. Cursor-hit CSS is also 0ms.' },
  { name: 'control', value: '200ms', usedOn: 'Button color changes.' },
  { name: 'emphasis', value: '300ms', usedOn: 'btn-enhanced scale.' },
  { name: 'theme', value: '400ms', usedOn: 'Theme color/background. Default page fade.' },
  { name: 'lift', value: '500ms', usedOn: 'card-enhanced hover. Hero gradient.' },
  { name: 'ambient', value: '6s', usedOn: '.floating loop. Utility only.' },
  { name: 'linger', value: '30s', usedOn: 'Rainbow restore. The signature.' },
] as const;

export const motionRules = [
  {
    title: 'Snap on. Linger off.',
    body: 'Rainbow arrives in 0ms. It fades back over 30s with power3.out, then clearProps. Never ease into the color.',
  },
  {
    title: 'One spectrum.',
    body: 'Seven Tailwind-adjacent hues. Random per hit, not sequential. No fully-saturated CSS rainbow.',
  },
  {
    title: 'GSAP for choreography. CSS for chrome.',
    body: 'Hero, logo, page fade, and rainbow are GSAP. Buttons, cards, and looping float stay CSS. Do not invent a third timing system.',
  },
  {
    title: 'Skip the show when asked.',
    body: 'prefers-reduced-motion skips rainbow and GSAP presets. Theme color transitions may remain.',
  },
] as const;

export const allowedMotion = [
  {
    status: 'canonical',
    name: 'Rainbow hover',
    usedOn: 'Hero letters, footer tagline, and any [data-rainbow-text=on] block',
  },
  {
    status: 'canonical',
    name: 'Page fade',
    usedOn: '0.4s power2.out via PageTransition',
  },
  {
    status: 'canonical',
    name: 'Cursor trail / morph / dazzle',
    usedOn: 'Global chrome. pulse, orbit, spark.',
  },
  {
    status: 'canonical',
    name: 'Cursor focus',
    usedOn: 'Pointer wrap on Surfaces cards. Spreads from the hit, fades on leave. data-cursor-focus=on',
  },
  {
    status: 'canonical',
    name: 'Theme transition',
    usedOn: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  {
    status: 'utility',
    name: 'Tailwind entrances',
    usedOn: 'fade-in, slide-up, slide-down, scale-in, bounce-gentle — optional, unused on live pages',
  },
  {
    status: 'utility',
    name: 'CSS hover extras',
    usedOn: '.card-enhanced, .btn-enhanced, .floating — optional',
  },
  {
    status: 'avoid',
    name: 'Saturated HoverLetters palette',
    usedOn: 'Legacy #FF0000 spectrum and 0.1s restore. Do not use.',
  },
] as const;

export const gsapEasings = [
  { name: 'power2.out', usedOn: 'Default fades, logo, page transition' },
  { name: 'power3.out', usedOn: 'Rainbow restore, slide-up presets' },
  { name: 'power1.inOut', usedOn: 'Hash scroll to contact' },
  { name: 'back.out(1.7)', usedOn: 'Scale-in preset only' },
  { name: 'none', usedOn: 'Parallax scrub, instant color set' },
] as const;
