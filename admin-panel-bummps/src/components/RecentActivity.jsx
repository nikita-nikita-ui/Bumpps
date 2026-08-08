import { HiOutlineUserAdd, HiOutlineShieldCheck, HiOutlineCash, HiOutlineHeart, HiOutlineFlag } from "react-icons/hi";
import GlassCard from "./ui/GlassCard";
import { activities } from "../data/ops";
import { motion } from "framer-motion";

const icons = { user: HiOutlineUserAdd, verify: HiOutlineShieldCheck, payment: HiOutlineCash, match: HiOutlineHeart, report: HiOutlineFlag };
const tones = { user: "text-gold bg-gold/10 border-gold/25", verify: "text-success bg-success/10 border-success/25", payment: "text-gold bg-gold/10 border-gold/25", match: "text-danger bg-danger/10 border-danger/25", report: "text-warning bg-warning/10 border-warning/25" };

export default function RecentActivity() {
  return (
    <GlassCard className="p-5 sm:p-6" delay={0.2}>
      <h3 className="font-display text-lg font-bold text-white mb-1">Recent Activity</h3>
      <p className="text-xs text-ink-muted mb-5">Live feed across the platform</p>

      <div className="space-y-1">
        {activities.map((a, i) => {
          const Icon = icons[a.type];
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
              className="flex items-start gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-white/[0.03]"
            >
              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border ${tones[a.type]}`}>
                <Icon className="text-sm" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] leading-snug text-white/90">{a.text}</p>
                <p className="mt-0.5 text-[11px] text-ink-faint">{a.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
