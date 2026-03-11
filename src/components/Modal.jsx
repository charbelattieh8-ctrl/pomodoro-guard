import { AnimatePresence, motion } from "framer-motion";
import GlassCard from "./GlassCard";
import PrimaryButton from "./PrimaryButton";

export default function Modal({ open, title, description, onCancel, onConfirm }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.99 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <GlassCard className="p-5">
              <h3 className="font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-200/90">{description}</p>
              <div className="mt-5 flex justify-end gap-3">
                <PrimaryButton variant="ghost" onClick={onCancel}>
                  Cancel
                </PrimaryButton>
                <PrimaryButton onClick={onConfirm}>Confirm</PrimaryButton>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
