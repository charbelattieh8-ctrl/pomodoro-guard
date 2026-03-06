import { motion } from "framer-motion";

export default function PrimaryButton({
  children,
  className = "",
  variant = "solid",
  ...props
}) {
  const base =
    variant === "ghost"
      ? "border border-white/15 bg-white/[0.07] text-slate-100 hover:border-white/25 hover:bg-white/[0.12]"
      : "border border-cyan-100/30 bg-gradient-to-b from-cyan-200/28 via-white/18 to-white/10 text-white shadow-[0_16px_30px_rgba(34,211,238,0.12)] hover:border-cyan-100/40 hover:from-cyan-200/34 hover:via-white/22 hover:to-white/14";
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.985 }}
      className={`group relative overflow-hidden rounded-2xl px-4 py-2.5 font-semibold tracking-[0.01em] transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-200/50 disabled:cursor-not-allowed disabled:opacity-50 ${base} ${className}`}
      {...props}
    >
      <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-70" />
      <span className="relative flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
}
