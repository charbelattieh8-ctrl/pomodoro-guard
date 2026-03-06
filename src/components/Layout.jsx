import { motion } from "framer-motion";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
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
  { text: "LOCK IN", left: "72%", top: "10%", rotate: -8, size: "text-xl" },
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
  const highMotionPage =
    location.pathname === "/timer" || location.pathname.startsWith("/rooms");
  const cinematicMotion = !reduceMotion && highMotionPage;
  const isMeme67 = activeTheme.id === "theme_meme_67";
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

      <motion.div
        className="mesh-overlay absolute inset-0"
        animate={cinematicMotion ? { opacity: [overlayOpacity * 0.7, overlayOpacity, overlayOpacity * 0.7] } : {}}
        transition={{ duration: surfaceDuration, repeat: Infinity, ease: smoothEase }}
        style={{ opacity: overlayOpacity }}
      />

      <motion.div
        className="noise-overlay absolute inset-0"
        style={{ opacity: reduceMotion ? 0.1 : 0.1 + sessionProgress * 0.15 }}
        animate={cinematicMotion ? { backgroundPosition: ["0px 0px", "48px 24px"] } : {}}
        transition={{ duration: isBreak ? 24 : 14, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="banding-fix-overlay absolute inset-[-12%]"
        style={{ opacity: reduceMotion ? 0.08 : 0.08 + sessionProgress * 0.06 }}
        animate={cinematicMotion ? { backgroundPosition: ["0px 0px, 0px 0px", "180px 120px, -140px 160px"] } : {}}
        transition={{ duration: isBreak ? 26 : 16, repeat: Infinity, ease: "linear" }}
      />

      {isMeme67 && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
        className="ambient-glow pointer-events-none absolute -left-[18%] top-[-4%] h-[56vh] w-[54vw] rounded-full"
        style={{
          background: `radial-gradient(ellipse at center, ${activeTheme.accent}b3 0%, ${activeTheme.accent}7a 22%, ${activeTheme.accent}38 48%, ${activeTheme.accent}14 68%, transparent 84%)`,
          filter: "blur(64px)",
          opacity: 0.34,
        }}
        animate={cinematicMotion ? { x: ["0%", "14%", "0%"], y: ["0%", "-6%", "0%"] } : {}}
        transition={{ duration: isBreak ? 28 : 18, repeat: Infinity, ease: smoothEase }}
      />

      <motion.div
        className="ambient-glow pointer-events-none absolute -right-[24%] bottom-[-8%] h-[60vh] w-[58vw] rounded-full"
        style={{
          background: `radial-gradient(ellipse at center, ${activeTheme.gradient.via}c2 0%, ${activeTheme.gradient.via}8f 24%, ${activeTheme.gradient.via}42 52%, ${activeTheme.gradient.via}14 72%, transparent 86%)`,
          filter: "blur(72px)",
          opacity: 0.4,
        }}
        animate={cinematicMotion ? { x: ["0%", "-12%", "0%"], y: ["0%", "8%", "0%"] } : {}}
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
          cinematicMotion
            ? {
                backgroundPosition: ["50% 0%", "50% 100%", "50% 0%"],
                opacity: [0.38 + sessionProgress * 0.1, 0.5 + sessionProgress * 0.16, 0.38 + sessionProgress * 0.1],
              }
            : {}
        }
        transition={{
          duration: isBreak ? 22 : 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
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
          cinematicMotion
            ? {
                opacity: [0.28, 0.4, 0.28],
                backgroundPosition: ["0% 0%", "12% 100%", "0% 0%"],
              }
            : {}
        }
        transition={{ duration: isBreak ? 18 : 10, repeat: Infinity, ease: smoothEase }}
      />

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] overflow-visible"
        style={{ height: fillHeight }}
        animate={
          cinematicMotion
            ? {
                x: [0, 1, -1, 0],
                y: [0, -1, 0, 0],
                rotate: [0, 0.08, -0.08, 0],
              }
            : {}
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
          animate={cinematicMotion ? { opacity: [0.6, 0.76, 0.6] } : {}}
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
          animate={cinematicMotion ? { backgroundPosition: ["0px 0px", "40px -92px"] } : {}}
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
            cinematicMotion
              ? {
                  y: [0, -14, 8, -4, 0],
                  scaleY: [1, 1.08, 0.94, 1.02, 1],
                }
              : {}
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
              cinematicMotion
                ? {
                    d: [
                      "M0,114 C140,92 280,134 430,114 C620,88 760,136 930,114 C1030,102 1120,108 1200,114 L1200,180 L0,180 Z",
                      "M0,118 C160,98 300,128 450,118 C620,96 760,128 920,118 C1030,108 1120,114 1200,118 L1200,180 L0,180 Z",
                      "M0,114 C140,92 280,134 430,114 C620,88 760,136 930,114 C1030,102 1120,108 1200,114 L1200,180 L0,180 Z",
                    ],
                  }
                : {}
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
              cinematicMotion
                ? {
                    opacity: [0.65, 0.95, 0.65],
                  }
                : {}
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
          animate={cinematicMotion ? { opacity: [0.44, 0.62, 0.44] } : {}}
          transition={{ duration: (isBreak ? 6.4 : 3.2) * liquidSpeedMultiplier, repeat: Infinity, ease: "easeInOut" }}
        />

        {cinematicMotion &&
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
          cinematicMotion
            ? { x: ["0%", "120%", "0%"], y: ["0%", "24%", "0%"], scale: [1, bloomScale, 1] }
            : { x: "10%" }
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
            animate={cinematicMotion ? { opacity: [0.85, 1, 0.85] } : {}}
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
