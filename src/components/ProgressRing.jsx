import { motion } from "framer-motion";

export default function ProgressRing({ progress, size = 250, stroke = 12, children }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <div
        className="pointer-events-none absolute rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_68%)] blur-2xl"
        style={{ width: size * 0.88, height: size * 0.88 }}
      />
      <svg width={size} height={size} className="-rotate-90 drop-shadow-[0_0_22px_rgba(255,255,255,0.14)]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={stroke}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGradient)"
          strokeLinecap="round"
          strokeWidth={stroke}
          fill="transparent"
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.4 }}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
            <stop offset="45%" stopColor="rgba(186,230,253,0.96)" />
            <stop offset="100%" stopColor="rgba(125,211,252,0.88)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute">{children}</div>
    </div>
  );
}
