import { motion } from "framer-motion";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppState } from "../context/AppStateProvider";
import CelebrationOverlay from "./CelebrationOverlay";
import Sidebar from "./Sidebar";
import Toast from "./Toast";
import TopBar from "./TopBar";

const LIQUID_BUBBLES = [
  { left: "8%", size: 5, drift: 10, duration: 5.5, delay: 0.2 },
  { left: "18%", size: 7, drift: -12, duration: 7.2, delay: 1.1 },
  { left: "31%", size: 4, drift: 8, duration: 4.8, delay: 0.6 },
  { left: "46%", size: 6, drift: -8, duration: 6.9, delay: 1.8 },
  { left: "58%", size: 5, drift: 11, duration: 6.1, delay: 0.3 },
  { left: "70%", size: 8, drift: -10, duration: 8.4, delay: 2.1 },
  { left: "84%", size: 5, drift: 9, duration: 5.7, delay: 1.4 },
];

export default function Layout() {
  const { state, sessionProgress, activeTheme, toasts, removeToast, celebration, actions } =
    useAppState();
  const { pauseTimer, resumeTimer } = actions;
  const reduceMotion = state.user.preferences.reduceMotion;
  const isBreak = state.sessions.current.mode !== "focus";
  const isRunning = state.sessions.current.status === "running";

  const overlayOpacity = reduceMotion ? 0.2 + sessionProgress * 0.12 : 0.22 + sessionProgress * 0.36;
  const bloomScale = reduceMotion ? 1 : 1 + sessionProgress * 1.6;
  const fillValue = Math.max(0, Math.min(100, sessionProgress * 100));
  const fillHeight = `${fillValue}%`;
  const topInset = `${100 - fillValue}%`;
  const unfilledInsetBottom = `${fillValue}%`;
  const bgDuration = isBreak ? 36 : 20;
  const surfaceDuration = isBreak ? 18 : 11;
  const smoothEase = [0.42, 0, 0.2, 1];
  const liquidDuration = isBreak ? 14 : 9;
  const liquidSpeedMultiplier = isRunning ? 1 : 1.45;
  const crestDuration = (isBreak ? 9 : 5.2) * liquidSpeedMultiplier;

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.code !== "Space") return;
      const target = event.target;
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);
      if (typing) return;
      event.preventDefault();
      if (state.sessions.current.status === "running") {
        pauseTimer();
      } else if (state.sessions.current.status === "paused") {
        resumeTimer();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state.sessions.current.status, pauseTimer, resumeTimer]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(130deg, ${activeTheme.gradient.from}, ${activeTheme.gradient.via}, ${activeTheme.gradient.to})`,
          backgroundSize: "180% 180%",
        }}
        animate={
          reduceMotion
            ? {}
            : {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }
        }
        transition={{
          duration: bgDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="mesh-overlay absolute inset-0"
        animate={reduceMotion ? {} : { opacity: [overlayOpacity * 0.7, overlayOpacity, overlayOpacity * 0.7] }}
        transition={{ duration: surfaceDuration, repeat: Infinity, ease: smoothEase }}
        style={{ opacity: overlayOpacity }}
      />

      <motion.div
        className="noise-overlay absolute inset-0"
        style={{ opacity: reduceMotion ? 0.1 : 0.1 + sessionProgress * 0.15 }}
        animate={reduceMotion ? {} : { backgroundPosition: ["0px 0px", "48px 24px"] }}
        transition={{ duration: isBreak ? 24 : 14, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="pointer-events-none absolute -left-[12%] top-[8%] h-[42vh] w-[40vw] rounded-full"
        style={{
          background: `radial-gradient(circle, ${activeTheme.accent}70 0%, transparent 66%)`,
          filter: "blur(34px)",
          opacity: 0.28,
        }}
        animate={reduceMotion ? {} : { x: ["0%", "14%", "0%"], y: ["0%", "-6%", "0%"] }}
        transition={{ duration: isBreak ? 28 : 18, repeat: Infinity, ease: smoothEase }}
      />

      <motion.div
        className="pointer-events-none absolute -right-[18%] bottom-[6%] h-[46vh] w-[45vw] rounded-full"
        style={{
          background: `radial-gradient(circle, ${activeTheme.gradient.via}99 0%, transparent 70%)`,
          filter: "blur(42px)",
          opacity: 0.34,
        }}
        animate={reduceMotion ? {} : { x: ["0%", "-12%", "0%"], y: ["0%", "8%", "0%"] }}
        transition={{ duration: isBreak ? 34 : 20, repeat: Infinity, ease: smoothEase }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,0.02) 0%, ${activeTheme.accent}4a 44%, ${activeTheme.accent}cc 100%)`,
          clipPath: `inset(${topInset} 0 0 0)`,
          opacity: reduceMotion ? 0.28 : 0.34 + sessionProgress * 0.34,
          mixBlendMode: "plus-lighter",
        }}
        animate={
          reduceMotion
            ? {}
            : {
                backgroundPosition: ["50% 0%", "50% 100%", "50% 0%"],
                opacity: [0.38 + sessionProgress * 0.1, 0.5 + sessionProgress * 0.16, 0.38 + sessionProgress * 0.1],
              }
        }
        transition={{ duration: isBreak ? 22 : 12, repeat: Infinity, ease: smoothEase }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath: `inset(0 0 ${unfilledInsetBottom} 0)`,
          background:
            "linear-gradient(165deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.02) 100%)",
          backgroundSize: "140% 140%",
          opacity: reduceMotion ? 0.3 : 0.32,
          mixBlendMode: "screen",
        }}
        animate={
          reduceMotion
            ? {}
            : {
                opacity: [0.28, 0.4, 0.28],
                backgroundPosition: ["0% 0%", "12% 100%", "0% 0%"],
              }
        }
        transition={{ duration: isBreak ? 18 : 10, repeat: Infinity, ease: smoothEase }}
      />

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] overflow-visible"
        style={{ height: fillHeight }}
        animate={
          reduceMotion
            ? {}
            : {
                x: [0, 1, -1, 0],
                y: [0, -1, 0, 0],
                rotate: [0, 0.08, -0.08, 0],
              }
        }
        transition={{
          duration: liquidDuration * liquidSpeedMultiplier,
          repeat: Infinity,
          ease: smoothEase,
        }}
        >
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(0deg, ${activeTheme.accent}f2 0%, ${activeTheme.accent}bf 38%, ${activeTheme.accent}66 75%, transparent 100%)`,
            opacity: reduceMotion ? 0.55 : 0.65,
          }}
          animate={reduceMotion ? {} : { opacity: [0.6, 0.76, 0.6] }}
          transition={{
            duration: liquidDuration * liquidSpeedMultiplier,
            repeat: Infinity,
            ease: smoothEase,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(165deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.12) 42%, rgba(255,255,255,0.07) 100%)",
            backdropFilter: "blur(12px) saturate(140%)",
            WebkitBackdropFilter: "blur(12px) saturate(140%)",
            opacity: 0.66,
          }}
        />

        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 22% 78%, rgba(255,255,255,0.32) 0 2px, transparent 3px), radial-gradient(circle at 68% 88%, rgba(255,255,255,0.22) 0 1.5px, transparent 3px), radial-gradient(circle at 48% 72%, rgba(255,255,255,0.22) 0 1.8px, transparent 3px)",
            opacity: reduceMotion ? 0.18 : 0.3,
          }}
          animate={reduceMotion ? {} : { backgroundPosition: ["0px 0px", "40px -92px"] }}
          transition={{
            duration: (isBreak ? 16 : 8) * liquidSpeedMultiplier,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.svg
          className="absolute left-0 top-0 w-full"
          viewBox="0 0 1200 180"
          preserveAspectRatio="none"
          style={{ height: "88px", transform: "translateY(-38%)", opacity: reduceMotion ? 0.86 : 0.96 }}
          animate={
            reduceMotion
              ? {}
              : {
                  y: [0, -14, 8, -4, 0],
                  scaleY: [1, 1.08, 0.94, 1.02, 1],
                }
          }
          transition={{
            duration: (isBreak ? 6.6 : 3.2) * liquidSpeedMultiplier,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.path
            d="M0,114 C140,92 280,134 430,114 C620,88 760,136 930,114 C1030,102 1120,108 1200,114 L1200,180 L0,180 Z"
            fill={`${activeTheme.accent}ee`}
            animate={
              reduceMotion
                ? {}
                : {
                    d: [
                      "M0,114 C140,92 280,134 430,114 C620,88 760,136 930,114 C1030,102 1120,108 1200,114 L1200,180 L0,180 Z",
                      "M0,118 C160,98 300,128 450,118 C620,96 760,128 920,118 C1030,108 1120,114 1200,118 L1200,180 L0,180 Z",
                      "M0,114 C140,92 280,134 430,114 C620,88 760,136 930,114 C1030,102 1120,108 1200,114 L1200,180 L0,180 Z",
                    ],
                  }
            }
            transition={{
              duration: (isBreak ? 5.6 : 2.8) * liquidSpeedMultiplier,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.path
            d="M0,118 C160,98 300,128 450,118 C620,96 760,128 920,118 C1030,108 1120,114 1200,118"
            stroke="rgba(255,255,255,0.92)"
            strokeWidth="2.6"
            fill="none"
            animate={
              reduceMotion
                ? {}
                : {
                    opacity: [0.65, 0.95, 0.65],
                  }
            }
            transition={{
              duration: (isBreak ? 4.8 : 2.4) * liquidSpeedMultiplier,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.svg>

        <motion.div
          className="absolute inset-x-0 top-0"
          style={{
            height: "24px",
            transform: "translateY(-26%)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.22) 45%, transparent 100%)",
            opacity: reduceMotion ? 0.38 : 0.52,
            filter: "blur(2px)",
          }}
          animate={reduceMotion ? {} : { opacity: [0.44, 0.62, 0.44] }}
          transition={{ duration: (isBreak ? 6.4 : 3.2) * liquidSpeedMultiplier, repeat: Infinity, ease: "easeInOut" }}
        />

        {!reduceMotion &&
          LIQUID_BUBBLES.map((bubble, index) => (
            <motion.span
              key={`bubble-${index}`}
              className="absolute bottom-0 rounded-full bg-white/65"
              style={{ left: bubble.left, width: bubble.size, height: bubble.size }}
              animate={{
                y: [0, -160 - index * 16],
                x: [0, bubble.drift, 0],
                opacity: [0, 0.55, 0],
                scale: [0.6, 1, 1.12],
              }}
              transition={{
                duration: bubble.duration * liquidSpeedMultiplier,
                delay: bubble.delay,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
      </motion.div>

      <motion.div
        className="pointer-events-none absolute -left-1/3 top-0 h-[60vh] w-[80vw] rounded-full"
        style={{
          background: `radial-gradient(circle, ${activeTheme.accent}70 0%, transparent 65%)`,
          filter: "blur(40px)",
          opacity: 0.22 + sessionProgress * 0.5,
        }}
        animate={
          reduceMotion
            ? { x: "10%" }
            : { x: ["0%", "120%", "0%"], y: ["0%", "24%", "0%"], scale: [1, bloomScale, 1] }
        }
        transition={{ duration: isBreak ? 28 : 16, repeat: Infinity, ease: smoothEase }}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/40" />

      <div className="pointer-events-none absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 md:block">
        <div className="glass flex h-44 w-9 items-end rounded-full border border-white/30 p-1">
          <motion.div
            className="w-full rounded-full"
            style={{
              height: fillHeight,
              background: `linear-gradient(180deg, ${activeTheme.accent}66 0%, ${activeTheme.accent}ee 100%)`,
            }}
            animate={reduceMotion ? {} : { opacity: [0.85, 1, 0.85] }}
            transition={{ duration: isBreak ? 8 : 5, repeat: Infinity, ease: smoothEase }}
          />
        </div>
        <p className="mt-2 text-center text-xs font-semibold text-white/90">{Math.round(fillValue)}%</p>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-start gap-4 p-4 pb-32 md:pb-6">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <TopBar />
          <Outlet />
        </main>
      </div>

      <Toast items={toasts} onClose={removeToast} />
      <CelebrationOverlay celebration={celebration} />
    </div>
  );
}
