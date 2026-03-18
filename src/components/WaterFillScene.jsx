import { motion } from "framer-motion";
import waterRippleTexture from "../assets/water/water-ripple-texture.png";
const WAVE_LAYERS = [
  {
    id: "deep-back",
    duration: 22,
    amplitude: 8,
    opacity: 0.18,
    strokeOpacity: 0,
    yOffset: 18,
    className: "timer-water-wave-deep-back",
    path: "M0,52 C85,48 155,40 235,42 C315,44 390,54 465,52 C540,50 615,40 695,38 C775,36 855,42 935,48 C1015,54 1095,56 1175,52 C1255,48 1335,42 1440,44 L1440,120 L0,120 Z",
    stroke: "M0,52 C85,48 155,40 235,42 C315,44 390,54 465,52 C540,50 615,40 695,38 C775,36 855,42 935,48 C1015,54 1095,56 1175,52 C1255,48 1335,42 1440,44",
  },
  {
    id: "mid-back",
    duration: 18,
    amplitude: 10,
    opacity: 0.32,
    strokeOpacity: 0,
    yOffset: 14,
    className: "timer-water-wave-mid-back",
    path: "M0,48 C70,44 140,35 215,39 C290,43 360,55 435,53 C510,51 580,38 655,34 C730,30 805,38 880,46 C955,54 1030,60 1105,56 C1180,52 1255,38 1330,36 C1400,34 1365,44 1440,50 L1440,120 L0,120 Z",
    stroke: "M0,48 C70,44 140,35 215,39 C290,43 360,55 435,53 C510,51 580,38 655,34 C730,30 805,38 880,46 C955,54 1030,60 1105,56 C1180,52 1255,38 1330,36 C1400,34 1365,44 1440,50",
  },
  {
    id: "mid-front",
    duration: 14,
    amplitude: 13,
    opacity: 0.48,
    strokeOpacity: 0.32,
    yOffset: 8,
    className: "timer-water-wave-mid-front",
    path: "M0,52 C60,46 125,37 195,40 C265,43 335,56 405,58 C475,60 545,46 615,42 C685,38 755,44 825,52 C895,60 965,66 1035,62 C1105,58 1175,46 1245,44 C1315,42 1380,50 1440,56 L1440,120 L0,120 Z",
    stroke: "M0,52 C60,46 125,37 195,40 C265,43 335,56 405,58 C475,60 545,46 615,42 C685,38 755,44 825,52 C895,60 965,66 1035,62 C1105,58 1175,46 1245,44 C1315,42 1380,50 1440,56",
  },
  {
    id: "front",
    duration: 10,
    amplitude: 16,
    opacity: 0.68,
    strokeOpacity: 0.58,
    yOffset: 0,
    className: "timer-water-wave-front",
    path: "M0,56 C55,50 115,38 185,40 C255,42 325,58 395,60 C465,62 535,48 605,42 C675,36 745,42 815,52 C885,62 955,70 1025,66 C1095,62 1165,46 1235,44 C1305,42 1370,52 1440,60 L1440,120 L0,120 Z",
    stroke: "M0,56 C55,50 115,38 185,40 C255,42 325,58 395,60 C465,62 535,48 605,42 C675,36 745,42 815,52 C885,62 955,70 1025,66 C1095,62 1165,46 1235,44 C1305,42 1370,52 1440,60",
  },
];

function clamp01(value) {
  return Math.max(0, Math.min(1, value || 0));
}

function WaterBody({ fillPercent, reduceMotion }) {
  return (
    <motion.div
      className="timer-water-fill absolute inset-x-0 bottom-0"
      animate={{ height: `${Math.max(fillPercent * 100, 0)}%` }}
      transition={{
        duration: reduceMotion ? 0.2 : 0.65,
        ease: [0.22, 0.8, 0.2, 1],
      }}
    >
      <div className="timer-water-body absolute inset-0 overflow-hidden">
        <div className="timer-water-gradient absolute inset-0" />

        <div className="timer-water-crest-fade absolute inset-x-0 top-0 h-28" />

        <motion.div
          className="timer-water-texture absolute inset-0"
          style={{ backgroundImage: `url(${waterRippleTexture})` }}
          animate={
            reduceMotion
              ? {}
              : {
                  backgroundPosition: ["0px 0px", "80px -56px", "144px -112px", "48px -80px", "0px 0px"],
                }
          }
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="timer-water-caustics absolute inset-0"
          animate={
            reduceMotion
              ? {}
              : {
                  backgroundPosition: ["0% 0%", "15% 75%", "28% 95%", "12% 55%", "0% 0%"],
                  opacity: [0.12, 0.20, 0.24, 0.16, 0.12],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: [0.40, 0, 0.60, 1] }}
        />

        <motion.div
          className="timer-water-micro-ripples absolute inset-0"
          animate={
            reduceMotion
              ? {}
              : {
                  backgroundPosition: ["0% 0%", "100% 100%"],
                  opacity: [0.05, 0.08, 0.05],
                }
          }
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="timer-water-highlight absolute inset-x-0 top-0 h-14"
          animate={reduceMotion ? {} : { opacity: [0.20, 0.36, 0.26, 0.20] }}
          transition={{ duration: 7, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
        />

        <motion.div
          className="timer-water-foam absolute inset-x-0 top-0"
          animate={
            reduceMotion
              ? {}
              : {
                  x: ["0%", "10%", "-5%", "6%", "0%"],
                  opacity: [0.16, 0.24, 0.20, 0.18, 0.16],
                }
          }
          transition={{ duration: 8.5, repeat: Infinity, ease: [0.40, 0, 0.60, 1] }}
        />

        <motion.div
          className="timer-water-specular absolute inset-x-0 top-0"
          animate={
            reduceMotion
              ? {}
              : {
                  x: ["-15%", "18%", "-15%"],
                  y: ["0%", "-10%", "0%"],
                  opacity: [0.14, 0.30, 0.14],
                }
          }
          transition={{ duration: 11, repeat: Infinity, ease: [0.38, 0, 0.62, 1] }}
        />
      </div>

      <WaterSurface reduceMotion={reduceMotion} />
    </motion.div>
  );
}

function WaterSurface({ reduceMotion }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[2]">
      <div className="timer-water-surface-window">
        {WAVE_LAYERS.map((layer) => {
          // Create more natural wave motion with organic patterns
          const getWaveMotion = () => {
            switch (layer.id) {
              case "deep-back":
                return [
                  layer.yOffset,
                  layer.yOffset - layer.amplitude * 0.20,
                  layer.yOffset + layer.amplitude * 0.12,
                  layer.yOffset - layer.amplitude * 0.15,
                  layer.yOffset + layer.amplitude * 0.08,
                  layer.yOffset - layer.amplitude * 0.05,
                  layer.yOffset,
                ];
              case "mid-back":
                return [
                  layer.yOffset,
                  layer.yOffset - layer.amplitude * 0.24,
                  layer.yOffset + layer.amplitude * 0.16,
                  layer.yOffset - layer.amplitude * 0.18,
                  layer.yOffset + layer.amplitude * 0.10,
                  layer.yOffset - layer.amplitude * 0.06,
                  layer.yOffset,
                ];
              case "mid-front":
                return [
                  layer.yOffset,
                  layer.yOffset - layer.amplitude * 0.28,
                  layer.yOffset + layer.amplitude * 0.20,
                  layer.yOffset - layer.amplitude * 0.22,
                  layer.yOffset + layer.amplitude * 0.12,
                  layer.yOffset - layer.amplitude * 0.10,
                  layer.yOffset + layer.amplitude * 0.04,
                  layer.yOffset,
                ];
              case "front":
                return [
                  layer.yOffset,
                  layer.yOffset - layer.amplitude * 0.35,
                  layer.yOffset + layer.amplitude * 0.24,
                  layer.yOffset - layer.amplitude * 0.28,
                  layer.yOffset + layer.amplitude * 0.16,
                  layer.yOffset - layer.amplitude * 0.12,
                  layer.yOffset + layer.amplitude * 0.08,
                  layer.yOffset - layer.amplitude * 0.04,
                  layer.yOffset,
                ];
              default:
                return [layer.yOffset];
            }
          };

          return (
            <motion.svg
              key={layer.id}
              className={`timer-water-surface-svg ${layer.className}`}
              viewBox="0 0 2880 120"
              preserveAspectRatio="none"
              animate={
                reduceMotion
                  ? {}
                  : {
                      x: ["0%", "-50%"],
                      y: getWaveMotion(),
                    }
              }
              transition={{
                x: {
                  duration: layer.duration,
                  repeat: Infinity,
                  ease: "linear",
                },
                y: {
                  duration: layer.duration * 0.90,
                  repeat: Infinity,
                  ease: [0.42, 0, 0.58, 1], // Smoother easing for more natural motion
                },
              }}
              style={{ left: "-2px" }}
            >
              <defs>
                <path id={`water-fill-${layer.id}`} d={layer.path} />
                <path id={`water-stroke-${layer.id}`} d={layer.stroke} />
              </defs>
              <use href={`#water-fill-${layer.id}`} x="0" className="timer-water-wave-fill" opacity={layer.opacity} />
              <use href={`#water-fill-${layer.id}`} x="1440" className="timer-water-wave-fill" opacity={layer.opacity} />
              <use
                href={`#water-stroke-${layer.id}`}
                x="0"
                className="timer-water-wave-stroke"
                opacity={layer.strokeOpacity}
              />
              <use
                href={`#water-stroke-${layer.id}`}
                x="1440"
                className="timer-water-wave-stroke"
                opacity={layer.strokeOpacity}
              />
            </motion.svg>
          );
        })}
      </div>
    </div>
  );
}

export default function WaterFillScene({ progress, reduceMotion = false, className = "" }) {
  const fillPercent = clamp01(progress);

  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`.trim()}>
      <div className="timer-water-backdrop absolute inset-0" />
      <div className="timer-water-vignette absolute inset-0" />
      <WaterBody fillPercent={fillPercent} reduceMotion={reduceMotion} />
      <div className="timer-water-overlay absolute inset-0" />
    </div>
  );
}
