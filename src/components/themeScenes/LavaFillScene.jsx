import { motion } from "framer-motion";
import { THEME_SCENE_ASSETS } from "../../lib/themeSceneAssets";
import { buildSceneVars, clamp01 } from "./utils";
import "./LavaFillScene.css";

const LAVA_PLATES = [
  {
    left: "-8%",
    top: "5%",
    width: "56%",
    height: "22%",
    clipPath: "polygon(0 28%, 10% 10%, 30% 0, 54% 8%, 76% 2%, 100% 18%, 96% 58%, 82% 82%, 60% 100%, 30% 94%, 12% 82%, 0 58%)",
    delay: "0s",
    duration: "52s",
    rotate: "-3deg",
  },
  {
    left: "20%",
    top: "1%",
    width: "48%",
    height: "20%",
    clipPath: "polygon(0 18%, 14% 4%, 38% 0, 62% 10%, 84% 4%, 100% 22%, 94% 66%, 74% 96%, 48% 88%, 24% 98%, 8% 76%, 0 50%)",
    delay: "5s",
    duration: "58s",
    rotate: "2deg",
  },
  {
    left: "54%",
    top: "6%",
    width: "46%",
    height: "24%",
    clipPath: "polygon(0 24%, 12% 12%, 28% 2%, 52% 0, 74% 8%, 100% 24%, 94% 62%, 82% 86%, 60% 100%, 32% 92%, 10% 82%, 0 58%)",
    delay: "8s",
    duration: "56s",
    rotate: "-1deg",
  },
  {
    left: "8%",
    top: "20%",
    width: "84%",
    height: "18%",
    clipPath: "polygon(0 38%, 12% 18%, 28% 8%, 46% 0, 62% 4%, 78% 0, 92% 10%, 100% 30%, 96% 58%, 82% 78%, 66% 96%, 46% 90%, 24% 100%, 8% 86%, 0 62%)",
    delay: "12s",
    duration: "64s",
    rotate: "0deg",
  },
];

const LAVA_CRACKS = [
  { left: "6%", top: "11%", width: "28%", rotate: "-14deg", duration: "34s", delay: "0s" },
  { left: "22%", top: "16%", width: "20%", rotate: "12deg", duration: "40s", delay: "3s" },
  { left: "44%", top: "12%", width: "26%", rotate: "-8deg", duration: "36s", delay: "6s" },
  { left: "58%", top: "18%", width: "30%", rotate: "10deg", duration: "42s", delay: "2s" },
  { left: "74%", top: "13%", width: "18%", rotate: "-18deg", duration: "32s", delay: "8s" },
  { left: "14%", top: "23%", width: "72%", rotate: "2deg", duration: "46s", delay: "1s" },
];

const LAVA_GLOW_POOLS = [
  { left: "18%", top: "18%", size: "14%", delay: "0s", duration: "7.5s" },
  { left: "44%", top: "12%", size: "16%", delay: "2s", duration: "8.5s" },
  { left: "66%", top: "16%", size: "12%", delay: "4s", duration: "9.2s" },
  { left: "79%", top: "11%", size: "10%", delay: "1s", duration: "7.8s" },
];

const SMOKE_PLUMES = [
  { left: "10%", top: "2%", width: "18rem", delay: "0s", duration: "28s", opacity: 0.28 },
  { left: "38%", top: "6%", width: "20rem", delay: "6s", duration: "32s", opacity: 0.24 },
  { left: "64%", top: "4%", width: "22rem", delay: "11s", duration: "34s", opacity: 0.22 },
];

const EMBERS = [
  { left: "8%", size: "5px", delay: "0s", duration: "14s", rise: "-112%" },
  { left: "18%", size: "4px", delay: "4s", duration: "16s", rise: "-108%" },
  { left: "31%", size: "6px", delay: "2s", duration: "13s", rise: "-118%" },
  { left: "46%", size: "5px", delay: "6s", duration: "15s", rise: "-110%" },
  { left: "60%", size: "4px", delay: "1s", duration: "14s", rise: "-116%" },
  { left: "73%", size: "6px", delay: "5s", duration: "17s", rise: "-114%" },
  { left: "86%", size: "4px", delay: "3s", duration: "13s", rise: "-109%" },
];

export default function LavaFillScene({ progress, reduceMotion = false, className = "", theme }) {
  const fillPercent = clamp01(progress);
  const glowOpacity = 0.34 + fillPercent * 0.36;

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden lava-fill-scene ${className}`.trim()}
      style={buildSceneVars(theme, {
        "--scene-texture": `url(${THEME_SCENE_ASSETS.lava.texture})`,
        "--scene-emission": `url(${THEME_SCENE_ASSETS.lava.emission})`,
      })}
    >
      <div className="lava-sky absolute inset-0" />
      <div className="lava-distant-ridge absolute inset-x-0 bottom-[12%] h-[20vh]" />
      <div className="lava-heat-haze absolute inset-x-[-10%] top-[2%] h-[28%]" />

      {!reduceMotion ? (
        <div className="absolute inset-0 overflow-hidden">
          {SMOKE_PLUMES.map((plume, index) => (
            <span
              key={`lava-smoke-${index}`}
              className="lava-smoke absolute"
              style={{
                left: plume.left,
                top: plume.top,
                width: plume.width,
                opacity: plume.opacity,
                animationDelay: plume.delay,
                animationDuration: plume.duration,
              }}
            />
          ))}
        </div>
      ) : null}

      <motion.div
        className="lava-fill absolute inset-x-0 bottom-0"
        animate={{ height: `${fillPercent * 100}%` }}
        transition={{
          duration: reduceMotion ? 0.2 : 0.7,
          ease: [0.22, 0.8, 0.2, 1],
        }}
      >
        <div className="lava-body absolute inset-0" />
        <div className="lava-underflow absolute inset-0" />
        <div className="lava-crust absolute inset-0">
          {LAVA_PLATES.map((plate, index) => (
            <span
              key={`lava-plate-${index}`}
              className="lava-plate absolute"
              style={{
                left: plate.left,
                top: plate.top,
                width: plate.width,
                height: plate.height,
                clipPath: plate.clipPath,
                transform: `rotate(${plate.rotate})`,
                animationDelay: plate.delay,
                animationDuration: plate.duration,
              }}
            />
          ))}

          {LAVA_CRACKS.map((crack, index) => (
            <span
              key={`lava-crack-${index}`}
              className="lava-crack absolute"
              style={{
                left: crack.left,
                top: crack.top,
                width: crack.width,
                transform: `rotate(${crack.rotate})`,
                animationDelay: crack.delay,
                animationDuration: crack.duration,
              }}
            />
          ))}

          {LAVA_GLOW_POOLS.map((pool, index) => (
            <span
              key={`lava-glow-${index}`}
              className="lava-glow-pocket absolute rounded-full"
              style={{
                left: pool.left,
                top: pool.top,
                width: pool.size,
                height: pool.size,
                animationDelay: pool.delay,
                animationDuration: pool.duration,
              }}
            />
          ))}
        </div>
        <div className="lava-surface absolute inset-x-0 top-0 h-0">
          <div className="lava-ridge lava-ridge-back" />
          <div className="lava-ridge lava-ridge-front" />
          <div className="lava-surface-glow absolute inset-x-0 top-[-1.25rem] h-16" />
        </div>
        <div className="lava-emission absolute inset-0" style={{ opacity: glowOpacity }} />

        {!reduceMotion ? (
          <div className="absolute inset-0 overflow-hidden">
            {EMBERS.map((ember, index) => (
              <span
                key={`lava-ember-${index}`}
                className="lava-ember absolute rounded-full"
                style={{
                  left: ember.left,
                  bottom: "-4%",
                width: ember.size,
                height: ember.size,
                animationDelay: ember.delay,
                animationDuration: ember.duration,
                ["--ember-rise"]: ember.rise,
              }}
            />
          ))}
        </div>
        ) : null}
      </motion.div>

      <div className="scene-vignette absolute inset-0" />
    </div>
  );
}
