import { motion } from "framer-motion";
import { THEME_SCENE_ASSETS } from "../../lib/themeSceneAssets";
import { buildSceneVars, clamp01 } from "./utils";

const SNOW_FLAKES = [
  { left: "4%", size: "6px", duration: "15s", delay: "0s" },
  { left: "12%", size: "10px", duration: "18s", delay: "4s" },
  { left: "22%", size: "5px", duration: "13s", delay: "2s" },
  { left: "31%", size: "8px", duration: "17s", delay: "7s" },
  { left: "43%", size: "7px", duration: "14s", delay: "1s" },
  { left: "55%", size: "11px", duration: "19s", delay: "5s" },
  { left: "66%", size: "5px", duration: "12s", delay: "3s" },
  { left: "74%", size: "9px", duration: "16s", delay: "8s" },
  { left: "84%", size: "7px", duration: "15s", delay: "6s" },
  { left: "92%", size: "6px", duration: "14s", delay: "9s" },
];

const SPARKLES = [
  { left: "12%", top: "26%", delay: "0s" },
  { left: "28%", top: "18%", delay: "2.4s" },
  { left: "46%", top: "34%", delay: "1.2s" },
  { left: "58%", top: "20%", delay: "3.2s" },
  { left: "77%", top: "30%", delay: "1.8s" },
  { left: "87%", top: "16%", delay: "2.8s" },
];

export default function SnowFillScene({ progress, reduceMotion = false, className = "", theme }) {
  const fillPercent = clamp01(progress);

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden snow-fill-scene ${className}`.trim()}
      style={buildSceneVars(theme, {
        "--scene-texture": `url(${THEME_SCENE_ASSETS.snow.texture})`,
      })}
    >
      <div className="snow-sky absolute inset-0" />
      <div className="snow-moon absolute right-[10%] top-[12%] h-28 w-28 rounded-full" />
      <div className="snow-frost-haze absolute inset-0" />

      {!reduceMotion ? (
        <div className="absolute inset-0 overflow-hidden">
          {SNOW_FLAKES.map((flake, index) => (
            <span
              key={`snow-flake-${index}`}
              className="snow-flake absolute rounded-full"
              style={{
                left: flake.left,
                width: flake.size,
                height: flake.size,
                animationDuration: flake.duration,
                animationDelay: flake.delay,
              }}
            />
          ))}
        </div>
      ) : null}

      <motion.div
        className="snow-fill absolute inset-x-0 bottom-0"
        animate={{ height: `${fillPercent * 100}%` }}
        transition={{
          duration: reduceMotion ? 0.2 : 0.72,
          ease: [0.22, 0.8, 0.2, 1],
        }}
      >
        <div className="snow-body absolute inset-0" />
        <div className="snow-surface absolute inset-x-0 top-0 h-0">
          <div className="snow-drift snow-drift-back" />
          <div className="snow-drift snow-drift-mid" />
          <div className="snow-drift snow-drift-front" />
          <div className="snow-rim absolute inset-x-0 top-[-1.25rem] h-16" />

          {!reduceMotion ? (
            <div className="absolute inset-x-0 top-[-4rem] h-24">
              {SPARKLES.map((sparkle, index) => (
                <span
                  key={`snow-sparkle-${index}`}
                  className="snow-sparkle absolute"
                  style={{
                    left: sparkle.left,
                    top: sparkle.top,
                    animationDelay: sparkle.delay,
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>
      </motion.div>

      <div className="scene-vignette absolute inset-0" />
    </div>
  );
}
