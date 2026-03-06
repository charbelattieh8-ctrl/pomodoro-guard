import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward, Plus, Sparkles, TimerReset, Waves } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import PrimaryButton from "../components/PrimaryButton";
import ProgressRing from "../components/ProgressRing";
import { useAppState } from "../context/AppStateProvider";
import { formatMs } from "../lib/utils";

const modeLabel = {
  focus: "Focus",
  break: "Break",
  longBreak: "Long Break",
};

export default function TimerPage() {
  const { state, actions, sessionProgress, currentRemainingMs } = useAppState();
  const { current } = state.sessions;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [ringSize, setRingSize] = useState(320);
  const targetMinutes = Math.round(current.totalMs / 60000);
  const progressPercent = Math.round(sessionProgress * 100);

  useEffect(() => {
    const applySize = () =>
      setRingSize(window.innerWidth < 480 ? 240 : window.innerWidth < 768 ? 280 : 320);
    applySize();
    window.addEventListener("resize", applySize);
    return () => window.removeEventListener("resize", applySize);
  }, []);

  useEffect(() => {
    const preset = Number(searchParams.get("minutes") || 0);
    if (!Number.isFinite(preset) || preset <= 0) return;
    const minutes = Math.max(1, Math.round(preset));
    actions.updateUserTimerSettings({ focusMinutes: minutes });
    actions.resetTimer();
    navigate("/timer", { replace: true });
  }, [searchParams, actions, navigate]);

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative min-h-[72vh]">
      <div className="mx-auto flex max-w-5xl flex-col gap-5 pt-6 md:pt-8">
        <GlassCard className="relative overflow-hidden p-6 md:p-8">
          <div className="absolute right-[-8%] top-[-16%] h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="absolute left-[-6%] bottom-[-18%] h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-md">
              <p className="eyebrow">Session Core</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] md:text-4xl">Your timer is the hero.</h2>
              <p className="mt-3 text-sm text-slate-200/84 md:text-base">
                Keep the interface clean, start quickly, and stay with the current block until it ends.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="surface-muted rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-slate-100/88">
                    <Sparkles size={15} className="text-cyan-100" />
                    <span className="text-sm">Mode</span>
                  </div>
                  <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em]">{modeLabel[current.mode]}</p>
                </div>
                <div className="surface-muted rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-slate-100/88">
                    <TimerReset size={15} className="text-amber-100" />
                    <span className="text-sm">Target</span>
                  </div>
                  <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em]">{targetMinutes} min</p>
                </div>
                <div className="surface-muted rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-slate-100/88">
                    <Waves size={15} className="text-emerald-100" />
                    <span className="text-sm">Progress</span>
                  </div>
                  <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em]">{progressPercent}%</p>
                </div>
              </div>
            </div>

            <div className="grid flex-1 place-items-center">
              <ProgressRing progress={sessionProgress} size={ringSize}>
                <div className="text-center">
                  <p className="eyebrow text-slate-200/82">{modeLabel[current.mode]}</p>
                  <p className="mt-3 font-display text-5xl font-semibold tracking-[-0.06em] sm:text-6xl md:text-7xl">
                    {formatMs(currentRemainingMs)}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                    <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 uppercase tracking-[0.22em] text-slate-200/76">
                      {current.status}
                    </span>
                    <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 uppercase tracking-[0.22em] text-slate-200/76">
                      Cycle {current.cycleCount}
                    </span>
                  </div>
                </div>
              </ProgressRing>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="w-full p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Command Row</p>
              <h3 className="mt-1 font-display text-2xl font-semibold tracking-[-0.04em]">Stay in flow</h3>
            </div>
            <p className="text-sm text-slate-300/82">Keep your controls obvious, fast, and low-friction.</p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
            {current.status !== "running" && (
              <PrimaryButton
                className="flex items-center justify-center gap-2"
                onClick={current.status === "paused" ? actions.resumeTimer : actions.startTimer}
              >
                <Play size={16} />
                {current.status === "paused" ? "Resume" : "Start"}
              </PrimaryButton>
            )}

            {current.status === "running" && (
              <PrimaryButton className="flex items-center justify-center gap-2" onClick={actions.pauseTimer}>
                <Pause size={16} /> Pause
              </PrimaryButton>
            )}

            <PrimaryButton
              className="flex items-center justify-center gap-2"
              variant="ghost"
              onClick={actions.resetTimer}
            >
              <RotateCcw size={16} /> Reset
            </PrimaryButton>

            <PrimaryButton
              className="flex items-center justify-center gap-2"
              variant="ghost"
              onClick={actions.skipPhase}
            >
              <SkipForward size={16} /> Skip
            </PrimaryButton>

            <PrimaryButton
              className="flex items-center justify-center gap-2"
              variant="ghost"
              onClick={actions.addFiveMinutes}
            >
              <Plus size={16} /> +5 min
            </PrimaryButton>
          </div>
        </GlassCard>

        <div className="grid gap-4 lg:grid-cols-3">
          <GlassCard className="p-5">
            <p className="eyebrow">Status</p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] capitalize">{current.status}</p>
            <p className="mt-2 text-sm text-slate-300/82">A clean timer looks better when the state is obvious at a glance.</p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="eyebrow">Cycle</p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em]">{current.cycleCount}</p>
            <p className="mt-2 text-sm text-slate-300/82">Track the repetition, not just the countdown.</p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="eyebrow">Rhythm</p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em]">{modeLabel[current.mode]}</p>
            <p className="mt-2 text-sm text-slate-300/82">The visual tone should reinforce what kind of session you are in.</p>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
