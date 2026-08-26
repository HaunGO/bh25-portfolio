import tailwindConfig from '../../../tailwind.config';

const SCALE_STOPS = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const;

type ColorScale = Record<(typeof SCALE_STOPS)[number], string>;

const themeColors = tailwindConfig.theme?.extend?.colors as Record<string, ColorScale>;

export const styleGuideSections = [
  { id: 'color', number: '01', title: 'Color' },
  { id: 'typography', number: '02', title: 'Typography' },
  { id: 'layout', number: '03', title: 'Layout' },
  { id: 'surfaces', number: '04', title: 'Surfaces' },
  { id: 'controls', number: '05', title: 'Controls' },
  { id: 'motion', number: '06', title: 'Motion' },
  { id: 'components', number: '07', title: 'Components' },
] as const;

export const colorFamilies = [
  {
    id: 'primary',
    title: 'Primary',
    usage: 'Sky brand. CTAs and links use 600 on light, 400 on dark.',
  },
  {
    id: 'accent',
    title: 'Accent',
    usage: 'Fuchsia flourish — hero gradient, enhanced button overlay, creative sparks.',
  },
  {
    id: 'neutral',
    title: 'Neutral',
    usage: 'Structure. Text 900/100, surfaces white ↔ 800/900, borders 200/700.',
  },
  {
    id: 'success',
    title: 'Success',
    usage: 'Semantic scale in the theme, barely used on the site yet.',
  },
  {
    id: 'warning',
    title: 'Warning',
    usage: 'Semantic scale in the theme, barely used on the site yet.',
  },
  {
    id: 'error',
    title: 'Error',
    usage: 'Semantic scale in the theme. Skills still use raw red/yellow/blue/green instead.',
  },
] as const;

export function getColorScale(familyId: string) {
  const scale = themeColors[familyId];
  return SCALE_STOPS.map((stop) => ({
    stop,
    hex: scale[stop],
    className: `${familyId}-${stop}`,
  }));
}

export { rainbowSpectrum as motionSpectrum, gsapEasings } from '@/lib/motion';

export const fontFamilies = [
  {
    name: 'Bitter',
    sample: 'Bitter',
    role: 'Display and headings',
    classes: 'font-display',
    aliases: 'font-serif · font-display',
  },
  {
    name: 'Inter',
    sample: 'Inter',
    role: 'Body and UI',
    classes: 'font-body',
    aliases: 'font-sans · font-body',
  },
  {
    name: 'Schoolbell',
    sample: 'Schoolbell',
    role: 'Script voice',
    classes: 'font-script',
    aliases: 'font-script',
  },
  {
    name: 'Mono',
    sample: 'SF Mono',
    role: 'Token labels',
    classes: 'font-mono',
    aliases: 'font-mono',
  },
] as const;

export const typeRamp = [
  {
    id: 'hero',
    label: 'Hero name',
    sample: 'Brandon',
    classes: 'text-8xl font-display font-semibold leading-tight',
    usedOn: 'Home hero',
  },
  {
    id: 'page-h1',
    label: 'Page H1',
    sample: 'Resume',
    classes: 'text-4xl md:text-6xl font-bold font-display',
    usedOn: 'Resume, Contact, 404',
  },
  {
    id: 'section-h2',
    label: 'Section H2',
    sample: 'Career Experience',
    classes: 'text-3xl md:text-4xl font-display',
    usedOn: 'Page sections',
  },
  {
    id: 'card-title',
    label: 'Card title',
    sample: 'Frontend Engineer',
    classes: 'text-2xl font-bold font-display',
    usedOn: 'Resume cards',
  },
  {
    id: 'lead',
    label: 'Body lead',
    sample: 'Interactive resume showcasing skills, experience, and craft.',
    classes: 'text-xl font-body',
    usedOn: 'Page introductions',
  },
  {
    id: 'body',
    label: 'Body',
    sample:
      'Building beautiful, interactive experiences that combine technical excellence with creative vision.',
    classes: 'text-lg leading-relaxed font-body',
    usedOn: 'Long-form copy',
  },
  {
    id: 'label',
    label: 'Label',
    sample: 'Email',
    classes: 'text-sm font-semibold tracking-wide',
    usedOn: 'Contact fields, overlines',
  },
  {
    id: 'pill',
    label: 'Pill',
    sample: 'TypeScript',
    classes: 'text-xs font-medium',
    usedOn: 'Tech tags',
  },
  {
    id: 'script-display',
    label: 'Script display',
    sample: 'a sampling of the system',
    classes: 'font-script text-5xl md:text-6xl leading-none tracking-tight',
    usedOn: 'About line',
  },
  {
    id: 'script-aside',
    label: 'Script aside',
    sample: 'Psalm 23',
    classes: 'font-script text-lg',
    usedOn: 'Footer quote',
  },
] as const;

export const containerSpecs = [
  { name: 'xs', className: 'max-w-xs', size: '320px' },
  { name: 'sm', className: 'max-w-sm', size: '384px' },
  { name: 'md', className: 'max-w-md', size: '448px' },
  { name: 'lg', className: 'max-w-lg', size: '512px' },
  { name: 'xl', className: 'max-w-xl', size: '576px' },
  { name: '2xl', className: 'max-w-2xl', size: '672px' },
  { name: '3xl', className: 'max-w-3xl', size: '768px' },
  { name: '4xl', className: 'max-w-4xl', size: '896px' },
  { name: '5xl', className: 'max-w-5xl', size: '1024px' },
  { name: '6xl', className: 'max-w-6xl', size: '1152px' },
  { name: '7xl', className: 'max-w-7xl', size: '1280px' },
] as const;

export const containerVariants = [
  { name: 'page', classes: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', note: 'Default page shell' },
  { name: 'content', classes: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8', note: 'Reading width' },
  { name: 'narrow', classes: 'max-w-3xl mx-auto px-4 sm:px-6 lg:px-8', note: 'Focused blocks' },
  { name: 'wide', classes: 'max-w-7xl mx-auto px-6 sm:px-8 lg:px-12', note: 'Extra gutter' },
] as const;

export const sectionSpacing = [
  { name: 'sectionSmall', classes: 'py-12 lg:py-16', padClass: 'py-12 lg:py-16' },
  { name: 'section', classes: 'py-16 lg:py-24', padClass: 'py-16 lg:py-24' },
  { name: 'sectionLarge', classes: 'py-20 lg:py-32', padClass: 'py-20 lg:py-32' },
] as const;

export const customSpacing = [
  { token: '18', value: '4.5rem / 72px', barClass: 'w-18' },
  { token: '88', value: '22rem / 352px', barClass: 'w-88' },
  { token: '128', value: '32rem / 512px', barClass: 'w-128' },
] as const;

export const customScreens = [
  { token: 'xs', value: '475px' },
  { token: 'sm', value: '640px', note: 'Tailwind default' },
  { token: 'md', value: '768px', note: 'Tailwind default' },
  { token: 'lg', value: '1024px', note: 'Tailwind default' },
  { token: 'xl', value: '1280px', note: 'Tailwind default' },
  { token: '2xl', value: '1536px', note: 'Tailwind default' },
  { token: '3xl', value: '1600px' },
  { token: '4xl', value: '2000px' },
] as const;

export const sectionBackgrounds = [
  { name: 'white', classes: 'bg-white dark:bg-neutral-900' },
  { name: 'neutral', classes: 'bg-neutral-50 dark:bg-neutral-900' },
  { name: 'primary', classes: 'bg-primary-50 dark:bg-primary-950' },
  { name: 'accent', classes: 'bg-accent-50 dark:bg-accent-950' },
] as const;

export function isLightHex(hex: string) {
  const normalized = hex.replace('#', '');
  const value = parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}
