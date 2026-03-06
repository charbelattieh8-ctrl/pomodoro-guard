import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Timer } from "lucide-react";
import PrimaryButton from "../components/PrimaryButton";
import StatCard from "../components/StatCard";
import StreakHero from "../components/StreakHero";
import LeaderboardCard from "../components/LeaderboardCard";
import GlassCard from "../components/GlassCard";
import { useAppState } from "../context/AppStateProvider";
import { useAuth } from "../context/AuthProvider";

function makeLast14(dailyStats) {
  const map = new Map(dailyStats.map((d) => [d.id, d]));
  const rows = [];
  const now = new Date();
  for (let i = 13; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    rows.push({ key, focused: map.has(key), minutes: map.get(key)?.focusMinutes || 0 });
  }
  return rows;
}

export default function DashboardPage() {
  const { state } = useAppState();
  const { leaderboard, dailyStats } = useAuth();
  const cells = makeLast14(dailyStats);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <StreakHero
        streakDays={state.milestones.progress.streakDays}
        bestStreakDays={state.milestones.progress.bestStreakDays}
      />

      <GlassCard className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-xl font-semibold">Last 14 days</h3>
          <Link to="/timer">
            <PrimaryButton className="flex items-center gap-2">
              <Timer size={16} /> Quick Start
            </PrimaryButton>
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-2">
          {cells.map((c) => (
            <div
              key={c.key}
              title={`${c.key} • ${c.minutes} min`}
              className={`rounded-lg border p-2 text-center text-xs ${
                c.focused
                  ? "border-emerald-200/50 bg-emerald-400/30"
                  : "border-white/15 bg-white/5"
              }`}
            >
              {c.key.slice(8)}
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Focus Sessions" value={state.milestones.progress.focusSessionsCompleted} />
        <StatCard title="Focus Minutes" value={state.milestones.progress.focusMinutesCompleted} />
        <StatCard title="Coins" value={state.economy.coins} />
      </div>

      <LeaderboardCard rows={leaderboard} />
    </motion.div>
  );
}
