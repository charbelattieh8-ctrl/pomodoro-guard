import GlassCard from "./GlassCard";

export default function StreakHero({ streakDays, bestStreakDays }) {
  return (
    <GlassCard className="p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-amber-100/90">Streak Central</p>
      <h2 className="mt-2 font-display text-4xl font-semibold md:text-5xl">{streakDays} day streak</h2>
      <p className="mt-2 text-sm text-slate-100/90">Best: {bestStreakDays} days</p>
    </GlassCard>
  );
}
