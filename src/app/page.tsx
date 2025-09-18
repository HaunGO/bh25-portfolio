'use client';

import Hero from '@/components/sections/Hero';
import TransitionDemo from '@/components/sections/TransitionDemo';
import { resumeData } from '@/data/resume';
import ResumeSection from '@/components/resume/ResumeSection';
import ExperienceSection from '@/components/resume/ExperienceSection';
import { PageSection } from '@/components/ui/Section';
// import QuickNavigation from '@/components/sections/QuickNavigation';

export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="experience" className="flex justify-end items-end ">
        <div className="md:w-7/12 mr-10">
          <h2 className="relative pl-4 text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 text-center">Experience</h2>      
          <ExperienceSection experience={resumeData.experience} className="" />
        </div>
      </section>


      {/* <TransitionDemo /> */}
      {/* <QuickNavigation /> */}      
    </>
  );
}
 