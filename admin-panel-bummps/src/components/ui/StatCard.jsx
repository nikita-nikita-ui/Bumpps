import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import Counter from "./Counter";

export default function StatCard({ label, value, prefix = "", suffix = "", decimals = 0, icon: Icon, trend, trendUp = true, spark, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-card border border-gold/[0.14] bg-card/70 backdrop-blur-xl p-5 shadow-soft transition-shadow duration-500 hover:shadow-goldGlow"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">{label}</p>
          <h3 className="mt-2 font-display text-[28px] font-bold text-white leading-none">
            <Counter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
          </h3>
          {trend && (
            <p className={`mt-2 flex items-center gap-1 text-xs font-semibold ${trendUp ? "text-success" : "text-danger"}`}>
              <span>{trendUp ? "↑" : "↓"}</span> {trend} <span className="text-ink-faint font-normal">vs last month</span>
            </p>
          )}
        </div>
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-gold/25 bg-gold/10 text-gold shadow-[0_0_20px_rgba(218,178,90,0.15)]">
          <Icon className="text-lg" />
        </div>
      </div>

      {spark && (
        <div className="relative -mx-1 mt-3 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spark}>
              <defs>
                <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DAB25A" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#DAB25A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="#DAB25A" strokeWidth={2} fill={`url(#spark-${label})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
