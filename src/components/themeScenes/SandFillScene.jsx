import { motion } from "framer-motion";
import { THEME_SCENE_ASSETS } from "../../lib/themeSceneAssets";
import { buildSceneVars, clamp01 } from "./utils";

const WIND_STREAMS = [
  { left: "-18%", top: "10%", width: "24rem", delay: "0s", duration: "18s", opacity: 0.24, blur: "8px" },
  { left: "-14%", top: "24%", width: "18rem", delay: "4s", duration: "20s", opacity: 0.18, blur: "10px" },
  { left: "-22%", top: "38%", width: "20rem", delay: "8s", duration: "17s", opacity: 0.16, blur: "9px" },
  { left: "-10%", top: "56%", width: "22rem", delay: "2s", duration: "16s", opacity: 0.18, blur: "7px" },
  { left: "-16%", top: "72%", width: "26rem", delay: "11s", duration: "21s", opacity: 0.14, blur: "11px" },
];

const SAND_GRAINS = [
  { left: "8%", top: "18%", size: "7px", delay: "0s", duration: "13s" },
  { left: "22%", top: "31%", size: "5px", delay: "2s", duration: "15s" },
  { left: "38%", top: "14%", size: "6px", delay: "7s", duration: "12s" },
  { left: "51%", top: "42%", size: "4px", delay: "3s", duration: "17s" },
  { left: "65%", top: "24%", size: "6px", delay: "1s", duration: "14s" },
  { left: "79%", top: "18%", size: "5px", delay: "9s", duration: "16s" },
  { left: "12%", top: "58%", size: "4px", delay: "6s", duration: "15s" },
  { left: "33%", top: "72%", size: "5px", delay: "5s", duration: "14s" },
  { left: "58%", top: "62%", size: "7px", delay: "10s", duration: "13s" },
  { left: "84%", top: "54%", size: "4px", delay: "4s", duration: "16s" },
];

export default function SandFillScene({ progress, reduceMotion = false, className = "", theme }) {
  const fillPercent = clamp01(progress);

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden sand-fill-scene ${className}`.trim()}
      style={buildSceneVars(theme, {
        "--scene-texture": `url(${THEME_SCENE_ASSETS.sand.texture})`,
      })}
    >
      <div className="sand-sky absolute inset-0" />
      <div className="sand-sun absolute right-[-8%] top-[-6%] h-[42vh] w-[42vh] rounded-full" />
      <div className="sand-haze absolute inset-0" />

      {!reduceMotion ? (
        <div className="absolute inset-0 overflow-hidden">
          {WIND_STREAMS.map((stream, index) => (
            <span
              key={`sand-stream-${index}`}
              className="sand-wind-stream absolute"
              style={{
                left: stream.left,
                top: stream.top,
                width: stream.width,
                opacity: stream.opacity,
                filter: `blur(${stream.blur})`,
                animationDelay: stream.delay,
                animationDuration: stream.duration,
              }}
            />
          ))}

          {SAND_GRAINS.map((grain, index) => (
            <span
              key={`sand-grain-${index}`}
              className="sand-grain absolute rounded-full"
              style={{
                left: grain.left,
                top: grain.top,
                width: grain.size,
                height: grain.size,
                animationDelay: grain.delay,
                animationDuration: grain.duration,
              }}
            />
          ))}
        </div>
      ) : null}

      <motion.div
        className="sand-fill absolute inset-x-0 bottom-0"
        animate={{ height: `${fillPercent * 100}%` }}
        transition={{
          duration: reduceMotion ? 0.2 : 0.7,
          ease: [0.22, 0.8, 0.2, 1],
        }}
      >
        <div className="sand-body absolute inset-0" />
        <div className="sand-surface absolute inset-x-0 top-0 h-0">
          <div className="sand-dune sand-dune-back" />
          <div className="sand-dune sand-dune-mid" />
          <div className="sand-dune sand-dune-front" />
          <div className="sand-dune-shadow sand-dune-shadow-back" />
          <div className="sand-dune-shadow sand-dune-shadow-front" />
          <div className="sand-crest-light absolute inset-x-0 top-[-1.75rem] h-16" />
        </div>
      </motion.div>

      <div className="scene-vignette absolute inset-0" />
    </div>
  );
}
