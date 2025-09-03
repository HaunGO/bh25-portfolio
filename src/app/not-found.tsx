import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found - BH25 Creative Portfolio',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-8xl mb-8">😵</div>
        <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 font-display">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-neutral-700 dark:text-neutral-300 mb-4 font-display">
          Page Not Found
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 font-body">
          The page you are looking for might have been moved, deleted, or never existed.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Go Home
          </Link>
          
          <div className="text-sm text-neutral-500 dark:text-neutral-500">
            Or try one of these pages:
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/portfolio"
              className="text-primary-600 dark:text-primary-400 hover:underline font-body"
            >
              Portfolio
            </Link>
            <Link 
              href="/resume"
              className="text-primary-600 dark:text-primary-400 hover:underline font-body"
            >
              Resume
            </Link>
            <Link 
              href="/contact"
              className="text-primary-600 dark:text-primary-400 hover:underline font-body"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
