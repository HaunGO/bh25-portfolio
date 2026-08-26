'use client';

import { useState } from 'react';
import StyleGuideSection from './StyleGuideSection';
import {
  colorFamilies,
  getColorScale,
  isLightHex,
  motionSpectrum,
} from './tokens';

export default function ColorSection() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      window.setTimeout(() => {
        setCopied((current) => (current === hex ? null : current));
      }, 1200);
    } catch {
      setCopied(null);
    }
  };

  return (
    <StyleGuideSection
      id="color"
      number="01"
      title="Color"
      note="Sky for action, fuchsia for flourish, neutrals for structure. Swatches come from tailwind.config.ts — click a chip to copy its hex."
    >
      <div className="space-y-12">
        {colorFamilies.map((family) => {
          const scale = getColorScale(family.id);
          return (
            <div key={family.id}>
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  {family.title}
                </h3>
                <p className="font-body text-sm text-neutral-600 dark:text-neutral-400">
                  {family.usage}
                </p>
              </div>
              <div className="grid grid-cols-4 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 sm:grid-cols-6 lg:grid-cols-11">
                {scale.map((swatch) => {
                  const light = isLightHex(swatch.hex);
                  const isCopied = copied === swatch.hex;
                  return (
                    <button
                      key={swatch.stop}
                      type="button"
                      onClick={() => copyHex(swatch.hex)}
                      className="group flex min-h-[5.5rem] flex-col justify-between p-2 text-left"
                      style={{ backgroundColor: swatch.hex }}
                      aria-label={`Copy ${swatch.className} ${swatch.hex}`}
                    >
                      <span
                        className={`font-mono text-[11px] ${light ? 'text-neutral-800' : 'text-white'}`}
                      >
                        {swatch.stop}
                      </span>
                      <span
                        className={`font-mono text-[10px] leading-tight ${light ? 'text-neutral-700' : 'text-white/80'}`}
                      >
                        {isCopied ? 'copied' : swatch.hex}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div>
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Motion spectrum
            </h3>
            <p className="font-body text-sm text-neutral-600 dark:text-neutral-400">
              Canonical hover spectrum from src/lib/motion.ts. Hero and footer import it.
            </p>
          </div>
          <div className="grid grid-cols-4 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 sm:grid-cols-7">
            {motionSpectrum.map((swatch) => {
              const light = isLightHex(swatch.hex);
              const isCopied = copied === swatch.hex;
              return (
                <button
                  key={swatch.hex}
                  type="button"
                  onClick={() => copyHex(swatch.hex)}
                  className="flex min-h-[5.5rem] flex-col justify-between p-2 text-left"
                  style={{ backgroundColor: swatch.hex }}
                  aria-label={`Copy ${swatch.name} ${swatch.hex}`}
                >
                  <span
                    className={`font-mono text-[11px] ${light ? 'text-neutral-800' : 'text-white'}`}
                  >
                    {swatch.name}
                  </span>
                  <span
                    className={`font-mono text-[10px] ${light ? 'text-neutral-700' : 'text-white/80'}`}
                  >
                    {isCopied ? 'copied' : swatch.hex}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Pairings
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
              <p className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                white / dark:neutral-800
              </p>
              <p className="mt-3 font-body text-neutral-900 dark:text-neutral-100">
                Body on a card surface
              </p>
              <p className="mt-1 font-body text-sm text-neutral-600 dark:text-neutral-400">
                Muted supporting line
              </p>
              <a
                href="#controls"
                className="mt-3 inline-block font-body text-primary-600 hover:underline dark:text-primary-400"
              >
                Primary link
              </a>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 dark:border-neutral-200 dark:bg-white">
              <p className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
                inverse surface
              </p>
              <p className="mt-3 font-body text-neutral-100 dark:text-neutral-900">
                Body on the opposite field
              </p>
              <p className="mt-1 font-body text-sm text-neutral-400 dark:text-neutral-600">
                Muted supporting line
              </p>
              <a
                href="#controls"
                className="mt-3 inline-block font-body text-primary-400 hover:underline dark:text-primary-600"
              >
                Primary link
              </a>
            </div>
          </div>
        </div>
      </div>
    </StyleGuideSection>
  );
}
