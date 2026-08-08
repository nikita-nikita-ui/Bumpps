import { motion } from "framer-motion";

export default function GlassCard({ children, className = "", hover = false, delay = 0, as: As = motion.div, ...rest }) {
  return (
    <As
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hover ? { y: -4, boxShadow: "0 30px 80px -25px rgba(218,178,90,0.25)" } : undefined}
      className={`relative rounded-card border border-gold/[0.14] bg-card/70 backdrop-blur-xl shadow-soft ${className}`}
      {...rest}
    >
      {children}
    </As>
  );
}
