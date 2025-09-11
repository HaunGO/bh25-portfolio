'use client';

import { createContext, useContext, ReactNode } from 'react';
import { PageTransitionContextType } from './types';

const PageTransitionContext = createContext<PageTransitionContextType | null>(null);

interface PageTransitionProviderProps {
  children: ReactNode;
  value: PageTransitionContextType;
}

export const PageTransitionProvider: React.FC<PageTransitionProviderProps> = ({ 
  children, 
  value
}) => {
  return (
    <PageTransitionContext.Provider value={value}>
      {children}
    </PageTransitionContext.Provider>
  );
};

export const usePageTransitionContext = (): PageTransitionContextType => {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransitionContext must be used within a PageTransitionProvider');
  }
  return context;
};
