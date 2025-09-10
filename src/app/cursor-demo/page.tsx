'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CursorDemo() {
  const demoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!demoRef.current) return;

    // Animate demo elements on mount
    gsap.fromTo(demoRef.current.children, 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1,
        ease: 'power2.out'
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 p-8">
      <div ref={demoRef} className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 cursor-hover" data-cursor-hover>
            Physics-Enhanced Cursor Demo
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 cursor-hover" data-cursor-hover>
            Experience advanced cursor interactions with Matter.js physics! Move your cursor around to see particle trails, magnetic effects, and collision detection.
          </p>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              🎯 <strong>Physics Features:</strong> Particle trails, magnetic attraction, click explosions, hover particles, and collision detection
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hover Effects */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 cursor-hover" data-cursor-hover>
              Hover Effects
            </h2>
            
            <div className="space-y-4">
              <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg cursor-hover" data-cursor-hover>
                <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 cursor-hover" data-cursor-hover>
                  Hover Card
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 cursor-hover" data-cursor-hover>
                  This card changes the cursor ring color on hover
                </p>
              </div>

              <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white cursor-hover" data-cursor-hover>
                <h3 className="text-lg font-medium cursor-hover" data-cursor-hover>
                  Gradient Card
                </h3>
                <p className="cursor-hover" data-cursor-hover>
                  Beautiful gradient background with hover effects
                </p>
              </div>
            </div>
          </div>

          {/* Magnetic Effects */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 cursor-hover" data-cursor-hover>
              Magnetic Effects
            </h2>
            
            <div className="space-y-4">
              <button 
                className="w-full p-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors cursor-magnetic" 
                data-cursor-magnetic
                data-cursor-click
              >
                Magnetic Button
              </button>

              <div className="p-6 bg-accent-100 dark:bg-accent-900 rounded-lg cursor-magnetic" data-cursor-magnetic>
                <h3 className="text-lg font-medium text-accent-800 dark:text-accent-200 cursor-magnetic" data-cursor-magnetic>
                  Magnetic Area
                </h3>
                <p className="text-accent-700 dark:text-accent-300 cursor-magnetic" data-cursor-magnetic>
                  This entire area has magnetic properties
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 cursor-hover" data-cursor-hover>
            Interactive Elements
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div 
                key={i}
                className="aspect-square bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-400 font-medium cursor-magnetic" 
                data-cursor-magnetic
                data-cursor-click
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Text Interactions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 cursor-hover" data-cursor-hover>
            Text Interactions
          </h2>
          
          <div className="space-y-4">
            <p className="text-lg text-neutral-700 dark:text-neutral-300 cursor-hover" data-cursor-hover>
              This paragraph has hover effects. The cursor will change when you hover over it.
            </p>
            
            <div className="flex flex-wrap gap-2">
              {['React', 'Next.js', 'GSAP', 'Three.js', 'TypeScript', 'Tailwind'].map((tech) => (
                <span 
                  key={tech}
                  className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full text-sm font-medium cursor-magnetic" 
                  data-cursor-magnetic
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Physics Effects */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 cursor-hover" data-cursor-hover>
            Physics Effects
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg text-white cursor-magnetic" data-cursor-magnetic>
              <h3 className="text-lg font-medium mb-2 cursor-magnetic" data-cursor-magnetic>
                Particle Trails
              </h3>
              <p className="text-sm cursor-magnetic" data-cursor-magnetic>
                Move your cursor around this area to see particle trails following your movement
              </p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg text-white cursor-magnetic" data-cursor-magnetic>
              <h3 className="text-lg font-medium mb-2 cursor-magnetic" data-cursor-magnetic>
                Magnetic Attraction
              </h3>
              <p className="text-sm cursor-magnetic" data-cursor-magnetic>
                Feel the magnetic pull as particles are attracted to your cursor position
              </p>
            </div>
          </div>
        </div>

        {/* Click Effects */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 cursor-hover" data-cursor-hover>
            Click Effects
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <button 
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors cursor-magnetic" 
              data-cursor-magnetic
              data-cursor-click
            >
              Explosion Effect
            </button>
            
            <button 
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors cursor-magnetic" 
              data-cursor-magnetic
              data-cursor-click
            >
              Ripple Effect
            </button>
            
            <button 
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors cursor-magnetic" 
              data-cursor-magnetic
              data-cursor-click
            >
              Particle Burst
            </button>
          </div>
          
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              💥 <strong>Click any button above</strong> to see explosion effects with physics particles!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
