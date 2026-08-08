import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineUsers, HiOutlineUserAdd as HiOutlineUserAddIcon, HiOutlineChatAlt2, HiOutlineCash, HiOutlineSpeakerphone, HiOutlineDocumentReport, HiOutlineUserAdd } from "react-icons/hi";
import StatCard from "../components/ui/StatCard";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Badge, { statusTone } from "../components/ui/Badge";
import GrowthChart from "../components/charts/GrowthChart";
import RecentActivity from "../components/RecentActivity";
import { SkeletonGrid } from "../components/ui/Skeleton";
import { allUsers, verificationRequests } from "../data/users";
import { transactions } from "../data/ops";
import { useAuth } from "../context/AuthContext";
import { getAdminStats } from "../services/Apis/users";

const spark = (base) => Array.from({ length: 10 }).map((_, i) => ({ v: base + Math.sin(i) * base * 0.15 + i * (base * 0.02) }));

export default function Dashboard() {
  const { admin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const now = new Date();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats();
        setStats(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalUsers = stats?.totalUsers ?? allUsers.length * 142;
  const newUsers = stats?.totalNewUsers ?? allUsers.filter((u) => u.verified).length * 142;
  const activeChats = 1840;
  const revenue = transactions.reduce((s, t) => s + (t.status === "Success" ? t.amount : 0), 0) * 40;

  const maleUsers = stats?.maleUsers ?? 0;
  const femaleUsers = stats?.femaleUsers ?? 0;
  const genderTotal = maleUsers + femaleUsers || 1;
  const malePct = Math.round((maleUsers / genderTotal) * 100);
  const femalePct = 100 - malePct;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-7 flex flex-col gap-5 rounded-card border border-gold/[0.14] bg-gradient-to-br from-card/80 to-card-raised/60 p-6 sm:p-7 backdrop-blur-xl relative overflow-hidden lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/[0.08] blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold mb-2">
            {now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
          <h1 className="font-display text-[26px] sm:text-3xl font-extrabold text-white">
            Welcome Back, {admin?.name?.split(" ")[0] || "Admin"} 
          </h1>
          <p className="mt-1.5 text-sm text-ink-muted">Here's today's overview of the BUMMPS platform.</p>
        </div>
        <div className="relative flex flex-wrap gap-3">
          <Button variant="primary" icon={HiOutlineUserAdd} size="md">Approve Users</Button>
          <Button variant="outline" icon={HiOutlineSpeakerphone} size="md">Broadcast Notification</Button>
          <Button variant="outline" icon={HiOutlineDocumentReport} size="md">Generate Report</Button>
        </div>
      </motion.div>

      {loading ? (
        <SkeletonGrid count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard label="Total Users" value={totalUsers} icon={HiOutlineUsers} trend="12.4%" trendUp spark={spark(40)} delay={0} />
          <StatCard label="New Users" value={newUsers} icon={HiOutlineUserAddIcon} trend="8.1%" trendUp spark={spark(30)} delay={0.06} />
          <StatCard label="Active Chats" value={activeChats} icon={HiOutlineChatAlt2} trend="5.6%" trendUp spark={spark(25)} delay={0.12} />
          <StatCard label="Revenue" value={revenue} prefix="$" decimals={0} icon={HiOutlineCash} trend="18.9%" trendUp spark={spark(35)} delay={0.18} />
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GrowthChart />
        </div>
        <RecentActivity />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-5 sm:p-6 lg:col-span-2" delay={0.15}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-white">Latest Registrations</h3>
            <Badge tone="gold">{allUsers.length} today</Badge>
          </div>
          <div className="space-y-3">
            {allUsers.slice(0, 5).map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-xl px-2 py-2 transition-colors hover:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <img src={u.avatar} className="h-9 w-9 rounded-full object-cover ring-2 ring-gold/15" />
                  <div>
                    <p className="text-sm font-medium text-white">{u.name}</p>
                    <p className="text-[11px] text-ink-faint">{u.country} · {u.age} yrs</p>
                  </div>
                </div>
                <Badge tone={statusTone(u.status)}>{u.status}</Badge>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6" delay={0.2}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-white">Gender Split</h3>
            <Badge tone="gold">{maleUsers + femaleUsers} users</Badge>
          </div>
          <div className="space-y-5">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-ink-muted">Male</span>
                <span className="font-semibold text-white">{maleUsers} ({malePct}%)</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-pill bg-white/[0.06]">
                <div className="h-full rounded-pill bg-gold-gradient" style={{ width: `${malePct}%` }} />
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-ink-muted">Female</span>
                <span className="font-semibold text-white">{femaleUsers} ({femalePct}%)</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-pill bg-white/[0.06]">
                <div className="h-full rounded-pill bg-white/40" style={{ width: `${femalePct}%` }} />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-5 sm:p-6" delay={0.25}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-white">Pending Verifications</h3>
            <Badge tone="warning">{verificationRequests.filter((v) => v.status === "Pending").length} pending</Badge>
          </div>
          <div className="space-y-3">
            {verificationRequests.filter((v) => v.status === "Pending").slice(0, 5).map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded-xl px-2 py-2 transition-colors hover:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <img src={v.user.avatar} className="h-9 w-9 rounded-full object-cover ring-2 ring-gold/15" />
                  <div>
                    <p className="text-sm font-medium text-white">{v.user.name}</p>
                    <p className="text-[11px] text-ink-faint">{v.idType} · submitted {v.submitted}</p>
                  </div>
                </div>
                <Badge tone="warning">Pending</Badge>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}