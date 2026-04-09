import { motion } from "framer-motion";
import { THEME_SCENE_ASSETS } from "../../lib/themeSceneAssets";
import { buildSceneVars, clamp01 } from "./utils";
import "./SnowFillScene.css";

const SNOW_FLAKES = [
  { left: "2%", top: "10%", size: "5px", duration: "17s", delay: "0s", drift: "-2.8rem", opacity: 0.44, blur: "0px" },
  { left: "11%", top: "2%", size: "9px", duration: "21s", delay: "2.2s", drift: "2.5rem", opacity: 0.56, blur: "0.4px" },
  { left: "18%", top: "14%", size: "4px", duration: "14s", delay: "4s", drift: "1.4rem", opacity: 0.38, blur: "0px" },
  { left: "27%", top: "6%", size: "7px", duration: "19s", delay: "1.2s", drift: "-3.5rem", opacity: 0.48, blur: "0.3px" },
  { left: "35%", top: "18%", size: "6px", duration: "16s", delay: "5.4s", drift: "2rem", opacity: 0.42, blur: "0px" },
  { left: "43%", top: "4%", size: "10px", duration: "24s", delay: "3.2s", drift: "-1.8rem", opacity: 0.58, blur: "0.6px" },
  { left: "52%", top: "11%", size: "5px", duration: "18s", delay: "6.8s", drift: "3.2rem", opacity: 0.4, blur: "0px" },
  { left: "60%", top: "1%", size: "8px", duration: "22s", delay: "2.8s", drift: "-2.2rem", opacity: 0.52, blur: "0.5px" },
  { left: "68%", top: "16%", size: "4px", duration: "15s", delay: "7.6s", drift: "1.6rem", opacity: 0.34, blur: "0px" },
  { left: "76%", top: "8%", size: "7px", duration: "20s", delay: "4.6s", drift: "-3rem", opacity: 0.5, blur: "0.4px" },
  { left: "83%", top: "3%", size: "5px", duration: "18s", delay: "5.8s", drift: "2.2rem", opacity: 0.36, blur: "0px" },
  { left: "91%", top: "13%", size: "6px", duration: "16s", delay: "1.8s", drift: "-1.5rem", opacity: 0.42, blur: "0.2px" },
];

const SPINDRIFT = [
  { left: "-8%", top: "56%", width: "24rem", duration: "14s", delay: "0s", opacity: 0.28 },
  { left: "10%", top: "52%", width: "18rem", duration: "12s", delay: "2.4s", opacity: 0.34 },
  { left: "30%", top: "58%", width: "22rem", duration: "15s", delay: "4.2s", opacity: 0.3 },
  { left: "54%", top: "50%", width: "20rem", duration: "13s", delay: "1.8s", opacity: 0.26 },
  { left: "74%", top: "57%", width: "24rem", duration: "16s", delay: "3.6s", opacity: 0.32 },
];

const RIDGE_LIGHTS = [
  { left: "8%", top: "24%", width: "16%", height: "10%" },
  { left: "24%", top: "17%", width: "18%", height: "12%" },
  { left: "48%", top: "20%", width: "20%", height: "14%" },
  { left: "71%", top: "16%", width: "16%", height: "11%" },
];

// Ice crystal sparkle points scattered on drift surface
const ICE_SPARKLES = [
  { left: "6%",  top: "12%", size: "4px",  dur: "2.8s", delay: "0s"   },
  { left: "18%", top: "8%",  size: "5px",  dur: "3.4s", delay: "1.2s" },
  { left: "32%", top: "14%", size: "3px",  dur: "2.4s", delay: "2.6s" },
  { left: "46%", top: "6%",  size: "5px",  dur: "3.8s", delay: "0.6s" },
  { left: "58%", top: "16%", size: "4px",  dur: "2.6s", delay: "3.4s" },
  { left: "72%", top: "9%",  size: "3px",  dur: "3.2s", delay: "1.8s" },
  { left: "84%", top: "12%", size: "5px",  dur: "2.9s", delay: "4.2s" },
  { left: "94%", top: "7%",  size: "4px",  dur: "3.6s", delay: "0.4s" },
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
      <div className="snow-night-glow absolute inset-0" />
      {/* Frost crystal edges on screen periphery */}
      <div className="snow-frost-edge absolute inset-0" />
      <div className="snow-distant-ridge absolute inset-x-0 top-[11%] h-[28%]" />
      <div className="snow-moon absolute right-[10%] top-[12%] h-28 w-28 rounded-full" />
      <div className="snow-frost-haze absolute inset-0" />
      <div className="snow-shadow-veil absolute inset-0" />

      {!reduceMotion ? (
        <div className="snow-snowfall absolute inset-0 overflow-hidden">
          {SNOW_FLAKES.map((flake, index) => (
            <span
              key={`snow-flake-${index}`}
              className="snow-flake absolute rounded-full"
              style={{
                left: flake.left,
                top: flake.top,
                width: flake.size,
                height: flake.size,
                opacity: flake.opacity,
                filter: `blur(${flake.blur})`,
                animationDuration: flake.duration,
                animationDelay: flake.delay,
                "--snow-drift": flake.drift,
              }}
            />
          ))}

          {SPINDRIFT.map((drift, index) => (
            <span
              key={`snow-spindrift-${index}`}
              className="snow-spindrift absolute"
              style={{
                left: drift.left,
                top: drift.top,
                width: drift.width,
                opacity: drift.opacity,
                animationDuration: drift.duration,
                animationDelay: drift.delay,
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
        <div className="snow-body-glow absolute inset-0" />
        <div className="snow-surface absolute inset-x-0 top-0 h-0">
          <div className="snow-drift snow-drift-back" />
          <div className="snow-drift snow-drift-mid" />
          <div className="snow-drift snow-drift-front" />
          <div className="snow-drift-shadow snow-drift-shadow-back" />
          <div className="snow-drift-shadow snow-drift-shadow-front" />
          <div className="snow-ripple-field absolute inset-x-0 top-[-3.5rem] h-36" />
          <div className="snow-crust-edge absolute inset-x-0 top-[-1.25rem] h-14" />
          <div className="snow-rim absolute inset-x-0 top-[-1.25rem] h-16" />

          {!reduceMotion ? (
            <div className="snow-surface-breath absolute inset-x-0 top-[-4rem] h-24">
              {RIDGE_LIGHTS.map((light, index) => (
                <span
                  key={`snow-ridge-light-${index}`}
                  className="snow-ridge-light absolute"
                  style={{
                    left: light.left,
                    top: light.top,
                    width: light.width,
                    height: light.height,
                  }}
                />
              ))}
              {/* Ice crystal sparkles on drift crest */}
              {ICE_SPARKLES.map((spark, index) => (
                <span
                  key={`snow-sparkle-${index}`}
                  className="snow-ice-sparkle absolute"
                  style={{
                    left:   spark.left,
                    top:    spark.top,
                    width:  spark.size,
                    height: spark.size,
                    animationDuration: spark.dur,
                    animationDelay:    spark.delay,
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
