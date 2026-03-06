import GlassCard from "./GlassCard";

export default function LeaderboardCard({ rows }) {
  return (
    <GlassCard className="p-5 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Social Heat</p>
          <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em]">Friends Leaderboard</h3>
        </div>
        <p className="text-sm text-slate-300/80">Stack streaks together and keep each other honest.</p>
      </div>

      <div className="mt-5 space-y-3">
        {rows.length === 0 && <p className="rounded-2xl border border-dashed border-white/15 px-4 py-5 text-sm text-slate-200/85">No friends yet.</p>}
        {rows.map((friend, index) => (
          <div key={friend.id} className="surface-muted flex items-center justify-between rounded-2xl px-4 py-3">
            <div className="flex items-center gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-white/20 to-white/5 text-sm font-bold text-white">
                #{index + 1}
              </div>
              <div>
                <p className="font-semibold text-white">@{friend.username || friend.displayName || "user"}</p>
                <p className="text-xs text-slate-300">Best {friend.bestStreakDays || 0} days</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-semibold tracking-[-0.04em] text-amber-100">{friend.streakDays || 0}</p>
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">streak</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
