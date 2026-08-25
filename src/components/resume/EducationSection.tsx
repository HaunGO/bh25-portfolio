'use client';

import { useRef, useEffect } from 'react';
import { Education } from '@/types/resume';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface EducationSectionProps {
  education: Education[];
}

const EducationSection = ({ education }: EducationSectionProps) => {
  const educationRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animate education cards
    educationRefs.current.forEach((ref) => {
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
              <LocationOnIcon className="h-4 w-4 text-neutral-500" fontSize="inherit" aria-hidden="true" />
              <span className="text-neutral-600 dark:text-neutral-400">{edu.location}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <CalendarMonthIcon className="h-4 w-4 text-neutral-500" fontSize="inherit" aria-hidden="true" />
              <span className="text-neutral-600 dark:text-neutral-400">
                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
              </span>
            </div>
            
            {edu.gpa && (
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-neutral-500" fontSize="inherit" aria-hidden="true" />
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
