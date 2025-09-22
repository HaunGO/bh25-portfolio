'use client';

import { useState, useRef, useEffect } from 'react';
import { Skill } from '@/types/resume';
import gsap from 'gsap';

interface SkillsSectionProps {
  skills: Skill[];
}

const SkillsSection = ({ skills }: SkillsSectionProps) => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const skillRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categoryLabels = {
    frontend: 'Frontend',
    backend: 'Backend', 
    design: 'Design',
    tools: 'Tools',
    other: 'Other'
  };

  const proficiencyColors = {
    beginner: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    advanced: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    expert: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
  };

  useEffect(() => {
    // Animate skill cards on hover
    skillRefs.current.forEach((ref, index) => {
      if (ref) {
        const skill = skills[index];
        if (skill) {
          ref.addEventListener('mouseenter', () => {
            gsap.to(ref, { scale: 1.05, duration: 0.2, ease: 'power2.out' });
          });
          
          ref.addEventListener('mouseleave', () => {
            gsap.to(ref, { scale: 1, duration: 0.2, ease: 'power2.out' });
          });
        }
      }
    });
  }, [skills]);

  return (
    <div className="space-y-12">
      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 font-display">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h3>
            <div className="space-y-3">
              {categorySkills.map((skill, index) => (
                <div
                  key={skill.id}
                  ref={(el) => { skillRefs.current[index] = el; }}
                  className="group cursor-pointer p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 bg-white dark:bg-neutral-800"
                  onClick={() => setSelectedSkill(skill)}
                  onMouseEnter={() => setHoveredSkill(skill.id)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {skill.name}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${proficiencyColors[skill.proficiency]}`}>
                      {skill.proficiency}
                    </span>
                  </div>
                  
                  {skill.years && (
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      {skill.years} year{skill.years !== 1 ? 's' : ''} experience
                    </div>
                  )}
                  
                  {hoveredSkill === skill.id && skill.description && (
                    <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {skill.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Skill Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-display">
                {selectedSkill.name}
              </h3>
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Proficiency:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${proficiencyColors[selectedSkill.proficiency]}`}>
                  {selectedSkill.proficiency}
                </span>
              </div>
              
              {selectedSkill.years && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">Experience:</span>
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {selectedSkill.years} year{selectedSkill.years !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              
              {selectedSkill.description && (
                <div>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400 block mb-1">Description:</span>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    {selectedSkill.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
