import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import { useAppState } from "../context/AppStateProvider";

export default function MilestonesPage() {
  const { milestoneCards } = useAppState();
  const earned = milestoneCards.filter((m) => m.earned);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="font-display text-2xl font-semibold">Milestones & Badges</h2>

      <div className="space-y-3">
        {milestoneCards.map((m) => (
          <GlassCard key={m.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{m.title}</h3>
                <p className="text-sm text-slate-200">{m.description}</p>
              </div>
              <span className="text-xs text-amber-200">+{m.rewardCoins} coins</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${Math.min(100, m.ratio * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-300">
              {m.current}/{m.target} {m.earned ? "• Earned" : m.completed ? "• Ready" : ""}
            </p>
          </GlassCard>
        ))}
      </div>

      <div>
        <h3 className="mb-3 font-display text-xl font-semibold">Earned Badges</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {earned.length === 0 && <p className="text-sm text-slate-200">No badges yet.</p>}
          {earned.map((badge, idx) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="glass rounded-xl p-4"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Badge</p>
              <p className="mt-2 font-semibold">{badge.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
