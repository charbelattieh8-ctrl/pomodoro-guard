import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import GlassCard from "../components/GlassCard";
import StatCard from "../components/StatCard";
import { useAppState } from "../context/AppStateProvider";
import { toLocalISODate } from "../lib/utils";

const build7Days = () => {
  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const iso = toLocalISODate(d.getTime());
    days.push({ iso, day: iso.slice(5), focusMinutes: 0, coinsEarned: 0 });
  }
  return days;
};

export default function StatsPage() {
  const { state } = useAppState();
  const history = state.sessions.history;

  const bars = build7Days();
  const dayMap = Object.fromEntries(bars.map((d) => [d.iso, d]));

  history.forEach((entry) => {
    if (entry.mode === "focus" && entry.completed) {
      const iso = toLocalISODate(entry.endedAt);
      if (dayMap[iso]) {
        dayMap[iso].focusMinutes += Number(entry.actualMinutes || entry.plannedMinutes || 0);
      }
    }
  });

  let cumulative = 0;
  const coinsLine = bars.map((b) => {
    const sessionsDone = b.focusMinutes / Math.max(1, state.user.timer.focusMinutes);
    cumulative += Math.round(sessionsDone * state.admin.config.rewards.coinsPerCompletedFocus);
    return { day: b.day, coins: cumulative };
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="font-display text-2xl font-semibold">Stats</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Coins" value={state.economy.coins} />
        <StatCard title="Earned Total" value={state.economy.earnedTotal} />
        <StatCard title="Current Streak" value={`${state.milestones.progress.streakDays} days`} />
        <StatCard title="Best Streak" value={`${state.milestones.progress.bestStreakDays} days`} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="h-80 p-4">
          <p className="mb-4 font-semibold">Focus Minutes (Last 7 Days)</p>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={bars}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.18)" />
              <XAxis dataKey="day" stroke="#e2e8f0" />
              <YAxis stroke="#e2e8f0" />
              <Tooltip />
              <Bar dataKey="focusMinutes" fill="#f8fafc" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="h-80 p-4">
          <p className="mb-4 font-semibold">Coins Earned (Cumulative)</p>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={coinsLine}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.18)" />
              <XAxis dataKey="day" stroke="#e2e8f0" />
              <YAxis stroke="#e2e8f0" />
              <Tooltip />
              <Line type="monotone" dataKey="coins" stroke="#f8fafc" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </motion.div>
  );
}
