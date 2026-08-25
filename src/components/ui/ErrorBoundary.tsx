'use client';

import { Component, ReactNode, ErrorInfo } from 'react';
import WarningIcon from '@mui/icons-material/Warning';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
          <div className="max-w-md mx-auto text-center px-4">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-error-100 dark:bg-error-900/20 rounded-full flex items-center justify-center mb-4">
                <WarningIcon className="h-8 w-8 text-error-600 dark:text-error-400" fontSize="inherit" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
              
              <button
                onClick={() => this.setState({ hasError: false })}
                className="w-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-neutral-100 dark:bg-neutral-800 rounded text-xs font-mono text-neutral-700 dark:text-neutral-300 overflow-auto">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  <div>
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap mt-1">
                      {this.state.error.stack}
                    </pre>
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // You can add error reporting logic here
    // e.g., send to Sentry, LogRocket, etc.
  };
}
