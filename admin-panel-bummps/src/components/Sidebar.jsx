import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineCreditCard,
  HiOutlineFlag,
  HiOutlineShieldCheck,
  HiOutlineCash,
  HiOutlineBell,
  HiOutlineCog,
  HiOutlineLogout,
  HiX,
} from "react-icons/hi";
import logoImg from "../assets/img.png";
import { useUI } from "../context/UIContext";

const navSections = [
  {
    label: "Overview",
    items: [{ to: "/", label: "Dashboard", icon: HiOutlineViewGrid }],
  },
  {
    label: "Platform",
    items: [
      { to: "/users", label: "Users", icon: HiOutlineUsers },
      { to: "/verification", label: "Verification", icon: HiOutlineShieldCheck },
    ],
  },
  {
    label: "Business",
    items: [
      { to: "/subscriptions", label: "Subscriptions", icon: HiOutlineCreditCard },
      { to: "/payments", label: "Payments", icon: HiOutlineCash },
    ],
  },
  {
    label: "Moderation",
    items: [
      { to: "/reports", label: "Reports", icon: HiOutlineFlag },
      { to: "/notifications", label: "Notifications", icon: HiOutlineBell },
    ],
  },
  {
    label: "System",
    items: [{ to: "/settings", label: "Settings", icon: HiOutlineCog }],
  },
];

function SidebarContent({ onLogout, mobile = false }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 px-5 pb-4 pt-5">
        <img
          src={logoImg}
          alt="Bummps Logo"
          className="h-8 w-auto object-contain"
        />
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-2 scrollbar-none">
        <div className="space-y-3">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.22em] text-ink-faint">
                {section.label}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink key={item.to} to={item.to} end={item.to === "/"}>
                    {({ isActive }) => (
                      <motion.div
                        whileHover={{ x: 2 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                          isActive
                            ? "text-white"
                            : "text-ink-muted hover:bg-white/[0.035] hover:text-white"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId={
                              mobile
                                ? "mobile-sidebar-active"
                                : "desktop-sidebar-active"
                            }
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 32,
                            }}
                            className="absolute inset-0 rounded-xl border border-gold/[0.14] bg-gold/[0.08] shadow-soft"
                          />
                        )}

                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gold shadow-[0_0_10px_rgba(218,178,90,0.55)]" />
                        )}

                        <div
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                            isActive
                              ? "border border-gold/[0.14] bg-gold/[0.08]"
                              : "border border-transparent group-hover:border-gold/[0.08] group-hover:bg-gold/[0.035]"
                          }`}
                        >
                          <item.icon
                            className={`text-[18px] transition-all duration-300 ${
                              isActive
                                ? "text-gold"
                                : "text-ink-muted group-hover:text-gold"
                            }`}
                          />
                        </div>

                        <span className="relative z-10 truncate">
                          {item.label}
                        </span>
                      </motion.div>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="shrink-0 p-3">
        <div className="mb-3 h-px bg-gold/[0.08]" />

        <button
          type="button"
          onClick={onLogout}
          className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 text-sm font-medium text-ink-muted transition-all duration-300 hover:border-gold/[0.14] hover:bg-gold/[0.05] hover:text-gold"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] transition-all duration-300 group-hover:border-gold/[0.14] group-hover:bg-gold/[0.08]">
            <HiOutlineLogout className="text-[18px] transition-transform duration-300 group-hover:-translate-x-0.5" />
          </div>

          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { mobileOpen, setMobileOpen } = useUI();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    navigate("/login");
    setMobileOpen(false);
  };

  return (
    <>
      <aside className="relative hidden h-screen w-[264px] shrink-0 flex-col overflow-hidden bg-card/70 backdrop-blur-xl lg:flex">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-gold/[0.08]" />

        <div className="pointer-events-none absolute -left-20 top-16 h-48 w-48 rounded-full bg-gold/[0.025] blur-3xl" />

        <div className="pointer-events-none absolute -right-24 bottom-16 h-56 w-56 rounded-full bg-gold/[0.025] blur-3xl" />

        <div className="relative z-10 flex h-full min-h-0 flex-col">
          <SidebarContent onLogout={handleLogout} />
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col overflow-hidden border-r border-gold/[0.10] bg-card backdrop-blur-xl shadow-soft lg:hidden"
            >
              <div className="pointer-events-none absolute -left-20 top-20 h-48 w-48 rounded-full bg-gold/[0.025] blur-3xl" />

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-5 z-30 grid h-8 w-8 place-items-center rounded-full border border-white/[0.08] bg-white/[0.025] text-ink-muted transition-all duration-300 hover:border-gold/[0.20] hover:bg-gold/[0.06] hover:text-gold"
              >
                <HiX className="text-base" />
              </button>

              <div className="relative z-10 flex h-full min-h-0 flex-col">
                <SidebarContent onLogout={handleLogout} mobile />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}