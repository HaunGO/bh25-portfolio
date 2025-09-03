import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Bitter } from 'next/font/google';
import './globals.css';

// Configure Inter font for body text
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Configure Bitter font for headings
const bitter = Bitter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bitter',
});
import Layout from '@/components/layout/Layout';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

export const metadata: Metadata = {
  title: 'BH25 Creative Portfolio - Senior Frontend Developer',
  description: 'Creative developer passionate about building beautiful, interactive experiences that combine technical excellence with artistic vision.',
  keywords: ['frontend developer', 'creative developer', 'portfolio', 'React', 'Next.js', 'GSAP', 'Three.js'],
  authors: [{ name: 'BH25' }],
  creator: 'BH25',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    title: 'BH25 Creative Portfolio',
    description: 'Creative developer passionate about building beautiful, interactive experiences.',
    siteName: 'BH25 Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BH25 Creative Portfolio',
    description: 'Creative developer passionate about building beautiful, interactive experiences.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Theme will be handled client-side to prevent hydration mismatch */}
      </head>
      <body
        className={`${inter.variable} ${bitter.variable} antialiased`}
      >
        <ErrorBoundary>
          <Layout>
            {children}
          </Layout>
        </ErrorBoundary>
      </body>
    </html>
  );
}
