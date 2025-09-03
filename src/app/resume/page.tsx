import { Metadata } from 'next';
import PageTransition from '@/components/ui/PageTransition';

export const metadata: Metadata = {
  title: 'Resume - BH25 Creative Portfolio',
  description: 'Interactive resume with skills, experience, and education in creative development.',
};

export default function ResumePage() {
  return (
    <PageTransition transition="scale" config={{ duration: 0.7, delay: 0.1 }}>
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 font-display">
              Resume
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto font-body">
              Interactive resume showcasing my skills, experience, and creative development journey
            </p>
          </div>
          
          {/* Placeholder for interactive resume - will be implemented in Story #6 */}
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2 font-display">
              Interactive Resume Coming Soon
            </h2>
            <p className="text-neutral-500 dark:text-neutral-500 font-body">
              This will be implemented in the next sprint with modular sections and animations
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
