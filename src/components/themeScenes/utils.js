const DEFAULT_FILL_PALETTE = {
  base: "#0891b2",
  light: "#67e8f9",
  crest: "#a5f3fc",
  deep: "#082f49",
};

export function clamp01(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(1, numeric));
}

export function hexToRgb(hex) {
  const raw = String(hex || "").replace("#", "").trim();
  const normalized =
    raw.length === 3
      ? raw
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : raw.padStart(6, "0").slice(0, 6);
  const value = Number.parseInt(normalized, 16);

  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
}

export function getThemePalette(theme) {
  return theme?.fill ?? theme?.water ?? DEFAULT_FILL_PALETTE;
}

export function buildSceneVars(theme, extra = {}) {
  const palette = getThemePalette(theme);
  const accent = theme?.accent ?? palette.light;
  const gradient = theme?.gradient ?? {
    from: palette.deep,
    via: palette.base,
    to: palette.base,
  };

  return {
    "--scene-base": palette.base,
    "--scene-base-rgb": hexToRgb(palette.base),
    "--scene-light": palette.light,
    "--scene-light-rgb": hexToRgb(palette.light),
    "--scene-crest": palette.crest,
    "--scene-crest-rgb": hexToRgb(palette.crest),
    "--scene-deep": palette.deep,
    "--scene-deep-rgb": hexToRgb(palette.deep),
    "--scene-accent": accent,
    "--scene-accent-rgb": hexToRgb(accent),
    "--scene-gradient-from": gradient.from,
    "--scene-gradient-via": gradient.via,
    "--scene-gradient-to": gradient.to,
    ...extra,
  };
}
