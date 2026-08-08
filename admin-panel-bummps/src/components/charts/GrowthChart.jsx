import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { userGrowth } from "../../data/ops";
import GlassCard from "../ui/GlassCard";
import { Tabs } from "../ui/Controls";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gold/20 bg-[#1D1F24] px-3.5 py-2.5 shadow-lift">
      <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-sm font-semibold text-white">
          {p.dataKey === "revenue" ? `$${p.value.toLocaleString()}` : p.value.toLocaleString()}
          <span className="ml-1.5 text-[11px] font-normal text-ink-faint capitalize">{p.dataKey}</span>
        </p>
      ))}
    </div>
  );
}

export default function GrowthChart() {
  const [metric, setMetric] = useState("Users");
  const key = metric === "Users" ? "users" : "revenue";

  return (
    <GlassCard className="p-5 sm:p-6" delay={0.1}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-white">Platform Growth</h3>
          <p className="text-xs text-ink-muted mt-1">User acquisition & revenue trend, last 7 months</p>
        </div>
        <Tabs tabs={["Users", "Revenue"]} active={metric} onChange={setMetric} />
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={userGrowth} margin={{ left: -20, right: 10 }}>
            <defs>
              <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DAB25A" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#DAB25A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#7C818D", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#7C818D", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#DAB25A", strokeOpacity: 0.2, strokeWidth: 30 }} />
            <Area type="monotone" dataKey={key} stroke="#DAB25A" strokeWidth={2.5} fill="url(#growthFill)" dot={false} activeDot={{ r: 5, fill: "#DAB25A", stroke: "#1D1F24", strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
