import GlassCard from "./GlassCard";

export default function ThemePreview({ theme, selected, locked, children }) {
  const isPremium = theme.tier === "premium";
  const styleLabel =
    theme.fillStyle === "bubble"
      ? "Bubble Rise Fill"
      : theme.fillStyle === "frost"
        ? "Freezing Glass Fill"
        : theme.fillStyle === "snow"
          ? "Snowfall Pile-Up Fill"
          : theme.fillStyle === "grid"
            ? "Neon Grid Fill"
            : theme.fillStyle === "comet"
              ? "Comet Sweep Fill"
                : theme.fillStyle === "auroraBands"
                  ? "Aurora Band Fill"
                  : "Liquid Tide Fill";
  const showStyleLabel = isPremium || (theme.fillStyle && theme.fillStyle !== "tide");
  return (
    <GlassCard className={`p-4 md:p-5 ${selected ? "ring-2 ring-cyan-100/70 shadow-[0_18px_60px_rgba(125,211,252,0.18)]" : ""}`}>
      <div
        className="soft-vignette relative h-32 overflow-hidden rounded-[22px] border border-white/15"
        style={{
          background: `linear-gradient(135deg, ${theme.gradient.from}, ${theme.gradient.via}, ${theme.gradient.to})`,
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.28),transparent_34%,transparent_64%,rgba(255,255,255,0.1))]" />
        <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/82">
          {isPremium ? "Premium" : "Core"}
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h4 className="font-display text-xl font-semibold tracking-[-0.03em]">{theme.name}</h4>
          {showStyleLabel && <p className="mt-1 text-xs text-slate-300/90">{styleLabel}</p>}
        </div>
        <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-100/82">{locked ? `${theme.priceCoins} coins` : "Unlocked"}</span>
      </div>
      {isPremium && (
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-amber-200">
          Premium Background
        </p>
      )}
      <div className="mt-4">{children}</div>
    </GlassCard>
  );
}
