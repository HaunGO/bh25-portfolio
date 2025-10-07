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
import AdvancedCursor from '@/components/ui/AdvancedCursor';

export const metadata: Metadata = {
  title: 'BH`25',
  description: 'Frontend Engineer • Creative Developer • UX/UI Specialist • AI Enthusiast • Electro-Magnetic Tinkerer • Bushcraft Master • Real American Hero • Chuck Norris Evangelist',
  keywords: ['frontend engineer', 'creative developer', 'UX/UI specialist', 'AI enthusiast', 'electro-magnetic tinkerer', 'bushcraft master', 'React', 'Next.js', 'GSAP', 'Three.js', 'portfolio'],
  authors: [{ name: 'Brandon Haun' }],
  creator: 'Brandon Haun',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://brandonhaun.com',
    title: 'Brandon Haun - Creative Developer Portfolio',
    description: 'Frontend Engineer passionate about building beautiful, interactive experiences that combine technical excellence with creative vision.',
    siteName: 'Brandon Haun Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brandon Haun - Creative Developer Portfolio',
    description: 'Frontend Engineer passionate about building beautiful, interactive experiences that combine technical excellence with creative vision.',
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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Prevent theme flash by setting theme immediately */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  let shouldBeDark = true; // Default to dark mode
                  
                  if (savedTheme === 'dark') {
                    shouldBeDark = true;
                  } else if (savedTheme === 'light') {
                    shouldBeDark = false;
                  } else {
                    shouldBeDark = true; // Default to dark mode instead of system preference
                  }
                  
                  if (shouldBeDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {
                  // Fallback to system preference if localStorage fails
                  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                }
                // // THIS IS AN ANNOYING UN-RELATED ETH WARNING FROM THE BROWSER I GUESS.
                // // Block ethereum-related errors from external sources
                window.addEventListener('error', function(e) {
                  if (e.message && e.message.includes('ethereum')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                });
                
                // Override ethereum to prevent errors
                if (typeof window !== 'undefined') {
                  Object.defineProperty(window, 'ethereum', {
                    value: {
                      selectedAddress: null,
                      isConnected: function() { return false; },
                      request: function() { return Promise.reject('Not available'); }
                    },
                    writable: false,
                    configurable: false
                  });
                }
                
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${bitter.variable} antialiased`}
      >
        <AdvancedCursor />
        <ErrorBoundary>
          <Layout>
            {children}
          </Layout>
        </ErrorBoundary>
      </body>
    </html>
  );
}
