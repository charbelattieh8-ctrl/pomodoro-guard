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

const DUNES = [
  {
    className: "sand-dune-back",
    left: "-12%",
    top: "-4vh",
    width: "62%",
    height: "18vh",
    clipPath: "polygon(0% 72%, 10% 56%, 23% 39%, 38% 26%, 55% 18%, 71% 19%, 84% 27%, 93% 38%, 100% 52%, 100% 100%, 0% 100%)",
    skew: "-1.5deg",
  },
  {
    className: "sand-dune-mid",
    left: "14%",
    top: "-8vh",
    width: "54%",
    height: "22vh",
    clipPath: "polygon(0% 82%, 8% 68%, 18% 52%, 31% 35%, 46% 22%, 59% 16%, 71% 18%, 82% 28%, 91% 42%, 100% 60%, 100% 100%, 0% 100%)",
    skew: "0deg",
  },
  {
    className: "sand-dune-front",
    left: "40%",
    top: "-10vh",
    width: "68%",
    height: "26vh",
    clipPath: "polygon(0% 88%, 6% 76%, 15% 61%, 27% 45%, 41% 30%, 55% 18%, 67% 12%, 78% 11%, 87% 16%, 94% 27%, 100% 42%, 100% 100%, 0% 100%)",
    skew: "1deg",
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
