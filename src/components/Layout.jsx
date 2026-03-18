import { motion } from "framer-motion";
import { Suspense, lazy, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAppState } from "../context/AppStateProvider";
import CelebrationOverlay from "./CelebrationOverlay";
import Sidebar from "./Sidebar";
import Toast from "./Toast";
import TopBar from "./TopBar";

const WaterFillScene = lazy(() => import("./WaterFillScene"));

const MEME_67_MARKS = [
  { left: "6%", top: "10%", size: 22, rotate: -12 },
  { left: "16%", top: "28%", size: 26, rotate: 8 },
  { left: "28%", top: "14%", size: 20, rotate: -6 },
  { left: "37%", top: "34%", size: 24, rotate: 10 },
  { left: "49%", top: "20%", size: 30, rotate: -10 },
  { left: "60%", top: "12%", size: 22, rotate: 14 },
  { left: "72%", top: "30%", size: 28, rotate: -8 },
  { left: "84%", top: "16%", size: 24, rotate: 9 },
  { left: "12%", top: "58%", size: 30, rotate: 7 },
  { left: "24%", top: "72%", size: 22, rotate: -10 },
  { left: "36%", top: "62%", size: 26, rotate: 12 },
  { left: "48%", top: "78%", size: 20, rotate: -7 },
  { left: "60%", top: "64%", size: 24, rotate: 9 },
  { left: "73%", top: "74%", size: 28, rotate: -12 },
  { left: "86%", top: "60%", size: 22, rotate: 6 },
];

const MEME_67_STICKERS = [
  { text: "67", left: "5%", top: "7%", rotate: -14, size: "text-3xl" },
  { text: "OG BOI", left: "16%", top: "40%", rotate: 9, size: "text-xl" },
  { text: "LOCK INNN", left: "72%", top: "10%", rotate: -8, size: "text-xl" },
  { text: "67 MODE", left: "60%", top: "76%", rotate: 12, size: "text-lg" },
  { text: "BRUH", left: "38%", top: "24%", rotate: -11, size: "text-lg" },
  { text: "SHEESH", left: "80%", top: "44%", rotate: 6, size: "text-lg" },
];


export default function Layout() {
  const { state, sessionProgress, activeTheme, toasts, removeToast, celebration, actions } =
    useAppState();
  const location = useLocation();
  const { pauseTimer, resumeTimer } = actions;
  const reduceMotion = state.user.preferences.reduceMotion;
  const highMotionPage = location.pathname.startsWith("/rooms");
  const cinematicMotion = !reduceMotion && highMotionPage;
  const isMeme67 = activeTheme.id === "theme_meme_67";

  const overlayOpacity = reduceMotion ? 0.2 + sessionProgress * 0.12 : 0.22 + sessionProgress * 0.36;
  const bgDuration = state.sessions.current.mode !== "focus" ? 36 : 20;
  const surfaceDuration = state.sessions.current.mode !== "focus" ? 18 : 11;
  const smoothEase = [0.42, 0, 0.2, 1];

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
    <div className="relative min-h-screen overflow-x-hidden">
      <motion.div
        className="fixed inset-0"
        style={{
          background: `linear-gradient(130deg, ${activeTheme.gradient.from}, ${activeTheme.gradient.via}, ${activeTheme.gradient.to})`,
          backgroundSize: "180% 180%",
        }}
        animate={
          cinematicMotion
            ? {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }
            : {}
        }
        transition={{
          duration: bgDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <Suspense fallback={<div className="fixed inset-0 bg-[linear-gradient(180deg,rgba(4,12,24,0.2),rgba(2,8,16,0.7))]" />}>
        <WaterFillScene progress={sessionProgress} reduceMotion={reduceMotion} />
      </Suspense>

      <motion.div
        className="mesh-overlay fixed inset-0"
        animate={cinematicMotion ? { opacity: [overlayOpacity * 0.7, overlayOpacity, overlayOpacity * 0.7] } : {}}
        transition={{ duration: surfaceDuration, repeat: Infinity, ease: smoothEase }}
        style={{ opacity: overlayOpacity }}
      />

      <motion.div
        className="noise-overlay fixed inset-0"
        style={{ opacity: reduceMotion ? 0.1 : 0.1 + sessionProgress * 0.15 }}
        animate={cinematicMotion ? { backgroundPosition: ["0px 0px", "48px 24px"] } : {}}
        transition={{ duration: state.sessions.current.mode !== "focus" ? 24 : 14, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="banding-fix-overlay fixed inset-[-12%]"
        style={{ opacity: reduceMotion ? 0.12 : 0.12 + sessionProgress * 0.08 }}
        animate={cinematicMotion ? { backgroundPosition: ["0px 0px, 0px 0px", "180px 120px, -140px 160px"] } : {}}
        transition={{ duration: state.sessions.current.mode !== "focus" ? 26 : 16, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="grain-overlay fixed inset-[-8%]"
        style={{ opacity: reduceMotion ? 0.07 : 0.07 + sessionProgress * 0.05 }}
        animate={cinematicMotion ? { backgroundPosition: ["0px 0px", "120px 90px"] } : {}}
        transition={{ duration: state.sessions.current.mode !== "focus" ? 18 : 10, repeat: Infinity, ease: "linear" }}
      />

      {isMeme67 && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <motion.div
            className="absolute -left-[10%] top-[18%] font-display text-[20vw] font-black leading-none text-yellow-300/10"
            style={{ transform: "rotate(-10deg)" }}
            animate={cinematicMotion ? { x: [0, 40, 0], y: [0, -12, 0], opacity: [0.08, 0.16, 0.08] } : {}}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            67
          </motion.div>

          <motion.div
            className="absolute -right-[8%] bottom-[2%] font-display text-[18vw] font-black leading-none text-amber-200/10"
            style={{ transform: "rotate(12deg)" }}
            animate={cinematicMotion ? { x: [0, -34, 0], y: [0, 10, 0], opacity: [0.07, 0.15, 0.07] } : {}}
            transition={{ duration: 7.6, repeat: Infinity, ease: "easeInOut" }}
          >
            67
          </motion.div>

          {MEME_67_MARKS.map((mark, idx) => (
            <motion.span
              key={`meme67-${idx}`}
              className="absolute select-none font-display font-bold text-yellow-200/25"
              style={{
                left: mark.left,
                top: mark.top,
                fontSize: `${mark.size}px`,
                transform: `rotate(${mark.rotate}deg)`,
                textShadow: "0 0 18px rgba(250,204,21,0.18)",
              }}
              animate={
                cinematicMotion
                  ? {
                      y: [0, -6, 0, 5, 0],
                      opacity: [0.2, 0.35, 0.2],
                    }
                  : {}
              }
              transition={{
                duration: 3.4 + (idx % 5) * 0.7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (idx % 4) * 0.2,
              }}
            >
              67
            </motion.span>
          ))}

          {MEME_67_STICKERS.map((sticker, idx) => (
            <motion.div
              key={`meme67-sticker-${idx}`}
              className={`absolute rounded-xl border border-yellow-100/35 bg-black/25 px-3 py-1 font-display font-bold text-yellow-100/80 shadow-[0_0_20px_rgba(250,204,21,0.25)] backdrop-blur-sm ${sticker.size}`}
              style={{ left: sticker.left, top: sticker.top, transform: `rotate(${sticker.rotate}deg)` }}
              animate={
                cinematicMotion
                  ? {
                      y: [0, -5, 0, 4, 0],
                      scale: [1, 1.04, 1],
                      opacity: [0.74, 0.95, 0.74],
                    }
                  : {}
              }
              transition={{
                duration: 2.6 + idx * 0.45,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {sticker.text}
            </motion.div>
          ))}

          <motion.div
            className="absolute left-[10%] top-[78%] rounded-full border border-yellow-100/30 bg-black/30 px-4 py-2 text-sm font-black text-yellow-100/80 shadow-[0_0_18px_rgba(250,204,21,0.22)]"
            animate={cinematicMotion ? { y: [0, -4, 0], rotate: [0, -1.2, 0, 1.2, 0] } : {}}
            transition={{ duration: 2.9, repeat: Infinity, ease: "easeInOut" }}
          >
            (•_•) 67
          </motion.div>

          <motion.div
            className="absolute right-[8%] top-[70%] rounded-2xl border border-yellow-100/25 bg-black/25 px-4 py-2 text-xs font-bold tracking-wider text-yellow-50/80"
            animate={cinematicMotion ? { y: [0, 3, 0, -3, 0], x: [0, -3, 0, 3, 0] } : {}}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          >
            OG INTERNET ENERGY
          </motion.div>
        </div>
      )}
      <motion.div
        className="ambient-glow pointer-events-none fixed -left-[18%] top-[-4%] h-[56vh] w-[54vw] rounded-full"
        style={{
          background: `radial-gradient(ellipse at center, ${activeTheme.accent}b3 0%, ${activeTheme.accent}7a 22%, ${activeTheme.accent}38 48%, ${activeTheme.accent}14 68%, transparent 84%)`,
          filter: "blur(64px)",
          opacity: 0.34,
        }}
        animate={cinematicMotion ? { x: ["0%", "14%", "0%"], y: ["0%", "-6%", "0%"] } : {}}
        transition={{ duration: state.sessions.current.mode !== "focus" ? 28 : 18, repeat: Infinity, ease: smoothEase }}
      />

      <motion.div
        className="ambient-glow pointer-events-none fixed -right-[24%] bottom-[-8%] h-[60vh] w-[58vw] rounded-full"
        style={{
          background: `radial-gradient(ellipse at center, ${activeTheme.gradient.via}c2 0%, ${activeTheme.gradient.via}8f 24%, ${activeTheme.gradient.via}42 52%, ${activeTheme.gradient.via}14 72%, transparent 86%)`,
          filter: "blur(72px)",
          opacity: 0.4,
        }}
        animate={cinematicMotion ? { x: ["0%", "-12%", "0%"], y: ["0%", "8%", "0%"] } : {}}
        transition={{ duration: state.sessions.current.mode !== "focus" ? 34 : 20, repeat: Infinity, ease: smoothEase }}
      />

      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/40" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-3 px-3 pb-32 pt-3 sm:px-4 sm:pb-36 md:min-h-screen md:flex-row md:items-start md:gap-4 md:p-4 md:pb-6">
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
