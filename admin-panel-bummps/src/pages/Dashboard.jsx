import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineUsers,
  HiOutlineUserAdd,
  HiOutlineChatAlt2,
  HiOutlineCash,
  HiOutlineSpeakerphone,
  HiOutlineCheckCircle,
  HiOutlineDotsVertical,
  HiOutlineTrendingUp,
  HiOutlineHeart,
} from "react-icons/hi";

const dashboardData = {
  stats: [
    {
      title: "Total Users",
      value: "15,842",
      change: "+12.4%",
      icon: HiOutlineUsers,
      positive: true,
    },
    {
      title: "New Users",
      value: "1,248",
      change: "+8.6%",
      icon: HiOutlineUserAdd,
      positive: true,
    },
    {
      title: "Active Chats",
      value: "4,682",
      change: "+15.2%",
      icon: HiOutlineChatAlt2,
      positive: true,
    },
    {
      title: "Revenue",
      value: "$48,920",
      change: "+18.9%",
      icon: HiOutlineCash,
      positive: true,
    },
  ],

  growth: [
    { month: "Jan", users: 820 },
    { month: "Feb", users: 1080 },
    { month: "Mar", users: 1320 },
    { month: "Apr", users: 1180 },
    { month: "May", users: 1680 },
    { month: "Jun", users: 1920 },
    { month: "Jul", users: 2310 },
    { month: "Aug", users: 2780 },
  ],

  users: [
    {
      id: 1,
      name: "Sophia Anderson",
      email: "sophia@example.com",
      country: "United States",
      status: "Verified",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
    {
      id: 2,
      name: "Olivia Williams",
      email: "olivia@example.com",
      country: "United Kingdom",
      status: "Active",
      avatar: "https://i.pravatar.cc/150?img=45",
    },
    {
      id: 3,
      name: "Emma Johnson",
      email: "emma@example.com",
      country: "Canada",
      status: "Verified",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
    {
      id: 4,
      name: "Ava Martinez",
      email: "ava@example.com",
      country: "Spain",
      status: "Pending",
      avatar: "https://i.pravatar.cc/150?img=44",
    },
    {
      id: 5,
      name: "Isabella Brown",
      email: "isabella@example.com",
      country: "Australia",
      status: "Active",
      avatar: "https://i.pravatar.cc/150?img=48",
    },
  ],

  activities: [
    {
      title: "New premium subscription",
      description: "Sophia purchased Gold Plan",
      time: "5 min ago",
      icon: HiOutlineCash,
    },
    {
      title: "Profile verified",
      description: "Emma Johnson verification approved",
      time: "18 min ago",
      icon: HiOutlineCheckCircle,
    },
    {
      title: "New user registered",
      description: "Ava Martinez joined BUMMPS",
      time: "32 min ago",
      icon: HiOutlineUserAdd,
    },
    {
      title: "New match created",
      description: "24 new matches created today",
      time: "1 hour ago",
      icon: HiOutlineHeart,
    },
  ],

  verification: [
    {
      name: "Daniel Wilson",
      type: "Passport",
      submitted: "12 min ago",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      name: "James Miller",
      type: "Driving License",
      submitted: "28 min ago",
      avatar: "https://i.pravatar.cc/150?img=13",
    },
    {
      name: "Lucas Martin",
      type: "National ID",
      submitted: "41 min ago",
      avatar: "https://i.pravatar.cc/150?img=14",
    },
  ],

  gender: {
    male: 8920,
    female: 6922,
  },
};

/* =========================================================
   Theme Components
========================================================= */

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-card border border-gold/[0.14] bg-card/70 backdrop-blur-xl shadow-soft ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, type = "gold" }) => {
  const styles = {
    gold: "bg-gold/10 text-gold border-gold/20",
    green:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    yellow:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`rounded-pill border px-2.5 py-1 text-[10px] font-semibold ${styles[type]}`}
    >
      {children}
    </span>
  );
};

const statusType = (status) => {
  if (status === "Verified" || status === "Active") {
    return "green";
  }

  if (status === "Pending") {
    return "yellow";
  }

  return "gold";
};

/* =========================================================
   Dashboard
========================================================= */

export default function Dashboard() {
  const [period, setPeriod] = useState("Monthly");

  const totalGender =
    dashboardData.gender.male + dashboardData.gender.female;

  const malePercentage = Math.round(
    (dashboardData.gender.male / totalGender) * 100
  );

  const femalePercentage = 100 - malePercentage;

  const maxGrowth = Math.max(
    ...dashboardData.growth.map((item) => item.users)
  );

  return (
    <div className="px-4 pb-4 pt-2 text-white sm:px-6 sm:pb-6 sm:pt-3 lg:px-8 lg:pb-8 lg:pt-3">
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* =================================================
            Welcome Header
        ================================================= */}

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-card border border-gold/[0.14] bg-card/70 p-6 shadow-soft backdrop-blur-xl sm:p-8"
        >
          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Platform Online
                </span>
              </div>

              <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
                Saturday, August 22, 2026
              </p>

              <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                Welcome Back, Admin
              </h1>

              <p className="mt-2 max-w-xl text-sm text-ink-muted">
                Here's what's happening across the BUMMPS platform today.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 rounded-pill bg-gold-gradient px-4 py-3 text-sm font-bold text-black transition hover:scale-[1.02]">
                <HiOutlineUserAdd className="text-lg" />
                Approve Users
              </button>

              <button className="flex items-center gap-2 rounded-pill border border-gold/[0.14] bg-card/70 px-4 py-3 text-sm font-semibold text-white transition hover:border-gold/30 hover:bg-gold/[0.05]">
                <HiOutlineSpeakerphone className="text-lg text-gold" />
                Broadcast
              </button>
            </div>
          </div>
        </motion.div>

        {/* =================================================
            Stats
        ================================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardData.stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="group relative overflow-hidden p-5 transition hover:-translate-y-1 hover:border-gold/30">
                  <div className="relative flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-ink-muted">
                        {stat.title}
                      </p>

                      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        {stat.value}
                      </h2>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                          <HiOutlineTrendingUp />
                          {stat.change}
                        </span>

                        <span className="text-[11px] text-ink-faint">
                          vs last month
                        </span>
                      </div>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/[0.14] bg-gold/[0.08] text-xl text-gold">
                      <Icon />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* =================================================
            Growth + Activity
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* User Growth */}

          <Card className="p-5 sm:p-6 xl:col-span-2">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  User Growth
                </h2>

                <p className="mt-1 text-xs text-ink-muted">
                  New user registrations over time
                </p>
              </div>

              <div className="flex rounded-pill border border-gold/[0.14] bg-card/70 p-1">
                {["Weekly", "Monthly", "Yearly"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setPeriod(item)}
                    className={`rounded-pill px-3 py-1.5 text-xs font-medium transition ${
                      period === item
                        ? "bg-gold/10 text-gold"
                        : "text-ink-muted hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex h-64 items-end gap-3 sm:gap-5">
              {dashboardData.growth.map((item) => {
                const height = Math.max(
                  (item.users / maxGrowth) * 100,
                  8
                );

                return (
                  <div
                    key={item.month}
                    className="group flex h-full flex-1 flex-col justify-end"
                  >
                    <div className="relative flex flex-1 items-end">
                      <div
                        className="w-full rounded-t-xl bg-gold-gradient opacity-80 transition-all duration-500 group-hover:opacity-100"
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded-lg border border-gold/[0.14] bg-card px-2 py-1 text-[10px] font-semibold text-white shadow-soft group-hover:block">
                          {item.users.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <span className="mt-3 text-center text-[11px] text-ink-muted">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recent Activity */}

          <Card className="p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Recent Activity
                </h2>

                <p className="mt-1 text-xs text-ink-muted">
                  Latest platform events
                </p>
              </div>

              <button className="text-ink-muted transition hover:text-gold">
                <HiOutlineDotsVertical />
              </button>
            </div>

            <div className="space-y-5">
              {dashboardData.activities.map((activity, index) => {
                const Icon = activity.icon;

                return (
                  <div key={index} className="flex gap-3">
                    <div className="relative">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gold/[0.14] bg-gold/[0.08] text-gold">
                        <Icon />
                      </div>

                      {index !== dashboardData.activities.length - 1 && (
                        <div className="absolute left-1/2 top-10 h-7 w-px -translate-x-1/2 bg-white/[0.06]" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">
                        {activity.title}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-ink-muted">
                        {activity.description}
                      </p>

                      <p className="mt-1 text-[10px] text-ink-faint">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* =================================================
            Registrations + Gender
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Latest Registrations */}

          <Card className="overflow-hidden xl:col-span-2">
            <div className="flex items-center justify-between border-b border-gold/[0.08] p-5 sm:p-6">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Latest Registrations
                </h2>

                <p className="mt-1 text-xs text-ink-muted">
                  Recently joined members
                </p>
              </div>

              <button className="text-xs font-semibold text-gold hover:underline">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="border-b border-gold/[0.08] text-left">
                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
                      User
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
                      Location
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dashboardData.users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-white/[0.04] transition hover:bg-gold/[0.03]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-gold/10"
                          />

                          <div>
                            <p className="text-sm font-semibold text-white">
                              {user.name}
                            </p>

                            <p className="mt-0.5 text-[11px] text-ink-faint">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-xs text-ink-muted">
                        {user.country}
                      </td>

                      <td className="px-5 py-4">
                        <Badge type={statusType(user.status)}>
                          {user.status}
                        </Badge>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button className="rounded-lg p-2 text-ink-faint transition hover:bg-gold/[0.05] hover:text-gold">
                          <HiOutlineDotsVertical />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Gender Split */}

          <Card className="p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Gender Split
                </h2>

                <p className="mt-1 text-xs text-ink-muted">
                  Current user distribution
                </p>
              </div>

              <HiOutlineUsers className="text-xl text-gold" />
            </div>

            <div className="mb-6 flex items-center justify-center">
              <div
                className="relative flex h-44 w-44 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#E8C15B 0 ${malePercentage}%, rgba(255,255,255,0.10) ${malePercentage}% 100%)`,
                }}
              >
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-card/70">
                  <span className="font-display text-2xl font-bold text-white">
                    {totalGender.toLocaleString()}
                  </span>

                  <span className="text-[10px] uppercase tracking-wider text-ink-faint">
                    Total Users
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-gold" />

                  <span className="text-sm text-ink-muted">
                    Male
                  </span>
                </div>

                <span className="text-sm font-semibold text-white">
                  {dashboardData.gender.male.toLocaleString()}{" "}
                  <span className="text-ink-faint">
                    ({malePercentage}%)
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/30" />

                  <span className="text-sm text-ink-muted">
                    Female
                  </span>
                </div>

                <span className="text-sm font-semibold text-white">
                  {dashboardData.gender.female.toLocaleString()}{" "}
                  <span className="text-ink-faint">
                    ({femalePercentage}%)
                  </span>
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* =================================================
            Pending Verifications
        ================================================= */}

        <Card className="p-5 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                Pending Verifications
              </h2>

              <p className="mt-1 text-xs text-ink-muted">
                Profiles waiting for approval
              </p>
            </div>

            <Badge type="yellow">
              {dashboardData.verification.length} Pending
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {dashboardData.verification.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-xl border border-gold/[0.14] bg-card/70 p-3 transition hover:border-gold/30"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-gold/10"
                  />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.name}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-[10px] text-ink-faint">
                      <span>{item.type}</span>
                      <span>•</span>
                      <span>{item.submitted}</span>
                    </div>
                  </div>
                </div>

                <HiOutlineCheckCircle className="text-xl text-yellow-400" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}