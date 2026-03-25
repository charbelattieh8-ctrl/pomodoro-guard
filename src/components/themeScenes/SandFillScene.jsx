import { motion } from "framer-motion";
import { THEME_SCENE_ASSETS } from "../../lib/themeSceneAssets";
import { buildSceneVars, clamp01 } from "./utils";
import "./SandFillScene.css";

const WIND_STREAMS = [
  { left: "-20%", top: "14%", width: "26rem", delay: "0s", duration: "18s", opacity: 0.25, blur: "8px" },
  { left: "-18%", top: "30%", width: "22rem", delay: "3s", duration: "21s", opacity: 0.18, blur: "10px" },
  { left: "-24%", top: "46%", width: "24rem", delay: "7s", duration: "20s", opacity: 0.16, blur: "11px" },
  { left: "-16%", top: "64%", width: "28rem", delay: "1s", duration: "19s", opacity: 0.18, blur: "9px" },
];

const SAND_GRAINS = [
  { left: "4%", top: "78%", size: "2px", delay: "0s", duration: "3.4s", travelX: "18vw", peakY: "-8vh", endY: "-1vh" },
  { left: "9%", top: "72%", size: "2px", delay: "1.1s", duration: "3.8s", travelX: "16vw", peakY: "-7vh", endY: "-2vh" },
  { left: "13%", top: "82%", size: "3px", delay: "2.4s", duration: "4.2s", travelX: "20vw", peakY: "-6vh", endY: "0vh" },
  { left: "18%", top: "76%", size: "2px", delay: "0.6s", duration: "3.1s", travelX: "14vw", peakY: "-5vh", endY: "-1vh" },
  { left: "24%", top: "79%", size: "3px", delay: "1.8s", duration: "3.9s", travelX: "19vw", peakY: "-7vh", endY: "-1vh" },
  { left: "31%", top: "74%", size: "2px", delay: "2.8s", duration: "4.4s", travelX: "17vw", peakY: "-8vh", endY: "1vh" },
  { left: "37%", top: "81%", size: "2px", delay: "0.9s", duration: "3.3s", travelX: "15vw", peakY: "-6vh", endY: "-2vh" },
  { left: "43%", top: "77%", size: "3px", delay: "1.4s", duration: "3.6s", travelX: "21vw", peakY: "-7vh", endY: "0vh" },
  { left: "49%", top: "83%", size: "2px", delay: "3.1s", duration: "4.1s", travelX: "18vw", peakY: "-5vh", endY: "-1vh" },
  { left: "55%", top: "75%", size: "3px", delay: "2.1s", duration: "3.7s", travelX: "17vw", peakY: "-7vh", endY: "-1vh" },
  { left: "61%", top: "80%", size: "2px", delay: "0.4s", duration: "3.2s", travelX: "16vw", peakY: "-6vh", endY: "-2vh" },
  { left: "66%", top: "73%", size: "2px", delay: "2.6s", duration: "4.3s", travelX: "20vw", peakY: "-7vh", endY: "0vh" },
  { left: "71%", top: "79%", size: "3px", delay: "1.6s", duration: "3.5s", travelX: "14vw", peakY: "-8vh", endY: "-1vh" },
  { left: "77%", top: "76%", size: "2px", delay: "0.8s", duration: "4s", travelX: "18vw", peakY: "-6vh", endY: "-1vh" },
  { left: "83%", top: "81%", size: "3px", delay: "2.9s", duration: "4.5s", travelX: "15vw", peakY: "-7vh", endY: "0vh" },
  { left: "89%", top: "74%", size: "2px", delay: "1.2s", duration: "3.6s", travelX: "17vw", peakY: "-6vh", endY: "-2vh" },
];

const DISTANT_RIDGES = [
  {
    className: "sand-ridge-1",
    left: "-6%",
    top: "10%",
    width: "58%",
    height: "11%",
    clipPath: "polygon(0% 84%, 9% 70%, 20% 58%, 34% 48%, 50% 42%, 66% 46%, 79% 58%, 90% 70%, 100% 82%, 100% 100%, 0% 100%)",
  },
  {
    className: "sand-ridge-2",
    left: "30%",
    top: "13%",
    width: "52%",
    height: "10%",
    clipPath: "polygon(0% 88%, 10% 74%, 24% 63%, 40% 56%, 56% 58%, 72% 66%, 86% 76%, 100% 88%, 100% 100%, 0% 100%)",
  },
  {
    className: "sand-ridge-3",
    left: "66%",
    top: "15%",
    width: "38%",
    height: "9%",
    clipPath: "polygon(0% 90%, 12% 78%, 26% 66%, 44% 58%, 62% 60%, 78% 69%, 90% 78%, 100% 90%, 100% 100%, 0% 100%)",
  },
];

const DUNES = [
  {
    className: "sand-dune-far-left",
    left: "-18%",
    top: "-7vh",
    width: "48%",
    height: "14vh",
    clipPath: "polygon(0% 84%, 10% 72%, 23% 58%, 39% 47%, 54% 42%, 68% 44%, 82% 54%, 92% 66%, 100% 80%, 100% 100%, 0% 100%)",
    skew: "-2deg",
  },
  {
    className: "sand-dune-far-mid",
    left: "10%",
    top: "-9vh",
    width: "40%",
    height: "15vh",
    clipPath: "polygon(0% 88%, 10% 73%, 22% 57%, 38% 42%, 53% 34%, 68% 35%, 80% 43%, 90% 57%, 100% 76%, 100% 100%, 0% 100%)",
    skew: "-0.75deg",
  },
  {
    className: "sand-dune-far-right",
    left: "42%",
    top: "-8vh",
    width: "42%",
    height: "14vh",
    clipPath: "polygon(0% 86%, 9% 73%, 22% 60%, 39% 48%, 57% 42%, 72% 46%, 84% 56%, 93% 68%, 100% 82%, 100% 100%, 0% 100%)",
    skew: "0.5deg",
  },
  {
    className: "sand-dune-mid-left",
    left: "-10%",
    top: "-10vh",
    width: "62%",
    height: "20vh",
    clipPath: "polygon(0% 90%, 6% 78%, 15% 64%, 28% 50%, 43% 38%, 57% 31%, 70% 30%, 81% 36%, 91% 48%, 100% 66%, 100% 100%, 0% 100%)",
    skew: "-1.5deg",
  },
  {
    className: "sand-dune-mid-right",
    left: "30%",
    top: "-12vh",
    width: "62%",
    height: "22vh",
    clipPath: "polygon(0% 92%, 8% 80%, 18% 66%, 31% 50%, 46% 34%, 60% 23%, 73% 18%, 84% 20%, 92% 30%, 100% 48%, 100% 100%, 0% 100%)",
    skew: "1deg",
  },
  {
    className: "sand-dune-foreground",
    left: "-6%",
    top: "-13vh",
    width: "118%",
    height: "28vh",
    clipPath: "polygon(0% 100%, 0% 82%, 9% 73%, 18% 66%, 29% 60%, 41% 54%, 53% 48%, 65% 42%, 75% 34%, 84% 28%, 92% 30%, 100% 40%, 100% 100%)",
    skew: "0deg",
  },
];

export default function SandFillScene({ progress, reduceMotion = false, className = "", theme }) {
  const fillPercent = clamp01(progress);

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden sand-fill-scene ${className}`.trim()}
      style={buildSceneVars(theme, {
        "--scene-texture": `url(${THEME_SCENE_ASSETS.sand.texture})`,
      })}
    >
      <div className="sand-sky absolute inset-0" />
      <div className="sand-sun absolute right-[-8%] top-[-6%] h-[42vh] w-[42vh] rounded-full" />
      <div className="sand-distance absolute inset-x-0 top-[12%] h-[26%]" />
      <div className="sand-atmosphere absolute inset-x-0 top-[18%] h-[28%]" />
      <div className="sand-ridges absolute inset-0">
        {DISTANT_RIDGES.map((ridge) => (
          <span
            key={ridge.className}
            className={`sand-ridge absolute ${ridge.className}`}
            style={{
              left: ridge.left,
              top: ridge.top,
              width: ridge.width,
              height: ridge.height,
              clipPath: ridge.clipPath,
            }}
          />
        ))}
      </div>
      <div className="sand-haze absolute inset-0" />

      {!reduceMotion ? (
        <div className="absolute inset-0 overflow-hidden">
          {WIND_STREAMS.map((stream, index) => (
            <span
              key={`sand-stream-${index}`}
              className="sand-wind-stream absolute"
              style={{
                left: stream.left,
                top: stream.top,
                width: stream.width,
                opacity: stream.opacity,
                filter: `blur(${stream.blur})`,
                animationDelay: stream.delay,
                animationDuration: stream.duration,
              }}
            />
          ))}

          {SAND_GRAINS.map((grain, index) => (
            <span
              key={`sand-grain-${index}`}
              className="sand-grain absolute rounded-full"
              style={{
                left: grain.left,
                top: grain.top,
                width: grain.size,
                height: grain.size,
                animationDelay: grain.delay,
                animationDuration: grain.duration,
                "--travel-x": grain.travelX,
                "--peak-y": grain.peakY,
                "--end-y": grain.endY,
              }}
            />
          ))}
        </div>
      ) : null}

      <motion.div
        className="sand-fill absolute inset-x-0 bottom-0"
        animate={{ height: `${fillPercent * 100}%` }}
        transition={{
          duration: reduceMotion ? 0.2 : 0.7,
          ease: [0.22, 0.8, 0.2, 1],
        }}
      >
        <div className="sand-body absolute inset-0" />
        <div className="sand-body-noise absolute inset-0" />
        <div className="sand-surface absolute inset-x-0 top-0 h-0">
          {DUNES.map((dune) => (
            <div
              key={dune.className}
              className={`sand-dune ${dune.className}`}
              style={{
                left: dune.left,
                top: dune.top,
                width: dune.width,
                height: dune.height,
                clipPath: dune.clipPath,
                "--dune-skew": dune.skew,
              }}
            >
              <span className="sand-dune-ripples" />
              <span className="sand-dune-slipface" />
              <span className="sand-dune-crest" />
              <span className="sand-dune-shadow" />
            </div>
          ))}
          <div className="sand-crest-light absolute inset-x-0 top-[-1.5rem] h-16" />
          <div className="sand-foreground-shadow absolute inset-x-0 bottom-[-13vh] h-[24vh]" />
        </div>

        {!reduceMotion ? (
          <div className="sand-crest-saltation absolute inset-x-0 top-[-4rem] h-28">
            {SAND_GRAINS.slice(0, 8).map((grain, index) => (
              <span
                key={`sand-crest-grain-${index}`}
                className="sand-grain sand-grain-crest absolute rounded-full"
                style={{
                  left: grain.left,
                  top: grain.top,
                  width: grain.size,
                  height: grain.size,
                  animationDelay: grain.delay,
                  animationDuration: grain.duration,
                  "--travel-x": grain.travelX,
                  "--peak-y": grain.peakY,
                  "--end-y": grain.endY,
                }}
              />
            ))}
          </div>
        ) : null}
      </motion.div>

      <div className="sand-haze sand-haze-front absolute inset-x-0 bottom-0 h-[34%]" />
      <div className="scene-vignette absolute inset-0" />
    </div>
  );
}
