import { motion } from "framer-motion";
import waterRippleTexture from "../assets/water/water-ripple-texture.png";

/*
 * Ocean-realistic wave layers.
 * Each path uses trochoid-like shapes: sharp narrow crests, broad flat troughs.
 * Multiple wavelengths are superimposed for natural irregularity.
 * Paths are designed for a 1440-wide viewport (doubled to 2880 for seamless scroll).
 */
const WAVE_LAYERS = [
  {
    id: "deep-swell",
    duration: 32,
    amplitude: 4,
    opacity: 0.08,
    strokeOpacity: 0,
    yOffset: 28,
    className: "timer-water-wave-deep-swell",
    // Very long wavelength, gentle undulation — deep ocean swell (start/end Y=62)
    path: "M0,62 C120,60 240,58 360,56 C420,55 460,50 500,44 C540,38 560,36 600,38 C640,40 680,48 720,54 C800,62 920,66 1040,64 C1100,63 1140,58 1180,50 C1220,42 1240,38 1280,40 C1320,42 1380,54 1440,62 L1440,140 L0,140 Z",
    stroke: "M0,62 C120,60 240,58 360,56 C420,55 460,50 500,44 C540,38 560,36 600,38 C640,40 680,48 720,54 C800,62 920,66 1040,64 C1100,63 1140,58 1180,50 C1220,42 1240,38 1280,40 C1320,42 1380,54 1440,62",
  },
  {
    id: "deep-back",
    duration: 26,
    amplitude: 7,
    opacity: 0.15,
    strokeOpacity: 0,
    yOffset: 22,
    className: "timer-water-wave-deep-back",
    // Broad troughs, moderate crests (start/end Y=58)
    path: "M0,58 C60,56 100,54 150,48 C180,44 200,38 230,34 C260,30 280,32 320,40 C360,48 420,58 500,62 C560,64 620,62 680,56 C720,52 750,44 790,38 C830,32 860,30 900,34 C940,38 1000,52 1060,60 C1120,64 1180,62 1220,56 C1260,50 1290,44 1330,40 C1370,38 1400,46 1440,58 L1440,140 L0,140 Z",
    stroke: "M0,58 C60,56 100,54 150,48 C180,44 200,38 230,34 C260,30 280,32 320,40 C360,48 420,58 500,62 C560,64 620,62 680,56 C720,52 750,44 790,38 C830,32 860,30 900,34 C940,38 1000,52 1060,60 C1120,64 1180,62 1220,56 C1260,50 1290,44 1330,40 C1370,38 1400,46 1440,58",
  },
  {
    id: "mid-back",
    duration: 21,
    amplitude: 10,
    opacity: 0.26,
    strokeOpacity: 0.06,
    yOffset: 16,
    className: "timer-water-wave-mid-back",
    // More pronounced crests, flatter troughs (start/end Y=54)
    path: "M0,54 C40,56 80,60 130,62 C180,64 210,62 240,54 C260,48 275,38 295,30 C315,22 330,20 350,24 C370,28 400,42 440,54 C480,62 540,66 600,64 C640,62 670,56 700,46 C720,40 740,32 760,26 C780,22 800,22 820,28 C850,36 890,50 940,60 C990,66 1050,66 1100,62 C1140,58 1170,48 1200,38 C1220,32 1240,26 1260,24 C1280,24 1310,30 1350,40 C1390,50 1420,54 1440,54 L1440,140 L0,140 Z",
    stroke: "M0,54 C40,56 80,60 130,62 C180,64 210,62 240,54 C260,48 275,38 295,30 C315,22 330,20 350,24 C370,28 400,42 440,54 C480,62 540,66 600,64 C640,62 670,56 700,46 C720,40 740,32 760,26 C780,22 800,22 820,28 C850,36 890,50 940,60 C990,66 1050,66 1100,62 C1140,58 1170,48 1200,38 C1220,32 1240,26 1260,24 C1280,24 1310,30 1350,40 C1390,50 1420,54 1440,54",
  },
  {
    id: "mid-front",
    duration: 16,
    amplitude: 14,
    opacity: 0.42,
    strokeOpacity: 0.22,
    yOffset: 10,
    className: "timer-water-wave-mid-front",
    // Sharp trochoid crests, broad flat troughs (start/end Y=60)
    path: "M0,60 C30,62 70,66 120,68 C170,68 200,64 225,56 C240,50 252,40 265,30 C278,20 288,16 300,18 C312,20 325,30 340,44 C360,58 400,66 460,68 C520,68 560,64 590,56 C610,50 625,38 640,28 C655,18 665,14 680,16 C695,18 712,30 735,46 C760,60 800,68 860,70 C920,70 960,64 990,54 C1010,46 1025,36 1040,26 C1055,18 1065,14 1080,16 C1095,18 1115,32 1140,48 C1170,62 1210,68 1270,70 C1320,68 1360,64 1400,60 C1420,58 1435,59 1440,60 L1440,140 L0,140 Z",
    stroke: "M0,60 C30,62 70,66 120,68 C170,68 200,64 225,56 C240,50 252,40 265,30 C278,20 288,16 300,18 C312,20 325,30 340,44 C360,58 400,66 460,68 C520,68 560,64 590,56 C610,50 625,38 640,28 C655,18 665,14 680,16 C695,18 712,30 735,46 C760,60 800,68 860,70 C920,70 960,64 990,54 C1010,46 1025,36 1040,26 C1055,18 1065,14 1080,16 C1095,18 1115,32 1140,48 C1170,62 1210,68 1270,70 C1320,68 1360,64 1400,60 C1420,58 1435,59 1440,60",
  },
  {
    id: "front",
    duration: 12,
    amplitude: 18,
    opacity: 0.62,
    strokeOpacity: 0.48,
    yOffset: 2,
    className: "timer-water-wave-front",
    // Most dramatic — steep crests, wide deep troughs (start/end Y=66)
    path: "M0,66 C20,68 50,72 90,74 C140,74 170,72 195,64 C210,58 222,46 235,34 C248,22 256,14 268,12 C280,10 290,14 305,26 C320,38 340,54 370,66 C400,72 440,76 490,76 C540,74 570,68 595,58 C612,50 624,38 638,26 C652,14 660,10 674,10 C688,10 700,18 718,34 C738,50 760,66 800,74 C840,78 890,78 940,74 C970,70 995,60 1015,48 C1030,38 1042,26 1055,16 C1068,8 1078,6 1090,8 C1102,10 1118,24 1138,42 C1162,60 1195,74 1240,76 C1290,76 1330,74 1370,70 C1400,68 1425,66 1440,66 L1440,140 L0,140 Z",
    stroke: "M0,66 C20,68 50,72 90,74 C140,74 170,72 195,64 C210,58 222,46 235,34 C248,22 256,14 268,12 C280,10 290,14 305,26 C320,38 340,54 370,66 C400,72 440,76 490,76 C540,74 570,68 595,58 C612,50 624,38 638,26 C652,14 660,10 674,10 C688,10 700,18 718,34 C738,50 760,66 800,74 C840,78 890,78 940,74 C970,70 995,60 1015,48 C1030,38 1042,26 1055,16 C1068,8 1078,6 1090,8 C1102,10 1118,24 1138,42 C1162,60 1195,74 1240,76 C1290,76 1330,74 1370,70 C1400,68 1425,66 1440,66",
  },
  {
    id: "spray",
    duration: 9,
    amplitude: 22,
    opacity: 0.38,
    strokeOpacity: 0.65,
    yOffset: -4,
    className: "timer-water-wave-spray",
    // Fast choppy surface waves with spray-like peaks (start/end Y=64)
    path: "M0,64 C15,66 35,72 60,74 C85,74 100,70 115,62 C125,56 133,44 142,32 C151,20 158,14 168,12 C178,10 188,16 200,28 C216,44 235,62 265,72 C290,76 315,74 340,66 C355,60 365,48 378,36 C391,24 398,16 410,14 C422,12 432,18 448,32 C468,50 490,68 530,76 C560,78 590,74 615,64 C632,56 642,44 655,32 C668,20 676,14 688,12 C700,10 712,18 728,34 C748,52 775,70 810,76 C840,78 868,74 892,64 C908,56 920,44 934,32 C948,20 956,14 968,12 C980,10 992,18 1008,34 C1028,52 1055,70 1090,76 C1120,78 1148,74 1172,64 C1188,56 1200,44 1214,32 C1228,20 1236,14 1248,12 C1260,10 1272,18 1288,34 C1308,52 1335,70 1370,76 C1395,78 1415,72 1440,64 L1440,140 L0,140 Z",
    stroke: "M0,64 C15,66 35,72 60,74 C85,74 100,70 115,62 C125,56 133,44 142,32 C151,20 158,14 168,12 C178,10 188,16 200,28 C216,44 235,62 265,72 C290,76 315,74 340,66 C355,60 365,48 378,36 C391,24 398,16 410,14 C422,12 432,18 448,32 C468,50 490,68 530,76 C560,78 590,74 615,64 C632,56 642,44 655,32 C668,20 676,14 688,12 C700,10 712,18 728,34 C748,52 775,70 810,76 C840,78 868,74 892,64 C908,56 920,44 934,32 C948,20 956,14 968,12 C980,10 992,18 1008,34 C1028,52 1055,70 1090,76 C1120,78 1148,74 1172,64 C1188,56 1200,44 1214,32 C1228,20 1236,14 1248,12 C1260,10 1272,18 1288,34 C1308,52 1335,70 1370,76 C1395,78 1415,72 1440,64",
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
      {/* Ocean swell — slow, large vertical breathing on the whole surface */}
      <motion.div
        className="timer-water-surface-window"
        animate={
          reduceMotion
            ? {}
            : {
                y: [0, -6, 2, -4, 0],
              }
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: [0.42, 0, 0.58, 1],
        }}
      >
        {WAVE_LAYERS.map((layer) => {
          // Ocean-realistic vertical motion: irregular swell with different
          // frequencies per layer (deeper = slower/gentler, surface = choppier)
          const getWaveMotion = () => {
            const y = layer.yOffset;
            const a = layer.amplitude;
            switch (layer.id) {
              case "deep-swell":
                // Barely moves — deep ocean swell
                return [y, y - a * 0.08, y + a * 0.05, y - a * 0.04, y];
              case "deep-back":
                return [
                  y,
                  y - a * 0.14,
                  y + a * 0.08,
                  y - a * 0.10,
                  y + a * 0.05,
                  y,
                ];
              case "mid-back":
                return [
                  y,
                  y - a * 0.20,
                  y + a * 0.12,
                  y - a * 0.16,
                  y + a * 0.08,
                  y - a * 0.06,
                  y,
                ];
              case "mid-front":
                return [
                  y,
                  y - a * 0.28,
                  y + a * 0.18,
                  y - a * 0.22,
                  y + a * 0.12,
                  y - a * 0.08,
                  y + a * 0.04,
                  y,
                ];
              case "front":
                // Most dramatic — big rolling motion
                return [
                  y,
                  y - a * 0.36,
                  y + a * 0.24,
                  y - a * 0.30,
                  y + a * 0.16,
                  y - a * 0.12,
                  y + a * 0.06,
                  y,
                ];
              case "spray":
                // Choppiest — fast irregular bobbing
                return [
                  y,
                  y - a * 0.40,
                  y + a * 0.28,
                  y - a * 0.34,
                  y + a * 0.20,
                  y - a * 0.14,
                  y + a * 0.08,
                  y - a * 0.04,
                  y,
                ];
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
                  duration: layer.duration * 0.82,
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
