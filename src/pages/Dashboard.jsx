import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Flame, Sparkles, Timer, Trophy, Wallet } from "lucide-react";
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <StreakHero
        streakDays={state.milestones.progress.streakDays}
        bestStreakDays={state.milestones.progress.bestStreakDays}
      />

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <GlassCard className="relative overflow-hidden p-5 md:p-6">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Consistency Map</p>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em]">Last 14 days</h3>
              <p className="mt-2 text-sm text-slate-300/82">A quick read on how stable your focus rhythm has been recently.</p>
            </div>
            <Link to="/timer">
              <PrimaryButton className="flex items-center gap-2">
                <Timer size={16} /> Quick Start
              </PrimaryButton>
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-7 gap-2.5">
            {cells.map((c) => (
              <div
                key={c.key}
                title={`${c.key} • ${c.minutes} min`}
                className={`rounded-2xl border p-3 text-center transition ${
                  c.focused
                    ? "border-emerald-100/45 bg-gradient-to-b from-emerald-300/30 to-emerald-500/14 shadow-[0_8px_24px_rgba(16,185,129,0.15)]"
                    : "border-white/10 bg-white/[0.04]"
                }`}
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-300/70">{c.key.slice(5, 7)}</p>
                <p className="mt-2 font-display text-xl font-semibold tracking-[-0.04em]">{c.key.slice(8)}</p>
                <p className="mt-1 text-[11px] text-slate-300/80">{c.minutes} min</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5 md:p-6">
          <p className="eyebrow">Pulse</p>
          <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em]">Today at a glance</h3>
          <div className="mt-5 space-y-3">
            <div className="surface-muted rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <Flame size={16} className="text-amber-200" />
                <p className="text-sm font-medium text-slate-100/90">Current streak</p>
              </div>
              <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">{state.milestones.progress.streakDays} days</p>
            </div>
            <div className="surface-muted rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <Wallet size={16} className="text-cyan-100" />
                <p className="text-sm font-medium text-slate-100/90">Coins ready</p>
              </div>
              <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">{state.economy.coins}</p>
            </div>
            <div className="surface-muted rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <Sparkles size={16} className="text-violet-200" />
                <p className="text-sm font-medium text-slate-100/90">Focus sessions</p>
              </div>
              <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">{state.milestones.progress.focusSessionsCompleted}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Focus Sessions" value={state.milestones.progress.focusSessionsCompleted} icon={<Sparkles size={18} />} />
        <StatCard title="Focus Minutes" value={state.milestones.progress.focusMinutesCompleted} icon={<Timer size={18} />} />
        <StatCard title="Coins" value={state.economy.coins} icon={<Trophy size={18} />} />
      </div>

      <GlassCard className="p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Quick Launch</p>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em]">Keep momentum easy</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/timer">
              <PrimaryButton className="flex items-center gap-2">
                <Timer size={16} /> Open Timer
              </PrimaryButton>
            </Link>
            <Link to="/shop">
              <PrimaryButton variant="ghost">Browse Themes</PrimaryButton>
            </Link>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="surface-muted rounded-2xl p-4">
            <p className="eyebrow text-[0.62rem]">Tip</p>
            <p className="mt-2 text-sm text-slate-100/88">Use the timer as your default landing point before starting work.</p>
          </div>
          <div className="surface-muted rounded-2xl p-4">
            <p className="eyebrow text-[0.62rem]">Shop</p>
            <p className="mt-2 text-sm text-slate-100/88">Unlock backgrounds only after your routine is stable.</p>
          </div>
          <div className="surface-muted rounded-2xl p-4">
            <p className="eyebrow text-[0.62rem]">Social</p>
            <p className="mt-2 text-sm text-slate-100/88">Friendly accountability works best when the habit already exists.</p>
          </div>
        </div>
      </GlassCard>

      <LeaderboardCard rows={leaderboard} />
    </motion.div>
  );
}
