import { motion } from "framer-motion";
import waterRippleTexture from "../assets/water/water-ripple-texture.png";
const WAVE_LAYERS = [
  {
    id: "back",
    duration: 13.5,
    amplitude: 7,
    opacity: 0.38,
    strokeOpacity: 0,
    yOffset: 9,
    className: "timer-water-wave-back",
    path: "M0,44 C70,40 130,32 198,36 C266,40 330,54 402,52 C472,50 536,34 606,30 C676,26 744,34 812,42 C882,50 944,56 1010,52 C1082,48 1146,32 1216,30 C1286,28 1356,40 1440,46 L1440,120 L0,120 Z",
    stroke: "M0,44 C70,40 130,32 198,36 C266,40 330,54 402,52 C472,50 536,34 606,30 C676,26 744,34 812,42 C882,50 944,56 1010,52 C1082,48 1146,32 1216,30 C1286,28 1356,40 1440,46",
  },
  {
    id: "front",
    duration: 9.5,
    amplitude: 11,
    opacity: 0.7,
    strokeOpacity: 0.56,
    yOffset: 0,
    className: "timer-water-wave-front",
    path: "M0,52 C60,46 122,34 194,36 C266,38 336,56 404,58 C474,60 538,44 606,38 C676,32 746,40 816,50 C886,60 950,68 1020,64 C1090,60 1150,42 1216,40 C1284,38 1352,48 1440,56 L1440,120 L0,120 Z",
    stroke: "M0,52 C60,46 122,34 194,36 C266,38 336,56 404,58 C474,60 538,44 606,38 C676,32 746,40 816,50 C886,60 950,68 1020,64 C1090,60 1150,42 1216,40 C1284,38 1352,48 1440,56",
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
                  backgroundPosition: ["0% 0%", "22% 100%", "0% 0%"],
                  opacity: [0.12, 0.2, 0.12],
                }
          }
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="timer-water-highlight absolute inset-x-0 top-0 h-14"
          animate={reduceMotion ? {} : { opacity: [0.18, 0.28, 0.18] }}
          transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="timer-water-specular absolute inset-x-0 top-0"
          animate={
            reduceMotion
              ? {}
              : {
                  x: ["-10%", "12%", "-10%"],
                  opacity: [0.14, 0.22, 0.14],
                }
          }
          transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut" }}
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
        {WAVE_LAYERS.map((layer) => (
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
                    y:
                      layer.id === "front"
                        ? [layer.yOffset, layer.yOffset - layer.amplitude * 0.24, layer.yOffset, layer.yOffset + layer.amplitude * 0.18, layer.yOffset]
                        : [layer.yOffset, layer.yOffset - layer.amplitude * 0.16, layer.yOffset, layer.yOffset + layer.amplitude * 0.12, layer.yOffset],
                  }
            }
            transition={{
              x: {
                duration: layer.duration,
                repeat: Infinity,
                ease: "linear",
              },
              y: {
                duration: layer.duration * 0.8,
                repeat: Infinity,
                ease: "easeInOut",
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
        ))}
      </div>
    </div>
  );
}

export default function WaterFillScene({ progress, reduceMotion = false, className = "" }) {
  const fillPercent = clamp01(progress);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`.trim()}>
      <div className="timer-water-backdrop absolute inset-0" />
      <div className="timer-water-vignette absolute inset-0" />
      <WaterBody fillPercent={fillPercent} reduceMotion={reduceMotion} />
      <div className="timer-water-overlay absolute inset-0" />
    </div>
  );
}
