'use client';

import Hero3D from '@/components/three/Hero3D';

export default function ThreeDemoPage() {
  return (
    <main className="min-h-screen bg-neutral-900">
      <Hero3D />
      
      {/* Additional content section to show scroll behavior */}
      <section className="relative z-10 bg-neutral-900 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-6">
            3D Hero Demo
          </h2>
          <p className="text-neutral-300 max-w-2xl">
            This is a demonstration of the 3D hero component using Three.js. 
            Move your mouse around to see the interactive elements respond. 
            The floating geometric shapes create an engaging visual experience.
          </p>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <h3 className="text-xl font-semibold text-white mb-2">Interactive</h3>
              <p className="text-neutral-400">
                Shapes respond to mouse movement with smooth, physics-based animations.
              </p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <h3 className="text-xl font-semibold text-white mb-2">Performant</h3>
              <p className="text-neutral-400">
                Optimized rendering with proper cleanup and efficient animation loops.
              </p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <h3 className="text-xl font-semibold text-white mb-2">Customizable</h3>
              <p className="text-neutral-400">
                Easy to modify colors, shapes, and behaviors through props and config.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
