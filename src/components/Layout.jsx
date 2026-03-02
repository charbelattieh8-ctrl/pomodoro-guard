import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import { useAppState } from "../context/AppStateProvider";
import Sidebar from "./Sidebar";
import Toast from "./Toast";
import TopBar from "./TopBar";

export default function Layout() {
  const { state, sessionProgress, activeTheme, toasts, removeToast } = useAppState();
  const reduceMotion = state.user.preferences.reduceMotion;
  const isBreak = state.sessions.current.mode !== "focus";

  const overlayOpacity = reduceMotion ? 0.2 + sessionProgress * 0.12 : 0.22 + sessionProgress * 0.36;
  const bloomScale = reduceMotion ? 1 : 1 + sessionProgress * 1.6;
  const fillValue = Math.max(0, Math.min(100, sessionProgress * 100));
  const fillHeight = `${fillValue}%`;
  const topInset = `${100 - fillValue}%`;
  const unfilledInsetBottom = `${fillValue}%`;
  const bgDuration = isBreak ? 36 : 20;
  const surfaceDuration = isBreak ? 18 : 11;
  const smoothEase = [0.42, 0, 0.2, 1];

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
            ? { filter: `hue-rotate(${sessionProgress * 10}deg) saturate(1.08)` }
            : {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                filter: [`hue-rotate(0deg) saturate(1)`, `hue-rotate(${sessionProgress * 20}deg) saturate(1.16)`],
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
          opacity: reduceMotion ? 0.3 : 0.32,
          mixBlendMode: "screen",
        }}
        animate={reduceMotion ? {} : { opacity: [0.28, 0.36, 0.28] }}
        transition={{ duration: isBreak ? 16 : 10, repeat: Infinity, ease: smoothEase }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath: `inset(${topInset} 0 0 0)`,
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.1) 36%, rgba(255,255,255,0.06) 100%)",
          backdropFilter: "blur(12px) saturate(130%)",
          WebkitBackdropFilter: "blur(12px) saturate(130%)",
          opacity: reduceMotion ? 0.58 : 0.64,
        }}
      />

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: fillHeight,
          background: `linear-gradient(0deg, ${activeTheme.accent}f2 0%, ${activeTheme.accent}a3 32%, transparent 100%)`,
          opacity: reduceMotion ? 0.32 : 0.38 + sessionProgress * 0.26,
        }}
        animate={
          reduceMotion
            ? { opacity: 0.32 + sessionProgress * 0.2 }
            : {
                opacity: [0.42 + sessionProgress * 0.14, 0.52 + sessionProgress * 0.2, 0.42 + sessionProgress * 0.14],
              }
        }
        transition={{ duration: isBreak ? 14 : 8, repeat: Infinity, ease: smoothEase }}
      />

      <motion.div
        className="pointer-events-none absolute inset-x-0 z-[1]"
        style={{
          bottom: fillHeight,
          height: "74px",
          background: `radial-gradient(ellipse at center bottom, rgba(255,255,255,0.9) 0%, ${activeTheme.accent}d9 36%, transparent 74%)`,
          opacity: reduceMotion ? 0.48 : 0.7,
          filter: "blur(10px)",
        }}
        animate={
          reduceMotion
            ? {}
            : { x: ["-8%", "8%", "-6%"], scaleX: [1, 1.08, 1], opacity: [0.62, 0.78, 0.62] }
        }
        transition={{ duration: isBreak ? 16 : 9, repeat: Infinity, ease: smoothEase }}
      />

      <motion.div
        className="pointer-events-none absolute inset-x-0 z-[2]"
        style={{
          bottom: fillHeight,
          height: "3px",
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.98) 50%, transparent 100%)",
          opacity: reduceMotion ? 0.66 : 0.84,
        }}
        animate={reduceMotion ? {} : { x: ["-6%", "6%", "-6%"] }}
        transition={{ duration: isBreak ? 14 : 8, repeat: Infinity, ease: smoothEase }}
      />

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
    </div>
  );
}
