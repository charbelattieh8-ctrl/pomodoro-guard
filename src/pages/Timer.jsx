import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward, Plus } from "lucide-react";
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
  const { displayFormat = "minutesSeconds" } = state.user.timer;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [ringSize, setRingSize] = useState(320);
  const isHoursFormat = displayFormat === "hoursMinutesSeconds";

  useEffect(() => {
    const applySize = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const horizontalPadding = viewportWidth < 640 ? 56 : viewportWidth < 768 ? 88 : 140;
      const verticalAllowance = viewportHeight < 760 ? viewportHeight * 0.38 : viewportHeight * 0.46;
      const maxSize = isHoursFormat ? 292 : 320;
      const minSize = isHoursFormat ? 210 : 228;
      const nextSize = Math.max(minSize, Math.min(maxSize, viewportWidth - horizontalPadding, verticalAllowance));
      setRingSize(nextSize);
    };
    applySize();
    window.addEventListener("resize", applySize);
    return () => window.removeEventListener("resize", applySize);
  }, [isHoursFormat]);

  const timerTextClass = isHoursFormat
    ? "mt-2 font-display text-4xl font-semibold sm:text-5xl md:text-6xl"
    : "mt-2 font-display text-5xl font-semibold sm:text-6xl md:text-7xl";

  useEffect(() => {
    const preset = Number(searchParams.get("minutes") || 0);
    if (!Number.isFinite(preset) || preset <= 0) return;
    const minutes = Math.max(1, Math.round(preset));
    actions.updateUserTimerSettings({ focusMinutes: minutes });
    actions.resetTimer();
    navigate("/timer", { replace: true });
  }, [searchParams, actions, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative min-h-[calc(100dvh-11rem)] md:min-h-[72vh]"
    >
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 pt-2 sm:gap-5 sm:pt-4 md:pt-8">
        <GlassCard className="w-full max-w-xl p-4 sm:p-6 md:p-10">
          <div className="grid place-items-center">
            <ProgressRing progress={sessionProgress} size={ringSize}>
              <div className="text-center">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-200 sm:text-sm">{modeLabel[current.mode]}</p>
                <p className={timerTextClass}>{formatMs(currentRemainingMs, displayFormat)}</p>
                <p className="mt-2 text-xs text-slate-300">Cycle {current.cycleCount}</p>
              </div>
            </ProgressRing>
          </div>
        </GlassCard>

        <div className="flex w-full max-w-xl flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <GlassCard className="w-full p-3 sm:p-4 lg:w-auto">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:flex lg:flex-wrap lg:justify-center">
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
            </div>
          </GlassCard>

          <GlassCard className="w-full p-3 sm:p-4 lg:w-auto">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:flex lg:flex-wrap lg:justify-center">
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
        </div>
      </div>
    </motion.div>
  );
}
