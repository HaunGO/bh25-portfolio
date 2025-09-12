'use client';

import { ReactNode, memo } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import ThemeToggle from '../ui/ThemeToggle';
import PageTransition from '../transitions/PageTransition';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = memo(function Layout({ children, className = '' }: LayoutProps) {
  const pathname = usePathname();
  
  // Now you can control visibility based on the current page
  const isHomePage = pathname === '/';
  // const isPortfolioPage = pathname === '/portfolio';
  // const isContactPage = pathname === '/contact';
  // const isResumePage = pathname === '/resume';
  

  return (
    <div className="min-h-screen flex flex-col">
      <Header className={isHomePage ? 'hidden opacity-0' : 'visible opacity-100'} />
      <ThemeToggle />
      
      <PageTransition>
        <main className={`flex-1 ${className}`}>
          {children}
        </main>
      
        <Footer />
        
      </PageTransition>
    </div>
  );
});

export default Layout;
