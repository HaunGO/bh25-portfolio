export const DASHBOARD_SESSION_KEY = 'bh-dashboard-session';
export const DASHBOARD_PRESETS_KEY = 'bh-dashboard-presets';

export const RAINBOW_SECTION_IDS = [
  'color',
  'typography',
  'layout',
  'surfaces',
  'controls',
  'motion',
  'components',
] as const;

export type RainbowSectionId = (typeof RAINBOW_SECTION_IDS)[number];

export type ThemeName = 'dark' | 'light';
export type GuideEffect = 'rainbow';

export type GuideBlockFlags = {
  masthead: boolean;
  sections: Record<RainbowSectionId, boolean>;
};

export type DashboardSettings = {
  theme: ThemeName;
  rainbow: GuideBlockFlags;
  cursorFocus: boolean;
  trailHandoff: boolean;
};

export type DashboardPreset = {
  id: string;
  name: string;
  settings: DashboardSettings;
};

export type DashboardPresetStore = {
  defaultId: string;
  presets: DashboardPreset[];
};

export type DashboardSession = {
  settings: DashboardSettings;
  sourcePresetId: string | null;
};

export const DEFAULT_PRESET_ID = 'default';

function createBlockFlags(on: boolean): GuideBlockFlags {
  return {
    masthead: on,
    sections: Object.fromEntries(
      RAINBOW_SECTION_IDS.map((id) => [id, on]),
    ) as Record<RainbowSectionId, boolean>,
  };
}

export const builtinSettings: DashboardSettings = {
  theme: 'dark',
  rainbow: createBlockFlags(true),
  cursorFocus: true,
  trailHandoff: true,
};

export function createDefaultPresetStore(): DashboardPresetStore {
  return {
    defaultId: DEFAULT_PRESET_ID,
    presets: [
      {
        id: DEFAULT_PRESET_ID,
        name: 'Default',
        settings: structuredClone(builtinSettings),
      },
    ],
  };
}

function mergeBlockFlags(partial?: Partial<GuideBlockFlags> | null): GuideBlockFlags {
  return {
    masthead: partial?.masthead ?? true,
    sections: {
      ...builtinSettings.rainbow.sections,
      ...partial?.sections,
    },
  };
}

function mergeCursorFocus(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value && typeof value === 'object' && 'sections' in value) {
    const flags = value as GuideBlockFlags;
    return flags.sections?.surfaces ?? true;
  }

  return true;
}

export function mergeSettings(partial?: Partial<DashboardSettings> | null): DashboardSettings {
  return {
    theme: partial?.theme === 'light' ? 'light' : 'dark',
    rainbow: mergeBlockFlags(partial?.rainbow),
    cursorFocus: mergeCursorFocus(partial?.cursorFocus),
    trailHandoff: partial?.trailHandoff !== false,
  };
}

export function applyTheme(theme: ThemeName) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
  }
}

function readJson<T>(storage: Storage, key: string): T | null {
  try {
    const raw = storage.getItem(key);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadPresetStore(): DashboardPresetStore {
  const stored = readJson<DashboardPresetStore>(localStorage, DASHBOARD_PRESETS_KEY);
  if (!stored?.presets?.length) {
    return createDefaultPresetStore();
  }

  const presets = stored.presets.map((preset) => ({
    id: preset.id,
    name: preset.name || 'Untitled',
    settings: mergeSettings(preset.settings),
  }));

  const defaultId =
    presets.some((preset) => preset.id === stored.defaultId)
      ? stored.defaultId
      : presets[0].id;

  return { defaultId, presets };
}

export function savePresetStore(store: DashboardPresetStore) {
  localStorage.setItem(DASHBOARD_PRESETS_KEY, JSON.stringify(store));
}

export function loadSession(): DashboardSession | null {
  const stored = readJson<DashboardSession>(sessionStorage, DASHBOARD_SESSION_KEY);
  if (!stored?.settings) {
    return null;
  }

  return {
    settings: mergeSettings(stored.settings),
    sourcePresetId: stored.sourcePresetId ?? null,
  };
}

export function saveSession(session: DashboardSession) {
  sessionStorage.setItem(DASHBOARD_SESSION_KEY, JSON.stringify(session));
}

export function getDefaultSettings(store: DashboardPresetStore) {
  const preset =
    store.presets.find((item) => item.id === store.defaultId) ?? store.presets[0];
  return mergeSettings(preset?.settings);
}

export function allGuideBlocksOn(flags: GuideBlockFlags) {
  return flags.masthead && RAINBOW_SECTION_IDS.every((id) => flags.sections[id]);
}

export function setGuideBlockFlags(
  flags: GuideBlockFlags,
  target: 'all' | 'masthead' | RainbowSectionId,
  on: boolean,
): GuideBlockFlags {
  if (target === 'all') {
    return createBlockFlags(on);
  }

  if (target === 'masthead') {
    return { ...flags, masthead: on };
  }

  return {
    ...flags,
    sections: { ...flags.sections, [target]: on },
  };
}

export function slugifyPresetName(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || `preset-${Date.now()}`;
}
