import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineEye,
  HiOutlinePause,
  HiOutlinePlay,
  HiOutlineTrash,
  HiOutlineUserAdd,
  HiOutlineDownload,
  HiOutlineUsers,
  HiOutlineCheckCircle,
  HiOutlineStar,
  HiOutlineBan,
} from "react-icons/hi";

import { SearchInput, SelectFilter, Tabs } from "../components/ui/Controls";
import DataTable from "../components/ui/DataTable";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import UserModal from "../components/UserModal";

import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../services/Apis/users";

const tabFilter = {
  "All Users": () => true,
  Verified: (u) => u.isVerified,
  Blocked: (u) => u.isDeactivated,
  Premium: (u) => u.subscription?.isActive,
};

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-card border border-gold/[0.14] bg-card/70 shadow-soft backdrop-blur-xl ${className}`}
  >
    {children}
  </div>
);

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Card className="group relative overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/30">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/[0.04] blur-3xl transition group-hover:bg-gold/[0.08]" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-ink-muted">{title}</p>

          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {value.toLocaleString()}
          </h2>

          <p className="mt-2 text-[11px] text-ink-faint">{description}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/[0.14] bg-gold/[0.08] text-xl text-gold transition group-hover:bg-gold/15">
          <Icon />
        </div>
      </div>
    </Card>
  </motion.div>
);

export default function Users() {
  const [tab, setTab] = useState("All Users");
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("All Countries");
  const [status, setStatus] = useState("All Status");
  const [selected, setSelected] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res?.data?.users || []);
    } catch (err) {
      console.log(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const countries = useMemo(
    () => [
      "All Countries",
      ...new Set(users.map((u) => u.livingIn).filter(Boolean)),
    ],
    [users]
  );

  const statuses = ["All Status", "Active", "Blocked"];

  const capitalize = (value) => {
    if (!value) return "-";

    return String(value)
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const stats = useMemo(
    () => ({
      total: users.length,
      verified: users.filter((u) => u.isVerified).length,
      premium: users.filter((u) => u.subscription?.isActive).length,
      blocked: users.filter((u) => u.isDeactivated).length,
    }),
    [users]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...users]
      .filter((u) => tabFilter[tab]?.(u))
      .filter((u) => {
        if (!query) return true;

        const name = String(u.name || "").toLowerCase();
        const email = String(u.email || "").toLowerCase();
        const userId = String(u.userId || u.id || "").toLowerCase();

        return (
          name.includes(query) ||
          email.includes(query) ||
          userId.includes(query)
        );
      })
      .filter(
        (u) =>
          country === "All Countries" || u.livingIn === country
      )
      .filter((u) => {
        if (status === "All Status") return true;
        if (status === "Active") return !u.isDeactivated;
        if (status === "Blocked") return u.isDeactivated;
        return true;
      })
      .sort((a, b) => {
        const genderA = String(a.gender || "").toLowerCase();
        const genderB = String(b.gender || "").toLowerCase();

        if (genderA !== genderB) {
          if (genderA === "male") return -1;
          if (genderB === "male") return 1;
        }

        return String(a.name || "").localeCompare(
          String(b.name || "")
        );
      });
  }, [users, tab, search, country, status]);

  const handleViewUser = async (user) => {
    try {
      const res = await getUserById(user._id);
      setSelected(res?.data?.user || null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      await deleteUser(user._id);
      await fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggleUser = async (user) => {
    try {
      await updateUser(user._id, {
        isDeactivated: !user.isDeactivated,
      });

      await fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    {
      key: "name",
      header: "User",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={u.profilePic || "/default-avatar.png"}
              alt={capitalize(u.name)}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-gold/10"
            />

            {u.isVerified && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-card bg-emerald-400 text-[9px] font-bold text-black">
                ✓
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="truncate font-semibold text-white">
              {capitalize(u.name)}
            </div>

            <p className="mt-0.5 truncate text-[11px] text-ink-faint">
              {u.email || "No email"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "age",
      header: "Age",
      render: (u) => (
        <span className="text-sm text-ink-muted">
          {u.age || "-"}
        </span>
      ),
    },
    {
      key: "gender",
      header: "Gender",
      render: (u) => (
        <span className="text-sm text-ink-muted">
          {u.gender
            ? u.gender.charAt(0).toUpperCase() +
              u.gender.slice(1).toLowerCase()
            : "-"}
        </span>
      ),
    },
    {
      key: "livingIn",
      header: "Location",
      render: (u) => (
        <span className="text-sm text-ink-muted">
          {capitalize(u.livingIn)}
        </span>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      render: (u) => {
        const rawPlan = u.subscription?.plan;

        let planName = "Free";

        if (typeof rawPlan === "object" && rawPlan !== null) {
          planName =
            rawPlan.name ||
            rawPlan.title ||
            rawPlan.planName ||
            "Free";
        } else if (typeof rawPlan === "string") {
          const isMongoId = /^[a-f\d]{24}$/i.test(rawPlan);
          planName = isMongoId ? "Free" : rawPlan;
        }

        const isPremium =
          Boolean(u.subscription?.isActive) &&
          !/^[a-f\d]{24}$/i.test(String(rawPlan || ""));

        return (
          <span
            className={`inline-flex items-center gap-1 rounded-pill border px-2.5 py-1 text-[10px] font-semibold ${
              isPremium
                ? "border-gold/20 bg-gold/10 text-gold"
                : "border-white/10 bg-white/[0.03] text-ink-muted"
            }`}
          >
            {isPremium && <HiOutlineStar className="text-xs" />}
            {capitalize(planName)}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Verification",
      render: (u) => (
        <Badge tone={u.isVerified ? "success" : "warning"}>
          {u.isVerified ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
      key: "blockStatus",
      header: "Account",
      render: (u) => (
        <Badge
          tone={u.isDeactivated ? "danger" : "success"}
          dot
        >
          {u.isDeactivated ? "Blocked" : "Active"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (u) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewUser(u)}
            title="View User"
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-ink-muted transition-all hover:scale-110 hover:border-gold/40 hover:bg-gold/[0.06] hover:text-gold"
          >
            <HiOutlineEye className="text-sm" />
          </button>

          <button
            onClick={() => handleDeleteUser(u)}
            title="Delete User"
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-ink-muted transition-all hover:scale-110 hover:border-danger/40 hover:bg-danger/10 hover:text-danger"
          >
            <HiOutlineTrash className="text-sm" />
          </button>

          <button
            onClick={() => handleToggleUser(u)}
            title={u.isDeactivated ? "Activate User" : "Block User"}
            className={`grid h-8 w-8 place-items-center rounded-full border bg-white/[0.02] transition-all hover:scale-110 ${
              u.isDeactivated
                ? "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                : "border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
            }`}
          >
            {u.isDeactivated ? (
              <HiOutlinePlay className="text-sm" />
            ) : (
              <HiOutlinePause className="text-sm" />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 pb-4 pt-0 text-white sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-card border border-gold/[0.14] bg-card/70 p-6 shadow-soft backdrop-blur-xl sm:p-8"
        >
          <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-gold/[0.05] blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  User Management
                </span>
              </div>

              <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
                Platform Members
              </p>

              <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                Manage Users
              </h1>

              <p className="mt-2 max-w-xl text-sm text-ink-muted">
                Manage, verify, moderate and monitor every member
                on the BUMMPS platform.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                icon={HiOutlineDownload}
                size="md"
              >
                Export
              </Button>

              <Button
                variant="primary"
                icon={HiOutlineUserAdd}
                size="md"
              >
                Add User
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats.total}
            icon={HiOutlineUsers}
            description="All registered members"
            delay={0.05}
          />

          <StatCard
            title="Verified Users"
            value={stats.verified}
            icon={HiOutlineCheckCircle}
            description="Identity verified members"
            delay={0.1}
          />

          <StatCard
            title="Premium Users"
            value={stats.premium}
            icon={HiOutlineStar}
            description="Active premium subscriptions"
            delay={0.15}
          />

          <StatCard
            title="Blocked Users"
            value={stats.blocked}
            icon={HiOutlineBan}
            description="Currently restricted accounts"
            delay={0.2}
          />
        </div>

        <Card className="overflow-hidden">
          <div className="border-b border-gold/[0.08] p-5 sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  All Members
                </h2>

                <p className="mt-1 text-xs text-ink-muted">
                  View and manage registered BUMMPS users.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-ink-faint">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {filtered.length} users found
              </div>
            </div>

            <div className="mb-5 overflow-x-auto">
              <Tabs
                tabs={Object.keys(tabFilter)}
                active={tab}
                onChange={setTab}
              />
            </div>

            <div className="flex flex-col gap-3 xl:flex-row">
              <div className="relative flex-1">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search by name, email or user ID..."
                  className="w-full"
                />
              </div>

              <SelectFilter
                value={country}
                onChange={setCountry}
                options={countries}
                className="xl:w-52"
              />

              <SelectFilter
                value={status}
                onChange={setStatus}
                options={statuses}
                className="xl:w-48"
              />
            </div>
          </div>

          <div className="relative">
            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />

                  <p className="text-xs text-ink-muted">
                    Loading users...
                  </p>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/[0.14] bg-gold/[0.06] text-2xl text-gold">
                  <HiOutlineUsers />
                </div>

                <h3 className="text-sm font-semibold text-white">
                  No users found
                </h3>

                <p className="mt-1 max-w-sm text-xs text-ink-muted">
                  Try changing your search query or filters to
                  find users.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <DataTable
                  columns={columns}
                  data={filtered}
                  pageSize={8}
                />
              </div>
            )}
          </div>
        </Card>

        <UserModal
          user={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
        />
      </div>
    </div>
  );
}