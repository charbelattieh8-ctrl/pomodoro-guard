import { AnimatePresence, motion } from "framer-motion";
import GlassCard from "./GlassCard";
import PrimaryButton from "./PrimaryButton";

export default function LoginModal({
  open,
  onClose,
  onSubmit,
  onGoogle,
  onGuest,
  busy,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center bg-black/45 p-4"
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
            <GlassCard className="space-y-3 p-5">
              <h3 className="font-display text-xl font-semibold">Login</h3>
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  onSubmit(String(fd.get("email") || ""), String(fd.get("password") || ""));
                }}
              >
                <input name="email" type="email" required className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2" placeholder="Email" />
                <input name="password" type="password" required className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2" placeholder="Password" />
                <PrimaryButton className="w-full" disabled={busy}>Login</PrimaryButton>
              </form>
              <div className="grid gap-2">
                <PrimaryButton variant="ghost" onClick={onGoogle}>Continue with Google</PrimaryButton>
                <PrimaryButton variant="ghost" onClick={onGuest}>Continue as Guest</PrimaryButton>
              </div>
              <button type="button" className="text-sm underline" onClick={onClose}>Close</button>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
