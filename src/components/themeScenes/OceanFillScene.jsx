import { motion } from "framer-motion";
import { buildSceneVars, clamp01 } from "./utils";
import "./OceanFillScene.css";

// Rising bubble particles — varied sizes and drifts
const BUBBLES = [
  { left: "3%",  size: "8px",  dur: "18s", delay: "0s",   rise: "-90vh", drift: "1.4rem"  },
  { left: "9%",  size: "5px",  dur: "14s", delay: "2.6s", rise: "-86vh", drift: "-0.8rem" },
  { left: "16%", size: "10px", dur: "22s", delay: "5.2s", rise: "-94vh", drift: "2rem"    },
  { left: "24%", size: "6px",  dur: "16s", delay: "1.4s", rise: "-88vh", drift: "-1.2rem" },
  { left: "32%", size: "4px",  dur: "12s", delay: "7.8s", rise: "-84vh", drift: "0.8rem"  },
  { left: "40%", size: "9px",  dur: "20s", delay: "3.4s", rise: "-92vh", drift: "-1.6rem" },
  { left: "49%", size: "5px",  dur: "15s", delay: "6.4s", rise: "-88vh", drift: "1.2rem"  },
  { left: "57%", size: "7px",  dur: "17s", delay: "0.8s", rise: "-86vh", drift: "-0.6rem" },
  { left: "65%", size: "4px",  dur: "13s", delay: "4.6s", rise: "-90vh", drift: "1.8rem"  },
  { left: "73%", size: "8px",  dur: "21s", delay: "2.2s", rise: "-94vh", drift: "-2rem"   },
  { left: "81%", size: "5px",  dur: "16s", delay: "9.2s", rise: "-86vh", drift: "0.6rem"  },
  { left: "89%", size: "6px",  dur: "14s", delay: "3.8s", rise: "-88vh", drift: "-1rem"   },
  { left: "96%", size: "4px",  dur: "18s", delay: "5.6s", rise: "-92vh", drift: "1.4rem"  },
];

export default function OceanFillScene({ progress, reduceMotion = false, className = "", theme }) {
  const fillPercent = clamp01(progress);

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden ocean-fill-scene ${className}`.trim()}
      style={buildSceneVars(theme)}
    >
      {/* Underwater background layers */}
      <div className="ocean-sky absolute inset-0" />
      <div className="ocean-light-shafts absolute inset-0" />
      <div className="ocean-caustics absolute inset-x-0 top-0 h-[44%]" />
      <div className="ocean-coral absolute inset-x-0 bottom-[10%] h-[52%]" />
      <div className="ocean-ambient absolute inset-0" />

      {/* Rising bubbles */}
      {!reduceMotion ? (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {BUBBLES.map((bubble, i) => (
            <span
              key={`ocean-bubble-${i}`}
              className="ocean-bubble absolute"
              style={{
                left:    bubble.left,
                bottom:  "-2%",
                width:   bubble.size,
                height:  bubble.size,
                animationDuration: bubble.dur,
                animationDelay:    bubble.delay,
                "--bubble-rise":  bubble.rise,
                "--bubble-drift": bubble.drift,
              }}
            />
          ))}
        </div>
      ) : null}

      {/* Rising fill */}
      <motion.div
        className="ocean-fill absolute inset-x-0 bottom-0"
        animate={{ height: `${fillPercent * 100}%` }}
        transition={{ duration: reduceMotion ? 0.2 : 0.72, ease: [0.22, 0.8, 0.2, 1] }}
      >
        <div className="ocean-body absolute inset-0" />
        <div className="ocean-body-caustics absolute inset-0" />
        <div className="ocean-body-glow absolute inset-0" />

        {/* Wave surface at top of fill */}
        <div className="ocean-surface absolute inset-x-0 top-0 h-0">
          <div className="ocean-wave ocean-wave-back" />
          <div className="ocean-wave ocean-wave-mid" />
          <div className="ocean-wave ocean-wave-front" />
          <div className="ocean-crest absolute inset-x-0 top-[-1.25rem] h-14" />
          <div className="ocean-foam absolute inset-x-0 top-[-2.5rem] h-12" />
        </div>
      </motion.div>

      <div className="scene-vignette absolute inset-0" />
    </div>
  );
}
