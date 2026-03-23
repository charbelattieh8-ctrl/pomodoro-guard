import { motion } from "framer-motion";
import { THEME_SCENE_ASSETS } from "../../lib/themeSceneAssets";
import { buildSceneVars, clamp01 } from "./utils";

const EMBERS = [
  { left: "6%", size: "7px", delay: "0s", duration: "10s" },
  { left: "17%", size: "4px", delay: "2s", duration: "12s" },
  { left: "29%", size: "5px", delay: "1s", duration: "11s" },
  { left: "41%", size: "8px", delay: "4s", duration: "13s" },
  { left: "53%", size: "6px", delay: "3s", duration: "9s" },
  { left: "64%", size: "5px", delay: "6s", duration: "12s" },
  { left: "76%", size: "7px", delay: "5s", duration: "10s" },
  { left: "88%", size: "4px", delay: "7s", duration: "11s" },
];

const SMOKE_PLUMES = [
  { left: "8%", top: "2%", width: "16rem", delay: "0s", duration: "22s" },
  { left: "32%", top: "8%", width: "18rem", delay: "5s", duration: "24s" },
  { left: "60%", top: "5%", width: "20rem", delay: "10s", duration: "26s" },
];

export default function LavaFillScene({ progress, reduceMotion = false, className = "", theme }) {
  const fillPercent = clamp01(progress);

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden lava-fill-scene ${className}`.trim()}
      style={buildSceneVars(theme, {
        "--scene-texture": `url(${THEME_SCENE_ASSETS.lava.texture})`,
        "--scene-emission": `url(${THEME_SCENE_ASSETS.lava.emission})`,
      })}
    >
      <div className="lava-sky absolute inset-0" />
      <div className="lava-glow-halo absolute left-[8%] top-[10%] h-[28vh] w-[28vh] rounded-full" />

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
        <div className="lava-emission absolute inset-0" />
        <div className="lava-surface absolute inset-x-0 top-0 h-0">
          <div className="lava-crest lava-crest-back" />
          <div className="lava-crest lava-crest-front" />
          <div className="lava-surface-glow absolute inset-x-0 top-[-1.25rem] h-16" />
        </div>

        {!reduceMotion ? (
          <div className="absolute inset-0 overflow-hidden">
            {EMBERS.map((ember, index) => (
              <span
                key={`lava-ember-${index}`}
                className="lava-ember absolute rounded-full"
                style={{
                  left: ember.left,
                  width: ember.size,
                  height: ember.size,
                  animationDelay: ember.delay,
                  animationDuration: ember.duration,
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
