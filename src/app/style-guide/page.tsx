import { Metadata } from 'next';
import StyleGuide from '@/components/style-guide/StyleGuide';

export const metadata: Metadata = {
  title: 'Style Guide - BH`26',
  description: 'A sampling of the design system behind this portfolio.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function StyleGuidePage() {
  return <StyleGuide />;
}
