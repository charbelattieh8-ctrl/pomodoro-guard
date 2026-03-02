import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import Toggle from "../components/Toggle";
import { useAppState } from "../context/AppStateProvider";

export default function SettingsPage() {
  const { state, actions } = useAppState();
  const timer = state.user.timer;
  const prefs = state.user.preferences;
  const inputClass =
    "mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 outline-none transition focus:border-white/40";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="font-display text-2xl font-semibold">Settings</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="space-y-4 p-4">
          <h3 className="font-semibold">Timer Durations</h3>
          <label className="block text-sm text-slate-100">
            Focus Minutes
            <input
              className={inputClass}
              type="number"
              value={timer.focusMinutes === 0 ? "" : timer.focusMinutes}
              onChange={(e) => actions.updateUserTimerSettings({ focusMinutes: Number(e.target.value) })}
            />
          </label>
          <label className="block text-sm text-slate-100">
            Break Minutes
            <input
              className={inputClass}
              type="number"
              value={timer.breakMinutes === 0 ? "" : timer.breakMinutes}
              onChange={(e) => actions.updateUserTimerSettings({ breakMinutes: Number(e.target.value) })}
            />
          </label>
          <label className="block text-sm text-slate-100">
            Long Break Minutes
            <input
              className={inputClass}
              type="number"
              value={timer.longBreakMinutes === 0 ? "" : timer.longBreakMinutes}
              onChange={(e) => actions.updateUserTimerSettings({ longBreakMinutes: Number(e.target.value) })}
            />
          </label>
          <label className="block text-sm text-slate-100">
            Cycles Before Long Break
            <input
              className={inputClass}
              type="number"
              value={timer.cyclesBeforeLongBreak === 0 ? "" : timer.cyclesBeforeLongBreak}
              onChange={(e) =>
                actions.updateUserTimerSettings({ cyclesBeforeLongBreak: Number(e.target.value) })
              }
            />
          </label>
        </GlassCard>

        <GlassCard className="space-y-4 p-4">
          <h3 className="font-semibold">Preferences</h3>
          <Toggle
            label="Sound"
            checked={prefs.soundOn}
            onChange={(soundOn) => actions.updatePreferences({ soundOn })}
          />
          <Toggle
            label="Notifications"
            checked={prefs.notificationsOn}
            onChange={(notificationsOn) => actions.updatePreferences({ notificationsOn })}
          />
          <Toggle
            label="Reduce Motion"
            checked={prefs.reduceMotion}
            onChange={(reduceMotion) => actions.updatePreferences({ reduceMotion })}
          />
        </GlassCard>
      </div>
    </motion.div>
  );
}
