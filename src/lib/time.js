import { clamp } from "./utils";

export const getModeMinutes = (timer, mode) => {
  if (mode === "break") return timer.breakMinutes;
  if (mode === "longBreak") return timer.longBreakMinutes;
  return timer.focusMinutes;
};

export const modeFromCycle = (cycleCount, cyclesBeforeLongBreak) => {
  if (cycleCount > 0 && cycleCount % cyclesBeforeLongBreak === 0) {
    return "longBreak";
  }
  return "break";
};

export const calcRemainingMs = (current, now = Date.now()) => {
  if (current.status === "running" && current.endsAt) {
    return clamp(current.endsAt - now, 0, Number.MAX_SAFE_INTEGER);
  }
  return Math.max(0, current.remainingMs);
};

export const calcSessionProgress = (current, timer, now = Date.now()) => {
  const totalMs = getModeMinutes(timer, current.mode) * 60 * 1000;
  if (!totalMs) return 0;
  const remainingMs = calcRemainingMs(current, now);
  return clamp((totalMs - remainingMs) / totalMs, 0, 1);
};
