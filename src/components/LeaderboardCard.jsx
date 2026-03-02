import GlassCard from "./GlassCard";

export default function LeaderboardCard({ rows }) {
  return (
    <GlassCard className="p-4">
      <h3 className="font-display text-xl font-semibold">Friends Leaderboard</h3>
      <div className="mt-3 space-y-2">
        {rows.length === 0 && <p className="text-sm text-slate-200">No friends yet.</p>}
        {rows.map((friend) => (
          <div key={friend.id} className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-2">
            <div>
              <p className="font-semibold">@{friend.username || friend.displayName || "user"}</p>
              <p className="text-xs text-slate-300">Best {friend.bestStreakDays || 0} days</p>
            </div>
            <p className="text-lg font-semibold text-amber-100">{friend.streakDays || 0}??</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
