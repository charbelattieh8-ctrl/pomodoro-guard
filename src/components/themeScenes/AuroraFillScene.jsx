import { motion } from "framer-motion";
import { buildSceneVars, clamp01 } from "./utils";

const AURORA_CURTAINS = [
  { className: "aurora-curtain aurora-curtain-1", delay: "0s", duration: "13s" },
  { className: "aurora-curtain aurora-curtain-2", delay: "1.8s", duration: "16s" },
  { className: "aurora-curtain aurora-curtain-3", delay: "4.2s", duration: "14s" },
  { className: "aurora-curtain aurora-curtain-4", delay: "2.6s", duration: "17s" },
];

const STARS = [
  { left: "8%", top: "12%", size: "3px" },
  { left: "16%", top: "22%", size: "2px" },
  { left: "24%", top: "8%", size: "4px" },
  { left: "38%", top: "16%", size: "2px" },
  { left: "47%", top: "10%", size: "3px" },
  { left: "56%", top: "20%", size: "2px" },
  { left: "68%", top: "12%", size: "4px" },
  { left: "78%", top: "18%", size: "3px" },
  { left: "88%", top: "9%", size: "2px" },
  { left: "72%", top: "28%", size: "2px" },
];

export default function AuroraFillScene({ progress, reduceMotion = false, className = "", theme }) {
  const fillPercent = clamp01(progress);
  const glowOpacity = 0.22 + fillPercent * 0.78;

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden aurora-fill-scene ${className}`.trim()}
      style={buildSceneVars(theme)}
    >
      <div className="aurora-sky absolute inset-0" />
      <div className="aurora-moon absolute right-[12%] top-[11%] h-24 w-24 rounded-full" />

      <div className="absolute inset-0">
        {STARS.map((star, index) => (
          <span
            key={`aurora-star-${index}`}
            className="aurora-star absolute rounded-full"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
            }}
          />
        ))}
      </div>

      <motion.div
        className="aurora-curtains absolute inset-x-[-10%] top-[8%] h-[68%]"
        animate={
          reduceMotion
            ? { opacity: glowOpacity }
            : {
                opacity: [glowOpacity * 0.72, glowOpacity, glowOpacity * 0.8],
              }
        }
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {AURORA_CURTAINS.map((curtain, index) => (
          <span
            key={`aurora-curtain-${index}`}
            className={curtain.className}
            style={{
              animationDelay: curtain.delay,
              animationDuration: curtain.duration,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="aurora-fill absolute inset-x-0 bottom-0"
        animate={{ height: `${fillPercent * 100}%`, opacity: 0.24 + fillPercent * 0.5 }}
        transition={{
          duration: reduceMotion ? 0.2 : 0.75,
          ease: [0.22, 0.8, 0.2, 1],
        }}
      >
        <div className="aurora-reflection absolute inset-0" />
        <div className="aurora-ice-sheen absolute inset-x-0 top-0 h-20" />
      </motion.div>

      <div className="aurora-mountains absolute inset-x-0 bottom-0 h-[28vh]" />
      <div className="aurora-vignette absolute inset-0" />
    </div>
  );
}
