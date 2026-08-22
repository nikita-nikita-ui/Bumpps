import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineBell,
  HiOutlineTrash,
  HiOutlineSpeakerphone,
  HiOutlineUsers,
  HiOutlineUser,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineHeart,
  HiOutlineSparkles,
  HiOutlineGift,
  HiOutlinePaperAirplane,
} from "react-icons/hi";

import { SearchInput, SelectFilter, Tabs } from "../components/ui/Controls";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

import {
  sendNotificationToAll,
  sendNotificationToUser,
  getNotificationHistory,
} from "../services/Apis/users";

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-card border border-gold/[0.14] bg-card/70 backdrop-blur-xl shadow-soft ${className}`}
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
      <div className="flex items-start justify-between">
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

const typeMeta = {
  match: {
    icon: HiOutlineHeart,
    label: "Match",
  },
  like: {
    icon: HiOutlineHeart,
    label: "Like",
  },
  recommendation: {
    icon: HiOutlineSparkles,
    label: "Recommendation",
  },
  birthday: {
    icon: HiOutlineGift,
    label: "Birthday",
  },
};

const getIcon = (notification) => {
  if (notification.type && typeMeta[notification.type]) {
    return typeMeta[notification.type].icon;
  }

  return notification.recipient
    ? HiOutlineUser
    : HiOutlineSpeakerphone;
};

const getTypeLabel = (notification) => {
  if (notification.type && typeMeta[notification.type]) {
    return typeMeta[notification.type].label;
  }

  return notification.recipient
    ? "Specific User"
    : "All Users";
};

const formatDate = (date, full = false) => {
  if (!date) return "-";

  return new Date(date).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: full ? "numeric" : undefined,
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function Notifications() {
  const [composeOpen, setComposeOpen] = useState(false);
  const [target, setTarget] = useState("all");
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [lastSent, setLastSent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState(null);
  const [search, setSearch] = useState("");
  const [targetFilter, setTargetFilter] = useState("All Audiences");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [tab, setTab] = useState("All Notifications");

  const fetchHistory = async () => {
    setLoadingHistory(true);
    setHistoryError(null);

    try {
      const res = await getNotificationHistory();
      setHistory(res.data.notifications || []);
    } catch (err) {
      setHistoryError(
        err?.response?.data?.message ||
          "Notification history load nahi ho paayi."
      );
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const resetComposeForm = () => {
    setTitle("");
    setMessage("");
    setUserId("");
    setTarget("all");
    setError(null);
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      setError("Title aur Message dono required hain.");
      return;
    }

    if (target === "single" && !userId.trim()) {
      setError(
        "User ID required hai specific user ko bhejne ke liye."
      );
      return;
    }

    setSending(true);
    setError(null);

    try {
      const res =
        target === "all"
          ? await sendNotificationToAll({
              title,
              message,
            })
          : await sendNotificationToUser({
              userId,
              title,
              message,
            });

      setLastSent(res.data);

      if (res.data.notification) {
        setHistory((h) => [res.data.notification, ...h]);
      }

      resetComposeForm();
      setComposeOpen(false);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Notification bhejne me error aaya. Dobara try karo."
      );
    } finally {
      setSending(false);
    }
  };

  const stats = useMemo(() => {
    const all = history.length;

    const broadcasts = history.filter(
      (n) => !n.recipient
    ).length;

    const specific = history.filter(
      (n) => !!n.recipient
    ).length;

    const today = new Date();

    const sentToday = history.filter((n) => {
      if (!n.createdAt) return false;

      const date = new Date(n.createdAt);

      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }).length;

    return {
      all,
      broadcasts,
      specific,
      sentToday,
    };
  }, [history]);

  const targetOptions = [
    "All Audiences",
    "All Users",
    "Specific User",
  ];

  const typeOptions = [
    "All Types",
    "Match",
    "Like",
    "Recommendation",
    "Birthday",
  ];

  const tabFilter = {
    "All Notifications": () => true,
    Broadcasts: (n) => !n.recipient,
    "Specific Users": (n) => !!n.recipient,
  };

  const filteredHistory = useMemo(() => {
    return [...history]
      .filter((n) => tabFilter[tab](n))
      .filter((n) => {
        if (targetFilter === "All Audiences") return true;
        if (targetFilter === "All Users") return !n.recipient;
        if (targetFilter === "Specific User") return !!n.recipient;
        return true;
      })
      .filter((n) => {
        if (typeFilter === "All Types") return true;

        return (
          getTypeLabel(n).toLowerCase() ===
          typeFilter.toLowerCase()
        );
      })
      .filter((n) => {
        const query = search.toLowerCase();

        return (
          (n.title || "").toLowerCase().includes(query) ||
          (n.message || "").toLowerCase().includes(query) ||
          getTypeLabel(n)
            .toLowerCase()
            .includes(query)
        );
      });
  }, [
    history,
    tab,
    targetFilter,
    typeFilter,
    search,
  ]);

  return (
    <div className="px-4 pb-4 pt-0 text-white sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-card border border-gold/[0.14] bg-card/70 p-6 shadow-soft backdrop-blur-xl sm:p-8"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Communication Center
                </span>
              </div>

              <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
                Platform Notifications
              </p>

              <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                Manage Notifications
              </h1>

              <p className="mt-2 max-w-xl text-sm text-ink-muted">
                Send broadcasts, notify individual users and
                monitor notification activity across the BUMMPS
                platform.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                icon={HiOutlineSpeakerphone}
                size="md"
                onClick={() => setComposeOpen(true)}
              >
                Compose Notification
              </Button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {lastSent && (
            <motion.div
              initial={{
                opacity: 0,
                y: -12,
                height: 0,
              }}
              animate={{
                opacity: 1,
                y: 0,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                y: -12,
                height: 0,
              }}
              className="overflow-hidden"
            >
              <Card className="border-emerald-400/20 bg-emerald-400/[0.04] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
                      <HiOutlineCheckCircle className="text-xl" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Notification sent successfully
                      </p>

                      <p className="mt-0.5 text-xs text-ink-faint">
                        Your notification has been added to the
                        recent activity list.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setLastSent(null)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-ink-muted transition hover:border-danger/40 hover:bg-danger/10 hover:text-danger"
                  >
                    <HiOutlineTrash className="text-sm" />
                  </button>
                </div>

                {lastSent.notification && (
                  <div className="mt-4 rounded-2xl border border-white/5 bg-[#0F1013] p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
                          Notification
                        </p>

                        <p className="mt-1.5 text-sm font-semibold text-white">
                          {lastSent.notification.title}
                        </p>
                      </div>

                      <span className="inline-flex w-fit items-center gap-1.5 rounded-pill border border-gold/20 bg-gold/[0.06] px-3 py-1.5 text-[10px] font-semibold text-gold">
                        {lastSent.notification.recipient ? (
                          <HiOutlineUser />
                        ) : (
                          <HiOutlineUsers />
                        )}

                        {lastSent.notification.recipient
                          ? "Specific User"
                          : "All Users"}
                      </span>
                    </div>

                    <div className="my-4 h-px bg-white/5" />

                    <p className="text-sm leading-relaxed text-ink-muted">
                      {lastSent.notification.message}
                    </p>

                    <div className="mt-4 flex items-center gap-1.5 text-ink-faint">
                      <HiOutlineClock className="text-xs" />

                      <span className="text-xs">
                        Sent{" "}
                        {formatDate(
                          lastSent.notification.createdAt,
                          true
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Notifications"
            value={stats.all}
            icon={HiOutlineBell}
            description="All notification records"
            delay={0.05}
          />

          <StatCard
            title="Broadcasts"
            value={stats.broadcasts}
            icon={HiOutlineUsers}
            description="Notifications sent to everyone"
            delay={0.1}
          />

          <StatCard
            title="Specific Users"
            value={stats.specific}
            icon={HiOutlineUser}
            description="Direct user notifications"
            delay={0.15}
          />

          <StatCard
            title="Sent Today"
            value={stats.sentToday}
            icon={HiOutlinePaperAirplane}
            description="Notifications sent today"
            delay={0.2}
          />
        </div>

        <Card className="overflow-hidden">
          <div className="border-b border-gold/[0.08] p-5 sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Notification Activity
                </h2>

                <p className="mt-1 text-xs text-ink-muted">
                  View and manage recent notifications sent from
                  the BUMMPS admin panel.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-ink-faint">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {filteredHistory.length} notifications found
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
                  placeholder="Search notification title or message..."
                  className="w-full"
                />
              </div>

              <SelectFilter
                value={targetFilter}
                onChange={setTargetFilter}
                options={targetOptions}
                className="xl:w-52"
              />

              <SelectFilter
                value={typeFilter}
                onChange={setTypeFilter}
                options={typeOptions}
                className="xl:w-48"
              />
            </div>
          </div>

          <div className="relative">
            {loadingHistory ? (
              <div className="flex min-h-[350px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />

                  <p className="text-xs text-ink-muted">
                    Loading notifications...
                  </p>
                </div>
              </div>
            ) : historyError ? (
              <div className="flex min-h-[350px] flex-col items-center justify-center px-5 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-danger/20 bg-danger/10 text-2xl text-danger">
                  <HiOutlineExclamationCircle />
                </div>

                <h3 className="text-sm font-semibold text-white">
                  Unable to load notifications
                </h3>

                <p className="mt-1 max-w-sm text-xs text-ink-muted">
                  {historyError}
                </p>

                <button
                  onClick={fetchHistory}
                  className="mt-4 text-xs font-semibold text-gold transition hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="flex min-h-[350px] flex-col items-center justify-center px-5 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/[0.14] bg-gold/[0.06] text-2xl text-gold">
                  <HiOutlineBell />
                </div>

                <h3 className="text-sm font-semibold text-white">
                  No notifications found
                </h3>

                <p className="mt-1 max-w-sm text-xs text-ink-muted">
                  Try changing your search query or filters to
                  find notifications.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredHistory.map((notification, index) => {
                  const Icon = getIcon(notification);
                  const isSpecific = !!notification.recipient;

                  return (
                    <motion.div
                      key={notification._id || index}
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.025,
                      }}
                      className="group flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-white/[0.02] sm:px-6"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                            isSpecific
                              ? "border-blue-400/20 bg-blue-400/[0.08] text-blue-400"
                              : "border-gold/[0.18] bg-gold/[0.07] text-gold"
                          }`}
                        >
                          <Icon className="text-lg" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-semibold text-white">
                                {notification.title ||
                                  getTypeLabel(notification)}
                              </h3>

                              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-faint">
                                {notification.message ||
                                  "No message available"}
                              </p>
                            </div>

                            <span
                              className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-pill border px-2.5 py-1 text-[10px] font-semibold ${
                                isSpecific
                                  ? "border-blue-400/20 bg-blue-400/[0.06] text-blue-400"
                                  : "border-gold/20 bg-gold/[0.06] text-gold"
                              }`}
                            >
                              {isSpecific ? (
                                <HiOutlineUser />
                              ) : (
                                <HiOutlineUsers />
                              )}

                              {getTypeLabel(notification)}
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                            <div className="flex items-center gap-1.5 text-ink-faint">
                              <HiOutlineClock className="text-xs" />

                              <span className="text-[11px]">
                                {formatDate(
                                  notification.createdAt,
                                  true
                                )}
                              </span>
                            </div>

                            {notification.recipient && (
                              <div className="flex items-center gap-1.5">
                                <HiOutlineUser className="text-xs text-ink-faint" />

                                <span className="max-w-[220px] truncate text-[11px] text-ink-faint">
                                  User:{" "}
                                  {typeof notification.recipient ===
                                  "object"
                                    ? notification.recipient._id ||
                                      notification.recipient.name ||
                                      "Specific User"
                                    : notification.recipient}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        <Modal
          open={composeOpen}
          onClose={() => {
            setComposeOpen(false);
            resetComposeForm();
          }}
          title="Compose Notification"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink-muted">
                Send To
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTarget("all")}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                    target === "all"
                      ? "border-gold/40 bg-gold/[0.08]"
                      : "border-white/10 bg-white/[0.02] hover:border-gold/20"
                  }`}
                >
                  <div
                    className={`grid h-9 w-9 place-items-center rounded-xl ${
                      target === "all"
                        ? "bg-gold/15 text-gold"
                        : "bg-white/5 text-ink-muted"
                    }`}
                  >
                    <HiOutlineUsers />
                  </div>

                  <div>
                    <p
                      className={`text-xs font-semibold ${
                        target === "all"
                          ? "text-gold"
                          : "text-white"
                      }`}
                    >
                      All Users
                    </p>

                    <p className="mt-0.5 text-[10px] text-ink-faint">
                      Broadcast
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setTarget("single")}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                    target === "single"
                      ? "border-gold/40 bg-gold/[0.08]"
                      : "border-white/10 bg-white/[0.02] hover:border-gold/20"
                  }`}
                >
                  <div
                    className={`grid h-9 w-9 place-items-center rounded-xl ${
                      target === "single"
                        ? "bg-gold/15 text-gold"
                        : "bg-white/5 text-ink-muted"
                    }`}
                  >
                    <HiOutlineUser />
                  </div>

                  <div>
                    <p
                      className={`text-xs font-semibold ${
                        target === "single"
                          ? "text-gold"
                          : "text-white"
                      }`}
                    >
                      Specific User
                    </p>

                    <p className="mt-0.5 text-[10px] text-ink-faint">
                      Direct message
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <AnimatePresence>
              {target === "single" && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  className="overflow-hidden"
                >
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink-muted">
                    User ID
                  </label>

                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter user ID"
                    className="w-full rounded-2xl border border-gold/[0.16] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-ink-faint focus:border-gold/50"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink-muted">
                Notification Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Profile Verified"
                className="w-full rounded-2xl border border-gold/[0.16] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-ink-faint focus:border-gold/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink-muted">
                Message
              </label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Write your notification message..."
                className="w-full resize-none rounded-2xl border border-gold/[0.16] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-ink-faint focus:border-gold/50"
              />
            </div>

            <div className="rounded-2xl border border-gold/[0.12] bg-white/[0.02] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
                  Push Preview
                </p>

                <HiOutlineBell className="text-sm text-gold" />
              </div>

              <div className="rounded-xl border border-white/5 bg-[#0F1013] p-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold-gradient font-bold text-black">
                    B
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white">
                      {title || "BUMMPS"}
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                      {message ||
                        "Your notification message will appear here..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-3 text-xs text-danger">
                <HiOutlineExclamationCircle className="mt-0.5 shrink-0 text-sm" />
                <span>{error}</span>
              </div>
            )}

            <Button
              variant="primary"
              className="w-full"
              icon={HiOutlinePaperAirplane}
              onClick={handleSend}
              disabled={sending}
            >
              {sending
                ? "Sending..."
                : target === "all"
                ? "Send to All Users"
                : "Send to Specific User"}
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}