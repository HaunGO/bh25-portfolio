import StyleGuideSection from './StyleGuideSection';
import {
  containerSpecs,
  containerVariants,
  customScreens,
  customSpacing,
  sectionBackgrounds,
  sectionSpacing,
} from './tokens';

export default function LayoutSection() {
  return (
    <StyleGuideSection
      id="layout"
      number="03"
      title="Layout"
      note="Spacing and width live in src/lib/design-system.ts, then Container and Section apply them. The bars below are the real max-width classes."
    >
      <div className="space-y-12">
        <div>
          <h3 className="mb-4 font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Containers
          </h3>
          <div className="space-y-2">
            {containerSpecs.map((spec) => (
              <div
                key={spec.name}
                className={`${spec.className} flex items-center justify-between rounded-md bg-primary-600/15 px-3 py-2 dark:bg-primary-400/15`}
              >
                <span className="font-mono text-xs text-neutral-700 dark:text-neutral-300">
                  {spec.name}
                </span>
                <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                  {spec.size}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Variants
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {containerVariants.map((variant) => (
              <div
                key={variant.name}
                className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800"
              >
                <p className="font-display font-bold text-neutral-900 dark:text-neutral-100">
                  {variant.name}
                </p>
                <p className="mt-1 font-body text-sm text-neutral-600 dark:text-neutral-400">
                  {variant.note}
                </p>
                <p className="mt-2 font-mono text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {variant.classes}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Section spacing
          </h3>
          <div className="space-y-4">
            {sectionSpacing.map((item) => (
              <div
                key={item.name}
                className="overflow-hidden rounded-xl border border-dashed border-neutral-300 dark:border-neutral-600"
              >
                <div className={`${item.padClass} bg-primary-500/10 dark:bg-primary-400/10`}>
                  <div className="rounded-md bg-white px-4 py-2 text-center dark:bg-neutral-800">
                    <p className="font-mono text-xs text-neutral-700 dark:text-neutral-300">
                      {item.name}
                    </p>
                    <p className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                      {item.classes}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Custom spacing
          </h3>
          <div className="space-y-3">
            {customSpacing.map((item) => (
              <div key={item.token} className="flex flex-wrap items-center gap-3">
                <span className="w-24 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                  spacing.{item.token}
                </span>
                <div
                  className={`${item.barClass} h-3 max-w-full rounded-full bg-primary-500`}
                />
                <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Screens
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[20rem] text-left font-body text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="py-2 font-mono text-xs font-medium text-neutral-500">token</th>
                  <th className="py-2 font-mono text-xs font-medium text-neutral-500">min-width</th>
                  <th className="py-2 font-mono text-xs font-medium text-neutral-500">note</th>
                </tr>
              </thead>
              <tbody>
                {customScreens.map((screen) => (
                  <tr
                    key={screen.token}
                    className="border-b border-neutral-100 dark:border-neutral-800"
                  >
                    <td className="py-2 font-mono text-neutral-800 dark:text-neutral-200">
                      {screen.token}
                    </td>
                    <td className="py-2 font-mono text-neutral-600 dark:text-neutral-400">
                      {screen.value}
                    </td>
                    <td className="py-2 text-neutral-500 dark:text-neutral-500">
                      {'note' in screen ? screen.note : 'custom'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Section backgrounds
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {sectionBackgrounds.map((bg) => (
              <div
                key={bg.name}
                className={`rounded-xl border border-neutral-200 px-4 py-8 text-center dark:border-neutral-700 ${bg.classes}`}
              >
                <p className="font-mono text-xs text-neutral-700 dark:text-neutral-300">{bg.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StyleGuideSection>
  );
}
