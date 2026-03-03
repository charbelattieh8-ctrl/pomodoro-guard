import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { addCoins, canAfford } from "../lib/economy";
import { collectNewMilestones, computeMilestoneProgress } from "../lib/milestones";
import { loadState, saveState, createDefaultState, writeCache } from "../lib/storage";
import { calcRemainingMs, calcSessionProgress, getModeMinutes, modeFromCycle } from "../lib/time";
import { themeById } from "../lib/themes";
import { getYesterdayISO, toLocalISODate, uid } from "../lib/utils";
import { useAuth } from "./AuthProvider";
import { db } from "../lib/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { completeFocusToCloud } from "../lib/firestore";

const AppStateContext = createContext(null);

const keepHistory200 = (history) => history.slice(-200);

const appendHistoryEntry = (history, entry) => keepHistory200([...history, entry]);

const finalizeStreak = (progress, dateISO) => {
  const prev = progress.lastFocusCompletionDate;
  if (!prev) {
    return {
      ...progress,
      streakDays: 1,
      bestStreakDays: Math.max(progress.bestStreakDays, 1),
      lastFocusCompletionDate: dateISO,
    };
  }
  if (prev === dateISO) {
    return { ...progress };
  }
  const yesterday = getYesterdayISO(dateISO);
  const streakDays = prev === yesterday ? progress.streakDays + 1 : 1;
  return {
    ...progress,
    streakDays,
    bestStreakDays: Math.max(progress.bestStreakDays, streakDays),
    lastFocusCompletionDate: dateISO,
  };
};

export function AppStateProvider({ children }) {
  const { user, profile } = useAuth();
  const [state, setState] = useState(() => loadState());
  const [now, setNow] = useState(Date.now());
  const [toasts, setToasts] = useState([]);
  const [celebration, setCelebration] = useState(null);
  const completionLockRef = useRef(false);
  const lastCelebratedHistoryIdRef = useRef(
    state.sessions.history[state.sessions.history.length - 1]?.id ?? null
  );
  const prevCoinsRef = useRef(state.economy.coins);
  const syncedCloudSessionIdsRef = useRef(new Set());

  useEffect(() => {
    saveState(state);
    writeCache(state);
  }, [state]);

  useEffect(() => {
    const isRunning = state.sessions.current.status === "running";
    const intervalMs = isRunning ? 250 : 1400;
    const interval = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => {
      clearInterval(interval);
    };
  }, [state.sessions.current.status]);

  const addToast = useCallback((message, type = "info") => {
    const id = uid();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (!celebration) return undefined;
    const t = setTimeout(() => setCelebration(null), 2200);
    return () => clearTimeout(t);
  }, [celebration]);

  useEffect(() => {
    if (!db || !user || !profile || profile.migratedLocal) return;
    const local = loadState();
    setDoc(
      doc(db, "users", user.uid),
      {
        streakDays: Math.max(Number(profile.streakDays || 0), Number(local.milestones.progress.streakDays || 0)),
        bestStreakDays: Math.max(
          Number(profile.bestStreakDays || 0),
          Number(local.milestones.progress.bestStreakDays || 0)
        ),
        focusSessionsCompleted: Math.max(
          Number(profile.focusSessionsCompleted || 0),
          Number(local.milestones.progress.focusSessionsCompleted || 0)
        ),
        focusMinutesCompleted: Math.max(
          Number(profile.focusMinutesCompleted || 0),
          Number(local.milestones.progress.focusMinutesCompleted || 0)
        ),
        coins: Math.max(Number(profile.coins || 0), Number(local.economy.coins || 0)),
        earnedTotal: Math.max(Number(profile.earnedTotal || 0), Number(local.economy.earnedTotal || 0)),
        migratedLocal: true,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }, [user, profile]);

  useEffect(() => {
    if (!profile) return;
    setState((prev) => ({
      ...prev,
      economy: {
        ...prev.economy,
        coins: Number(profile.coins ?? prev.economy.coins),
        earnedTotal: Number(profile.earnedTotal ?? prev.economy.earnedTotal),
      },
      milestones: {
        ...prev.milestones,
        progress: {
          ...prev.milestones.progress,
          streakDays: Number(profile.streakDays ?? prev.milestones.progress.streakDays),
          bestStreakDays: Number(profile.bestStreakDays ?? prev.milestones.progress.bestStreakDays),
          focusSessionsCompleted: Number(
            profile.focusSessionsCompleted ?? prev.milestones.progress.focusSessionsCompleted
          ),
          focusMinutesCompleted: Number(
            profile.focusMinutesCompleted ?? prev.milestones.progress.focusMinutesCompleted
          ),
          lastFocusCompletionDate:
            profile.lastFocusCompletionDate ?? prev.milestones.progress.lastFocusCompletionDate,
        },
      },
    }));
  }, [profile]);

  useEffect(() => {
    if (!db || !user) return undefined;
    const timer = setTimeout(() => {
      setDoc(
        doc(db, "users", user.uid),
        {
          streakDays: Number(state.milestones.progress.streakDays || 0),
          bestStreakDays: Number(state.milestones.progress.bestStreakDays || 0),
          focusSessionsCompleted: Number(state.milestones.progress.focusSessionsCompleted || 0),
          focusMinutesCompleted: Number(state.milestones.progress.focusMinutesCompleted || 0),
          coins: Number(state.economy.coins || 0),
          earnedTotal: Number(state.economy.earnedTotal || 0),
          lastSeenAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }, 700);
    return () => clearTimeout(timer);
  }, [
    user,
    state.milestones.progress.streakDays,
    state.milestones.progress.bestStreakDays,
    state.milestones.progress.focusSessionsCompleted,
    state.milestones.progress.focusMinutesCompleted,
    state.economy.coins,
    state.economy.earnedTotal,
  ]);

  useEffect(() => {
    const history = state.sessions.history;
    if (!history.length) {
      prevCoinsRef.current = state.economy.coins;
      return;
    }
    const latest = history[history.length - 1];
    if (
      latest.id !== lastCelebratedHistoryIdRef.current &&
      latest.mode === "focus" &&
      latest.completed
    ) {
      const deltaCoins = Math.max(0, state.economy.coins - prevCoinsRef.current);
      const coins =
        deltaCoins > 0 ? deltaCoins : Number(state.admin.config.rewards.coinsPerCompletedFocus || 0);
      setCelebration({
        id: uid(),
        title: "Focus complete",
        subtitle:
          state.sessions.current.mode === "longBreak"
            ? "Great work. Long break unlocked."
            : "Great work. Break time.",
        coins,
      });
      addToast(`Focus complete • +${coins} coins`, "success");
      lastCelebratedHistoryIdRef.current = latest.id;
    }
    prevCoinsRef.current = state.economy.coins;
  }, [
    state.sessions.history,
    state.sessions.current.mode,
    state.economy.coins,
    state.admin.config.rewards.coinsPerCompletedFocus,
    addToast,
  ]);

  useEffect(() => {
    if (!db || !user) return;
    const history = state.sessions.history;
    if (!history.length) return;
    const latest = history[history.length - 1];
    if (!latest || latest.mode !== "focus" || !latest.completed) return;
    if (syncedCloudSessionIdsRef.current.has(latest.id)) return;

    const coinDelta = Math.max(0, state.economy.coins - prevCoinsRef.current);
    const coinsAwarded = coinDelta || Number(state.admin.config.rewards.coinsPerCompletedFocus || 0);

    completeFocusToCloud({
      db,
      uid: user.uid,
      session: latest,
      coinsAwarded,
      streakDays: state.milestones.progress.streakDays,
      bestStreakDays: state.milestones.progress.bestStreakDays,
      lastFocusCompletionDate: state.milestones.progress.lastFocusCompletionDate,
    })
      .then(() => {
        syncedCloudSessionIdsRef.current.add(latest.id);
      })
      .catch(() => {});
  }, [
    user,
    state.sessions.history,
    state.economy.coins,
    state.admin.config.rewards.coinsPerCompletedFocus,
    state.milestones.progress.streakDays,
    state.milestones.progress.bestStreakDays,
    state.milestones.progress.lastFocusCompletionDate,
  ]);

  const activeTheme = useMemo(() => {
    const themes = state.admin.config.themes;
    return themeById(themes, state.user.preferences.selectedThemeId);
  }, [state.admin.config.themes, state.user.preferences.selectedThemeId]);

  const currentRemainingMs = useMemo(
    () => calcRemainingMs(state.sessions.current, now),
    [state.sessions.current, now]
  );

  const sessionProgress = useMemo(
    () => calcSessionProgress(state.sessions.current, state.user.timer, now),
    [state.sessions.current, state.user.timer, now]
  );

  const milestoneCards = useMemo(
    () =>
      computeMilestoneProgress(
        state.admin.config.milestoneDefinitions,
        state.milestones.progress,
        state.milestones.earnedBadgeIds
      ),
    [
      state.admin.config.milestoneDefinitions,
      state.milestones.progress,
      state.milestones.earnedBadgeIds,
    ]
  );

  const resetCurrentForMode = useCallback((mode, timerSettings, cycleCount = 0) => {
    return {
      mode,
      status: "idle",
      startedAt: null,
      endsAt: null,
      remainingMs: getModeMinutes(timerSettings, mode) * 60 * 1000,
      cycleCount,
      sessionId: null,
    };
  }, []);

  const startTimer = useCallback(() => {
    setState((prev) => {
      const current = prev.sessions.current;
      if (current.status === "running") return prev;
      const durationMs =
        current.status === "paused"
          ? current.remainingMs
          : getModeMinutes(prev.user.timer, current.mode) * 60 * 1000;
      const startAt = Date.now();
      return {
        ...prev,
        sessions: {
          ...prev.sessions,
          current: {
            ...current,
            status: "running",
            startedAt: current.startedAt ?? startAt,
            sessionId: current.sessionId ?? uid(),
            endsAt: startAt + durationMs,
            remainingMs: durationMs,
          },
        },
      };
    });
  }, []);

  const pauseTimer = useCallback(() => {
    setState((prev) => {
      const current = prev.sessions.current;
      if (current.status !== "running") return prev;
      return {
        ...prev,
        sessions: {
          ...prev.sessions,
          current: {
            ...current,
            status: "paused",
            remainingMs: calcRemainingMs(current),
            endsAt: null,
          },
        },
      };
    });
  }, []);

  const resumeTimer = useCallback(() => {
    setState((prev) => {
      const current = prev.sessions.current;
      if (current.status !== "paused") return prev;
      const startAt = Date.now();
      return {
        ...prev,
        sessions: {
          ...prev.sessions,
          current: {
            ...current,
            status: "running",
            startedAt: current.startedAt ?? startAt,
            sessionId: current.sessionId ?? uid(),
            endsAt: startAt + current.remainingMs,
          },
        },
      };
    });
  }, []);

  const resetTimer = useCallback(() => {
    setState((prev) => {
      const current = prev.sessions.current;
      let history = prev.sessions.history;
      if (current.startedAt && current.sessionId) {
        history = appendHistoryEntry(history, {
          id: current.sessionId,
          mode: current.mode,
          startedAt: current.startedAt,
          endedAt: Date.now(),
          plannedMinutes: getModeMinutes(prev.user.timer, current.mode),
          actualMinutes: Math.floor((Date.now() - current.startedAt) / 60000),
          completed: false,
        });
      }
      return {
        ...prev,
        sessions: {
          ...prev.sessions,
          history,
          current: resetCurrentForMode(current.mode, prev.user.timer, current.cycleCount),
        },
      };
    });
  }, [resetCurrentForMode]);

  const moveToNextPhase = useCallback(
    (prev, completedFocus) => {
      const current = prev.sessions.current;
      let nextMode = "focus";
      let cycleCount = current.cycleCount;

      if (current.mode === "focus") {
        if (completedFocus) {
          cycleCount += 1;
        }
        nextMode = modeFromCycle(cycleCount, prev.user.timer.cyclesBeforeLongBreak);
      } else {
        nextMode = "focus";
        if (current.mode === "longBreak") {
          cycleCount = 0;
        }
      }

      return resetCurrentForMode(nextMode, prev.user.timer, cycleCount);
    },
    [resetCurrentForMode]
  );

  const completeCurrentSession = useCallback(
    (naturallyCompleted = true) => {
      setState((prev) => {
        const current = prev.sessions.current;
        if (!current.startedAt || !current.sessionId) {
          return {
            ...prev,
            sessions: {
              ...prev.sessions,
              current: moveToNextPhase(prev, false),
            },
          };
        }

        const endAt = Date.now();
        const plannedMinutes = getModeMinutes(prev.user.timer, current.mode);
        const actualMinutes = naturallyCompleted
          ? plannedMinutes
          : Math.max(0, Math.floor((endAt - current.startedAt) / 60000));

        let next = {
          ...prev,
          sessions: {
            ...prev.sessions,
            history: appendHistoryEntry(prev.sessions.history, {
              id: current.sessionId,
              mode: current.mode,
              startedAt: current.startedAt,
              endedAt: endAt,
              plannedMinutes,
              actualMinutes,
              completed: naturallyCompleted,
            }),
          },
        };

        if (naturallyCompleted && current.mode === "focus") {
          next.economy = addCoins(
            next.economy,
            Number(next.admin.config.rewards.coinsPerCompletedFocus || 0)
          );

          const dateISO = toLocalISODate(endAt);
          let progress = {
            ...next.milestones.progress,
            focusSessionsCompleted: next.milestones.progress.focusSessionsCompleted + 1,
            focusMinutesCompleted: next.milestones.progress.focusMinutesCompleted + plannedMinutes,
            maxSingleFocusMinutes: Math.max(
              Number(next.milestones.progress.maxSingleFocusMinutes || 0),
              Number(plannedMinutes || 0)
            ),
          };
          progress = finalizeStreak(progress, dateISO);
          next.milestones = {
            ...next.milestones,
            progress,
          };

          const unlocked = collectNewMilestones({
            definitions: next.admin.config.milestoneDefinitions,
            progress,
            earnedBadgeIds: next.milestones.earnedBadgeIds,
          });
          if (unlocked.length > 0) {
            next = {
              ...next,
              milestones: {
                ...next.milestones,
                earnedBadgeIds: [
                  ...next.milestones.earnedBadgeIds,
                  ...unlocked.map((x) => x.id),
                ],
              },
              economy: unlocked.reduce(
                (acc, item) => addCoins(acc, Number(item.rewardCoins || 0)),
                next.economy
              ),
            };
          }
        }

        next.sessions.current = moveToNextPhase(next, naturallyCompleted && current.mode === "focus");
        return next;
      });
    },
    [moveToNextPhase]
  );

  const skipPhase = useCallback(() => {
    completeCurrentSession(false);
  }, [completeCurrentSession]);

  useEffect(() => {
    const current = state.sessions.current;
    if (current.status !== "running") {
      completionLockRef.current = false;
      return;
    }
    if (current.endsAt && current.endsAt <= now && !completionLockRef.current) {
      completionLockRef.current = true;
      completeCurrentSession(true);
    }
  }, [state.sessions.current, now, completeCurrentSession]);

  const selectTheme = useCallback(
    (themeId) => {
      setState((prev) => {
        if (!prev.shop.unlockedThemeIds.includes(themeId)) return prev;
        return {
          ...prev,
          user: {
            ...prev.user,
            preferences: {
              ...prev.user.preferences,
              selectedThemeId: themeId,
            },
          },
        };
      });
    },
    []
  );

  const unlockTheme = useCallback(
    (themeId) => {
      setState((prev) => {
        const theme = prev.admin.config.themes.find((t) => t.id === themeId);
        if (!theme) return prev;
        if (prev.shop.unlockedThemeIds.includes(themeId)) return prev;
        if (!canAfford(prev.economy.coins, theme.priceCoins)) return prev;
        return {
          ...prev,
          economy: { ...prev.economy, coins: prev.economy.coins - theme.priceCoins },
          shop: {
            ...prev.shop,
            unlockedThemeIds: [...prev.shop.unlockedThemeIds, themeId],
          },
        };
      });
      addToast("Theme unlocked", "success");
    },
    [addToast]
  );

  const updateUserTimerSettings = useCallback((patch) => {
    setState((prev) => {
      const nextRaw = { ...prev.user.timer, ...patch };
      const timer = {
        ...nextRaw,
        focusMinutes: Number(nextRaw.focusMinutes),
        breakMinutes: Number(nextRaw.breakMinutes),
        longBreakMinutes: Number(nextRaw.longBreakMinutes),
        cyclesBeforeLongBreak: Number(nextRaw.cyclesBeforeLongBreak),
      };
      const mode = prev.sessions.current.mode;
      const shouldResetRemaining = prev.sessions.current.status === "idle";
      return {
        ...prev,
        user: { ...prev.user, timer },
        sessions: {
          ...prev.sessions,
          current: {
            ...prev.sessions.current,
            remainingMs: shouldResetRemaining
              ? getModeMinutes(timer, mode) * 60 * 1000
              : prev.sessions.current.remainingMs,
          },
        },
      };
    });
  }, []);

  const updatePreferences = useCallback((patch) => {
    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        preferences: { ...prev.user.preferences, ...patch },
      },
    }));
  }, []);

  const adminUpdateConfig = useCallback((patch) => {
    setState((prev) => ({
      ...prev,
      admin: {
        ...prev.admin,
        config: {
          ...prev.admin.config,
          ...patch,
          rewards: {
            ...prev.admin.config.rewards,
            ...(patch.rewards || {}),
            bonusCoins: {
              ...prev.admin.config.rewards.bonusCoins,
              ...(patch.rewards?.bonusCoins || {}),
            },
          },
        },
      },
    }));
    addToast("Admin config saved", "success");
  }, [addToast]);

  const adminSetPasscodeHash = useCallback((passcodeHash) => {
    setState((prev) => ({
      ...prev,
      admin: {
        ...prev.admin,
        passcodeHash,
      },
    }));
  }, []);

  const adminResetData = useCallback(() => {
    const fresh = createDefaultState();
    setState(fresh);
    addToast("App data reset", "warning");
  }, [addToast]);

  const adminGrantCoins = useCallback(
    (amount) => {
      const safeAmount = Math.max(0, Number(amount) || 0);
      if (safeAmount <= 0) return;
      setState((prev) => ({
        ...prev,
        economy: addCoins(prev.economy, safeAmount),
      }));
      addToast(`Granted ${safeAmount} coins`, "success");
    },
    [addToast]
  );

  const value = {
    state,
    now,
    toasts,
    activeTheme,
    currentRemainingMs,
    sessionProgress,
    milestoneCards,
    celebration,
    addToast,
    removeToast,
    actions: {
      startTimer,
      pauseTimer,
      resumeTimer,
      resetTimer,
      skipPhase,
      selectTheme,
      unlockTheme,
      updateUserTimerSettings,
      updatePreferences,
      adminUpdateConfig,
      adminResetData,
      adminSetPasscodeHash,
      adminGrantCoins,
    },
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
};
