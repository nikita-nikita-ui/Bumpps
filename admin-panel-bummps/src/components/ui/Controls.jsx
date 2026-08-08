import { useEffect, useRef, useState } from "react";
import { HiOutlineSearch, HiOutlineChevronDown, HiOutlineCheck } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export function SearchInput({ value, onChange, placeholder = "Search...", className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <HiOutlineSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-pill border border-gold/[0.16] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-ink-faint outline-none transition-all focus:border-gold/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgba(218,178,90,0.08)]"
      />
    </div>
  );
}

export function SelectFilter({ value, onChange, options, className = "" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 rounded-pill border bg-white/[0.03] py-2.5 pl-4 pr-3.5 text-left text-sm text-white outline-none transition-all ${open
          ? "border-gold/50 bg-white/[0.05] shadow-[0_0_0_4px_rgba(218,178,90,0.08)]"
          : "border-gold/[0.16] hover:border-gold/30 hover:bg-white/[0.045]"
          }`}
      >
        <span className="truncate">{value}</span>
        <HiOutlineChevronDown
          className={`shrink-0 text-sm text-ink-faint transition-transform duration-200 ${open ? "rotate-180 text-gold" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-64 overflow-y-auto rounded-2xl border border-gold/[0.16] bg-[#1D1F24] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            {options.map((opt) => {
              const isActive = opt === value;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors ${isActive ? "bg-gold/[0.12] text-gold" : "text-ink-muted hover:bg-white/[0.05] hover:text-white"
                    }`}
                >
                  <span className="truncate">{opt}</span>
                  {isActive && <HiOutlineCheck className="shrink-0 text-sm" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        {eyebrow && <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.25em] text-gold">{eyebrow}</p>}
        <h1 className="font-display text-[26px] sm:text-[30px] font-extrabold text-white">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </motion.div>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="mb-6 flex w-fit gap-1 rounded-pill border border-gold/[0.14] bg-white/[0.02] p-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`relative rounded-pill px-4 py-2 text-xs font-semibold tracking-wide transition-colors duration-300 ${active === tab ? "text-black" : "text-ink-muted hover:text-white"
            }`}
        >
          {active === tab && (
            <motion.span
              layoutId="tab-pill"
              className="absolute inset-0 rounded-pill bg-gold-gradient shadow-[0_4px_16px_rgba(218,178,90,0.35)]"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative">{tab}</span>
        </button>
      ))}
    </div>
  );
}