'use client';

import { resumeData } from '@/data/resume';
import ResumeSection from '@/components/resume/ResumeSection';
import ExperienceSection from '@/components/resume/ExperienceSection';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MailIcon from '@mui/icons-material/Mail';

export default function ResumePage() {
  const { personalInfo } = resumeData;

  return (
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

        <ResumeSection title="About" id="about">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 font-display">
                  {personalInfo.name}
                </h3>
                <p className="text-lg text-primary-600 dark:text-primary-400 font-medium mb-4">
                  {personalInfo.title}
                </p>
                <p className="text-neutral-700 dark:text-neutral-300 font-body leading-relaxed">
                  {personalInfo.summary}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MailIcon className="h-5 w-5 text-neutral-500" fontSize="inherit" aria-hidden="true" />
                  <a href={`mailto:${personalInfo.email}`} className="text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {personalInfo.email}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <LocationOnIcon className="h-5 w-5 text-neutral-500" fontSize="inherit" aria-hidden="true" />
                  <span className="text-neutral-700 dark:text-neutral-300">{personalInfo.location}</span>
                </div>

                {personalInfo.website && (
                  <div className="flex items-center gap-3">
                    <LanguageIcon className="h-5 w-5 text-neutral-500" fontSize="inherit" aria-hidden="true" />
                    <a
                      href={personalInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {personalInfo.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ResumeSection>

        {/* <ResumeSection title="Skills" id="skills">
          <SkillsSection skills={resumeData.skills} />
        </ResumeSection> */}

        <ResumeSection title="Experience" id="experience">
          <ExperienceSection experience={resumeData.experience} />
        </ResumeSection>

        {/* <ResumeSection title="Education" id="education">
          <EducationSection education={resumeData.education} />
        </ResumeSection> */}
        
      </div>
    </div>
  );
}
