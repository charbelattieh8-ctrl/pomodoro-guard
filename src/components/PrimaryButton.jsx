import { motion } from "framer-motion";

export default function PrimaryButton({
  children,
  className = "",
  variant = "solid",
  ...props
}) {
  const base =
    variant === "ghost"
      ? "bg-white/10 hover:bg-white/20 border border-white/20"
      : "bg-white/20 hover:bg-white/30 border border-white/30";
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-xl px-4 py-2 font-semibold text-white transition ${base} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
