import GlassCard from "./GlassCard";

export default function StreakHero({ streakDays, bestStreakDays }) {
  return (
    <GlassCard className="relative overflow-hidden p-6 md:p-8">
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top,rgba(253,224,71,0.18),transparent_58%)] opacity-90" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="eyebrow text-amber-100/80">Momentum Engine</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
            {streakDays} day streak
          </h2>
          <p className="mt-3 max-w-lg text-sm text-slate-100/88 md:text-base">
            You are building a repeatable rhythm. Protect the streak today and the rest of the week gets easier.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:min-w-[320px]">
          <div className="surface-muted rounded-2xl p-4">
            <p className="eyebrow text-[0.64rem]">Current Run</p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em]">{streakDays}</p>
            <p className="mt-1 text-sm text-slate-300/80">days in motion</p>
          </div>
          <div className="surface-muted rounded-2xl p-4">
            <p className="eyebrow text-[0.64rem]">Best Ever</p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em]">{bestStreakDays}</p>
            <p className="mt-1 text-sm text-slate-300/80">days reached</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
