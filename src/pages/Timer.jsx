import { Suspense, lazy, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowPathIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppState } from "../context/AppStateProvider";
import { formatMs } from "../lib/utils";

const WaterTimerBackground = lazy(() => import("../components/WaterTimerBackground"));

const modeLabel = {
  focus: "Focus",
  break: "Break",
  longBreak: "Long Break",
};

const actionIconClass = "h-5 w-5";

function WaterRipples({ ripples }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="timer-ripple"
          style={{ left: ripple.x, top: ripple.y }}
          initial={{ scale: 0.3, opacity: 0.32 }}
          animate={{ scale: ripple.scale, opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0.65, 0.3, 1] }}
        />
      ))}
    </div>
  );
}

function WaterMeter({ progress }) {
  const fillValue = Math.round(progress * 100);

  return (
    <div className="timer-panel flex h-full min-h-[270px] flex-col justify-between gap-5 rounded-[2rem] p-5">
      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.34em] text-cyan-100/58">Depth</p>
        <p className="mt-2 text-4xl font-semibold text-white">{fillValue}%</p>
        <p className="mt-2 max-w-xs text-sm leading-6 text-slate-200/72">
          The waterline rises in direct proportion to elapsed time and settles back on reset.
        </p>
      </div>

      <div className="flex items-end gap-4">
        <div className="timer-meter relative h-48 w-16 overflow-hidden rounded-[999px] border border-white/20 bg-white/8 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
          <motion.div
            className="absolute inset-x-2 bottom-2 rounded-[999px] bg-[linear-gradient(180deg,rgba(143,236,255,0.78),rgba(17,145,215,0.9))] shadow-[0_0_28px_rgba(70,205,255,0.35)]"
            animate={{ height: `${Math.max(fillValue, 3)}%` }}
            transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 1] }}
          />
          <motion.div
            className="absolute inset-x-1.5 h-4 rounded-full bg-white/60 blur-[2px]"
            animate={{ bottom: `calc(${Math.max(fillValue, 3)}% - 0.2rem)` }}
            transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 1] }}
          />
        </div>
        <div className="space-y-2 text-sm text-slate-200/72">
          <p>Calm wave field</p>
          <p>Low-opacity bubbles</p>
          <p>Refraction and caustics</p>
        </div>
      </div>
    </div>
  );
}

export default function TimerPage() {
  const { state, actions, sessionProgress, currentRemainingMs } = useAppState();
  const { current } = state.sessions;
  const { displayFormat = "minutesSeconds" } = state.user.timer;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [ripples, setRipples] = useState([]);
  const isHoursFormat = displayFormat === "hoursMinutesSeconds";
  const reduceMotion = state.user.preferences.reduceMotion;
  const fillPercent = Math.round(sessionProgress * 100);

  useEffect(() => {
    const preset = Number(searchParams.get("minutes") || 0);
    if (!Number.isFinite(preset) || preset <= 0) return;
    const minutes = Math.max(1, Math.round(preset));
    actions.updateUserTimerSettings({ focusMinutes: minutes });
    actions.resetTimer();
    navigate("/timer", { replace: true });
  }, [searchParams, actions, navigate]);

  useEffect(() => {
    if (!ripples.length) return undefined;
    const timer = window.setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 950);
    return () => window.clearTimeout(timer);
  }, [ripples]);

  const triggerRipple = (event) => {
    const fallbackX = window.innerWidth * 0.5;
    const fallbackY = window.innerHeight * (1 - sessionProgress * 0.45);
    const nextRipple = {
      id: `${Date.now()}-${Math.random()}`,
      x: event?.clientX ?? fallbackX,
      y: event?.clientY ?? fallbackY,
      scale: reduceMotion ? 4 : 8,
    };
    setRipples((prev) => [...prev.slice(-2), nextRipple]);
  };

  const runActionWithRipple = (action) => (event) => {
    triggerRipple(event);
    action();
  };

  const timerTextClass = isHoursFormat
    ? "mt-4 font-display text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl"
    : "mt-4 font-display text-6xl font-semibold tracking-[-0.05em] sm:text-7xl lg:text-[5.5rem]";

  return (
    <div className="relative isolate min-h-[calc(100vh-8.5rem)]">
      <Suspense fallback={<div className="fixed inset-0 z-0 bg-[linear-gradient(180deg,#031019,#0b1f31_48%,#0a2030)]" />}>
        <WaterTimerBackground progress={sessionProgress} reduceMotion={reduceMotion} />
      </Suspense>
      <WaterRipples ripples={ripples} />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
        className="relative z-[3] mx-auto flex max-w-6xl flex-col gap-6 px-1 pb-10 pt-2 md:pt-6"
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section className="timer-shell rounded-[2rem] p-5 sm:p-7 lg:p-9">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-2 backdrop-blur-xl">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.8)]" />
                <p className="text-xs uppercase tracking-[0.32em] text-cyan-50/75">{modeLabel[current.mode]}</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-slate-950/18 px-3 py-2 text-xs uppercase tracking-[0.28em] text-slate-100/72 backdrop-blur-xl">
                <span>Cycle {current.cycleCount}</span>
                <span className="h-1 w-1 rounded-full bg-white/45" />
                <span>{fillPercent}% elapsed</span>
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/54">Pomodoro</p>
                <p className={timerTextClass}>{formatMs(currentRemainingMs, displayFormat)}</p>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-100/70 sm:text-base">
                  A full-screen water container rises with elapsed time, with calm layered waves, subtle refraction,
                  and soft optical detail kept behind a contrast-safe overlay.
                </p>

                <div className="mt-8">
                  <div className="timer-progress-track h-3 w-full overflow-hidden rounded-full">
                    <motion.div
                      className="timer-progress-fill h-full rounded-full"
                      animate={{ width: `${Math.max(fillPercent, 2)}%` }}
                      transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 1] }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-slate-100/52">
                    <span>Empty</span>
                    <span>Surface line</span>
                    <span>Full</span>
                  </div>
                </div>
              </div>

              <div className="timer-info-panel rounded-[1.75rem] p-5">
                <p className="text-[0.65rem] uppercase tracking-[0.32em] text-cyan-100/58">Session state</p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {current.status === "running" ? "Flowing" : current.status === "paused" ? "Still" : "Ready"}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-200/70">
                  Ripples appear only on direct interaction, keeping the background smooth and low-distraction.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="timer-dock flex flex-wrap gap-3 rounded-[1.75rem] p-3">
                {current.status !== "running" && (
                  <button
                    type="button"
                    className="timer-action timer-action-primary"
                    onClick={runActionWithRipple(
                      current.status === "paused" ? actions.resumeTimer : actions.startTimer
                    )}
                  >
                    <PlayIcon className={actionIconClass} />
                    {current.status === "paused" ? "Resume" : "Start"}
                  </button>
                )}

                {current.status === "running" && (
                  <button
                    type="button"
                    className="timer-action timer-action-primary"
                    onClick={runActionWithRipple(actions.pauseTimer)}
                  >
                    <PauseIcon className={actionIconClass} />
                    Pause
                  </button>
                )}

                <button
                  type="button"
                  className="timer-action"
                  onClick={runActionWithRipple(actions.resetTimer)}
                >
                  <ArrowPathIcon className={actionIconClass} />
                  Reset
                </button>

                <button type="button" className="timer-action" onClick={actions.skipPhase}>
                  <ForwardIcon className={actionIconClass} />
                  Skip
                </button>

                <button type="button" className="timer-action" onClick={actions.addFiveMinutes}>
                  <PlusIcon className={actionIconClass} />
                  +5 min
                </button>
              </div>
            </div>
          </section>

          <WaterMeter progress={sessionProgress} />
        </div>
      </motion.div>
    </div>
  );
}
