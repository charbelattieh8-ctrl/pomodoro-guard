import { motion } from "framer-motion";
import { buildSceneVars, clamp01 } from "./utils";
import "./ForestFillScene.css";

// Falling leaf particles — varied sizes, drifts, and timings
const LEAVES = [
  { left: "4%",  top: "-8%",  size: "10px", dur: "14s", delay: "0s",   drift: "3.2rem",  driftEnd: "5.4rem"  },
  { left: "14%", top: "-4%",  size: "7px",  dur: "18s", delay: "3.2s", drift: "-2.8rem", driftEnd: "-4.6rem" },
  { left: "22%", top: "-6%",  size: "9px",  dur: "16s", delay: "5.8s", drift: "4.1rem",  driftEnd: "6.2rem"  },
  { left: "33%", top: "-3%",  size: "8px",  dur: "21s", delay: "1.4s", drift: "-3.4rem", driftEnd: "-5.1rem" },
  { left: "42%", top: "-7%",  size: "11px", dur: "13s", delay: "7.2s", drift: "2.6rem",  driftEnd: "4.4rem"  },
  { left: "53%", top: "-5%",  size: "7px",  dur: "17s", delay: "2.6s", drift: "-4rem",   driftEnd: "-6rem"   },
  { left: "62%", top: "-2%",  size: "9px",  dur: "19s", delay: "4.4s", drift: "3.8rem",  driftEnd: "5.6rem"  },
  { left: "72%", top: "-9%",  size: "8px",  dur: "15s", delay: "6.6s", drift: "-2.2rem", driftEnd: "-3.8rem" },
  { left: "81%", top: "-4%",  size: "10px", dur: "20s", delay: "0.8s", drift: "4.4rem",  driftEnd: "6.6rem"  },
  { left: "91%", top: "-6%",  size: "7px",  dur: "16s", delay: "8.4s", drift: "-3rem",   driftEnd: "-4.8rem" },
];

// Firefly glows distributed around the mid-scene
const FIREFLIES = [
  { left: "8%",  top: "48%", size: "6px",  dur: "4.2s", delay: "0s",   flyX: "1.4rem",  flyY: "-1.8rem", flyX2: "-0.8rem", flyY2: "-3.2rem" },
  { left: "19%", top: "56%", size: "5px",  dur: "5.8s", delay: "1.4s", flyX: "-2rem",   flyY: "-2.4rem", flyX2: "1.2rem",  flyY2: "-1.6rem" },
  { left: "31%", top: "44%", size: "7px",  dur: "3.9s", delay: "2.8s", flyX: "2.2rem",  flyY: "-1.2rem", flyX2: "-1rem",   flyY2: "-2.8rem" },
  { left: "46%", top: "52%", size: "5px",  dur: "6.4s", delay: "0.6s", flyX: "-1.6rem", flyY: "-2rem",   flyX2: "0.8rem",  flyY2: "-3.6rem" },
  { left: "58%", top: "46%", size: "6px",  dur: "4.6s", delay: "3.6s", flyX: "1.8rem",  flyY: "-1.4rem", flyX2: "-1.4rem", flyY2: "-2.2rem" },
  { left: "71%", top: "54%", size: "5px",  dur: "5.2s", delay: "1.8s", flyX: "-2.4rem", flyY: "-2.6rem", flyX2: "1.6rem",  flyY2: "-1.8rem" },
  { left: "83%", top: "49%", size: "7px",  dur: "4s",   delay: "4.6s", flyX: "1.2rem",  flyY: "-1rem",   flyX2: "-0.6rem", flyY2: "-2.6rem" },
  { left: "93%", top: "58%", size: "5px",  dur: "6s",   delay: "2.2s", flyX: "-1.8rem", flyY: "-1.6rem", flyX2: "1rem",    flyY2: "-3rem"   },
];

export default function ForestFillScene({ progress, reduceMotion = false, className = "", theme }) {
  const fillPercent = clamp01(progress);
  // Firefly intensity increases as forest "fills"
  const fireflyOpacity = 0.4 + fillPercent * 0.45;

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden forest-fill-scene ${className}`.trim()}
      style={buildSceneVars(theme)}
    >
      {/* Background sky and canopy layers */}
      <div className="forest-sky absolute inset-0" />
      <div className="forest-canopy absolute inset-x-0 top-0 h-[36%]" />
      <div className="forest-rays absolute inset-0" />
      <div className="forest-trunks absolute inset-x-0 top-[12%] h-[60%]" />
      <div className="forest-mist absolute inset-x-0 top-[22%] h-[40%]" />
      <div className="forest-light-pool absolute inset-0" />

      {/* Falling leaves */}
      {!reduceMotion ? (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {LEAVES.map((leaf, i) => (
            <span
              key={`forest-leaf-${i}`}
              className="forest-leaf absolute"
              style={{
                left: leaf.left,
                top: leaf.top,
                width: leaf.size,
                height: leaf.size,
                animationDuration: leaf.dur,
                animationDelay: leaf.delay,
                "--leaf-drift": leaf.drift,
                "--leaf-drift-end": leaf.driftEnd,
              }}
            />
          ))}
        </div>
      ) : null}

      {/* Rising fill (earth + moss) */}
      <motion.div
        className="forest-fill absolute inset-x-0 bottom-0"
        animate={{ height: `${fillPercent * 100}%` }}
        transition={{ duration: reduceMotion ? 0.2 : 0.7, ease: [0.22, 0.8, 0.2, 1] }}
      >
        <div className="forest-body absolute inset-0" />
        <div className="forest-body-moss absolute inset-0" />

        {/* Surface mounds at the fill top edge */}
        <div className="forest-surface absolute inset-x-0 top-0 h-0">
          <div className="forest-mound forest-mound-back" />
          <div className="forest-mound forest-mound-mid" />
          <div className="forest-mound forest-mound-front" />
          <div className="forest-crest-glow absolute inset-x-0 top-[-1.5rem] h-14" />
          <div className="forest-mound-shadow absolute inset-x-0 top-[-1rem] h-8" />
        </div>

        {/* Fireflies that glow inside the forest body */}
        {!reduceMotion ? (
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ opacity: fireflyOpacity }}
          >
            {FIREFLIES.map((fly, i) => (
              <span
                key={`forest-fly-${i}`}
                className="forest-firefly absolute"
                style={{
                  left: fly.left,
                  top: fly.top,
                  width: fly.size,
                  height: fly.size,
                  animationDuration: fly.dur,
                  animationDelay: fly.delay,
                  "--fly-x":  fly.flyX,
                  "--fly-y":  fly.flyY,
                  "--fly-x2": fly.flyX2,
                  "--fly-y2": fly.flyY2,
                }}
              />
            ))}
          </div>
        ) : null}
      </motion.div>

      {/* Global vignette */}
      <div className="scene-vignette absolute inset-0" />
    </div>
  );
}
