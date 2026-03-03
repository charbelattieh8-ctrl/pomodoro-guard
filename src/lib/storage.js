import { DEFAULT_THEMES } from "./themes";
import { STORAGE_KEY } from "./utils";

const DEFAULT_MILESTONES = [
  {
    id: "first_focus_session",
    title: "First Focus",
    description: "Complete your first focus session",
    type: "focusSessionsCompleted",
    target: 1,
    rewardCoins: 20,
  },
  {
    id: "ten_focus_sessions",
    title: "Focus Apprentice",
    description: "Complete 10 focus sessions",
    type: "focusSessionsCompleted",
    target: 10,
    rewardCoins: 50,
  },
  {
    id: "three_hundred_focus_minutes",
    title: "300 Focus Minutes",
    description: "Accumulate 300 completed focus minutes",
    type: "focusMinutesCompleted",
    target: 300,
    rewardCoins: 50,
  },
  {
    id: "seven_day_streak",
    title: "7 Day Streak",
    description: "Complete focus sessions for 7 consecutive days",
    type: "streakDays",
    target: 7,
    rewardCoins: 100,
  },
  {
    id: "focus_67_sessions",
    title: "Route 67",
    description: "Reach 67 completed focus sessions in total",
    type: "focusSessionsCompleted",
    target: 67,
    rewardCoins: 670,
  },
  {
    id: "focus_69_sessions",
    title: "Nice 69",
    description: "Complete exactly one 69-minute focus session.",
    type: "focusSessionsExactly69",
    target: 1,
    rewardCoins: 690,
  },
];

const DEFAULT_STATE = {
  version: 1,
  user: {
    displayName: "",
    preferences: {
      selectedThemeId: "theme_default_1",
      soundOn: true,
      notificationsOn: false,
      reduceMotion: false,
    },
    timer: {
      focusMinutes: 25,
      breakMinutes: 5,
      longBreakMinutes: 15,
      cyclesBeforeLongBreak: 4,
    },
  },
  economy: {
    coins: 0,
    earnedTotal: 0,
  },
  shop: {
    unlockedThemeIds: ["theme_default_1", "theme_default_2"],
  },
  milestones: {
    earnedBadgeIds: [],
    progress: {
      focusSessionsCompleted: 0,
      focusMinutesCompleted: 0,
      maxSingleFocusMinutes: 0,
      focusSessionsExactly69: 0,
      streakDays: 0,
      lastFocusCompletionDate: null,
      bestStreakDays: 0,
    },
  },
  sessions: {
    current: {
      mode: "focus",
      status: "idle",
      startedAt: null,
      endsAt: null,
      remainingMs: 25 * 60 * 1000,
      cycleCount: 0,
      sessionId: null,
    },
    history: [],
  },
  admin: {
    passcodeHash: "a7a057f8baea8970e940cec1bfc35ca3fc9a4f934570157178ef3aed98b7ad6a",
    config: {
      rewards: {
        coinsPerCompletedFocus: 10,
        bonusCoins: {
          firstSession: 20,
          tenSessions: 50,
          threeHundredMinutes: 50,
          sevenDayStreak: 100,
        },
      },
      themes: DEFAULT_THEMES,
      milestoneDefinitions: DEFAULT_MILESTONES,
    },
  },
};

export const createDefaultState = () => JSON.parse(JSON.stringify(DEFAULT_STATE));

const mergeThemes = (savedThemes, defaultThemes) => {
  const byId = new Map();
  for (const theme of savedThemes || []) byId.set(theme.id, theme);
  for (const theme of defaultThemes) {
    if (!byId.has(theme.id)) byId.set(theme.id, theme);
  }
  return Array.from(byId.values());
};

const mergeMilestoneDefinitions = (savedDefs, defaultDefs) => {
  const byId = new Map();
  for (const def of defaultDefs || []) byId.set(def.id, def);
  for (const def of savedDefs || []) {
    if (!def?.id) continue;
    const base = byId.get(def.id) || {};
    byId.set(def.id, { ...base, ...def });
  }

  // Force canonical behavior for built-in meme challenge so old local configs migrate.
  if (byId.has("focus_69_sessions")) {
    byId.set("focus_69_sessions", {
      ...byId.get("focus_69_sessions"),
      id: "focus_69_sessions",
      title: "Nice 69",
      description: "Complete exactly one 69-minute focus session.",
      type: "focusSessionsExactly69",
      target: 1,
      rewardCoins: 690,
    });
  }

  return Array.from(byId.values());
};

const mergeWithDefaults = (saved) => {
  const base = createDefaultState();
  return {
    ...base,
    ...saved,
    user: {
      ...base.user,
      ...saved?.user,
      preferences: { ...base.user.preferences, ...saved?.user?.preferences },
      timer: { ...base.user.timer, ...saved?.user?.timer },
    },
    economy: { ...base.economy, ...saved?.economy },
    shop: {
      ...base.shop,
      ...saved?.shop,
      unlockedThemeIds:
        saved?.shop?.unlockedThemeIds?.length > 0
          ? saved.shop.unlockedThemeIds
          : base.shop.unlockedThemeIds,
    },
    milestones: {
      ...base.milestones,
      ...saved?.milestones,
      progress: { ...base.milestones.progress, ...saved?.milestones?.progress },
    },
    sessions: {
      ...base.sessions,
      ...saved?.sessions,
      current: { ...base.sessions.current, ...saved?.sessions?.current },
      history: Array.isArray(saved?.sessions?.history)
        ? saved.sessions.history.slice(-200)
        : [],
    },
    admin: {
      ...base.admin,
      ...saved?.admin,
      config: {
        ...base.admin.config,
        ...saved?.admin?.config,
        rewards: {
          ...base.admin.config.rewards,
          ...saved?.admin?.config?.rewards,
          bonusCoins: {
            ...base.admin.config.rewards.bonusCoins,
            ...saved?.admin?.config?.rewards?.bonusCoins,
          },
        },
        themes:
          saved?.admin?.config?.themes?.length > 0
            ? mergeThemes(saved.admin.config.themes, base.admin.config.themes)
            : base.admin.config.themes,
        milestoneDefinitions:
          saved?.admin?.config?.milestoneDefinitions?.length > 0
            ? mergeMilestoneDefinitions(
                saved.admin.config.milestoneDefinitions,
                base.admin.config.milestoneDefinitions
              )
            : base.admin.config.milestoneDefinitions,
      },
    },
  };
};

export const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    return mergeWithDefaults(JSON.parse(raw));
  } catch {
    return createDefaultState();
  }
};

export const saveState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const readCache = loadState;
export const writeCache = saveState;
