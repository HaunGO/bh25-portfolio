'use client';

import { useRef } from 'react';
import { Experience } from '@/types/resume';

interface ExperienceSectionProps {
  experience: Experience[];
  className?: string;
}

const ExperienceSection = ({ experience, className }: ExperienceSectionProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const experienceRefs = useRef<(HTMLDivElement | null)[]>([]);

  // useEffect(() => {
  //   if (!timelineRef.current) return;

  //   gsap.registerPlugin(ScrollTrigger);

  //   // Create timeline animation
  //   const tl = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: timelineRef.current,
  //       start: 'top 70%',
  //       end: 'bottom 30%',
  //       toggleActions: 'play none none reverse'
  //     }
  //   });

  //   // Animate each experience item
  //   experienceRefs.current.forEach((ref, index) => {
  //     if (ref) {
  //       tl.fromTo(ref,
  //         { opacity: 0, x: -50 },
  //         { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
  //         index * 0.1
  //       );
  //     }
  //   });

  //   return () => {
  //     tl.kill();
  //   };
  // }, [experience]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div ref={timelineRef} className={`relative ${className}`}>

      {/* Timeline line */}
      <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[1px] Tail bg-gradient-to-b from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400"></div>
      






      <div className="space-y-12">
        {experience.map((exp, index) => (
          <div
            key={exp.id}
            ref={(el) => { experienceRefs.current[index] = el; }}
            className="relative pl-14 md:pl-20"
          >
            {/* Timeline dot */}
            <div className="absolute left-4 md:left-6 w-4 h-4 bg-primary-500 dark:bg-primary-400 rounded-full border-4 border-white dark:border-neutral-900 z-10"></div>
            
            {/* Experience card */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-shadow duration-300">
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-display">
                    {exp.position}
                  </h3>
                  <p className="text-lg text-primary-600 dark:text-primary-400 font-medium">
                    {exp.company}
                  </p>
                </div>
                <div className="text-right mt-2 md:mt-0">
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    {exp.startDate} - {exp.endDate === 'Present' ? 'Present' :exp.endDate}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-300">
                    {exp.location}
                  </div>
                </div>
              </div>
              

              <p className="text-neutral-700 dark:text-neutral-300 mb-4 font-body">
                {exp.description}
              </p>
              


              
              {/* Achievements */}
              {exp.achievements.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Key Achievements:
                  </h4>
                  <ul className="space-y-1">
                    {exp.achievements.map((achievement: string, idx: number) => (
                      <li key={idx} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start">
                        <span className="text-primary-500 dark:text-primary-400 mr-2 mt-1">•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              



              {/* Technologies */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Technologies:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>





        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;
