import { motion } from "framer-motion";
import { buildSceneVars, clamp01 } from "./utils";
import "./CyberpunkFillScene.css";

// Rising data-bit particles (cyan, magenta, yellow variants)
const DATA_BITS = [
  { left: "4%",  size: "4px",  dur: "12s", delay: "0s",   rise: "-88vh", drift: "1.2rem",  color: ""         },
  { left: "11%", size: "3px",  dur: "16s", delay: "2.4s", rise: "-92vh", drift: "-0.8rem", color: "cyber-bit-magenta" },
  { left: "19%", size: "5px",  dur: "10s", delay: "5s",   rise: "-86vh", drift: "1.8rem",  color: ""         },
  { left: "27%", size: "3px",  dur: "14s", delay: "1.2s", rise: "-94vh", drift: "-1.4rem", color: "cyber-bit-yellow"  },
  { left: "35%", size: "4px",  dur: "11s", delay: "7.2s", rise: "-90vh", drift: "0.6rem",  color: ""         },
  { left: "44%", size: "3px",  dur: "15s", delay: "3.6s", rise: "-88vh", drift: "-1rem",   color: "cyber-bit-magenta" },
  { left: "52%", size: "5px",  dur: "9s",  delay: "6s",   rise: "-96vh", drift: "1.6rem",  color: ""         },
  { left: "60%", size: "3px",  dur: "13s", delay: "0.8s", rise: "-84vh", drift: "-0.6rem", color: "cyber-bit-yellow"  },
  { left: "68%", size: "4px",  dur: "11s", delay: "4.4s", rise: "-92vh", drift: "1.4rem",  color: ""         },
  { left: "75%", size: "3px",  dur: "17s", delay: "2s",   rise: "-88vh", drift: "-1.8rem", color: "cyber-bit-magenta" },
  { left: "83%", size: "5px",  dur: "10s", delay: "8.6s", rise: "-86vh", drift: "0.8rem",  color: ""         },
  { left: "91%", size: "3px",  dur: "14s", delay: "1.6s", rise: "-90vh", drift: "-1.2rem", color: "cyber-bit-yellow"  },
];

export default function CyberpunkFillScene({ progress, reduceMotion = false, className = "", theme }) {
  const fillPercent = clamp01(progress);
  // Glow intensifies as fill rises
  const glowOpacity = 0.3 + fillPercent * 0.5;

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden cyberpunk-fill-scene ${className}`.trim()}
      style={buildSceneVars(theme)}
    >
      {/* Dark cyberpunk background layers */}
      <div className="cyber-sky absolute inset-0" />
      <div className="cyber-scanlines absolute inset-0" />
      <div className="cyber-cityline absolute inset-x-0 bottom-[14%] h-[52%]" />
      <div className="cyber-grid-horizon absolute inset-x-0 bottom-0 h-[46%]" />
      <div className="cyber-horizon-glow absolute inset-x-0 bottom-[8%] h-[32%]" />

      {/* Rising data-bit particles */}
      {!reduceMotion ? (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {DATA_BITS.map((bit, i) => (
            <span
              key={`cyber-bit-${i}`}
              className={`cyber-bit absolute ${bit.color}`.trim()}
              style={{
                left: bit.left,
                bottom: "0%",
                width: bit.size,
                height: bit.size,
                animationDuration: bit.dur,
                animationDelay: bit.delay,
                "--bit-rise":  bit.rise,
                "--bit-drift": bit.drift,
              }}
            />
          ))}
        </div>
      ) : null}

      {/* Rising fill — neon grid panel */}
      <motion.div
        className="cyber-fill absolute inset-x-0 bottom-0"
        animate={{ height: `${fillPercent * 100}%` }}
        transition={{ duration: reduceMotion ? 0.2 : 0.6, ease: [0.22, 0.8, 0.2, 1] }}
      >
        <div className="cyber-body absolute inset-0" />
        <div className="cyber-body-circuits absolute inset-0" />
        <div
          className="cyber-body-glow absolute inset-0"
          style={{ opacity: glowOpacity }}
        />

        {/* Surface ridges at the top of fill */}
        <div className="cyber-surface absolute inset-x-0 top-0 h-0">
          <div className="cyber-ridge cyber-ridge-back" />
          <div className="cyber-ridge cyber-ridge-front" />
          <div className="cyber-surface-neon absolute inset-x-0 top-[-0.5rem] h-3" />
        </div>
      </motion.div>

      <div className="scene-vignette absolute inset-0" />
    </div>
  );
}
