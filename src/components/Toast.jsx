import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ items = [], onClose }) {
  return (
    <div className="fixed right-4 top-4 z-50 space-y-2">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass rounded-xl px-4 py-3 text-sm text-white shadow-glow"
            onClick={() => onClose(t.id)}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
