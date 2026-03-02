import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
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
  const [ringSize, setRingSize] = useState(250);

  useEffect(() => {
    const applySize = () => setRingSize(window.innerWidth < 480 ? 210 : window.innerWidth < 768 ? 230 : 250);
    applySize();
    window.addEventListener("resize", applySize);
    return () => window.removeEventListener("resize", applySize);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative min-h-[72vh]">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-5 pt-6 md:pt-10">
        <GlassCard className="w-full max-w-xl p-6 md:p-10">
          <div className="grid place-items-center">
            <ProgressRing progress={sessionProgress} size={ringSize}>
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-200">{modeLabel[current.mode]}</p>
                <p className="mt-2 font-display text-5xl font-semibold sm:text-6xl md:text-7xl">
                  {formatMs(currentRemainingMs)}
                </p>
                <p className="mt-2 text-xs text-slate-300">Cycle {current.cycleCount}</p>
              </div>
            </ProgressRing>
          </div>
        </GlassCard>

        <GlassCard className="w-full max-w-xl p-4">
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center">
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
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
