// Design System Tokens and Utilities
// Centralized design system for consistent spacing, containers, and layouts

export const designTokens = {
  // Container sizes
  containers: {
    xs: 'max-w-xs',      // 20rem / 320px
    sm: 'max-w-sm',      // 24rem / 384px  
    md: 'max-w-md',      // 28rem / 448px
    lg: 'max-w-lg',      // 32rem / 512px
    xl: 'max-w-xl',      // 36rem / 576px
    '2xl': 'max-w-2xl',  // 42rem / 672px
    '3xl': 'max-w-3xl',  // 48rem / 768px
    '4xl': 'max-w-4xl',  // 56rem / 896px
    '5xl': 'max-w-5xl',  // 64rem / 1024px
    '6xl': 'max-w-6xl',  // 72rem / 1152px
    '7xl': 'max-w-7xl',  // 80rem / 1280px
    full: 'max-w-full',
  },
  
  // Spacing system
  spacing: {
    section: 'py-16 lg:py-24',           // Standard section padding
    sectionSmall: 'py-12 lg:py-16',      // Smaller section padding
    sectionLarge: 'py-20 lg:py-32',      // Large section padding
    container: 'px-4 sm:px-6 lg:px-8',   // Standard container padding
    containerSmall: 'px-4 sm:px-6',      // Smaller container padding
    containerLarge: 'px-6 sm:px-8 lg:px-12', // Larger container padding
  },
  
  // Layout patterns
  layouts: {
    centered: 'mx-auto',
    fullWidth: 'w-full',
    constrained: 'max-w-7xl mx-auto',
  }
} as const;

// Pre-built container classes
export const containerClasses = {
  // Standard containers
  page: `${designTokens.containers['7xl']} ${designTokens.layouts.centered} ${designTokens.spacing.container}`,
  content: `${designTokens.containers['4xl']} ${designTokens.layouts.centered} ${designTokens.spacing.container}`,
  narrow: `${designTokens.containers['3xl']} ${designTokens.layouts.centered} ${designTokens.spacing.container}`,
  wide: `${designTokens.containers['7xl']} ${designTokens.layouts.centered} ${designTokens.spacing.containerLarge}`,
  
  // Section containers
  section: `${designTokens.spacing.section}`,
  sectionSmall: `${designTokens.spacing.sectionSmall}`,
  sectionLarge: `${designTokens.spacing.sectionLarge}`,
} as const;

// Utility functions
export const getContainerClass = (size: keyof typeof designTokens.containers = '7xl') => {
  return `${designTokens.containers[size]} ${designTokens.layouts.centered} ${designTokens.spacing.container}`;
};

export const getSectionClass = (size: 'small' | 'default' | 'large' = 'default') => {
  const spacingMap = {
    small: designTokens.spacing.sectionSmall,
    default: designTokens.spacing.section,
    large: designTokens.spacing.sectionLarge,
  };
  return spacingMap[size];
};

// Component-specific patterns
export const componentPatterns = {
  // Page sections
  pageSection: `${containerClasses.section} ${containerClasses.page}`,
  contentSection: `${containerClasses.section} ${containerClasses.content}`,
  narrowSection: `${containerClasses.section} ${containerClasses.narrow}`,
  
  // Layout components
  header: containerClasses.page,
  footer: containerClasses.page,
  main: containerClasses.page,
} as const;
