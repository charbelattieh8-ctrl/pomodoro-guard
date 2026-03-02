import GlassCard from "./GlassCard";

export default function ThemePreview({ theme, selected, locked, children }) {
  return (
    <GlassCard className={`p-4 ${selected ? "ring-2 ring-white/70" : ""}`}>
      <div
        className="h-24 rounded-xl"
        style={{
          background: `linear-gradient(135deg, ${theme.gradient.from}, ${theme.gradient.via}, ${theme.gradient.to})`,
        }}
      />
      <div className="mt-3 flex items-center justify-between">
        <h4 className="font-semibold">{theme.name}</h4>
        <span className="text-xs text-slate-200">{locked ? `${theme.priceCoins} coins` : "Unlocked"}</span>
      </div>
      <div className="mt-3">{children}</div>
    </GlassCard>
  );
}
