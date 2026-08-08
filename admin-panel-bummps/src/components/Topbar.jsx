import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineSearch, HiOutlineBell, HiOutlineChatAlt2, HiOutlineSun, HiOutlineMoon, HiChevronDown, HiOutlineMenu, HiOutlineUser, HiOutlineCog, HiOutlineLogout } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import { notifications } from "../data/ops";

export default function Topbar() {
  const { setMobileOpen, theme, toggleTheme } = useUI();
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const ref = useRef(null);
  const nref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setProfileOpen(false);
      if (nref.current && !nref.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gold/[0.10] bg-[#17181C]/75 px-4 sm:px-6 py-3.5 backdrop-blur-xl">
      <button onClick={() => setMobileOpen(true)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-ink-muted lg:hidden">
        <HiOutlineMenu />
      </button>

      <div className="relative hidden md:block w-full max-w-sm">
        <HiOutlineSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          placeholder="Search users, chats, payments..."
          className="w-full rounded-pill border border-gold/[0.14] bg-white/[0.03] py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-ink-faint outline-none transition-all focus:border-gold/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgba(218,178,90,0.08)]"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-ink-muted transition-all hover:border-gold/40 hover:text-gold">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.25 }}>
              {theme === "dark" ? <HiOutlineMoon /> : <HiOutlineSun />}
            </motion.span>
          </AnimatePresence>
        </button>

        <Link to="/chats" className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 text-ink-muted transition-all hover:border-gold/40 hover:text-gold">
          <HiOutlineChatAlt2 />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-success ring-2 ring-[#17181C]" />
        </Link>

        <div className="relative" ref={nref}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 text-ink-muted transition-all hover:border-gold/40 hover:text-gold"
          >
            <HiOutlineBell />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-gold text-[9px] font-bold text-black ring-2 ring-[#17181C]">
                {unread}
              </span>
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-gold/20 bg-[#1D1F24] shadow-lift"
              >
                <div className="border-b border-white/5 px-4 py-3 text-xs font-bold uppercase tracking-widest text-ink-muted">Notifications</div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.slice(0, 5).map((n) => (
                    <div key={n.id} className="flex items-start gap-3 border-b border-white/[0.04] px-4 py-3 hover:bg-white/[0.02]">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.read ? "bg-white/20" : "bg-gold"}`} />
                      <div>
                        <p className="text-xs text-white leading-relaxed">{n.title}</p>
                        <p className="mt-0.5 text-[10px] text-ink-faint">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/notifications" onClick={() => setNotifOpen(false)} className="block px-4 py-3 text-center text-xs font-semibold text-gold hover:bg-white/[0.02]">
                  View all notifications
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={ref}>
          <button onClick={() => setProfileOpen((v) => !v)} className="flex items-center gap-2 rounded-full border border-white/10 py-1 pl-1 pr-2.5 transition-all hover:border-gold/40">
            <img src={admin?.avatar} alt="admin" className="h-8 w-8 rounded-full object-cover ring-2 ring-gold/20" />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-none">{admin?.name}</p>
              <p className="mt-0.5 text-[10px] text-ink-faint">{admin?.role}</p>
            </div>
            <HiChevronDown className={`text-xs text-ink-faint transition-transform ${profileOpen ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-gold/20 bg-[#1D1F24] py-2 shadow-lift"
              >
                <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-muted hover:bg-white/[0.03] hover:text-white">
                  <HiOutlineUser /> My Profile
                </Link>
                <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-muted hover:bg-white/[0.03] hover:text-white">
                  <HiOutlineCog /> Settings
                </Link>
                <div className="my-1.5 border-t border-white/5" />
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger/[0.06]"
                >
                  <HiOutlineLogout /> Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
