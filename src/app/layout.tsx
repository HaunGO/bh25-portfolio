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
  title: 'BH`26',
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
    <html lang="en" className="" suppressHydrationWarning>
      <head>
        {/* Prevent theme flash by setting theme immediately */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = 'dark';
                  try {
                    var session = sessionStorage.getItem('bh-dashboard-session');
                    if (session) {
                      var parsedSession = JSON.parse(session);
                      if (parsedSession && parsedSession.settings && parsedSession.settings.theme) {
                        theme = parsedSession.settings.theme;
                      }
                    } else {
                      var store = localStorage.getItem('bh-dashboard-presets');
                      if (store) {
                        var parsedStore = JSON.parse(store);
                        var presets = parsedStore && parsedStore.presets ? parsedStore.presets : [];
                        for (var i = 0; i < presets.length; i++) {
                          if (presets[i].id === parsedStore.defaultId && presets[i].settings && presets[i].settings.theme) {
                            theme = presets[i].settings.theme;
                            break;
                          }
                        }
                      } else {
                        var legacy = localStorage.getItem('theme');
                        if (legacy === 'light' || legacy === 'dark') {
                          theme = legacy;
                        }
                      }
                    }
                  } catch (readError) {}

                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
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
