import GlassCard from "./GlassCard";
import { THEME_SCENE_ASSETS } from "../lib/themeSceneAssets";
import { buildSceneVars } from "./themeScenes/utils";

function ThemeSwatch({ theme }) {
  const fillStyle = theme.fillStyle ?? "water";
  const assets = THEME_SCENE_ASSETS[fillStyle] ?? {};
  const style = buildSceneVars(theme, {
    ...(assets.texture ? { "--preview-texture": `url(${assets.texture})` } : {}),
    ...(assets.emission ? { "--preview-emission": `url(${assets.emission})` } : {}),
  });

  return (
    <div className={`theme-preview-art theme-preview-${fillStyle}`} style={style}>
      <div className="theme-preview-backdrop absolute inset-0" />

      {fillStyle === "aurora" ? (
        <>
          <div className="theme-preview-stars absolute inset-0" />
          <div className="theme-preview-aurora theme-preview-aurora-1" />
          <div className="theme-preview-aurora theme-preview-aurora-2" />
          <div className="theme-preview-aurora theme-preview-aurora-3" />
          <div className="theme-preview-ice absolute inset-x-0 bottom-0 h-[38%]" />
        </>
      ) : (
        <>
          <div className="theme-preview-fill theme-preview-fill-back" />
          <div className="theme-preview-fill theme-preview-fill-front" />
          {fillStyle === "water" ? <div className="theme-preview-waterline absolute inset-x-0 bottom-[28%] h-6" /> : null}
          {fillStyle === "lava" ? <div className="theme-preview-emission absolute inset-0" /> : null}
          {fillStyle === "snow" ? <div className="theme-preview-frost absolute inset-0" /> : null}
          {fillStyle === "sand" ? <div className="theme-preview-dust absolute inset-0" /> : null}
        </>
      )}
    </div>
  );
}

export default function ThemePreview({ theme, selected, locked, children }) {
  return (
    <GlassCard className={`p-4 ${selected ? "ring-2 ring-white/70" : ""}`}>
      <ThemeSwatch theme={theme} />
      <div className="mt-3 flex items-center justify-between">
        <h4 className="font-semibold">{theme.name}</h4>
        <span className="text-xs text-slate-200">{locked ? `${theme.priceCoins} coins` : "Unlocked"}</span>
      </div>
      <div className="mt-3">{children}</div>
    </GlassCard>
  );
}
