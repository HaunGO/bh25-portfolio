'use client';

export default function AdvancedCursorDemo() {
  return (
    <div className="relative min-h-screen p-8 ">
      <h2 className="text-2xl font-bold mb-6">Advanced Cursor Demo</h2>
      
      {/* Example Button */}
      <button 
        className="btn-primary"
        data-advanced-cursor="true"
      >
        Hover me for Advanced Cursor Effect
      </button>
      
      {/* Example Card */}
      <div 
        data-advanced-cursor="true"
      >
        <h3 className="text-lg font-semibold mb-2">Interactive Card</h3>
        <p className="text-gray-600 dark:text-gray-400">
          This card has the advanced cursor effect. Hover over it to see the cursor draw a rectangle around it.
        </p>
      </div>
    </div>
  );
}
