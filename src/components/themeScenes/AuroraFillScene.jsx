import { motion } from "framer-motion";
import { buildSceneVars, clamp01 } from "./utils";
import "./AuroraFillScene.css";

const AURORA_CURTAINS = [
  {
    className: "aurora-curtain-shell aurora-curtain-shell-1",
    left: "-12%",
    top: "3%",
    width: "34%",
    height: "79%",
    opacity: 0.72,
    delay: "-2s",
    duration: "19s",
    blur: "7px",
    skew: "-12deg",
    clipPath: "polygon(40% 0, 60% 0, 80% 12%, 92% 100%, 8% 100%, 20% 12%)",
  },
  {
    className: "aurora-curtain-shell aurora-curtain-shell-2",
    left: "6%",
    top: "0%",
    width: "29%",
    height: "84%",
    opacity: 0.64,
    delay: "-6s",
    duration: "22s",
    blur: "6px",
    skew: "-7deg",
    clipPath: "polygon(34% 0, 66% 0, 84% 16%, 90% 100%, 10% 100%, 16% 16%)",
  },
  {
    className: "aurora-curtain-shell aurora-curtain-shell-3",
    left: "30%",
    top: "2%",
    width: "34%",
    height: "87%",
    opacity: 0.84,
    delay: "-10s",
    duration: "24s",
    blur: "5px",
    skew: "4deg",
    clipPath: "polygon(28% 0, 72% 0, 86% 14%, 94% 100%, 6% 100%, 14% 14%)",
  },
  {
    className: "aurora-curtain-shell aurora-curtain-shell-4",
    left: "56%",
    top: "0%",
    width: "30%",
    height: "82%",
    opacity: 0.68,
    delay: "-4s",
    duration: "21s",
    blur: "6px",
    skew: "8deg",
    clipPath: "polygon(34% 0, 66% 0, 82% 18%, 90% 100%, 10% 100%, 18% 18%)",
  },
  {
    className: "aurora-curtain-shell aurora-curtain-shell-5",
    left: "78%",
    top: "4%",
    width: "24%",
    height: "76%",
    opacity: 0.58,
    delay: "-8s",
    duration: "23s",
    blur: "7px",
    skew: "12deg",
    clipPath: "polygon(38% 0, 62% 0, 80% 20%, 88% 100%, 12% 100%, 20% 20%)",
  },
];

const AURORA_STARS = [
  { left: "7%", top: "12%", size: "2px", opacity: 0.62, duration: "6.5s", delay: "0s" },
  { left: "14%", top: "24%", size: "1.5px", opacity: 0.34, duration: "7.8s", delay: "1.2s" },
  { left: "22%", top: "8%", size: "2px", opacity: 0.48, duration: "6.8s", delay: "2.1s" },
  { left: "31%", top: "16%", size: "1.5px", opacity: 0.3, duration: "8.4s", delay: "0.7s" },
  { left: "44%", top: "10%", size: "2px", opacity: 0.45, duration: "7.2s", delay: "2.9s" },
  { left: "52%", top: "20%", size: "1.5px", opacity: 0.31, duration: "7.4s", delay: "0.4s" },
  { left: "64%", top: "12%", size: "2px", opacity: 0.52, duration: "6.2s", delay: "1.9s" },
  { left: "73%", top: "18%", size: "1.5px", opacity: 0.39, duration: "7.6s", delay: "2.7s" },
  { left: "83%", top: "9%", size: "2px", opacity: 0.36, duration: "8.1s", delay: "0.9s" },
  { left: "90%", top: "28%", size: "1.5px", opacity: 0.28, duration: "7.1s", delay: "1.5s" },
  { left: "56%", top: "7%", size: "1.5px", opacity: 0.24, duration: "8.8s", delay: "3.2s" },
  { left: "36%", top: "6%", size: "1.5px", opacity: 0.22, duration: "9s", delay: "2.4s" },
];

export default function AuroraFillScene({ progress, reduceMotion = false, className = "", theme }) {
  const fillPercent = clamp01(progress);
  const glowOpacity = 0.16 + fillPercent * 0.42;
  const reflectionOpacity = 0.14 + fillPercent * 0.24;
  const groundOpacity = 0.28 + fillPercent * 0.3;
  const mistOpacity = 0.16 + fillPercent * 0.1;

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden aurora-fill-scene ${className}`.trim()}
      style={buildSceneVars(theme, {
        "--aurora-play-state": reduceMotion ? "paused" : "running",
        "--aurora-intensity": glowOpacity,
        "--aurora-reflection-opacity": reflectionOpacity,
        "--aurora-ground-opacity": groundOpacity,
        "--aurora-mist-opacity": mistOpacity,
      })}
    >
      <div className="aurora-sky absolute inset-0" />
      <div className="aurora-airglow absolute inset-0" />
      <div className="aurora-moon absolute right-[11%] top-[10%] h-20 w-20 rounded-full" />

      <div className="aurora-starfield absolute inset-0">
        {AURORA_STARS.map((star, index) => (
          <span
            key={`aurora-star-${index}`}
            className="aurora-star absolute rounded-full"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animationDuration: star.duration,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      <div className="aurora-horizon-glow absolute inset-x-[-8%] bottom-[14%] h-[24vh]" />

      <motion.div
        className="aurora-curtain-field absolute inset-x-[-8%] top-0 bottom-[14%]"
        animate={
          reduceMotion
            ? { opacity: glowOpacity }
            : {
                opacity: [glowOpacity * 0.8, glowOpacity, glowOpacity * 0.88],
              }
        }
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {AURORA_CURTAINS.map((curtain, index) => (
          <span
            key={`aurora-curtain-${index}`}
            className={curtain.className}
            style={{
              left: curtain.left,
              top: curtain.top,
              width: curtain.width,
              height: curtain.height,
              opacity: curtain.opacity,
              animationDelay: curtain.delay,
              animationDuration: curtain.duration,
              filter: `blur(${curtain.blur})`,
              clipPath: curtain.clipPath,
              "--aurora-lean": curtain.skew,
            }}
          >
            <span className="aurora-curtain-core" />
            <span className="aurora-curtain-rays" />
            <span className="aurora-curtain-folds" />
          </span>
        ))}
      </motion.div>

      <motion.div
        className="aurora-fill absolute inset-x-0 bottom-0"
        animate={{ height: `${fillPercent * 100}%`, opacity: 0.22 + fillPercent * 0.28 }}
        transition={{
          duration: reduceMotion ? 0.2 : 0.75,
          ease: [0.22, 0.8, 0.2, 1],
        }}
      >
        <div className="aurora-reflection absolute inset-0" />
        <div className="aurora-ice-cracks absolute inset-0" />
        <div className="aurora-ice-sheen absolute inset-x-0 top-0 h-20" />
      </motion.div>

      <div className="aurora-mountains absolute inset-x-0 bottom-0 h-[28vh]" />
      <div className="aurora-vignette absolute inset-0" />
    </div>
  );
}
