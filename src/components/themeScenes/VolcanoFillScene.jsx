import { motion } from "framer-motion";
import { buildSceneVars, clamp01 } from "./utils";
import "./VolcanoFillScene.css";

// Magma cracks distributed across fill body
const MAGMA_CRACKS = [
  { left: "4%",  top: "12%", width: "22%", rotate: "-11deg", dur: "5.4s",  delay: "0s"   },
  { left: "18%", top: "18%", width: "18%", rotate: "14deg",  dur: "7.2s",  delay: "1.2s" },
  { left: "36%", top: "9%",  width: "26%", rotate: "-6deg",  dur: "6.1s",  delay: "2.8s" },
  { left: "52%", top: "15%", width: "20%", rotate: "9deg",   dur: "8.4s",  delay: "0.6s" },
  { left: "66%", top: "20%", width: "24%", rotate: "-16deg", dur: "5.8s",  delay: "3.4s" },
  { left: "78%", top: "11%", width: "16%", rotate: "12deg",  dur: "7s",    delay: "1.8s" },
  { left: "10%", top: "28%", width: "34%", rotate: "3deg",   dur: "9.2s",  delay: "4.6s" },
  { left: "46%", top: "30%", width: "42%", rotate: "-2deg",  dur: "6.6s",  delay: "2.2s" },
];

// Magma hotspot pools
const HOTSPOTS = [
  { left: "12%", top: "14%", size: "12%", dur: "6.2s",  delay: "0s"   },
  { left: "38%", top: "10%", size: "14%", dur: "7.8s",  delay: "2s"   },
  { left: "62%", top: "16%", size: "10%", dur: "5.6s",  delay: "4s"   },
  { left: "82%", top: "12%", size: "11%", dur: "8.4s",  delay: "1s"   },
];

// Rising embers
const EMBERS = [
  { left: "6%",  size: "5px", dur: "13s", delay: "0s",   rise: "-110vh", drift: "1.2rem"  },
  { left: "14%", size: "4px", dur: "17s", delay: "3.6s", rise: "-106vh", drift: "-0.8rem" },
  { left: "24%", size: "6px", dur: "11s", delay: "7.2s", rise: "-114vh", drift: "1.8rem"  },
  { left: "38%", size: "4px", dur: "15s", delay: "1.8s", rise: "-108vh", drift: "-1.4rem" },
  { left: "50%", size: "5px", dur: "12s", delay: "5.4s", rise: "-112vh", drift: "0.8rem"  },
  { left: "63%", size: "4px", dur: "16s", delay: "2.4s", rise: "-106vh", drift: "-0.6rem" },
  { left: "76%", size: "6px", dur: "14s", delay: "8.8s", rise: "-116vh", drift: "1.4rem"  },
  { left: "88%", size: "4px", dur: "13s", delay: "4.2s", rise: "-108vh", drift: "-1rem"   },
];

// Ash flakes
const ASH = [
  { left: "10%", size: "8px",  dur: "22s", delay: "0s",   drift: "3rem"   },
  { left: "28%", size: "6px",  dur: "28s", delay: "5.6s", drift: "-4rem"  },
  { left: "50%", size: "10px", dur: "19s", delay: "9.4s", drift: "2.4rem" },
  { left: "70%", size: "7px",  dur: "25s", delay: "3.2s", drift: "-3.4rem"},
  { left: "88%", size: "6px",  dur: "21s", delay: "7.8s", drift: "2rem"   },
];

export default function VolcanoFillScene({ progress, reduceMotion = false, className = "", theme }) {
  const fillPercent = clamp01(progress);
  const glowIntensity = 0.28 + fillPercent * 0.44;

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden volcano-fill-scene ${className}`.trim()}
      style={buildSceneVars(theme)}
    >
      {/* Volcanic sky and atmosphere */}
      <div className="volcano-sky absolute inset-0" />
      <div className="volcano-cone-glow absolute inset-x-0 top-0 h-[48%]" />
      <div className="volcano-ash-sky absolute inset-x-0 top-0 h-[56%]" />
      <div className="volcano-mountain absolute inset-x-0 bottom-[8%] h-[62%]" />
      <div className="volcano-heat-haze absolute inset-x-[-8%] top-[4%] h-[32%]" />

      {/* Embers and ash particles */}
      {!reduceMotion ? (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {EMBERS.map((e, i) => (
            <span
              key={`volcano-ember-${i}`}
              className="volcano-ember absolute"
              style={{
                left:   e.left,
                bottom: "-2%",
                width:  e.size,
                height: e.size,
                animationDuration: e.dur,
                animationDelay:    e.delay,
                "--ember-rise":  e.rise,
                "--ember-drift": e.drift,
              }}
            />
          ))}
          {ASH.map((a, i) => (
            <span
              key={`volcano-ash-${i}`}
              className="volcano-ash absolute"
              style={{
                left:   a.left,
                top:    "-2%",
                width:  a.size,
                height: a.size,
                animationDuration: a.dur,
                animationDelay:    a.delay,
                "--ash-drift": a.drift,
              }}
            />
          ))}
        </div>
      ) : null}

      {/* Rising fill */}
      <motion.div
        className="volcano-fill absolute inset-x-0 bottom-0"
        animate={{ height: `${fillPercent * 100}%` }}
        transition={{ duration: reduceMotion ? 0.2 : 0.7, ease: [0.22, 0.8, 0.2, 1] }}
      >
        <div className="volcano-body absolute inset-0" />
        <div className="volcano-body-rock absolute inset-0" />

        {/* Magma crack lines */}
        {MAGMA_CRACKS.map((crack, i) => (
          <span
            key={`volcano-crack-${i}`}
            className="volcano-crack absolute"
            style={{
              left:   crack.left,
              top:    crack.top,
              width:  crack.width,
              transform: `rotate(${crack.rotate})`,
              animationDuration: crack.dur,
              animationDelay:    crack.delay,
            }}
          />
        ))}

        {/* Magma hotspot glows */}
        {HOTSPOTS.map((h, i) => (
          <span
            key={`volcano-hotspot-${i}`}
            className="volcano-hotspot absolute"
            style={{
              left:   h.left,
              top:    h.top,
              width:  h.size,
              height: h.size,
              animationDuration: h.dur,
              animationDelay:    h.delay,
            }}
          />
        ))}

        {/* Jagged rock surface at fill top */}
        <div className="volcano-surface absolute inset-x-0 top-0 h-0">
          <div className="volcano-spire volcano-spire-back" />
          <div className="volcano-spire volcano-spire-front" />
          <div
            className="volcano-surface-glow absolute inset-x-0 top-[-1.25rem] h-14"
            style={{ opacity: glowIntensity }}
          />
        </div>
      </motion.div>

      <div className="scene-vignette absolute inset-0" />
    </div>
  );
}
