import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiX } from "react-icons/hi";
import Logo from "./Logo";
import { navSections } from "../data/nav";
import { useUI } from "../context/UIContext";

function SidebarContent({ collapsed }) {
  return (
    <>
      <div className={`flex items-center px-5 pt-6 pb-8 ${collapsed ? "justify-center px-0" : ""}`}>
        <Logo className="h-8" collapsed={collapsed} />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {navSections.map((section) => (
          <div key={section.label} className="mb-5">
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint">{section.label}</p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.to === "/"}>
                  {({ isActive }) => (
                    <motion.div
                      whileHover={{ x: collapsed ? 0 : 3 }}
                      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                        isActive ? "text-white" : "text-ink-muted hover:text-white"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-nav"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          className="absolute inset-0 rounded-xl border border-gold/25 bg-gold/[0.10] shadow-[0_0_20px_rgba(218,178,90,0.18)]"
                        />
                      )}
                      {isActive && !collapsed && (
                        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-gold-gradient shadow-[0_0_10px_rgba(218,178,90,0.8)]" />
                      )}
                      <item.icon className={`relative z-10 shrink-0 text-lg transition-colors ${isActive ? "text-gold" : "group-hover:text-gold/80"}`} />
                      {!collapsed && <span className="relative z-10 truncate">{item.label}</span>}
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </>
  );
}

export default function Sidebar() {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useUI();

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 84 : 264 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative hidden lg:flex flex-col shrink-0 border-r border-gold/[0.10] bg-[#1A1B20]/80 backdrop-blur-xl"
      >
        <SidebarContent collapsed={collapsed} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3.5 top-9 grid h-7 w-7 place-items-center rounded-full border border-gold/30 bg-[#1D1F24] text-gold shadow-lift transition-transform hover:scale-110"
        >
          {collapsed ? <HiChevronDoubleRight className="text-xs" /> : <HiChevronDoubleLeft className="text-xs" />}
        </button>
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#1A1B20] border-r border-gold/[0.14] lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-6 grid h-8 w-8 place-items-center rounded-full border border-white/10 text-ink-muted"
              >
                <HiX />
              </button>
              <SidebarContent collapsed={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
