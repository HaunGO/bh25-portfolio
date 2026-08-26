import StyleGuideSection from './StyleGuideSection';
import { fontFamilies, typeRamp } from './tokens';

export default function TypographySection() {
  return (
    <StyleGuideSection
      id="typography"
      number="02"
      title="Typography"
      note="Bitter for the voice of the page, Inter for reading, Schoolbell for a handwritten aside. The ramp below is what the site actually uses — it is not tokenized yet."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {fontFamilies.map((family) => (
          <div
            key={family.name}
            className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <p className={`text-5xl leading-none text-neutral-900 dark:text-white ${family.classes}`}>
              {family.sample}
            </p>
            <p className="mt-4 font-display text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {family.name}
            </p>
            <p className="font-body text-sm text-neutral-600 dark:text-neutral-400">{family.role}</p>
            <p className="mt-2 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
              {family.aliases}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 space-y-8">
        {typeRamp.map((entry) => (
          <div
            key={entry.id}
            className="border-b border-neutral-200 pb-8 last:border-b-0 last:pb-0 dark:border-neutral-800"
          >
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-semibold tracking-wide text-neutral-500 dark:text-neutral-400">
                {entry.label}
              </p>
              <p className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                {entry.classes}
                <span className="mx-2 text-neutral-300 dark:text-neutral-600">·</span>
                {entry.usedOn}
              </p>
            </div>
            <div className="overflow-x-auto">
              <p className={`text-neutral-900 dark:text-neutral-100 ${entry.classes}`}>
                {entry.sample}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-neutral-200 bg-white p-8 dark:border-neutral-700 dark:bg-neutral-800">
        <p className="mb-4 text-sm font-semibold tracking-wide text-neutral-500 dark:text-neutral-400">
          Pairing
        </p>
        <h3 className="font-display text-3xl font-bold text-neutral-900 dark:text-white md:text-4xl">
          A Creator of Great &amp; Many
        </h3>
        <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
          Frontend engineer passionate about building beautiful, interactive experiences that
          combine technical excellence with creative vision.
        </p>
        <p className="mt-6 font-script text-2xl text-neutral-900 dark:text-neutral-100">
          hello, from the handwritten voice
        </p>
      </div>
    </StyleGuideSection>
  );
}
