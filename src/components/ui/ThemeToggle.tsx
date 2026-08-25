'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

interface ThemeToggleProps {
  className?: string;
  position?: 'fixed' | 'absolute';
}

const ThemeToggle = memo(function ThemeToggle({ 
  className = '', 
  position = 'fixed' 
}: ThemeToggleProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isThemeInitialized, setIsThemeInitialized] = useState(false);

  // Initialize theme from localStorage and system preference - CRITICAL: No flash allowed
  useEffect(() => {
    // Immediately check and apply theme before any rendering
    const savedTheme = localStorage.getItem('theme');
    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let shouldBeDark = true; // Default to dark mode
    
    if (savedTheme === 'dark') {
      shouldBeDark = true;
    } else if (savedTheme === 'light') {
      shouldBeDark = false;
    } else {
      // No saved preference, default to dark mode
      shouldBeDark = true;
    }
    
    // Apply theme to DOM immediately
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    
    // Set state after DOM is updated
    setIsDarkMode(shouldBeDark);
    setIsThemeInitialized(true);
  }, []);

  // Handle theme toggle - memoized to prevent re-renders
  const toggleTheme = useCallback(() => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // CRITICAL: Don't render ANYTHING until theme is fully initialized
  // This prevents the flash from light to dark theme
  if (!isThemeInitialized) {
    return null; // Return null instead of a skeleton to prevent any flash
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${position === 'fixed' ? 'fixed' : 'absolute'}
        top-1.5 lg:top-2.5 right-2 md:right-3 z-50
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
