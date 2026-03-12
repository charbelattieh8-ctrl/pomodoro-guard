import { useMemo } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import waterSurfaceAnimation from "../assets/water/water-surface-lottie.json";
import waterRippleTexture from "../assets/water/water-ripple-texture.png";

const SURFACE_OVERLAP_PX = 8;

function clamp01(value) {
  return Math.max(0, Math.min(1, value || 0));
}

function WaterBody({ fillPercent, reduceMotion }) {
  return (
    <motion.div
      className="timer-water-fill absolute inset-x-0 bottom-0 overflow-hidden"
      animate={{ height: `${Math.max(fillPercent * 100, 0)}%` }}
      transition={{
        duration: reduceMotion ? 0.2 : 0.65,
        ease: [0.22, 0.8, 0.2, 1],
      }}
    >
      <div className="timer-water-gradient absolute inset-0" />

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
        className="timer-water-highlight absolute inset-x-0 top-0 h-10"
        animate={reduceMotion ? {} : { opacity: [0.28, 0.42, 0.28] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
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
    </motion.div>
  );
}

function WaterSurface({ fillPercent, reduceMotion }) {
  const lottieOptions = useMemo(
    () => ({
      animationData: waterSurfaceAnimation,
      loop: true,
      autoplay: true,
      rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
    }),
    []
  );

  const bottom = useMemo(
    () => `calc(${fillPercent * 100}% - ${SURFACE_OVERLAP_PX}px)`,
    [fillPercent]
  );

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 z-[2]"
      animate={{ bottom }}
      transition={{
        duration: reduceMotion ? 0.2 : 0.65,
        ease: [0.22, 0.8, 0.2, 1],
      }}
    >
      <div className="timer-water-surface-window">
        <Lottie
          {...lottieOptions}
          renderer="svg"
          speed={reduceMotion ? 0.18 : 0.42}
          className="timer-water-surface-lottie"
        />
      </div>
    </motion.div>
  );
}

export default function WaterFillScene({ progress, reduceMotion = false }) {
  const fillPercent = clamp01(progress);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
      <div className="timer-water-backdrop absolute inset-0" />
      <div className="timer-water-vignette absolute inset-0" />
      <WaterBody fillPercent={fillPercent} reduceMotion={reduceMotion} />
      <WaterSurface fillPercent={fillPercent} reduceMotion={reduceMotion} />
      <div className="timer-water-overlay absolute inset-0" />
    </div>
  );
}
