'use client';

import Hero from '@/components/sections/Hero';
import TransitionDemo from '@/components/sections/TransitionDemo';
import { resumeData } from '@/data/resume';
import ResumeSection from '@/components/resume/ResumeSection';
import ExperienceSection from '@/components/resume/ExperienceSection';
import { PageSection } from '@/components/ui/Section';
import AdvancedCursorDemo from '@/components/ui/AdvancedCursorDemo';
// import QuickNavigation from '@/components/sections/QuickNavigation';
import { PageContainer } from '@/components/ui/Container';

export default function HomePage() {
  return (
    <>
      <Hero />

      <PageContainer className="flex flex-col md:flex-row">
        
        <div className="md:flex-row md:justify-end md:w-2/5"></div>
        <div className="md:flex-row md:justify-end md:w-3/5">
          <ExperienceSection experience={resumeData.experience} className="" />
        </div>





      </PageContainer>






      {/* <PageContainer className="flex justify-end items-end ">
        <div className="md:w-7/12 ">
          <h2 className="relative pl-4 md:pl-12 text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 text-center">Experience</h2>      
          <ExperienceSection experience={resumeData.experience} className="" />
        </div>
      </PageContainer> */}




      {/* <AdvancedCursorDemo /> */}
      {/* <TransitionDemo /> */}
      {/* <QuickNavigation /> */}      
    </>
  );
}
 