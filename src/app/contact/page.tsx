import { Metadata } from 'next';
import CopyEmail from '@/components/ui/CopyEmail';
import { resumeData } from '@/data/resume';

export const metadata: Metadata = {
  title: 'Contact - BH25 Creative Portfolio',
  description: 'Get in touch about opportunities, collaborations, or just to say hello.',
};

export default function ContactPage() {
  const { personalInfo } = resumeData;

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

        <div className="max-w-xl mx-auto">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-700 space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 tracking-wide mb-1">
                Email
              </h2>
              <CopyEmail
                showIcon={false}
                className="text-lg font-body text-primary-600 hover:underline dark:text-primary-400"
              />
            </div>

            {personalInfo.linkedin && (
              <div>
                <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 tracking-wide mb-1">
                  LinkedIn
                </h2>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-primary-600 dark:text-primary-400 hover:underline font-body"
                >
                  {personalInfo.linkedin.replace('https://', '')}
                </a>
              </div>
            )}


            <div>
              <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 tracking-wide mb-1">
                Location
              </h2>
              <p className="text-lg text-neutral-700 dark:text-neutral-300 font-body">
                {personalInfo.location}
              </p>
            </div>


          </div>

        </div>
      </div>
    </div>
  );
}
