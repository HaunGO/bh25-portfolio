interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Loading({ 
  variant = 'spinner', 
  size = 'md', 
  className = '' 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const renderLoading = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={`animate-spin rounded-full border-2 border-neutral-300 border-t-primary-600 ${sizeClasses[size]} ${className}`} />
        );
      
      case 'dots':
        return (
          <div className={`flex space-x-1 ${className}`}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`bg-primary-600 rounded-full animate-bounce ${sizeClasses[size]}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`animate-pulse bg-primary-600 rounded-full ${sizeClasses[size]} ${className}`} />
        );
      
      case 'skeleton':
        return (
          <div className={`animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded ${sizeClasses[size]} ${className}`} />
        );
      
      default:
        return null;
    }
  };

  return renderLoading();
}

// Skeleton loader for content
export function Skeleton({ className = '', lines = 3 }: { className?: string; lines?: number }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded h-4 ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

// Page loading component
export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loading variant="spinner" size="lg" className="mx-auto" />
        <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
      </div>
    </div>
  );
}

// Button loading state
export function ButtonLoading({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Loading variant="spinner" size="sm" />
      <span>Loading...</span>
    </div>
  );
}
