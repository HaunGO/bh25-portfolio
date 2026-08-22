'use client';

import { ExternalLink, Mail, MapPin, UserRound } from 'lucide-react';
import { resumeData } from '@/data/resume';
import { PageContainer } from '../ui/Container';

const { personalInfo } = resumeData;

export default function ContactSection() {
  return (
    <section id="contact" className="relative z-10 scroll-mt-24 py-24">
      <PageContainer className="flex flex-col gap-8 md:flex-row">
        <div className="md:sticky md:top-24 md:w-1/5 md:self-start">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 md:text-4xl font-display">
            Contact
          </h2>
        </div>

        <div className="md:w-4/5">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-lg shadow-neutral-200/40 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20 md:p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                  <UserRound className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Name</p>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-100">{personalInfo.name}</p>
                </div>
              </div>

              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-700 dark:hover:bg-primary-950/30"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Email</p>
                  <p className="break-all font-semibold text-primary-600 dark:text-primary-400">{personalInfo.email}</p>
                </div>
              </a>

              {personalInfo.linkedin && (
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-700 dark:hover:bg-primary-950/30"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                    <ExternalLink className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">LinkedIn</p>
                    <p className="break-all font-semibold text-primary-600 dark:text-primary-400">{personalInfo.linkedin.replace('https://', '')}</p>
                  </div>
                </a>
              )}

              <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Location</p>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-100">{personalInfo.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
