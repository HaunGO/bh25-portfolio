'use client';

import { ReactNode, memo } from 'react';
import Header from './Header';
import Footer from './Footer';
import ThemeToggle from '../ui/ThemeToggle';
import PageTransition from '../transitions/PageTransition';

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
    <div className="min-h-screen flex flex-col">
      {/* <Header className={isHomePage ? 'hidden opacity-0' : 'visible opacity-100'} /> */}
      
      <Header />
      
      <ThemeToggle />
      
      <PageTransition>
        <main>
          {children}
        </main>  
      </PageTransition>
      
      <Footer />
    </div>
  );
});

export default Layout;
