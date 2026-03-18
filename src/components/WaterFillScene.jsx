import { motion } from "framer-motion";
import waterRippleTexture from "../assets/water/water-ripple-texture.png";
const WAVE_LAYERS = [
  {
    id: "deep-back",
    duration: 18,
    amplitude: 5,
    opacity: 0.22,
    strokeOpacity: 0,
    yOffset: 14,
    className: "timer-water-wave-deep-back",
    path: "M0,48 C90,45 150,38 230,40 C310,42 380,52 460,50 C540,48 620,38 700,36 C780,34 860,40 940,46 C1020,52 1100,54 1180,50 C1260,46 1340,40 1440,42 L1440,120 L0,120 Z",
    stroke: "M0,48 C90,45 150,38 230,40 C310,42 380,52 460,50 C540,48 620,38 700,36 C780,34 860,40 940,46 C1020,52 1100,54 1180,50 C1260,46 1340,40 1440,42",
  },
  {
    id: "mid-back",
    duration: 14.5,
    amplitude: 8,
    opacity: 0.35,
    strokeOpacity: 0,
    yOffset: 10,
    className: "timer-water-wave-mid-back",
    path: "M0,46 C75,42 145,34 220,38 C295,42 365,54 440,52 C515,50 585,36 660,32 C735,28 810,36 885,44 C960,52 1035,58 1110,54 C1185,50 1260,36 1335,34 C1405,32 1370,42 1440,48 L1440,120 L0,120 Z",
    stroke: "M0,46 C75,42 145,34 220,38 C295,42 365,54 440,52 C515,50 585,36 660,32 C735,28 810,36 885,44 C960,52 1035,58 1110,54 C1185,50 1260,36 1335,34 C1405,32 1370,42 1440,48",
  },
  {
    id: "mid-front",
    duration: 11,
    amplitude: 10,
    opacity: 0.50,
    strokeOpacity: 0.28,
    yOffset: 5,
    className: "timer-water-wave-mid-front",
    path: "M0,50 C65,45 130,36 200,38 C270,40 340,54 410,56 C480,58 550,44 620,40 C690,36 760,42 830,50 C900,58 970,64 1040,60 C1110,56 1180,44 1250,42 C1320,40 1385,48 1440,54 L1440,120 L0,120 Z",
    stroke: "M0,50 C65,45 130,36 200,38 C270,40 340,54 410,56 C480,58 550,44 620,40 C690,36 760,42 830,50 C900,58 970,64 1040,60 C1110,56 1180,44 1250,42 C1320,40 1385,48 1440,54",
  },
  {
    id: "front",
    duration: 8.5,
    amplitude: 13,
    opacity: 0.72,
    strokeOpacity: 0.62,
    yOffset: 0,
    className: "timer-water-wave-front",
    path: "M0,54 C58,48 118,36 188,38 C258,40 328,56 398,58 C468,60 538,46 608,40 C678,34 748,40 818,50 C888,60 958,68 1028,64 C1098,60 1168,44 1238,42 C1308,40 1375,50 1440,58 L1440,120 L0,120 Z",
    stroke: "M0,54 C58,48 118,36 188,38 C258,40 328,56 398,58 C468,60 538,46 608,40 C678,34 748,40 818,50 C888,60 958,68 1028,64 C1098,60 1168,44 1238,42 C1308,40 1375,50 1440,58",
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
                  backgroundPosition: ["0px 0px", "96px -64px", "0px -128px"],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="timer-water-caustics absolute inset-0"
          animate={
            reduceMotion
              ? {}
              : {
                  backgroundPosition: ["0% 0%", "18% 85%", "32% 100%", "14% 60%", "0% 0%"],
                  opacity: [0.10, 0.18, 0.22, 0.15, 0.10],
                }
          }
          transition={{ duration: 16, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
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
          animate={reduceMotion ? {} : { opacity: [0.18, 0.32, 0.22, 0.18] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }}
        />

        <motion.div
          className="timer-water-foam absolute inset-x-0 top-0"
          animate={
            reduceMotion
              ? {}
              : {
                  x: ["0%", "8%", "-4%", "0%"],
                  opacity: [0.15, 0.22, 0.18, 0.15],
                }
          }
          transition={{ duration: 7.5, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }}
        />

        <motion.div
          className="timer-water-specular absolute inset-x-0 top-0"
          animate={
            reduceMotion
              ? {}
              : {
                  x: ["-12%", "14%", "-12%"],
                  y: ["0%", "-8%", "0%"],
                  opacity: [0.12, 0.26, 0.12],
                }
          }
          transition={{ duration: 10.5, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
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
          // Create more natural wave motion with varied patterns per layer
          const getWaveMotion = () => {
            switch (layer.id) {
              case "deep-back":
                return [
                  layer.yOffset,
                  layer.yOffset - layer.amplitude * 0.14,
                  layer.yOffset + layer.amplitude * 0.08,
                  layer.yOffset - layer.amplitude * 0.10,
                  layer.yOffset,
                ];
              case "mid-back":
                return [
                  layer.yOffset,
                  layer.yOffset - layer.amplitude * 0.18,
                  layer.yOffset + layer.amplitude * 0.12,
                  layer.yOffset - layer.amplitude * 0.14,
                  layer.yOffset,
                ];
              case "mid-front":
                return [
                  layer.yOffset,
                  layer.yOffset - layer.amplitude * 0.22,
                  layer.yOffset + layer.amplitude * 0.16,
                  layer.yOffset - layer.amplitude * 0.18,
                  layer.yOffset,
                ];
              case "front":
                return [
                  layer.yOffset,
                  layer.yOffset - layer.amplitude * 0.28,
                  layer.yOffset + layer.amplitude * 0.20,
                  layer.yOffset - layer.amplitude * 0.24,
                  layer.yOffset + layer.amplitude * 0.12,
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
                  duration: layer.duration * 0.85,
                  repeat: Infinity,
                  ease: [0.45, 0.05, 0.55, 0.95], // Custom easing for more natural motion
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
