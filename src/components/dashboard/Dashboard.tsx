'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import {
  allGuideBlocksOn,
  applyTheme,
  builtinSettings,
  DEFAULT_PRESET_ID,
  getDefaultSettings,
  loadPresetStore,
  loadSession,
  savePresetStore,
  saveSession,
  setGuideBlockFlags,
  slugifyPresetName,
  type DashboardPreset,
  type DashboardPresetStore,
  type DashboardSession,
  type DashboardSettings,
  type GuideEffect,
  type RainbowSectionId,
  type ThemeName,
} from '@/lib/dashboard-settings';
import { syncTrailHandoff } from '@/lib/cursor-focus';
import { styleGuideSections } from '@/components/style-guide/tokens';

type DashboardContextValue = {
  ready: boolean;
  settings: DashboardSettings;
  presets: DashboardPreset[];
  defaultId: string;
  sourcePresetId: string | null;
  setTheme: (theme: ThemeName) => void;
  setBlock: (
    effect: GuideEffect,
    target: 'all' | 'masthead' | RainbowSectionId,
    on: boolean,
  ) => void;
  setCursorFocus: (on: boolean) => void;
  setTrailHandoff: (on: boolean) => void;
  applyPreset: (id: string) => void;
  saveAsDefault: () => void;
  saveAsPreset: (name: string) => void;
  deletePreset: (id: string) => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard() {
  const value = useContext(DashboardContext);
  if (!value) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return value;
}

function ToggleRow({
  label,
  on,
  onToggle,
}: {
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800"
    >
      <span className="font-body text-sm text-neutral-800 dark:text-neutral-100">{label}</span>
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full ${
          on ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            on ? 'translate-x-4' : ''
          }`}
        />
      </span>
    </button>
  );
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<DashboardSettings>(builtinSettings);
  const [store, setStore] = useState<DashboardPresetStore>({
    defaultId: DEFAULT_PRESET_ID,
    presets: [],
  });
  const [sourcePresetId, setSourcePresetId] = useState<string | null>(DEFAULT_PRESET_ID);

  const persistSession = useCallback((next: DashboardSession) => {
    saveSession(next);
    applyTheme(next.settings.theme);
  }, []);

  const commitSettings = useCallback(
    (nextSettings: DashboardSettings, nextSource: string | null) => {
      setSettings(nextSettings);
      setSourcePresetId(nextSource);
      persistSession({ settings: nextSettings, sourcePresetId: nextSource });
    },
    [persistSession],
  );

  useEffect(() => {
    const presetStore = loadPresetStore();
    const session = loadSession();
    const initialSettings = session?.settings ?? getDefaultSettings(presetStore);
    const initialSource =
      session?.sourcePresetId ?? (session ? null : presetStore.defaultId);

    setStore(presetStore);
    setSettings(initialSettings);
    setSourcePresetId(initialSource);
    applyTheme(initialSettings.theme);
    saveSession({ settings: initialSettings, sourcePresetId: initialSource });
    syncTrailHandoff(initialSettings.trailHandoff);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    syncTrailHandoff(settings.trailHandoff);
  }, [ready, settings.trailHandoff]);

  const setTheme = useCallback(
    (theme: ThemeName) => {
      commitSettings({ ...settings, theme }, null);
    },
    [commitSettings, settings],
  );

  const setBlock = useCallback(
    (
      effect: GuideEffect,
      target: 'all' | 'masthead' | RainbowSectionId,
      on: boolean,
    ) => {
      commitSettings(
        {
          ...settings,
          [effect]: setGuideBlockFlags(settings[effect], target, on),
        },
        null,
      );
    },
    [commitSettings, settings],
  );

  const setCursorFocus = useCallback(
    (on: boolean) => {
      commitSettings({ ...settings, cursorFocus: on }, null);
    },
    [commitSettings, settings],
  );

  const setTrailHandoff = useCallback(
    (on: boolean) => {
      commitSettings({ ...settings, trailHandoff: on }, null);
      syncTrailHandoff(on);
    },
    [commitSettings, settings],
  );

  const applyPreset = useCallback(
    (id: string) => {
      const preset = store.presets.find((item) => item.id === id);
      if (!preset) {
        return;
      }
      commitSettings(preset.settings, preset.id);
    },
    [commitSettings, store.presets],
  );

  const saveAsDefault = useCallback(() => {
    const nextStore: DashboardPresetStore = {
      ...store,
      defaultId: DEFAULT_PRESET_ID,
      presets: store.presets.map((preset) =>
        preset.id === DEFAULT_PRESET_ID
          ? { ...preset, settings: structuredClone(settings) }
          : preset,
      ),
    };
    setStore(nextStore);
    savePresetStore(nextStore);
    setSourcePresetId(DEFAULT_PRESET_ID);
    persistSession({ settings, sourcePresetId: DEFAULT_PRESET_ID });
  }, [persistSession, settings, store]);

  const saveAsPreset = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) {
        return;
      }

      const id = slugifyPresetName(trimmed);
      const preset: DashboardPreset = {
        id: store.presets.some((item) => item.id === id) ? `${id}-${Date.now()}` : id,
        name: trimmed,
        settings: structuredClone(settings),
      };
      const nextStore: DashboardPresetStore = {
        ...store,
        presets: [...store.presets, preset],
      };
      setStore(nextStore);
      savePresetStore(nextStore);
      setSourcePresetId(preset.id);
      persistSession({ settings, sourcePresetId: preset.id });
    },
    [persistSession, settings, store],
  );

  const deletePreset = useCallback(
    (id: string) => {
      if (id === DEFAULT_PRESET_ID) {
        return;
      }

      const nextPresets = store.presets.filter((preset) => preset.id !== id);
      const nextStore: DashboardPresetStore = {
        defaultId:
          store.defaultId === id ? DEFAULT_PRESET_ID : store.defaultId,
        presets: nextPresets,
      };
      setStore(nextStore);
      savePresetStore(nextStore);
      if (sourcePresetId === id) {
        setSourcePresetId(null);
        persistSession({ settings, sourcePresetId: null });
      }
    },
    [persistSession, settings, sourcePresetId, store],
  );

  const value = useMemo<DashboardContextValue>(
    () => ({
      ready,
      settings,
      presets: store.presets,
      defaultId: store.defaultId,
      sourcePresetId,
      setTheme,
      setBlock,
      setCursorFocus,
      setTrailHandoff,
      applyPreset,
      saveAsDefault,
      saveAsPreset,
      deletePreset,
    }),
    [
      applyPreset,
      deletePreset,
      ready,
      saveAsDefault,
      saveAsPreset,
      setBlock,
      setCursorFocus,
      setTrailHandoff,
      setTheme,
      settings,
      sourcePresetId,
      store.defaultId,
      store.presets,
    ],
  );

  return (
    <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
  );
}

export default function Dashboard() {
  const {
    ready,
    settings,
    presets,
    defaultId,
    sourcePresetId,
    setTheme,
    setBlock,
    setCursorFocus,
    setTrailHandoff,
    applyPreset,
    saveAsDefault,
    saveAsPreset,
    deletePreset,
  } = useDashboard();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [presetName, setPresetName] = useState('');

  const rainbowAllOn = allGuideBlocksOn(settings.rainbow);

  const openDashboard = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };

  const closeDashboard = () => {
    dialogRef.current?.close();
    setOpen(false);
  };

  if (!ready) {
    return null;
  }

  return (
    <div data-rainbow-skip>
      <button
        type="button"
        onClick={openDashboard}
        className="fixed bottom-5 right-5 z-[80] rounded-lg bg-neutral-100 p-2 text-neutral-700 shadow-lg hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
        aria-label="Open dashboard"
        aria-expanded={open}
      >
        <TuneIcon className="h-5 w-5" fontSize="inherit" />
      </button>

      <dialog
        ref={dialogRef}
        data-rainbow-skip
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            closeDashboard();
          }
        }}
        className="dashboard-sheet z-[80] m-0 h-full max-h-full w-full max-w-md border-l border-neutral-200 bg-white p-0 text-neutral-900 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-3 border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
            <div>
              <p className="font-mono text-[11px] tracking-widest text-primary-600 dark:text-primary-400">
                utility
              </p>
              <h2 className="font-display text-2xl font-bold">Dashboard</h2>
            </div>
            <button
              type="button"
              onClick={closeDashboard}
              className="rounded-lg p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Close dashboard"
            >
              <CloseIcon className="h-5 w-5" fontSize="inherit" />
            </button>
          </div>

          <div className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
            <label className="mb-2 block font-mono text-[11px] tracking-wide text-neutral-500">
              Presets
            </label>
            <select
              value={sourcePresetId ?? ''}
              onChange={(event) => {
                const id = event.target.value;
                if (id) {
                  applyPreset(id);
                }
              }}
              className="input-field"
            >
              <option value="">Session — unsaved</option>
              {presets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                  {preset.id === defaultId ? ' (default)' : ''}
                </option>
              ))}
            </select>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="btn-secondary text-xs" onClick={saveAsDefault}>
                Save as default
              </button>
              {sourcePresetId && sourcePresetId !== DEFAULT_PRESET_ID && (
                <button
                  type="button"
                  className="btn-secondary text-xs"
                  onClick={() => deletePreset(sourcePresetId)}
                >
                  Delete preset
                </button>
              )}
            </div>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                saveAsPreset(presetName);
                setPresetName('');
              }}
            >
              <input
                value={presetName}
                onChange={(event) => setPresetName(event.target.value)}
                className="input-field text-sm"
                placeholder="Name a preset"
                aria-label="New preset name"
              />
              <button type="submit" className="btn-primary shrink-0 text-xs">
                Save
              </button>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <section className="mb-8">
              <h3 className="mb-2 font-display text-lg font-bold">Appearance</h3>
              <ToggleRow
                label="Dark theme"
                on={settings.theme === 'dark'}
                onToggle={() => setTheme(settings.theme === 'dark' ? 'light' : 'dark')}
              />
            </section>

            <section>
              <h3 className="mb-2 font-display text-lg font-bold">Rainbow text</h3>
              <ToggleRow
                label="All blocks"
                on={rainbowAllOn}
                onToggle={() => setBlock('rainbow', 'all', !rainbowAllOn)}
              />
              <ToggleRow
                label="Masthead"
                on={settings.rainbow.masthead}
                onToggle={() => setBlock('rainbow', 'masthead', !settings.rainbow.masthead)}
              />
              {styleGuideSections.map((section) => (
                <ToggleRow
                  key={`rainbow-${section.id}`}
                  label={`${section.number} ${section.title}`}
                  on={settings.rainbow.sections[section.id as RainbowSectionId]}
                  onToggle={() =>
                    setBlock(
                      'rainbow',
                      section.id as RainbowSectionId,
                      !settings.rainbow.sections[section.id as RainbowSectionId],
                    )
                  }
                />
              ))}
            </section>

            <section className="mt-8">
              <h3 className="mb-2 font-display text-lg font-bold">Cursor focus</h3>
              <p className="mb-2 font-body text-xs text-neutral-500 dark:text-neutral-400">
                Wrap from the pointer on Surfaces cards, fade on leave. Tune in
                src/lib/cursor-focus.ts.
              </p>
              <ToggleRow
                label="Surface cards"
                on={settings.cursorFocus}
                onToggle={() => setCursorFocus(!settings.cursorFocus)}
              />
              <ToggleRow
                label="Trail handoff"
                on={settings.trailHandoff}
                onToggle={() => setTrailHandoff(!settings.trailHandoff)}
              />
              <p className="mt-1 font-body text-[11px] text-neutral-500 dark:text-neutral-400">
                Masks the cursor trail over the card so it looks like it becomes the
                outline. Easy to turn off.
              </p>
            </section>
          </div>
        </div>
      </dialog>
    </div>
  );
}
