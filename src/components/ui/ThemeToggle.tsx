'use client';

import { memo } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useDashboard } from '@/components/dashboard/Dashboard';

interface ThemeToggleProps {
  className?: string;
  position?: 'fixed' | 'absolute' | 'relative' | 'static';
}

const ThemeToggle = memo(function ThemeToggle({ 
  className = '', 
  position = 'fixed' 
}: ThemeToggleProps) {
  const { ready, settings, setTheme } = useDashboard();
  const isDarkMode = settings.theme === 'dark';

  if (!ready) {
    return null;
  }

  const positionClasses = {
    fixed: 'fixed top-1.5 lg:top-2.5 right-2 md:right-3 z-50',
    absolute: 'absolute top-1.5 lg:top-2.5 right-2 md:right-3 z-50',
    relative: 'relative',
    static: '',
  }[position];

  return (
    <button
      onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
      className={`
        ${positionClasses}
        p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 
        text-neutral-700 dark:text-neutral-300 
        hover:bg-neutral-200 dark:hover:bg-neutral-700 
        transition-colors shadow-lg
        ${className}
      `}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <LightModeIcon className="h-5 w-5" fontSize="inherit" />
      ) : (
        <DarkModeIcon className="h-5 w-5" fontSize="inherit" />
      )}
    </button>
  );
});

export default ThemeToggle;
