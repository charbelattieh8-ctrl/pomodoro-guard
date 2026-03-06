import GlassCard from "./GlassCard";

export default function StatCard({ title, value, icon }) {
  return (
    <GlassCard className="p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Snapshot</p>
          <h3 className="mt-2 text-sm font-medium text-slate-200/90">{title}</h3>
        </div>
        <div className="surface-muted rounded-2xl p-3 text-slate-100/90">
          {icon || <span className="block h-2.5 w-2.5 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(125,211,252,0.7)]" />}
        </div>
      </div>
      <p className="mt-8 font-display text-4xl font-semibold tracking-[-0.04em] md:text-[2.8rem]">{value}</p>
      <p className="mt-2 text-sm text-slate-300/80">Keep the rhythm. Small consistent sessions compound fast.</p>
    </GlassCard>
  );
}
