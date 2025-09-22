'use client';

import { useRef, useEffect } from 'react';
import { Education } from '@/types/resume';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface EducationSectionProps {
  education: Education[];
}

const EducationSection = ({ education }: EducationSectionProps) => {
  const educationRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animate education cards
    educationRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.fromTo(ref,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ref,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    });
  }, [education]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {education.map((edu, index) => (
        <div
          key={edu.id}
          ref={(el) => { educationRefs.current[index] = el; }}
          className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="mb-4">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-display">
              {edu.degree}
            </h3>
            <p className="text-lg text-primary-600 dark:text-primary-400 font-medium">
              {edu.field}
            </p>
            <p className="text-lg text-neutral-700 dark:text-neutral-300">
              {edu.institution}
            </p>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-neutral-600 dark:text-neutral-400">{edu.location}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-neutral-600 dark:text-neutral-400">
                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
              </span>
            </div>
            
            {edu.gpa && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-neutral-600 dark:text-neutral-400">GPA: {edu.gpa}</span>
              </div>
            )}
          </div>
          
          {/* Relevant Coursework */}
          {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Relevant Coursework:
              </h4>
              <div className="flex flex-wrap gap-2">
                {edu.relevantCoursework.map((course, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded text-xs"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Achievements */}
          {edu.achievements && edu.achievements.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Achievements:
              </h4>
              <ul className="space-y-1">
                {edu.achievements.map((achievement, idx) => (
                  <li key={idx} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start">
                    <span className="text-primary-500 dark:text-primary-400 mr-2 mt-1">•</span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EducationSection;
