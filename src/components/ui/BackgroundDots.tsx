/**
 * Global fixed SVG dot grid. Mount once from Layout — do not add per page.
 */
export default function BackgroundDots({ id = 'dotGrid' }: { id?: string }) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1]"
      aria-hidden="true"
      data-background-dots
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          <pattern
            id={id}
            x="0"
            y="0"
            width="15"
            height="15"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="10"
              cy="10"
              r="1"
              className="fill-neutral-300 dark:fill-neutral-700"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
