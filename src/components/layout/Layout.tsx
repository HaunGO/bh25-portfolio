'use client';

import { ReactNode, memo } from 'react';
import Header from './Header';
import Footer from './Footer';
import PageTransition from '../transitions/PageTransition';
import Hero3D from '../three/Hero3D';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = memo(function Layout({ children }: LayoutProps) {
  // Now you can control visibility based on the current page
  // const isHomePage = pathname === '/';
  // const isPortfolioPage = pathname === '/portfolio';
  // const isContactPage = pathname === '/contact';
  // const isResumePage = pathname === '/resume';
  

  return (
    <div className="relative min-h-screen">
      <Hero3D mode="background" className="z-0" />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* <Header className={isHomePage ? 'hidden opacity-0' : 'visible opacity-100'} /> */}

        <Header />

        <PageTransition>
          <main>
            {children}
          </main>
        </PageTransition>

        <Footer />
      </div>
    </div>
  );
});

export default Layout;
