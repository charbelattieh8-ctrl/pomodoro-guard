import { motion } from "framer-motion";

export default function ProgressRing({ progress, size = 250, stroke = 12, children }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={stroke}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.95)"
          strokeLinecap="round"
          strokeWidth={stroke}
          fill="transparent"
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.4 }}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute">{children}</div>
    </div>
  );
}
