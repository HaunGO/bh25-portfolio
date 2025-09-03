import Hero from '@/components/sections/Hero';
import QuickNavigation from '@/components/sections/QuickNavigation';
import PageTransition from '@/components/ui/PageTransition';

export default function HomePage() {
  return (
    <PageTransition 
      transition="fade" 
      config={{ 
        duration: 2.0,  // 2 second fade in
        ease: 'power2.out',
        delay: 0.1 
      }}
    >
      <div className="min-h-screen">
        <Hero />
        {/* <QuickNavigation /> */}
      </div>
    </PageTransition>
  );
}
