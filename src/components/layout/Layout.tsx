'use client';

import { ReactNode, memo } from 'react';
import Header from './Header';
import Footer from './Footer';
import PageTransition from '../transitions/PageTransition';
import RainbowTextRuntime from '../ui/RainbowTextRuntime';
import CursorFocusRuntime from '../ui/CursorFocusRuntime';
import Dashboard, { DashboardProvider } from '../dashboard/Dashboard';

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
      <div className="min-h-screen flex flex-col">
        {/* <Header className={isHomePage ? 'hidden opacity-0' : 'visible opacity-100'} /> */}
        
        <Header />
        <RainbowTextRuntime />
        <CursorFocusRuntime />
        <Dashboard />
        
        <PageTransition>
          <main>
            {children}
          </main>  
        </PageTransition>
        
        <Footer />
      </div>
    </DashboardProvider>
  );
});

export default Layout;
