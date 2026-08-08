import { useState } from "react";
import { motion } from "framer-motion";

const variants = {
  primary: "bg-gold-gradient text-[#1D1508] shadow-[0_8px_24px_rgba(218,178,90,0.35)] hover:shadow-[0_10px_32px_rgba(218,178,90,0.5)]",
  outline: "border border-gold/30 bg-white/[0.02] text-white hover:border-gold hover:bg-gold/10",
  ghost: "text-ink-muted hover:text-white hover:bg-white/5",
  danger: "border border-danger/30 bg-danger/10 text-danger hover:bg-danger/20",
  success: "border border-success/30 bg-success/10 text-success hover:bg-success/20",
};

const sizes = {
  sm: "px-3.5 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm",
};

export default function Button({ children, variant = "primary", size = "md", className = "", icon: Icon, onClick, ...rest }) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);
    onClick?.(e);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
      className={`relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-pill font-semibold tracking-wide transition-colors duration-300 cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {Icon && <Icon className="text-base" />}
      {children}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ opacity: 0.5, scale: 0 }}
          animate={{ opacity: 0, scale: 6 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          style={{ left: r.x, top: r.y }}
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50"
        />
      ))}
    </motion.button>
  );
}
