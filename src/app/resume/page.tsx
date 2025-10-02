'use client';

import { resumeData } from '@/data/resume';
import ResumeSection from '@/components/resume/ResumeSection';
import ExperienceSection from '@/components/resume/ExperienceSection';

export default function ResumePage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Experience Section */}
        <ResumeSection title="" id="experience">
          <ExperienceSection experience={resumeData.experience} />
        </ResumeSection>



        {/* Header Section */}
        {/* <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 font-display">
            Resume
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto font-body mb-8">
            Interactive resume showcasing my skills, experience, and creative development journey
          </p>
          
          <div className="flex justify-center">
            <DownloadButton />
          </div>
        </div> */}

        {/* Personal Info Section */}
        {/* <ResumeSection title="About" id="about">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 font-display">
                  {resumeData.personalInfo.name}
                </h3>
                <p className="text-lg text-primary-600 dark:text-primary-400 font-medium mb-4">
                  {resumeData.personalInfo.title}
                </p>
                <p className="text-neutral-700 dark:text-neutral-300 font-body leading-relaxed">
                  {resumeData.personalInfo.summary}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-neutral-700 dark:text-neutral-300">{resumeData.personalInfo.email}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-neutral-700 dark:text-neutral-300">{resumeData.personalInfo.location}</span>
                </div>
                
                {resumeData.personalInfo.website && (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                    <a 
                      href={resumeData.personalInfo.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {resumeData.personalInfo.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ResumeSection> */}

        {/* Skills Section */}
        {/* <ResumeSection title="Skills" id="skills">
          <SkillsSection skills={resumeData.skills} />
        </ResumeSection> */}

        {/* Experience Section */}
        {/* <ResumeSection title="Experience" id="experience">
          <ExperienceSection experience={resumeData.experience} />
        </ResumeSection> */}

        {/* Education Section */}
        {/* <ResumeSection title="Education" id="education">
          <EducationSection education={resumeData.education} />
        </ResumeSection> */}

        {/* Certifications Section */}
        {/* {resumeData.certifications && resumeData.certifications.length > 0 && (
          <ResumeSection title="Certifications" id="certifications">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumeData.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-md border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-primary-500 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">{cert}</span>
                  </div>
                </div>
              ))}
            </div>
          </ResumeSection>
        )} */}
      </div>
    </div>
  );
}
