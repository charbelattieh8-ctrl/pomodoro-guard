import { motion } from "framer-motion";
import { buildSceneVars, clamp01 } from "./utils";
import "./SpaceFillScene.css";

// Twinkling star particles scattered in the sky
const STAR_PARTICLES = [
  { left: "3%",  top: "6%",  size: "4px",  dur: "3.2s", delay: "0s"   },
  { left: "11%", top: "18%", size: "3px",  dur: "4.8s", delay: "1.4s" },
  { left: "19%", top: "9%",  size: "5px",  dur: "2.8s", delay: "2.6s" },
  { left: "28%", top: "24%", size: "3px",  dur: "5.4s", delay: "0.6s" },
  { left: "37%", top: "4%",  size: "4px",  dur: "3.8s", delay: "3.8s" },
  { left: "46%", top: "16%", size: "3px",  dur: "4.2s", delay: "1.8s" },
  { left: "54%", top: "28%", size: "5px",  dur: "3s",   delay: "5.2s" },
  { left: "62%", top: "7%",  size: "3px",  dur: "4.6s", delay: "0.2s" },
  { left: "71%", top: "21%", size: "4px",  dur: "3.4s", delay: "2.4s" },
  { left: "79%", top: "12%", size: "3px",  dur: "5s",   delay: "4.4s" },
  { left: "87%", top: "26%", size: "5px",  dur: "2.6s", delay: "1.2s" },
  { left: "94%", top: "8%",  size: "3px",  dur: "4.4s", delay: "3.2s" },
  // Lower sky stars
  { left: "7%",  top: "38%", size: "4px",  dur: "5.8s", delay: "0.8s" },
  { left: "22%", top: "44%", size: "3px",  dur: "3.6s", delay: "5.6s" },
  { left: "43%", top: "36%", size: "4px",  dur: "4.8s", delay: "2s"   },
  { left: "66%", top: "48%", size: "3px",  dur: "3.2s", delay: "4.2s" },
  { left: "84%", top: "40%", size: "5px",  dur: "4s",   delay: "1.6s" },
];

// Shooting stars
const SHOOTING_STARS = [
  { top: "8%",  left: "5%",  width: "12rem", dur: "8s",  delay: "0s",   angle: "-18deg" },
  { top: "22%", left: "30%", width: "9rem",  dur: "12s", delay: "5.4s", angle: "-14deg" },
  { top: "14%", left: "58%", width: "14rem", dur: "10s", delay: "9.2s", angle: "-22deg" },
];

export default function SpaceFillScene({ progress, reduceMotion = false, className = "", theme }) {
  const fillPercent = clamp01(progress);

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden space-fill-scene ${className}`.trim()}
      style={buildSceneVars(theme)}
    >
      {/* Deep space background layers */}
      <div className="space-sky absolute inset-0" />
      <div className="space-stars-far absolute inset-0" />
      <div className="space-stars-bright absolute inset-0" />
      <div className="space-milkyway absolute inset-0" />
      <div className="space-nebula absolute inset-0" />

      {/* Twinkling star particles */}
      {!reduceMotion ? (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {STAR_PARTICLES.map((star, i) => (
            <span
              key={`space-star-${i}`}
              className="space-star-particle absolute"
              style={{
                left:   star.left,
                top:    star.top,
                width:  star.size,
                height: star.size,
                animationDuration: star.dur,
                animationDelay:    star.delay,
              }}
            />
          ))}

          {SHOOTING_STARS.map((s, i) => (
            <span
              key={`space-shoot-${i}`}
              className="space-shooting-star absolute"
              style={{
                top:   s.top,
                left:  s.left,
                width: s.width,
                animationDuration: s.dur,
                animationDelay:    s.delay,
                "--shoot-angle": s.angle,
              }}
            />
          ))}
        </div>
      ) : null}

      {/* Rising nebula fill */}
      <motion.div
        className="space-fill absolute inset-x-0 bottom-0"
        animate={{ height: `${fillPercent * 100}%` }}
        transition={{ duration: reduceMotion ? 0.2 : 0.74, ease: [0.22, 0.8, 0.2, 1] }}
      >
        <div className="space-body absolute inset-0" />
        <div className="space-body-stardust absolute inset-0" />
        <div className="space-body-glow absolute inset-0" />

        {/* Nebula horizon / surface ridges */}
        <div className="space-surface absolute inset-x-0 top-0 h-0">
          <div className="space-horizon space-horizon-back" />
          <div className="space-horizon space-horizon-front" />
          <div className="space-nebula-crest absolute inset-x-0 top-[-1.5rem] h-16" />
        </div>
      </motion.div>

      <div className="scene-vignette absolute inset-0" />
    </div>
  );
}
