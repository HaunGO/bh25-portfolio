'use client';

import { TransitionLink } from '../transitions/TransitionLink';

const TransitionDemo: React.FC = () => {
  const pages = [
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Resume', href: '/resume' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6 font-display">
          Page Transition Demo
        </h2>
        
        <div>
          <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
            Test Navigation
          </h3>
          
          <div className="flex flex-wrap gap-4">
            {pages.map((page) => (
              <TransitionLink
                key={page.href}
                href={page.href}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Go to {page.name}
              </TransitionLink>
            ))}
          </div>
        </div>

        <div className="mt-8 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
          <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
            How it works:
          </h4>
          <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
            <li>• Click any navigation link to see the transition</li>
            <li>• The overlay animates in → route changes → overlay animates out</li>
            <li>• Reduced motion users get instant navigation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TransitionDemo;