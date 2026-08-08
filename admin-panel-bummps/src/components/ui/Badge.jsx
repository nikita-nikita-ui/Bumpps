const tones = {
  success: "text-success bg-success/10 border-success/30",
  warning: "text-warning bg-warning/10 border-warning/30",
  danger: "text-danger bg-danger/10 border-danger/30",
  gold: "text-gold bg-gold/10 border-gold/30",
  neutral: "text-ink-muted bg-white/5 border-white/10",
};

export default function Badge({ children, tone = "neutral", dot = false, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${tones[tone]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : tone === "danger" ? "bg-danger" : "bg-gold"}`} />}
      {children}
    </span>
  );
}

export function statusTone(status) {
  const map = {
    Active: "success",
    Verified: "success",
    Approved: "success",
    Success: "success",
    Successful: "success",
    Resolved: "success",
    Online: "success",
    Pending: "warning",
    Suspended: "warning",
    Refunded: "warning",
    Blocked: "danger",
    Rejected: "danger",
    Failed: "danger",
    Expired: "neutral",
    Unmatched: "neutral",
  };
  return map[status] || "neutral";
}
