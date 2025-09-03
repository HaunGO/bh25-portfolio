import { Metadata } from 'next';
import PageTransition from '@/components/ui/PageTransition';

export const metadata: Metadata = {
  title: 'Portfolio - BH25 Creative Portfolio',
  description: 'Browse through my latest projects and case studies showcasing creative development work.',
};

export default function PortfolioPage() {
  return (
    <PageTransition transition="slide" config={{ duration: 0.6, stagger: 0.15 }}>
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 font-display">
              Portfolio
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto font-body">
              A collection of projects that showcase my passion for creative development and technical excellence
            </p>
          </div>
          
          {/* Placeholder for portfolio grid - will be implemented in Story #5 */}
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2 font-body">
              Portfolio Grid Coming Soon
            </h2>
            <p className="text-neutral-500 dark:text-neutral-500 font-body">
              This will be implemented in the next sprint with project cards and filtering
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
