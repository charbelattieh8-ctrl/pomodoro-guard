import { motion } from "framer-motion";
import waterRippleTexture from "../assets/water/water-ripple-texture.png";

const WAVE_LAYERS = [
  {
    id: "deep-back",
    duration: 24,
    amplitude: 6,
    opacity: 0.14,
    strokeOpacity: 0,
    yOffset: 20,
    className: "timer-water-wave-deep-back",
    path: "M0,54 C60,50 120,44 200,46 C280,48 340,56 420,54 C500,52 560,42 640,40 C720,38 800,46 880,50 C960,54 1040,58 1120,54 C1200,50 1280,44 1360,46 L1440,48 L1440,120 L0,120 Z",
    stroke: "M0,54 C60,50 120,44 200,46 C280,48 340,56 420,54 C500,52 560,42 640,40 C720,38 800,46 880,50 C960,54 1040,58 1120,54 C1200,50 1280,44 1360,46 L1440,48",
  },
  {
    id: "mid-back",
    duration: 19,
    amplitude: 9,
    opacity: 0.28,
    strokeOpacity: 0,
    yOffset: 15,
    className: "timer-water-wave-mid-back",
    path: "M0,50 C55,46 115,36 190,40 C265,44 335,56 410,54 C485,52 555,38 630,35 C705,32 780,40 855,48 C930,56 1005,62 1080,58 C1155,54 1230,40 1305,38 C1375,36 1340,46 1440,52 L1440,120 L0,120 Z",
    stroke: "M0,50 C55,46 115,36 190,40 C265,44 335,56 410,54 C485,52 555,38 630,35 C705,32 780,40 855,48 C930,56 1005,62 1080,58 C1155,54 1230,40 1305,38 C1375,36 1340,46 1440,52",
  },
  {
    id: "mid-front",
    duration: 15,
    amplitude: 12,
    opacity: 0.44,
    strokeOpacity: 0.28,
    yOffset: 8,
    className: "timer-water-wave-mid-front",
    path: "M0,52 C50,46 110,38 180,41 C250,44 320,57 390,59 C460,61 530,47 600,43 C670,39 740,45 810,53 C880,61 950,67 1020,63 C1090,59 1160,47 1230,45 C1300,43 1365,51 1440,57 L1440,120 L0,120 Z",
    stroke: "M0,52 C50,46 110,38 180,41 C250,44 320,57 390,59 C460,61 530,47 600,43 C670,39 740,45 810,53 C880,61 950,67 1020,63 C1090,59 1160,47 1230,45 C1300,43 1365,51 1440,57",
  },
  {
    id: "front",
    duration: 11,
    amplitude: 15,
    opacity: 0.64,
    strokeOpacity: 0.52,
    yOffset: 0,
    className: "timer-water-wave-front",
    path: "M0,56 C45,50 100,39 170,41 C240,43 310,59 380,61 C450,63 520,49 590,43 C660,37 730,43 800,53 C870,63 940,71 1010,67 C1080,63 1150,47 1220,45 C1290,43 1355,53 1440,61 L1440,120 L0,120 Z",
    stroke: "M0,56 C45,50 100,39 170,41 C240,43 310,59 380,61 C450,63 520,49 590,43 C660,37 730,43 800,53 C870,63 940,71 1010,67 C1080,63 1150,47 1220,45 C1290,43 1355,53 1440,61",
  },
];

function clamp01(value) {
  return Math.max(0, Math.min(1, value || 0));
}

/** Convert hex to "r, g, b" string for use in rgba() */
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
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
                  opacity: [0.10, 0.18, 0.22, 0.14, 0.10],
                }
          }
          transition={{ duration: 20, repeat: Infinity, ease: [0.40, 0, 0.60, 1] }}
        />

        <motion.div
          className="timer-water-micro-ripples absolute inset-0"
          animate={
            reduceMotion
              ? {}
              : {
                  backgroundPosition: ["0% 0%", "100% 100%"],
                  opacity: [0.04, 0.07, 0.04],
                }
          }
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="timer-water-depth-shimmer absolute inset-0"
          animate={
            reduceMotion
              ? {}
              : {
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  opacity: [0.06, 0.12, 0.06],
                }
          }
          transition={{ duration: 16, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
        />

        <motion.div
          className="timer-water-highlight absolute inset-x-0 top-0 h-14"
          animate={reduceMotion ? {} : { opacity: [0.18, 0.32, 0.24, 0.18] }}
          transition={{ duration: 7, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
        />

        <motion.div
          className="timer-water-foam absolute inset-x-0 top-0"
          animate={
            reduceMotion
              ? {}
              : {
                  x: ["0%", "8%", "-4%", "5%", "0%"],
                  opacity: [0.14, 0.22, 0.18, 0.16, 0.14],
                }
          }
          transition={{ duration: 9, repeat: Infinity, ease: [0.40, 0, 0.60, 1] }}
        />

        <motion.div
          className="timer-water-specular absolute inset-x-0 top-0"
          animate={
            reduceMotion
              ? {}
              : {
                  x: ["-15%", "18%", "-15%"],
                  y: ["0%", "-10%", "0%"],
                  opacity: [0.12, 0.26, 0.12],
                }
          }
          transition={{ duration: 12, repeat: Infinity, ease: [0.38, 0, 0.62, 1] }}
        />

        <motion.div
          className="timer-water-sunbeam absolute inset-0"
          animate={
            reduceMotion
              ? {}
              : {
                  x: ["-20%", "20%", "-20%"],
                  opacity: [0.0, 0.08, 0.0],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
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
          const getWaveMotion = () => {
            switch (layer.id) {
              case "deep-back":
                return [
                  layer.yOffset,
                  layer.yOffset - layer.amplitude * 0.18,
                  layer.yOffset + layer.amplitude * 0.10,
                  layer.yOffset - layer.amplitude * 0.12,
                  layer.yOffset + layer.amplitude * 0.06,
                  layer.yOffset,
                ];
              case "mid-back":
                return [
                  layer.yOffset,
                  layer.yOffset - layer.amplitude * 0.22,
                  layer.yOffset + layer.amplitude * 0.14,
                  layer.yOffset - layer.amplitude * 0.16,
                  layer.yOffset + layer.amplitude * 0.08,
                  layer.yOffset,
                ];
              case "mid-front":
                return [
                  layer.yOffset,
                  layer.yOffset - layer.amplitude * 0.26,
                  layer.yOffset + layer.amplitude * 0.18,
                  layer.yOffset - layer.amplitude * 0.20,
                  layer.yOffset + layer.amplitude * 0.10,
                  layer.yOffset - layer.amplitude * 0.08,
                  layer.yOffset,
                ];
              case "front":
                return [
                  layer.yOffset,
                  layer.yOffset - layer.amplitude * 0.32,
                  layer.yOffset + layer.amplitude * 0.22,
                  layer.yOffset - layer.amplitude * 0.26,
                  layer.yOffset + layer.amplitude * 0.14,
                  layer.yOffset - layer.amplitude * 0.10,
                  layer.yOffset + layer.amplitude * 0.06,
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
              viewBox="0 -24 2880 156"
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
                  duration: layer.duration * 0.88,
                  repeat: Infinity,
                  ease: [0.42, 0, 0.58, 1],
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

export default function WaterFillScene({ progress, reduceMotion = false, className = "", theme }) {
  const fillPercent = clamp01(progress);

  const water = theme?.water;
  const cssVars = water
    ? {
        "--water-base": water.base,
        "--water-base-rgb": hexToRgb(water.base),
        "--water-light": water.light,
        "--water-light-rgb": hexToRgb(water.light),
        "--water-crest": water.crest,
        "--water-crest-rgb": hexToRgb(water.crest),
        "--water-deep": water.deep,
        "--water-deep-rgb": hexToRgb(water.deep),
      }
    : {};

  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`.trim()} style={cssVars}>
      <div className="timer-water-backdrop absolute inset-0" />
      <div className="timer-water-vignette absolute inset-0" />
      <WaterBody fillPercent={fillPercent} reduceMotion={reduceMotion} />
      <div className="timer-water-overlay absolute inset-0" />
    </div>
  );
}
