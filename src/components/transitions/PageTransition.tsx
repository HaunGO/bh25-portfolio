'use client';

import { useRef, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { gsap } from 'gsap';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const startTransition = async (to: string) => {
    if (to === pathname || !overlayRef.current) return;

    // Reset overlay to hidden state first
    gsap.set(overlayRef.current, { autoAlpha: 0 });

    // Animate in
    await gsap.to(overlayRef.current, { 
      autoAlpha: 1, 
      duration: .3, 
      ease: 'power2.in' 
    });

    // Navigate
    router.push(to);

    // Wait for route change
    await new Promise(resolve => {
      const check = () => {
        if (window.location.pathname === to) {
          resolve(void 0);
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    });

    // Animate out
    await gsap.to(overlayRef.current, { 
      autoAlpha: 0, 
      duration: .3, 
      ease: 'power2.ut' 
    });
  };

  // Expose globally (client-side only)
  if (typeof window !== 'undefined') {
    (window as any).startTransition = startTransition;
  }

  return (
    <>
      {children}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-30 bg-white dark:bg-black pointer-events-none"
        style={{ opacity: 0, visibility: 'hidden' }}
      />
    </>
  );
};

export default PageTransition;