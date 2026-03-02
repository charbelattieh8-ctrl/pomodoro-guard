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
import { loadState, saveState, createDefaultState } from "../lib/storage";
import { calcRemainingMs, calcSessionProgress, getModeMinutes, modeFromCycle } from "../lib/time";
import { themeById } from "../lib/themes";
import { getYesterdayISO, toLocalISODate, uid } from "../lib/utils";

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
  const [state, setState] = useState(() => loadState());
  const [now, setNow] = useState(Date.now());
  const [toasts, setToasts] = useState([]);
  const completionLockRef = useRef(false);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    let raf = 0;
    let interval = 0;
    const tick = () => {
      setNow(Date.now());
      raf = requestAnimationFrame(tick);
    };
    tick();
    interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(interval);
    };
  }, []);

  const addToast = useCallback((message, type = "info") => {
    const id = uid();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

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
          next.economy = addCoins(next.economy, next.admin.config.rewards.coinsPerCompletedFocus);

          const dateISO = toLocalISODate(endAt);
          let progress = {
            ...next.milestones.progress,
            focusSessionsCompleted: next.milestones.progress.focusSessionsCompleted + 1,
            focusMinutesCompleted: next.milestones.progress.focusMinutesCompleted + plannedMinutes,
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
      addToast(`${current.mode === "focus" ? "Focus" : "Break"} complete`, "success");
    }
  }, [state.sessions.current, now, completeCurrentSession, addToast]);

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
    addToast,
    removeToast: (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
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
