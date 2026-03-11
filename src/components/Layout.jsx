import { motion } from "framer-motion";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAppState } from "../context/AppStateProvider";
import CelebrationOverlay from "./CelebrationOverlay";
import Sidebar from "./Sidebar";
import Toast from "./Toast";
import TopBar from "./TopBar";

const LIQUID_BUBBLES = [
  { left: "5%", size: 6, drift: 12, duration: 6.8, delay: 0.2 },
  { left: "15%", size: 8, drift: -14, duration: 8.2, delay: 1.3 },
  { left: "28%", size: 5, drift: 9, duration: 5.8, delay: 0.8 },
  { left: "42%", size: 7, drift: -10, duration: 7.9, delay: 2.1 },
  { left: "55%", size: 6, drift: 13, duration: 7.1, delay: 0.5 },
  { left: "68%", size: 9, drift: -11, duration: 9.4, delay: 2.5 },
  { left: "82%", size: 6, drift: 10, duration: 6.7, delay: 1.8 },
  { left: "92%", size: 5, drift: -8, duration: 5.2, delay: 3.1 },
];

const PREMIUM_BUBBLES = [
  { left: "6%", size: 12, drift: 16, duration: 5.1, delay: 0.2 },
  { left: "14%", size: 8, drift: -10, duration: 4.6, delay: 1.1 },
  { left: "23%", size: 16, drift: 12, duration: 6.2, delay: 0.4 },
  { left: "36%", size: 10, drift: -14, duration: 5.5, delay: 1.7 },
  { left: "49%", size: 14, drift: 9, duration: 6.8, delay: 0.8 },
  { left: "62%", size: 9, drift: -11, duration: 5.3, delay: 1.9 },
  { left: "74%", size: 18, drift: 14, duration: 6.9, delay: 0.6 },
  { left: "86%", size: 11, drift: -8, duration: 4.9, delay: 1.3 },
];

const SNOW_FLAKES = [
  { left: "4%", size: 4, duration: 8.2, delay: 0.6 },
  { left: "10%", size: 6, duration: 11.4, delay: 1.2 },
  { left: "18%", size: 5, duration: 9.8, delay: 0.1 },
  { left: "25%", size: 3, duration: 7.9, delay: 1.8 },
  { left: "31%", size: 5, duration: 10.7, delay: 0.4 },
  { left: "39%", size: 4, duration: 8.9, delay: 2.1 },
  { left: "46%", size: 6, duration: 11.8, delay: 1.4 },
  { left: "53%", size: 3, duration: 7.6, delay: 0.5 },
  { left: "60%", size: 5, duration: 9.5, delay: 1.1 },
  { left: "68%", size: 4, duration: 8.7, delay: 2.4 },
  { left: "75%", size: 6, duration: 12.1, delay: 0.9 },
  { left: "82%", size: 4, duration: 9.1, delay: 1.7 },
  { left: "90%", size: 5, duration: 10.2, delay: 0.3 },
  { left: "96%", size: 3, duration: 8.1, delay: 2.2 },
];

const FROST_CRACKS = [
  { left: "8%", top: "22%", width: "24%", rotate: -18, delay: 0.1 },
  { left: "22%", top: "36%", width: "18%", rotate: 22, delay: 0.4 },
  { left: "38%", top: "18%", width: "26%", rotate: -12, delay: 0.7 },
  { left: "56%", top: "30%", width: "20%", rotate: 19, delay: 0.9 },
  { left: "72%", top: "16%", width: "22%", rotate: -24, delay: 1.2 },
];

const EMBER_PARTICLES = [
  { left: "8%", size: 8, drift: 12, duration: 5.8, delay: 0.3 },
  { left: "18%", size: 6, drift: -10, duration: 6.4, delay: 1.1 },
  { left: "30%", size: 9, drift: 8, duration: 7.1, delay: 0.9 },
  { left: "44%", size: 7, drift: -9, duration: 5.3, delay: 1.7 },
  { left: "57%", size: 10, drift: 12, duration: 7.6, delay: 0.6 },
  { left: "70%", size: 6, drift: -11, duration: 6.2, delay: 1.9 },
  { left: "84%", size: 8, drift: 9, duration: 5.9, delay: 1.2 },
];

const RING_RADII = [42, 68, 98, 132];

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
  const isPremiumTheme = activeTheme.tier === "premium";
  const highMotionPage =
    location.pathname === "/timer" || location.pathname.startsWith("/rooms");
  const cinematicMotion = !reduceMotion && (highMotionPage || isPremiumTheme);
  const isMeme67 = activeTheme.id === "theme_meme_67";
  const isBreak = state.sessions.current.mode !== "focus";
  const isRunning = state.sessions.current.status === "running";

  const overlayOpacity = reduceMotion ? 0.2 + sessionProgress * 0.12 : 0.22 + sessionProgress * 0.36;
  const bloomScale = reduceMotion ? 1 : 1 + sessionProgress * 1.6;
  const fillValue = Math.max(0, Math.min(100, sessionProgress * 100));
  const displayFillValue = isPremiumTheme ? Math.max(fillValue, 14) : fillValue;
  const fillHeight = `${displayFillValue}%`;
  const topInset = `${100 - displayFillValue}%`;
  const unfilledInsetBottom = `${displayFillValue}%`;
  const bgDuration = isBreak ? 36 : 20;
  const surfaceDuration = isBreak ? 18 : 11;
  const smoothEase = [0.42, 0, 0.2, 1];
  const liquidDuration = isBreak ? 18 : 12;
  const liquidSpeedMultiplier = isRunning ? 1 : 1.45;
  const fillStyle = activeTheme.fillStyle || "tide";

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
        style={{ opacity: reduceMotion ? 0.12 : 0.12 + sessionProgress * 0.08 }}
        animate={cinematicMotion ? { backgroundPosition: ["0px 0px, 0px 0px", "180px 120px, -140px 160px"] } : {}}
        transition={{ duration: isBreak ? 26 : 16, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="grain-overlay absolute inset-[-8%]"
        style={{ opacity: reduceMotion ? 0.07 : 0.07 + sessionProgress * 0.05 }}
        animate={cinematicMotion ? { backgroundPosition: ["0px 0px", "120px 90px"] } : {}}
        transition={{ duration: isBreak ? 18 : 10, repeat: Infinity, ease: "linear" }}
      />

      {fillStyle === "bubble" && cinematicMotion && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {PREMIUM_BUBBLES.map((bubble, index) => (
            <motion.span
              key={`bubble-atmo-${index}`}
              className="absolute bottom-[-10%] rounded-full border border-white/30 bg-white/5"
              style={{ left: bubble.left, width: bubble.size + 10, height: bubble.size + 10 }}
              animate={{
                y: [0, -950],
                x: [0, bubble.drift * 1.2, 0],
                opacity: [0, 0.5, 0],
                scale: [0.5, 1, 1.2],
              }}
              transition={{
                duration: bubble.duration + 3,
                delay: bubble.delay * 0.7,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      {fillStyle === "snow" && cinematicMotion && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {SNOW_FLAKES.map((flake, index) => (
            <motion.span
              key={`snow-atmo-${index}`}
              className="absolute top-[-8%] rounded-full bg-white/90"
              style={{ left: flake.left, width: flake.size + 1, height: flake.size + 1 }}
              animate={{ y: ["0vh", "110vh"], x: [0, index % 2 ? -14 : 14, 0], opacity: [0, 0.9, 0.9, 0] }}
              transition={{
                duration: flake.duration,
                delay: flake.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {fillStyle === "frost" && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 12% 14%, rgba(255,255,255,0.22), transparent 30%), radial-gradient(circle at 88% 8%, rgba(255,255,255,0.16), transparent 34%), radial-gradient(circle at 50% 0%, rgba(255,255,255,0.14), transparent 46%)",
          }}
          animate={cinematicMotion ? { opacity: [0.3, 0.56, 0.3] } : {}}
          transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
        />
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

      {fillStyle === "bubble" && (
        <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] overflow-hidden" style={{ height: fillHeight }}>
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(0deg, ${activeTheme.accent}80 0%, ${activeTheme.gradient.via}66 70%, transparent 100%)`,
            }}
          />
          {PREMIUM_BUBBLES.map((bubble, index) => (
            <motion.span
              key={`premium-bubble-${index}`}
              className="absolute bottom-0 rounded-full border border-white/45 bg-white/10"
              style={{
                left: bubble.left,
                width: bubble.size,
                height: bubble.size,
                boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.25), 0 0 18px ${activeTheme.accent}66`,
              }}
              animate={
                cinematicMotion
                  ? {
                      y: [0, -190 - index * 10],
                      x: [0, bubble.drift, 0],
                      opacity: [0, 0.9, 0],
                      scale: [0.5, 1.1, 1.2],
                    }
                  : {
                      opacity: [0.2, 0.6, 0.2],
                    }
              }
              transition={{
                duration: bubble.duration,
                delay: bubble.delay,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
          <motion.div
            className="absolute inset-x-0 top-0 h-6"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.22) 40%, transparent 100%)",
              filter: "blur(1px)",
            }}
            animate={cinematicMotion ? { opacity: [0.45, 0.75, 0.45] } : {}}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      {fillStyle === "frost" && (
        <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] overflow-hidden" style={{ height: fillHeight }}>
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(0deg, rgba(220,245,255,0.86) 0%, ${activeTheme.accent}66 45%, rgba(186,230,253,0.25) 100%)`,
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
            }}
            animate={cinematicMotion ? { opacity: [0.75, 0.95, 0.75] } : {}}
            transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(125deg, rgba(255,255,255,0.2) 0 1px, transparent 1px 10px), repeating-linear-gradient(35deg, rgba(255,255,255,0.16) 0 1px, transparent 1px 12px)",
              opacity: 0.5,
            }}
          />
          {FROST_CRACKS.map((crack, index) => (
            <motion.span
              key={`frost-crack-${index}`}
              className="absolute h-[2px] origin-left rounded-full bg-white/75"
              style={{
                left: crack.left,
                top: crack.top,
                width: crack.width,
                transform: `rotate(${crack.rotate}deg)`,
                boxShadow: "0 0 10px rgba(255,255,255,0.35)",
              }}
              animate={cinematicMotion ? { scaleX: [0.2, 1], opacity: [0.2, 0.85, 0.65] } : {}}
              transition={{
                duration: 1.6,
                delay: crack.delay,
                repeat: Infinity,
                repeatDelay: 4.8,
                ease: "easeOut",
              }}
            />
          ))}
          <motion.div
            className="absolute inset-x-0 top-0 h-5"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.18), transparent)" }}
            animate={cinematicMotion ? { opacity: [0.45, 0.8, 0.45] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      {fillStyle === "snow" && (
        <>
          {cinematicMotion && (
            <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
              {SNOW_FLAKES.map((flake, index) => (
                <motion.span
                  key={`snow-flake-${index}`}
                  className="absolute top-[-6%] rounded-full bg-white/85"
                  style={{ left: flake.left, width: flake.size, height: flake.size }}
                  animate={{
                    y: ["0vh", "112vh"],
                    x: [0, index % 2 ? -10 : 10, 0],
                    opacity: [0, 0.9, 0.9, 0],
                  }}
                  transition={{
                    duration: flake.duration,
                    delay: flake.delay,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}
            </div>
          )}

          <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] overflow-hidden" style={{ height: fillHeight }}>
            <div className="absolute inset-0 bg-white/85" />
            <motion.svg
              className="absolute left-0 top-0 w-full"
              viewBox="0 0 1200 160"
              preserveAspectRatio="none"
              style={{ height: "76px", transform: "translateY(-48%)" }}
              animate={cinematicMotion ? { y: [0, -6, 0] } : {}}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <path
                d="M0,114 C110,88 230,136 360,110 C500,84 640,136 790,110 C910,90 1040,122 1200,108 L1200,160 L0,160 Z"
                fill="rgba(255,255,255,0.98)"
              />
            </motion.svg>
          </motion.div>
        </>
      )}

      {fillStyle === "grid" && (
        <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] overflow-hidden" style={{ height: fillHeight }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(0deg, ${activeTheme.accent}bf 0%, ${activeTheme.gradient.via}99 80%, transparent 100%)` }} />
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(rgba(255,255,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.22) 1px, transparent 1px)",
              backgroundSize: "40px 34px",
              transform: "perspective(420px) rotateX(65deg)",
              transformOrigin: "bottom center",
              opacity: 0.55,
            }}
            animate={cinematicMotion ? { backgroundPositionY: ["0px", "68px"] } : {}}
            transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}

      {fillStyle === "comet" && (
        <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] overflow-hidden" style={{ height: fillHeight }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(0deg, ${activeTheme.accent}d9 0%, ${activeTheme.gradient.to}99 100%)` }} />
          {cinematicMotion &&
            [0, 1, 2, 3].map((i) => (
              <motion.span
                key={`comet-${i}`}
                className="absolute h-[2px] w-40 rounded-full"
                style={{
                  left: `${8 + i * 22}%`,
                  top: `${22 + (i % 2) * 18}%`,
                  background: "linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0))",
                  filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))",
                  transform: "rotate(-22deg)",
                }}
                animate={{ x: ["-10%", "120%"], opacity: [0, 1, 0] }}
                transition={{ duration: 3.8 + i * 0.7, repeat: Infinity, ease: "easeOut", delay: i * 0.8 }}
              />
            ))}
        </motion.div>
      )}

      {fillStyle === "auroraBands" && (
        <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] overflow-hidden" style={{ height: fillHeight }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(0deg, ${activeTheme.accent}d9 0%, ${activeTheme.gradient.via}88 72%, transparent 100%)` }} />
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(110deg, rgba(255,255,255,0.08) 10%, rgba(255,255,255,0.35) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.28) 70%, rgba(255,255,255,0.08) 90%)",
              mixBlendMode: "screen",
              filter: "blur(3px)",
            }}
            animate={cinematicMotion ? { x: ["-8%", "8%", "-8%"], y: ["0%", "-4%", "0%"] } : {}}
            transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      {fillStyle === "tide" && (
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
                        "M0,114 C150,96 290,130 440,114 C630,92 770,132 940,114 C1040,104 1130,110 1200,114 L1200,180 L0,180 Z",
                        "M0,114 C140,92 280,134 430,114 C620,88 760,136 930,114 C1030,102 1120,108 1200,114 L1200,180 L0,180 Z",
                      ],
                    }
                  : {}
              }
              transition={{
                duration: (isBreak ? 7.2 : 3.8) * liquidSpeedMultiplier,
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
                duration: (isBreak ? 5.8 : 2.9) * liquidSpeedMultiplier,
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
      )}

      {fillStyle === "prism" && (
        <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] overflow-hidden" style={{ height: fillHeight }}>
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(150deg, ${activeTheme.accent}d9 0%, ${activeTheme.gradient.via}99 46%, ${activeTheme.gradient.to}cc 100%)`,
              clipPath: "polygon(0 12%, 24% 0, 54% 18%, 84% 4%, 100% 20%, 100% 100%, 0 100%)",
            }}
            animate={cinematicMotion ? { x: ["0%", "2%", "0%"], y: ["0%", "-2%", "0%"] } : {}}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.2) 42%, transparent 62%)",
              mixBlendMode: "screen",
            }}
            animate={cinematicMotion ? { x: ["-20%", "100%"] } : {}}
            transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}

      {fillStyle === "scanline" && (
        <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] overflow-hidden" style={{ height: fillHeight }}>
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(0deg, ${activeTheme.accent}cc 0%, ${activeTheme.gradient.via}cc 65%, transparent 100%)`,
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.22) 0 1px, rgba(255,255,255,0) 1px 8px)",
            }}
            animate={cinematicMotion ? { backgroundPositionY: ["0px", "-120px"] } : {}}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 38%)" }}
            animate={cinematicMotion ? { y: [0, -8, 0] } : {}}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      {fillStyle === "nebula" && (
        <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] overflow-hidden" style={{ height: fillHeight }}>
          <motion.div
            className="absolute -left-[10%] top-[8%] h-[65%] w-[45%] rounded-full"
            style={{ background: `radial-gradient(circle, ${activeTheme.accent}aa 0%, transparent 72%)`, filter: "blur(18px)" }}
            animate={cinematicMotion ? { x: ["0%", "12%", "0%"], y: ["0%", "-8%", "0%"] } : {}}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[-8%] bottom-[6%] h-[72%] w-[52%] rounded-full"
            style={{ background: `radial-gradient(circle, ${activeTheme.gradient.via}bb 0%, transparent 70%)`, filter: "blur(22px)" }}
            animate={cinematicMotion ? { x: ["0%", "-10%", "0%"], y: ["0%", "6%", "0%"] } : {}}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      {fillStyle === "embers" && (
        <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] overflow-hidden" style={{ height: fillHeight }}>
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(0deg, ${activeTheme.accent}d9 0%, ${activeTheme.gradient.from}66 58%, transparent 100%)`,
            }}
          />
          {cinematicMotion &&
            EMBER_PARTICLES.map((particle, index) => (
              <motion.span
                key={`ember-${index}`}
                className="absolute bottom-0 rounded-full"
                style={{
                  left: particle.left,
                  width: particle.size,
                  height: particle.size,
                  background: "rgba(255,255,255,0.85)",
                  boxShadow: `0 0 16px ${activeTheme.accent}`,
                }}
                animate={{
                  y: [0, -220 - index * 14],
                  x: [0, particle.drift, 0],
                  opacity: [0, 0.9, 0],
                  scale: [0.7, 1.1, 0.9],
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}
        </motion.div>
      )}

      {fillStyle === "rings" && (
        <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] overflow-hidden" style={{ height: fillHeight }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(0deg, ${activeTheme.accent}cc 0%, transparent 85%)` }} />
          {RING_RADII.map((radius, index) => (
            <motion.div
              key={`ring-${radius}`}
              className="absolute left-1/2 -translate-x-1/2 rounded-full border"
              style={{
                bottom: "-10%",
                width: `${radius * 2}%`,
                height: `${radius * 2}%`,
                borderColor: "rgba(255,255,255,0.26)",
              }}
              animate={cinematicMotion ? { scale: [0.96, 1.05, 0.96], opacity: [0.3, 0.55, 0.3] } : {}}
              transition={{
                duration: 4.2 + index * 0.65,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      )}

      {fillStyle === "sunburst" && (
        <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] overflow-hidden" style={{ height: fillHeight }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(0deg, ${activeTheme.accent}e6 0%, ${activeTheme.gradient.via}b3 62%, transparent 100%)` }} />
          <motion.div
            className="absolute left-1/2 top-[14%] h-[160%] w-[160%] -translate-x-1/2 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(255,255,255,0.34), rgba(255,255,255,0.06), rgba(255,255,255,0.34), rgba(255,255,255,0.08), rgba(255,255,255,0.34))",
              mixBlendMode: "screen",
            }}
            animate={cinematicMotion ? { rotate: [0, 360] } : {}}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}

      <motion.div
        className="ambient-glow pointer-events-none absolute -left-[28%] top-[-8%] h-[74vh] w-[96vw] rounded-full"
        style={{
          background: `radial-gradient(ellipse at center, ${activeTheme.accent}9e 0%, ${activeTheme.accent}66 18%, ${activeTheme.accent}2e 42%, ${activeTheme.accent}12 64%, transparent 84%)`,
          filter: "blur(86px)",
          opacity: 0.18 + sessionProgress * 0.22,
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
