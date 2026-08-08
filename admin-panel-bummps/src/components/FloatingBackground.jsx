import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function FloatingBackground({ variant = "app" }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });
  const t1x = useTransform(sx, (v) => v * 20);
  const t1y = useTransform(sy, (v) => v * 20);
  const t2x = useTransform(sx, (v) => v * -14);
  const t2y = useTransform(sy, (v) => v * -14);
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      mx.set(x);
      my.set(y);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [mx, my]);

  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-app-gradient">
      <motion.div
        style={{ x: t1x, y: t1y }}
        className="absolute -top-32 left-[8%] h-[420px] w-[420px] rounded-full bg-gold/[0.08] blur-[120px] animate-float"
      />
      <motion.div
        style={{ x: t2x, y: t2y }}
        className="absolute top-[30%] right-[4%] h-[380px] w-[380px] rounded-full bg-gold/[0.06] blur-[130px] animate-floatSlow"
      />
      <motion.div
        style={{ x: t1x, y: t2y }}
        className="absolute bottom-[-10%] left-[30%] h-[460px] w-[460px] rounded-full bg-[#F2D89A]/[0.05] blur-[140px] animate-float"
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
