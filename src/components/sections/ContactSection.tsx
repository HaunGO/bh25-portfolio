'use client';

import { ExternalLink, Mail, Phone } from 'lucide-react';
import { resumeData } from '@/data/resume';
import { PageContainer } from '../ui/Container';

const { personalInfo } = resumeData;
const phoneHref = personalInfo.phone.replace(/[^\d+]/g, '');

export default function ContactSection() {
  return (
    <section id="contact" className="relative z-10 scroll-mt-24 py-24" aria-label="Contact">
      <PageContainer>
        <div className="grid overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-xl shadow-neutral-200/40 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20 md:grid-cols-3">
          <a
            href={`mailto:${personalInfo.email}`}
            className="group flex min-h-64 flex-col justify-between border-b border-neutral-200 p-8 transition-colors hover:bg-primary-50 dark:border-neutral-800 dark:hover:bg-primary-950/20 md:border-b-0 md:border-r"
          >
            <Mail className="h-9 w-9 text-primary-600 dark:text-primary-400" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">Email</p>
              <p className="mt-3 break-all text-xl font-semibold text-neutral-900 dark:text-neutral-100">{personalInfo.email}</p>
            </div>
          </a>

          <a
            href={`tel:${phoneHref}`}
            className="group flex min-h-64 flex-col justify-between border-b border-neutral-200 p-8 transition-colors hover:bg-primary-50 dark:border-neutral-800 dark:hover:bg-primary-950/20 md:border-b-0 md:border-r"
          >
            <Phone className="h-9 w-9 text-primary-600 dark:text-primary-400" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">Phone</p>
              <p className="mt-3 text-xl font-semibold text-neutral-900 dark:text-neutral-100">{personalInfo.phone}</p>
            </div>
          </a>

          {personalInfo.linkedin && (
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-64 flex-col justify-between p-8 transition-colors hover:bg-primary-50 dark:hover:bg-primary-950/20"
            >
              <ExternalLink className="h-9 w-9 text-primary-600 dark:text-primary-400" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">LinkedIn</p>
                <p className="mt-3 break-all text-xl font-semibold text-neutral-900 dark:text-neutral-100">{personalInfo.linkedin.replace('https://', '')}</p>
              </div>
            </a>
          )}
        </div>
      </PageContainer>
    </section>
  );
}
