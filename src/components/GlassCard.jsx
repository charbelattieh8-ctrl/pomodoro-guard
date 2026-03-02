import { motion } from "framer-motion";

export default function GlassCard({ children, className = "", ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass rounded-2xl shadow-card ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
