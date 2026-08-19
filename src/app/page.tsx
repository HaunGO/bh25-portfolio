'use client';

import Hero from '@/components/sections/Hero';
import { resumeData } from '@/data/resume';
import ExperienceSection from '@/components/resume/ExperienceSection';
import QuickNavigation from '@/components/sections/QuickNavigation';
import { PageContainer } from '@/components/ui/Container';

// const aboutSummary = "I'm a Creative Developer at heart, a Frontend UX guy by experience, and a modern Design System Engineer by trade. I like making interfaces useful, intuitive, and maybe a little fun... bringing decades of creative web experience into component architecture, accessibility, motion, and practical AI-assisted workflows.";
const aboutSummary = "I am the human-in-the-loop! a Creative Developer at heart, a Frontend UX guy by experience, and a modern Design System Engineer by trade. I make interfaces useful, intuitive, and maybe a little fun.   …I bring decades of interactive web craft into these newfangled AI-native agentic workflows—prompts, context, graphs and all! As the bots do more of the work, good human judgment, taste, and direction matter more than ever.";
const featuredExperience = resumeData.experience.slice(0, 3);
const earlierExperience = resumeData.experience.slice(3, 7);

export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="about" className="relative z-10 scroll-mt-24 py-20 ">
        <PageContainer className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/5 md:sticky md:top-24 md:self-start">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 font-display">
              About me
            </h2>
          </div>
          <div className="md:w-4/5">
            <div className="space-y-5">
              <div className="grid gap-6">
                <div className="">
                  <p className="text-2xl px-8 leading-relaxed text-neutral-800 dark:text-neutral-100">
                    {aboutSummary}
                  </p>
                  <p className="text-2xl px-8 pt-8 leading-relaxed text-neutral-800 dark:text-neutral-100 font-script">
                    {aboutSummary}
                  </p>
                </div>
                <div className="bg-white dark:bg-neutral-900 p-10 rounded-lg">
                  <p className="text-xl leading-relaxed text-neutral-700 dark:text-neutral-300 font-body ">
                    {/* {resumeData.personalInfo.summary} */}
                    {aboutSummary}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`mailto:${resumeData.personalInfo.email}`}
                  data-cursor-hit="active"
                  data-cursor-level="about-cta"
                  className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                  Email me
                </a>
                {resumeData.personalInfo.linkedin && (
                  <a
                    href={resumeData.personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-hit="active"
                    data-cursor-level="about-cta"
                    className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <section id="experience" className="relative z-10 scroll-mt-24 ">
        <PageContainer className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/5 md:sticky md:top-24 md:self-start">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 font-display">
              Career Experience
            </h2>
          </div>
          <div className="md:w-4/5">
            <ExperienceSection experience={featuredExperience} className="" />

            <div className="mt-12 pl-14 md:pl-20">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 font-display">
                    Earlier Experience
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    A compact pass through the previous chapters.
                  </p>
                </div>
                <a
                  href="/resume"
                  data-cursor-hit="active"
                  data-cursor-level="resume-link"
                  className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  View full resume
                </a>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {earlierExperience.map((exp) => (
                  <article
                    key={exp.id}
                    data-cursor-hit="active"
                    data-cursor-level="compact-experience"
                    className="rounded-xl border border-neutral-200 bg-white p-5 shadow-md transition-shadow duration-300 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    <h4 className="text-base font-bold text-primary-600 dark:text-primary-400">
                      {exp.position}
                    </h4>
                    <p className="mt-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {exp.company}
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      {exp.startDate} - {exp.endDate}
                    </p>
                    <p className="mt-3 max-h-16 overflow-hidden text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {exp.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {exp.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* <QuickNavigation /> */}
    </>
  );
}
