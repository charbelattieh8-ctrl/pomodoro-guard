import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ items = [], onClose }) {
  return (
    <div className="fixed right-4 top-4 z-50 space-y-2">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 20, y: -6 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 20, y: -4 }}
            className="glass panel-card max-w-sm cursor-pointer rounded-2xl px-4 py-3 text-sm text-white shadow-glow"
            onClick={() => onClose(t.id)}
          >
            <p className="eyebrow text-[0.62rem] text-cyan-100/75">System Note</p>
            <p className="mt-1 text-sm text-white/92">{t.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
