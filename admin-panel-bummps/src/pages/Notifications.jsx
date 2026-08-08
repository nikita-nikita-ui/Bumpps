import { useState, useEffect } from "react";
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
} from "react-icons/hi";
import { PageHeader } from "../components/ui/Controls";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { sendNotificationToAll, sendNotificationToUser, getNotificationHistory } from "../services/Apis/users";

const typeMeta = {
  match: { icon: HiOutlineHeart, label: "Match" },
  like: { icon: HiOutlineHeart, label: "Like" },
  recommendation: { icon: HiOutlineSparkles, label: "Recommendation" },
  birthday: { icon: HiOutlineGift, label: "Birthday" },
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

  const fetchHistory = async () => {
    setLoadingHistory(true);
    setHistoryError(null);
    try {
      const res = await getNotificationHistory();
      setHistory(res.data.notifications || []);
    } catch (err) {
      setHistoryError(err?.response?.data?.message || "Notification history load nahi ho paayi.");
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
      setError("User ID required hai specific user ko bhejne ke liye.");
      return;
    }

    setSending(true);
    setError(null);

    try {
      const res =
        target === "all"
          ? await sendNotificationToAll({ title, message })
          : await sendNotificationToUser({ userId, title, message });

      setLastSent(res.data);
      setHistory((h) => [res.data.notification, ...h]);
      resetComposeForm();
      setComposeOpen(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Notification bhejne me error aaya. Dobara try karo.");
    } finally {
      setSending(false);
    }
  };

  const getIcon = (n) => {
    if (n.type && typeMeta[n.type]) return typeMeta[n.type].icon;
    return n.recipient ? HiOutlineUser : HiOutlineSpeakerphone;
  };

  const getBadgeLabel = (n) => {
    if (n.type && typeMeta[n.type]) return typeMeta[n.type].label;
    return n.recipient ? "Specific User" : "All Users";
  };

  return (
    <div>
      <PageHeader
        eyebrow="Moderation"
        title="Notifications"
        description="Send broadcasts and manage system alerts."
        actions={<Button variant="primary" icon={HiOutlineSpeakerphone} onClick={() => setComposeOpen(true)}>Compose Notification</Button>}
      />

      <AnimatePresence>
        {lastSent && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="rounded-2xl border border-success/25 bg-gradient-to-br from-success/[0.08] via-success/[0.04] to-transparent p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-success/30 bg-success/10 text-success">
                    <HiOutlineCheckCircle className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{lastSent.message}</p>
                    <p className="mt-0.5 text-xs text-ink-faint">Broadcast delivered · Server response</p>
                  </div>
                </div>
                <button
                  onClick={() => setLastSent(null)}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-ink-muted transition-colors hover:border-danger hover:text-danger"
                  aria-label="Dismiss"
                >
                  <HiOutlineTrash className="text-sm" />
                </button>
              </div>

              <div className="mt-4 rounded-xl border border-white/5 bg-[#0F1013] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-[180px]">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">Title</p>
                    <p className="mt-1.5 text-sm font-medium text-white">{lastSent.notification.title}</p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-pill border border-gold/20 bg-gold/[0.06] px-3 py-1.5">
                    {lastSent.notification.recipient ? (
                      <HiOutlineUser className="text-[11px] text-gold" />
                    ) : (
                      <HiOutlineUsers className="text-[11px] text-gold" />
                    )}
                    <span className="text-xs font-semibold text-gold">
                      {lastSent.notification.recipient ? "Specific User" : "All Users"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 h-px w-full bg-white/5" />

                <div className="mt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">Message</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{lastSent.notification.message}</p>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-ink-faint">
                  <HiOutlineClock className="text-xs shrink-0" />
                  <p className="text-xs">
                    Sent on{" "}
                    <span className="text-ink-muted">
                      {new Date(lastSent.notification.createdAt).toLocaleString(undefined, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Recent Broadcasts</h2>
          {!loadingHistory && (
            <span className="text-[11px] text-ink-faint">{history.length} total</span>
          )}
        </div>

        <GlassCard className="divide-y divide-white/5">
          {loadingHistory ? (
            <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
              <p className="text-ink-faint">Loading notifications...</p>
            </div>
          ) : historyError ? (
            <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
              <div className="grid h-10 w-10 place-items-center rounded-full border border-danger/30 bg-danger/10 text-danger">
                <HiOutlineExclamationCircle />
              </div>
              <p className="text-danger">{historyError}</p>
              <button onClick={fetchHistory} className="text-xs font-semibold text-gold hover:underline">
                Retry
              </button>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
              <div className="grid h-10 w-10 place-items-center rounded-full border border-gold/20 bg-gold/5 text-gold/60">
                <HiOutlineBell />
              </div>
              <p className="text-ink-faint">No broadcasts sent yet.</p>
              <p className="text-xs text-ink-faint/70">Notifications you send will appear here.</p>
            </div>
          ) : (
            history.map((n, i) => {
              const Icon = getIcon(n);
              return (
                <motion.div
                  key={n._id || i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02] sm:flex-row sm:items-center"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                    <Icon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">{n.title || getBadgeLabel(n)}</p>
                    <p className="mt-0.5 truncate text-xs text-ink-faint">{n.message}</p>
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end sm:text-right">
                    <span className="inline-block rounded-pill border border-gold/20 bg-gold/[0.06] px-2.5 py-1 text-[10px] font-semibold text-gold">
                      {getBadgeLabel(n)}
                    </span>
                    <p className="text-[11px] text-ink-faint sm:mt-1.5">
                      {new Date(n.createdAt).toLocaleString(undefined, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </GlassCard>
      </div>

      <Modal open={composeOpen} onClose={() => { setComposeOpen(false); resetComposeForm(); }} title="Broadcast Notification">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ink-muted">Send To</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTarget("all")}
                className={`flex items-center gap-1.5 rounded-pill border px-3.5 py-1.5 text-xs font-semibold transition-all ${target === "all" ? "border-gold bg-gold/10 text-gold" : "border-white/10 text-ink-muted hover:border-gold/30"
                  }`}
              >
                <HiOutlineUsers className="text-[11px]" /> All Users
              </button>
              <button
                onClick={() => setTarget("single")}
                className={`flex items-center gap-1.5 rounded-pill border px-3.5 py-1.5 text-xs font-semibold transition-all ${target === "single" ? "border-gold bg-gold/10 text-gold" : "border-white/10 text-ink-muted hover:border-gold/30"
                  }`}
              >
                <HiOutlineUser className="text-[11px]" /> Specific User
              </button>
            </div>
          </div>

          <AnimatePresence>
            {target === "single" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ink-muted">User ID</label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. 6a7596d0ef5fcbeebc988848"
                  className="w-full rounded-2xl border border-gold/[0.16] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-ink-faint outline-none focus:border-gold/50"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ink-muted">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Profile Verified"
              className="w-full rounded-2xl border border-gold/[0.16] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-ink-faint outline-none focus:border-gold/50"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ink-muted">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Write your push notification message..."
              className="w-full rounded-2xl border border-gold/[0.16] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-ink-faint outline-none focus:border-gold/50 resize-none"
            />
          </div>

          <div className="rounded-2xl border border-gold/[0.12] bg-white/[0.02] p-4">
            <p className="text-[10px] uppercase tracking-widest text-ink-faint mb-2">Push Preview</p>
            <div className="flex items-center gap-3 rounded-xl bg-[#0F1013] px-3.5 py-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold-gradient text-black font-bold text-xs">B</div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white">{title || "BUMMPS"}</p>
                <p className="text-xs text-ink-muted truncate">{message || "Your message will appear here..."}</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-xs text-danger">
              <HiOutlineExclamationCircle className="shrink-0 text-sm" />
              {error}
            </div>
          )}

          <Button variant="primary" className="w-full" icon={HiOutlineSpeakerphone} onClick={handleSend} disabled={sending}>
            {sending ? "Sending..." : target === "all" ? "Send to All Users" : "Send to User"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}