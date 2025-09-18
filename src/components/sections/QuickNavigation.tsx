'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { PageContainer } from '../ui/Container';

interface QuickNavigationProps {
  className?: string;
}

const navigationItems = [
  {
    title: 'Portfolio',
    description: 'Browse through my latest projects and case studies',
    href: '/portfolio',
    icon: '🎨',
  },
  {
    title: 'Resume',
    description: 'Interactive resume with skills and experience',
    href: '/resume',
    icon: '📄',
  },
  {
    title: 'Contact',
    description: 'Get in touch about opportunities or collaborations',
    href: '/contact',
    icon: '💬',
  },
];

export default function QuickNavigation({ className = '' }: QuickNavigationProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Create scroll-triggered animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        // start: 'top 80%',
        // end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });

    // Title animation
    tl.fromTo(titleRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power2.out' },
      0
    );

    // Cards staggered animation
    if (cardsRef.current?.children) {
      tl.fromTo(Array.from(cardsRef.current.children),
        { opacity: 0, scale: 0.9 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.15,
          ease: 'back.out(1.4)' 
        },
        0.3
      );
    }

    // Cleanup function
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`py-20 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 transition-colors duration-500 ${className}`}
    >
      {/* Visual separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-700 to-transparent" />
      
      <PageContainer>
        <h2 
          ref={titleRef}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-12 transition-colors duration-500 font-display"
        >
          Explore My Work
        </h2>
        
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {navigationItems.map((item) => (
            <div 
              key={item.title} 
              className="group card text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
            >
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2 transition-colors duration-300 font-display">
                {item.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 transition-colors duration-300 font-body">
                {item.description}
              </p>
              <a
                href={item.href}
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Explore
              </a>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
