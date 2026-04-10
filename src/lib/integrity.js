const INTEGRITY_KEY = "pg_integrity_v1";
const SECRET = ["p0m0", "d0r0", "_gu4rd", "_k3y"].join("");

function extractCriticalFields(state) {
  return JSON.stringify({
    c: state.economy?.coins ?? 0,
    et: state.economy?.earnedTotal ?? 0,
    eb: state.milestones?.earnedBadgeIds ?? [],
    ut: state.shop?.unlockedThemeIds ?? [],
    fs: state.milestones?.progress?.focusSessionsCompleted ?? 0,
    fm: state.milestones?.progress?.focusMinutesCompleted ?? 0,
    sd: state.milestones?.progress?.streakDays ?? 0,
  });
}

async function sha256(input) {
  const enc = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function computeStateHash(state) {
  return sha256(SECRET + extractCriticalFields(state));
}

export function saveIntegrity(hash) {
  try {
    localStorage.setItem(INTEGRITY_KEY, hash);
  } catch {
    // Silently fail if storage is full
  }
}

export function loadIntegrity() {
  try {
    return localStorage.getItem(INTEGRITY_KEY) || "";
  } catch {
    return "";
  }
}

/** Reset economy and milestone progress to safe defaults (keeps timer prefs). */
export function sanitizeState(state) {
  return {
    ...state,
    economy: { coins: 0, earnedTotal: 0 },
    shop: { ...state.shop, unlockedThemeIds: ["theme_default_1", "theme_default_2"] },
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
  };
}
