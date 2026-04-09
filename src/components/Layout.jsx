import { motion } from "framer-motion";
import { Suspense, lazy, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAppState } from "../context/useAppState";
import CelebrationOverlay from "./CelebrationOverlay";
import Sidebar from "./Sidebar";
import Toast from "./Toast";
import TopBar from "./TopBar";
import { buildSceneVars } from "./themeScenes/utils";

const ThemeFillScene = lazy(() => import("./ThemeFillScene"));

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

const SCENE_UI_TUNING = {
  water: {
    glassTintRgb: "255, 255, 255",
    glassBorderRgb: "255, 255, 255",
    glassShadowRgb: "2, 6, 23",
    glassSheenRgb: "255, 255, 255",
    glassTopOpacity: "0.16",
    glassMidOpacity: "0.05",
    glassBottomOpacity: "0.18",
    glassBorderOpacity: "0.2",
    glassHighlightOpacity: "0.22",
    glassShadowOpacity: "0.24",
    glassSheenOpacity: "0.16",
    glassSaturation: "135%",
    glassBlur: "12px",
    pageShadowRgb: "0, 0, 0",
    pageHighlightRgb: "255, 255, 255",
    pageShadowTop: "0.15",
    pageShadowBottom: "0.4",
    pageHighlightOpacity: "0.06",
    ambientLeftOpacity: 0.34,
    ambientRightOpacity: 0.4,
  },
  sand: {
    glassTintRgb: "248, 225, 196",
    glassBorderRgb: "255, 236, 208",
    glassShadowRgb: "28, 14, 6",
    glassSheenRgb: "255, 245, 226",
    glassTopOpacity: "0.12",
    glassMidOpacity: "0.06",
    glassBottomOpacity: "0.24",
    glassBorderOpacity: "0.16",
    glassHighlightOpacity: "0.16",
    glassShadowOpacity: "0.34",
    glassSheenOpacity: "0.12",
    glassSaturation: "132%",
    glassBlur: "14px",
    pageShadowRgb: "24, 11, 4",
    pageHighlightRgb: "255, 230, 194",
    pageShadowTop: "0.18",
    pageShadowBottom: "0.52",
    pageHighlightOpacity: "0.05",
    ambientLeftOpacity: 0.22,
    ambientRightOpacity: 0.28,
  },
  snow: {
    glassTintRgb: "198, 216, 236",
    glassBorderRgb: "225, 238, 255",
    glassShadowRgb: "6, 14, 24",
    glassSheenRgb: "243, 247, 255",
    glassTopOpacity: "0.08",
    glassMidOpacity: "0.05",
    glassBottomOpacity: "0.34",
    glassBorderOpacity: "0.22",
    glassHighlightOpacity: "0.18",
    glassShadowOpacity: "0.52",
    glassSheenOpacity: "0.1",
    glassSaturation: "145%",
    glassBlur: "18px",
    pageShadowRgb: "5, 12, 24",
    pageHighlightRgb: "224, 237, 255",
    pageShadowTop: "0.26",
    pageShadowBottom: "0.64",
    pageHighlightOpacity: "0.06",
    ambientLeftOpacity: 0.18,
    ambientRightOpacity: 0.22,
  },
  aurora: {
    glassTintRgb: "123, 243, 211",
    glassBorderRgb: "198, 255, 242",
    glassShadowRgb: "3, 10, 18",
    glassSheenRgb: "233, 255, 250",
    glassTopOpacity: "0.11",
    glassMidOpacity: "0.05",
    glassBottomOpacity: "0.24",
    glassBorderOpacity: "0.18",
    glassHighlightOpacity: "0.16",
    glassShadowOpacity: "0.42",
    glassSheenOpacity: "0.12",
    glassSaturation: "145%",
    glassBlur: "16px",
    pageShadowRgb: "2, 8, 16",
    pageHighlightRgb: "138, 255, 226",
    pageShadowTop: "0.18",
    pageShadowBottom: "0.54",
    pageHighlightOpacity: "0.08",
    ambientLeftOpacity: 0.3,
    ambientRightOpacity: 0.34,
  },
  lava: {
    glassTintRgb: "255, 167, 111",
    glassBorderRgb: "255, 210, 174",
    glassShadowRgb: "12, 4, 2",
    glassSheenRgb: "255, 224, 191",
    glassTopOpacity: "0.1",
    glassMidOpacity: "0.05",
    glassBottomOpacity: "0.3",
    glassBorderOpacity: "0.16",
    glassHighlightOpacity: "0.14",
    glassShadowOpacity: "0.44",
    glassSheenOpacity: "0.1",
    glassSaturation: "138%",
    glassBlur: "14px",
    pageShadowRgb: "10, 3, 2",
    pageHighlightRgb: "255, 178, 128",
    pageShadowTop: "0.18",
    pageShadowBottom: "0.6",
    pageHighlightOpacity: "0.05",
    ambientLeftOpacity: 0.26,
    ambientRightOpacity: 0.32,
  },

  // ── New environment scene UI tuning ───────────────────────

  /** Forest: dark earthy glass with faint moss-green tint */
  forest: {
    glassTintRgb: "74, 222, 128",
    glassBorderRgb: "134, 239, 172",
    glassShadowRgb: "2, 10, 5",
    glassSheenRgb: "187, 247, 208",
    glassTopOpacity: "0.1",
    glassMidOpacity: "0.05",
    glassBottomOpacity: "0.26",
    glassBorderOpacity: "0.16",
    glassHighlightOpacity: "0.14",
    glassShadowOpacity: "0.46",
    glassSheenOpacity: "0.1",
    glassSaturation: "136%",
    glassBlur: "14px",
    pageShadowRgb: "1, 6, 3",
    pageHighlightRgb: "134, 239, 172",
    pageShadowTop: "0.2",
    pageShadowBottom: "0.56",
    pageHighlightOpacity: "0.05",
    ambientLeftOpacity: 0.24,
    ambientRightOpacity: 0.3,
  },

  /** Cyberpunk: dark glass with vivid cyan/neon border glow */
  cyberpunk: {
    glassTintRgb: "0, 240, 255",
    glassBorderRgb: "0, 255, 255",
    glassShadowRgb: "0, 0, 12",
    glassSheenRgb: "180, 255, 255",
    glassTopOpacity: "0.08",
    glassMidOpacity: "0.04",
    glassBottomOpacity: "0.28",
    glassBorderOpacity: "0.22",
    glassHighlightOpacity: "0.18",
    glassShadowOpacity: "0.52",
    glassSheenOpacity: "0.1",
    glassSaturation: "148%",
    glassBlur: "16px",
    pageShadowRgb: "0, 0, 10",
    pageHighlightRgb: "0, 240, 255",
    pageShadowTop: "0.22",
    pageShadowBottom: "0.58",
    pageHighlightOpacity: "0.06",
    ambientLeftOpacity: 0.28,
    ambientRightOpacity: 0.34,
  },

  /** Ocean: deep aqua glass with seafoam tint */
  ocean: {
    glassTintRgb: "6, 182, 212",
    glassBorderRgb: "103, 232, 249",
    glassShadowRgb: "0, 8, 16",
    glassSheenRgb: "165, 243, 252",
    glassTopOpacity: "0.1",
    glassMidOpacity: "0.05",
    glassBottomOpacity: "0.32",
    glassBorderOpacity: "0.2",
    glassHighlightOpacity: "0.16",
    glassShadowOpacity: "0.5",
    glassSheenOpacity: "0.11",
    glassSaturation: "142%",
    glassBlur: "16px",
    pageShadowRgb: "0, 6, 14",
    pageHighlightRgb: "103, 232, 249",
    pageShadowTop: "0.22",
    pageShadowBottom: "0.6",
    pageHighlightOpacity: "0.06",
    ambientLeftOpacity: 0.22,
    ambientRightOpacity: 0.28,
  },

  /** Volcano: near-black glass with orange lava glow accent */
  volcano: {
    glassTintRgb: "251, 146, 60",
    glassBorderRgb: "253, 186, 116",
    glassShadowRgb: "8, 2, 0",
    glassSheenRgb: "254, 215, 170",
    glassTopOpacity: "0.09",
    glassMidOpacity: "0.05",
    glassBottomOpacity: "0.32",
    glassBorderOpacity: "0.15",
    glassHighlightOpacity: "0.13",
    glassShadowOpacity: "0.48",
    glassSheenOpacity: "0.09",
    glassSaturation: "136%",
    glassBlur: "13px",
    pageShadowRgb: "8, 2, 0",
    pageHighlightRgb: "253, 186, 116",
    pageShadowTop: "0.2",
    pageShadowBottom: "0.62",
    pageHighlightOpacity: "0.05",
    ambientLeftOpacity: 0.24,
    ambientRightOpacity: 0.3,
  },

  /** Space: very dark glass with violet nebula glow */
  space: {
    glassTintRgb: "139, 92, 246",
    glassBorderRgb: "196, 181, 253",
    glassShadowRgb: "2, 0, 10",
    glassSheenRgb: "233, 213, 255",
    glassTopOpacity: "0.09",
    glassMidOpacity: "0.04",
    glassBottomOpacity: "0.3",
    glassBorderOpacity: "0.18",
    glassHighlightOpacity: "0.14",
    glassShadowOpacity: "0.54",
    glassSheenOpacity: "0.1",
    glassSaturation: "146%",
    glassBlur: "17px",
    pageShadowRgb: "2, 0, 10",
    pageHighlightRgb: "196, 181, 253",
    pageShadowTop: "0.24",
    pageShadowBottom: "0.62",
    pageHighlightOpacity: "0.06",
    ambientLeftOpacity: 0.26,
    ambientRightOpacity: 0.32,
  },
};

function buildLayoutSceneVars(theme, sceneKind) {
  const tuning = SCENE_UI_TUNING[sceneKind] ?? SCENE_UI_TUNING.water;

  return {
    ...buildSceneVars(theme),
    "--glass-tint-rgb": tuning.glassTintRgb,
    "--glass-border-rgb": tuning.glassBorderRgb,
    "--glass-shadow-rgb": tuning.glassShadowRgb,
    "--glass-sheen-rgb": tuning.glassSheenRgb,
    "--glass-highlight-rgb": tuning.glassBorderRgb,
    "--glass-top-opacity": tuning.glassTopOpacity,
    "--glass-mid-opacity": tuning.glassMidOpacity,
    "--glass-bottom-opacity": tuning.glassBottomOpacity,
    "--glass-border-opacity": tuning.glassBorderOpacity,
    "--glass-highlight-opacity": tuning.glassHighlightOpacity,
    "--glass-shadow-opacity": tuning.glassShadowOpacity,
    "--glass-sheen-opacity": tuning.glassSheenOpacity,
    "--glass-saturation": tuning.glassSaturation,
    "--glass-blur": tuning.glassBlur,
    "--page-shadow-rgb": tuning.pageShadowRgb,
    "--page-highlight-rgb": tuning.pageHighlightRgb,
    "--page-shadow-top": tuning.pageShadowTop,
    "--page-shadow-bottom": tuning.pageShadowBottom,
    "--page-highlight-opacity": tuning.pageHighlightOpacity,
  };
}

export default function Layout() {
  const { state, sessionProgress, activeTheme, toasts, removeToast, celebration, actions } =
    useAppState();
  const location = useLocation();
  const { pauseTimer, resumeTimer } = actions;
  const reduceMotion = state.user.preferences.reduceMotion;
  const highMotionPage = location.pathname.startsWith("/rooms");
  const cinematicMotion = !reduceMotion && highMotionPage;
  const isMeme67 = activeTheme.id === "theme_meme_67";
  const sceneKind = activeTheme.fillStyle ?? "water";
  const sceneUi = SCENE_UI_TUNING[sceneKind] ?? SCENE_UI_TUNING.water;
  const overlayStrengthByScene = {
    water:    1,
    sand:     0.4,
    snow:     0.16,
    aurora:   0.6,
    lava:     0.46,
    // New environment scenes
    forest:   0.32,
    cyberpunk: 0.22,
    ocean:    0.28,
    volcano:  0.44,
    space:    0.2,
  };
  const overlayStrength = overlayStrengthByScene[sceneKind] ?? 1;
  const layoutSceneVars = buildLayoutSceneVars(activeTheme, sceneKind);

  const overlayOpacity =
    (reduceMotion ? 0.2 + sessionProgress * 0.12 : 0.22 + sessionProgress * 0.36) * overlayStrength;
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
    <div
      className="relative min-h-screen overflow-x-hidden"
      data-scene-kind={sceneKind}
      style={layoutSceneVars}
    >
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
        <ThemeFillScene progress={sessionProgress} reduceMotion={reduceMotion} theme={activeTheme} />
      </Suspense>

      <motion.div
        className={`mesh-overlay fixed inset-0 theme-surface-${sceneKind}`}
        animate={cinematicMotion ? { opacity: [overlayOpacity * 0.7, overlayOpacity, overlayOpacity * 0.7] } : {}}
        transition={{ duration: surfaceDuration, repeat: Infinity, ease: smoothEase }}
        style={{ opacity: overlayOpacity }}
      />

      <motion.div
        className={`noise-overlay fixed inset-0 theme-surface-${sceneKind}`}
        style={{ opacity: (reduceMotion ? 0.1 : 0.1 + sessionProgress * 0.15) * Math.max(0.55, overlayStrength) }}
        animate={cinematicMotion ? { backgroundPosition: ["0px 0px", "48px 24px"] } : {}}
        transition={{ duration: state.sessions.current.mode !== "focus" ? 24 : 14, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className={`banding-fix-overlay fixed inset-[-12%] theme-surface-${sceneKind}`}
        style={{ opacity: (reduceMotion ? 0.12 : 0.12 + sessionProgress * 0.08) * Math.max(0.5, overlayStrength) }}
        animate={cinematicMotion ? { backgroundPosition: ["0px 0px, 0px 0px", "180px 120px, -140px 160px"] } : {}}
        transition={{ duration: state.sessions.current.mode !== "focus" ? 26 : 16, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className={`grain-overlay fixed inset-[-8%] theme-surface-${sceneKind}`}
        style={{ opacity: (reduceMotion ? 0.07 : 0.07 + sessionProgress * 0.05) * Math.max(0.55, overlayStrength) }}
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
            (â€¢_â€¢) 67
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
          opacity: sceneUi.ambientLeftOpacity,
        }}
        animate={cinematicMotion ? { x: ["0%", "14%", "0%"], y: ["0%", "-6%", "0%"] } : {}}
        transition={{ duration: state.sessions.current.mode !== "focus" ? 28 : 18, repeat: Infinity, ease: smoothEase }}
      />

      <motion.div
        className="ambient-glow pointer-events-none fixed -right-[24%] bottom-[-8%] h-[60vh] w-[58vw] rounded-full"
        style={{
          background: `radial-gradient(ellipse at center, ${activeTheme.gradient.via}c2 0%, ${activeTheme.gradient.via}8f 24%, ${activeTheme.gradient.via}42 52%, ${activeTheme.gradient.via}14 72%, transparent 86%)`,
          filter: "blur(72px)",
          opacity: sceneUi.ambientRightOpacity,
        }}
        animate={cinematicMotion ? { x: ["0%", "-12%", "0%"], y: ["0%", "8%", "0%"] } : {}}
        transition={{ duration: state.sessions.current.mode !== "focus" ? 34 : 20, repeat: Infinity, ease: smoothEase }}
      />

      <div className="page-depth-overlay pointer-events-none fixed inset-0" />

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

