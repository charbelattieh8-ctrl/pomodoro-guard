export const STORAGE_KEY = "pomodoro_guard_state_v1";

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const uid = () =>
  `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;

export const toLocalISODate = (value = Date.now()) => {
  const d = new Date(value);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const getYesterdayISO = (isoDate) => {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setDate(d.getDate() - 1);
  return toLocalISODate(d.getTime());
};

export const formatMs = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

export const shallowMerge = (base, patch) => ({ ...base, ...patch });

export const hashStringSHA256 = async (input) => {
  const enc = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};
