'use client';

import { ReactNode, memo } from 'react';
import Header from './Header';
import Footer from './Footer';
import PageTransition from '../transitions/PageTransition';
import RainbowTextRuntime from '../ui/RainbowTextRuntime';
import CursorFocusRuntime from '../ui/CursorFocusRuntime';
import PointerModeRuntime from '../ui/PointerModeRuntime';
import AdvancedCursor from '../ui/AdvancedCursor';
import BackgroundDots from '../ui/BackgroundDots';
import { DashboardProvider } from '../dashboard/Dashboard';

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
    <DashboardProvider>
      <PointerModeRuntime />
      <AdvancedCursor />
      <div className="relative min-h-dvh flex flex-col overflow-x-hidden">
        {/* <Header className={isHomePage ? 'hidden opacity-0' : 'visible opacity-100'} /> */}

        <BackgroundDots />
        <Header />
        <RainbowTextRuntime />
        <CursorFocusRuntime />
        {/* Dashboard sheet unmounted: resume left the homepage. Keep DashboardProvider + files for later. */}
        
        <PageTransition>
          {/* Non-hero pages sit above the dots; hero stays unscoped so its gradient can sit behind them. */}
          <main className="relative [&>*:not([data-hero-section])]:relative [&>*:not([data-hero-section])]:z-10">
            {children}
          </main>  
        </PageTransition>
        
        <Footer />
      </div>
    </DashboardProvider>
  );
});

export default Layout;
