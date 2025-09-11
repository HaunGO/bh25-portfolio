import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - BH25 Creative Portfolio',
  description: 'Get in touch about opportunities, collaborations, or just to say hello.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6 font-display">
            Contact
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto font-body">
            Let&apos;s discuss opportunities, collaborations, or just connect about creative development
          </p>
        </div>
        
        {/* Placeholder for contact form - will be implemented in Story #7 */}
        <div className="text-center py-20">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2 font-display">
            Contact Form Coming Soon
          </h2>
          <p className="text-neutral-500 dark:text-neutral-500 font-body">
            This will be implemented in the next sprint with form validation and submission
          </p>
        </div>
      </div>
    </div>
  );
}
