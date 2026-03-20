import { motion } from "framer-motion";
import waterRippleTexture from "../assets/water/water-ripple-texture.png";

/*
 * Calm ocean wave layers.
 * Gentle trochoid-like shapes with reduced amplitude.
 * Paths are 1440-wide, doubled to 2880 for seamless scroll. Start Y = End Y.
 */
const WAVE_LAYERS = [
  {
    id: "deep-swell",
    duration: 36,
    amplitude: 3,
    opacity: 0.08,
    strokeOpacity: 0,
    yOffset: 24,
    className: "timer-water-wave-deep-swell",
    // Very gentle swell (Y range ~56-66, start/end Y=62)
    path: "M0,62 C120,61 240,59 360,58 C420,57 480,56 540,57 C600,58 660,60 720,62 C800,64 880,66 960,65 C1040,64 1120,61 1200,58 C1260,56 1300,56 1360,58 C1400,60 1430,61 1440,62 L1440,140 L0,140 Z",
    stroke: "M0,62 C120,61 240,59 360,58 C420,57 480,56 540,57 C600,58 660,60 720,62 C800,64 880,66 960,65 C1040,64 1120,61 1200,58 C1260,56 1300,56 1360,58 C1400,60 1430,61 1440,62",
  },
  {
    id: "deep-back",
    duration: 28,
    amplitude: 4,
    opacity: 0.14,
    strokeOpacity: 0,
    yOffset: 20,
    className: "timer-water-wave-deep-back",
    // Gentle undulation (Y range ~48-64, start/end Y=58)
    path: "M0,58 C60,56 120,54 200,50 C260,48 300,49 360,52 C420,56 500,62 580,64 C660,64 720,60 800,56 C860,52 920,49 980,50 C1040,52 1120,58 1200,62 C1260,64 1300,62 1360,58 C1400,56 1430,57 1440,58 L1440,140 L0,140 Z",
    stroke: "M0,58 C60,56 120,54 200,50 C260,48 300,49 360,52 C420,56 500,62 580,64 C660,64 720,60 800,56 C860,52 920,49 980,50 C1040,52 1120,58 1200,62 C1260,64 1300,62 1360,58 C1400,56 1430,57 1440,58",
  },
  {
    id: "mid-back",
    duration: 24,
    amplitude: 5,
    opacity: 0.24,
    strokeOpacity: 0.05,
    yOffset: 16,
    className: "timer-water-wave-mid-back",
    // Moderate gentle waves (Y range ~42-66, start/end Y=56)
    path: "M0,56 C50,58 100,62 160,64 C220,66 260,64 300,58 C330,54 355,48 385,44 C415,42 435,43 460,48 C490,54 530,62 580,64 C640,66 690,64 740,58 C770,54 800,48 830,44 C860,42 880,43 910,48 C950,54 1000,62 1060,66 C1120,66 1170,62 1220,56 C1260,50 1290,46 1330,44 C1360,44 1390,48 1420,54 C1432,56 1438,56 1440,56 L1440,140 L0,140 Z",
    stroke: "M0,56 C50,58 100,62 160,64 C220,66 260,64 300,58 C330,54 355,48 385,44 C415,42 435,43 460,48 C490,54 530,62 580,64 C640,66 690,64 740,58 C770,54 800,48 830,44 C860,42 880,43 910,48 C950,54 1000,62 1060,66 C1120,66 1170,62 1220,56 C1260,50 1290,46 1330,44 C1360,44 1390,48 1420,54 C1432,56 1438,56 1440,56",
  },
  {
    id: "rolling",
    duration: 26,
    amplitude: 3,
    opacity: 0.30,
    strokeOpacity: 0.08,
    yOffset: 14,
    className: "timer-water-wave-rolling",
    // Very calm, long-wavelength rolling (Y range ~52-62, start/end Y=58)
    path: "M0,58 C100,56 200,54 320,52 C400,52 480,54 560,56 C640,58 720,60 800,62 C880,62 960,60 1040,58 C1120,56 1200,54 1280,52 C1340,52 1390,54 1420,56 C1435,57 1440,58 1440,58 L1440,140 L0,140 Z",
    stroke: "M0,58 C100,56 200,54 320,52 C400,52 480,54 560,56 C640,58 720,60 800,62 C880,62 960,60 1040,58 C1120,56 1200,54 1280,52 C1340,52 1390,54 1420,56 C1435,57 1440,58 1440,58",
  },
  {
    id: "mid-front",
    duration: 18,
    amplitude: 7,
    opacity: 0.40,
    strokeOpacity: 0.18,
    yOffset: 10,
    className: "timer-water-wave-mid-front",
    // Gentle crests (Y range ~40-70, start/end Y=62)
    path: "M0,62 C40,64 80,66 130,68 C180,70 210,68 245,62 C270,58 290,50 310,44 C330,40 345,40 365,44 C390,50 420,60 460,66 C510,70 560,70 610,66 C640,62 665,54 690,46 C710,42 725,40 745,42 C770,46 800,56 840,64 C880,68 930,70 980,68 C1020,66 1050,60 1080,52 C1100,46 1115,42 1135,42 C1155,42 1180,48 1210,58 C1250,66 1290,70 1340,68 C1380,66 1410,64 1440,62 L1440,140 L0,140 Z",
    stroke: "M0,62 C40,64 80,66 130,68 C180,70 210,68 245,62 C270,58 290,50 310,44 C330,40 345,40 365,44 C390,50 420,60 460,66 C510,70 560,70 610,66 C640,62 665,54 690,46 C710,42 725,40 745,42 C770,46 800,56 840,64 C880,68 930,70 980,68 C1020,66 1050,60 1080,52 C1100,46 1115,42 1135,42 C1155,42 1180,48 1210,58 C1250,66 1290,70 1340,68 C1380,66 1410,64 1440,62",
  },
  {
    id: "front",
    duration: 14,
    amplitude: 9,
    opacity: 0.58,
    strokeOpacity: 0.40,
    yOffset: 4,
    className: "timer-water-wave-front",
    // Most visible — still gentle (Y range ~36-76, start/end Y=66)
    path: "M0,66 C30,68 70,72 120,74 C170,76 200,74 235,68 C260,62 280,54 305,46 C325,40 340,38 360,40 C380,42 405,52 435,62 C470,72 520,76 570,76 C620,74 655,68 685,60 C705,52 720,44 740,40 C755,36 770,38 790,42 C815,50 850,62 890,72 C930,76 980,76 1030,72 C1065,68 1090,60 1115,50 C1135,44 1148,40 1165,38 C1182,38 1200,42 1225,52 C1260,64 1300,74 1350,76 C1385,76 1410,72 1430,68 C1438,66 1440,66 1440,66 L1440,140 L0,140 Z",
    stroke: "M0,66 C30,68 70,72 120,74 C170,76 200,74 235,68 C260,62 280,54 305,46 C325,40 340,38 360,40 C380,42 405,52 435,62 C470,72 520,76 570,76 C620,74 655,68 685,60 C705,52 720,44 740,40 C755,36 770,38 790,42 C815,50 850,62 890,72 C930,76 980,76 1030,72 C1065,68 1090,60 1115,50 C1135,44 1148,40 1165,38 C1182,38 1200,42 1225,52 C1260,64 1300,74 1350,76 C1385,76 1410,72 1430,68 C1438,66 1440,66 1440,66",
  },
];

/** Bubble configuration — positions and timing for rising bubbles */
const BUBBLES = [
  { left: "8%", size: 6, delay: 0, duration: 12, drift: 15 },
  { left: "15%", size: 4, delay: 2.5, duration: 14, drift: -10 },
  { left: "23%", size: 8, delay: 5, duration: 10, drift: 20 },
  { left: "32%", size: 3, delay: 1, duration: 16, drift: -8 },
  { left: "41%", size: 5, delay: 7, duration: 13, drift: 12 },
  { left: "52%", size: 7, delay: 3, duration: 11, drift: -18 },
  { left: "60%", size: 4, delay: 8, duration: 15, drift: 10 },
  { left: "68%", size: 6, delay: 0.5, duration: 12, drift: -14 },
  { left: "76%", size: 9, delay: 4, duration: 9, drift: 16 },
  { left: "83%", size: 3, delay: 6, duration: 17, drift: -6 },
  { left: "90%", size: 5, delay: 2, duration: 14, drift: 12 },
  { left: "47%", size: 4, delay: 9, duration: 13, drift: -10 },
  { left: "18%", size: 7, delay: 6.5, duration: 11, drift: 14 },
  { left: "72%", size: 5, delay: 3.5, duration: 15, drift: -12 },
  { left: "35%", size: 3, delay: 11, duration: 16, drift: 8 },
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

function Bubbles({ reduceMotion }) {
  if (reduceMotion) return null;
  return (
    <div className="timer-water-bubbles absolute inset-0 overflow-hidden">
      {BUBBLES.map((b, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="timer-water-bubble absolute rounded-full"
          style={{
            left: b.left,
            bottom: "-5%",
            width: b.size,
            height: b.size,
          }}
          animate={{
            y: [0, "-110vh"],
            x: [0, b.drift, b.drift * 0.4, b.drift * 0.8, 0],
            opacity: [0, 0.6, 0.5, 0.3, 0],
            scale: [0.6, 1, 1.1, 1.2, 1.3],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: "linear",
            opacity: { duration: b.duration, times: [0, 0.05, 0.4, 0.85, 1] },
          }}
        />
      ))}
    </div>
  );
}

function GodRays({ reduceMotion }) {
  if (reduceMotion) return null;
  return (
    <div className="timer-water-godrays absolute inset-0 overflow-hidden">
      <motion.div
        className="timer-water-godray timer-water-godray-1 absolute"
        animate={{
          opacity: [0.04, 0.10, 0.06, 0.08, 0.04],
          x: ["-5%", "3%", "-2%", "4%", "-5%"],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
      />
      <motion.div
        className="timer-water-godray timer-water-godray-2 absolute"
        animate={{
          opacity: [0.03, 0.08, 0.05, 0.07, 0.03],
          x: ["3%", "-4%", "2%", "-3%", "3%"],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
      />
      <motion.div
        className="timer-water-godray timer-water-godray-3 absolute"
        animate={{
          opacity: [0.02, 0.06, 0.04, 0.05, 0.02],
          x: ["-2%", "5%", "0%", "3%", "-2%"],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
      />
    </div>
  );
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

        <div className="timer-water-crest-fade absolute inset-x-0 top-0 h-44" />

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
                  x: ["0%", "4%", "-2%", "3%", "0%"],
                  opacity: [0.10, 0.16, 0.13, 0.12, 0.10],
                }
          }
          transition={{ duration: 12, repeat: Infinity, ease: [0.40, 0, 0.60, 1] }}
        />

        <motion.div
          className="timer-water-specular absolute inset-x-0 top-0"
          animate={
            reduceMotion
              ? {}
              : {
                  x: ["-10%", "12%", "-10%"],
                  y: ["0%", "-6%", "0%"],
                  opacity: [0.08, 0.18, 0.08],
                }
          }
          transition={{ duration: 16, repeat: Infinity, ease: [0.38, 0, 0.62, 1] }}
        />

        <motion.div
          className="timer-water-sunbeam absolute inset-0"
          animate={
            reduceMotion
              ? {}
              : {
                  x: ["-15%", "15%", "-15%"],
                  opacity: [0.0, 0.06, 0.0],
                }
          }
          transition={{ duration: 22, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
        />

        {/* Underwater effects */}
        <GodRays reduceMotion={reduceMotion} />
        <Bubbles reduceMotion={reduceMotion} />
      </div>

      <WaterSurface reduceMotion={reduceMotion} />
    </motion.div>
  );
}

function WaterSurface({ reduceMotion }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[2]">
      {/* Ocean swell — slow, gentle vertical breathing */}
      <motion.div
        className="timer-water-surface-window"
        animate={
          reduceMotion
            ? {}
            : {
                y: [0, -3, 1, -2, 0],
              }
        }
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: [0.42, 0, 0.58, 1],
        }}
      >
        {WAVE_LAYERS.map((layer) => {
          const getWaveMotion = () => {
            const y = layer.yOffset;
            const a = layer.amplitude;
            switch (layer.id) {
              case "deep-swell":
                return [y, y - a * 0.06, y + a * 0.04, y];
              case "deep-back":
                return [y, y - a * 0.10, y + a * 0.06, y - a * 0.04, y];
              case "mid-back":
                return [y, y - a * 0.14, y + a * 0.08, y - a * 0.06, y];
              case "rolling":
                return [y, y - a * 0.10, y + a * 0.06, y];
              case "mid-front":
                return [y, y - a * 0.16, y + a * 0.10, y - a * 0.08, y + a * 0.04, y];
              case "front":
                return [y, y - a * 0.20, y + a * 0.12, y - a * 0.10, y + a * 0.05, y];
              default:
                return [y];
            }
          };

          return (
            <motion.svg
              key={layer.id}
              className={`timer-water-surface-svg ${layer.className}`}
              viewBox="0 -30 2880 180"
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
      </motion.div>
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
