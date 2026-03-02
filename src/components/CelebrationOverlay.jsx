import { AnimatePresence, motion } from "framer-motion";

const PARTICLES = [
  { x: -140, y: -70, d: 0 },
  { x: -110, y: -120, d: 0.03 },
  { x: -70, y: -150, d: 0.06 },
  { x: -20, y: -135, d: 0.09 },
  { x: 30, y: -150, d: 0.12 },
  { x: 70, y: -120, d: 0.15 },
  { x: 120, y: -80, d: 0.18 },
  { x: 150, y: -40, d: 0.21 },
];

export default function CelebrationOverlay({ celebration }) {
  return (
    <AnimatePresence>
      {celebration && (
        <motion.div
          key={celebration.id}
          className="pointer-events-none fixed inset-0 z-[70] grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="glass rounded-2xl px-6 py-5 text-center shadow-glow"
            initial={{ scale: 0.88, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -10, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-slate-200">{celebration.title}</p>
            <p className="mt-1 text-sm text-slate-100">{celebration.subtitle}</p>
            <p className="mt-3 font-display text-3xl font-semibold text-amber-100">+{celebration.coins} coins</p>
          </motion.div>

          <div className="absolute left-1/2 top-1/2">
            {PARTICLES.map((p, idx) => (
              <motion.span
                key={idx}
                className="absolute h-2 w-2 rounded-full bg-amber-200/90"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                animate={{ x: p.x, y: p.y, opacity: [0, 1, 0], scale: [0.5, 1, 0.4] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, delay: p.d, ease: "easeOut" }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
