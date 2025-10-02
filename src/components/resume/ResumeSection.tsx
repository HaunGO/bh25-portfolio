'use client';

import { ReactNode, useRef } from 'react';
import { ContentContainer } from '../ui/Container';

interface ResumeSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  id: string;
}

const ResumeSection = ({ title, children, className = '', id }: ResumeSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (!sectionRef.current || !titleRef.current || !contentRef.current) return;

  //   gsap.registerPlugin(ScrollTrigger);

  //   // Create timeline for section reveal
  //   const tl = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: sectionRef.current,
  //       start: 'top 80%',
  //       end: 'bottom 20%',
  //       toggleActions: 'play none none reverse'
  //     }
  //   });

  //   // Animate title
  //   tl.fromTo(titleRef.current, 
  //     { opacity: 0, y: 30 },
  //     { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
  //   );

  //   // Animate content with stagger
  //   tl.fromTo(contentRef.current.children,
  //     { opacity: 0, y: 20 },
  //     { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
  //     '-=0.4'
  //   );

  //   return () => {
  //     tl.kill();
  //   };
  // }, []);

  return (
    <section ref={sectionRef} id={id} className={`py-16 ${className}`} >
      <ContentContainer>
        <h2 ref={titleRef} className="" >
          {title}
        </h2>
        <div ref={contentRef}>
          {children}
        </div>
      </ContentContainer>
    </section>
  );
};

export default ResumeSection;
