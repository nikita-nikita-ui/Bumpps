export default function Logo({ className = "h-9", collapsed = false }) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className="relative h-full aspect-square shrink-0">
        <svg viewBox="0 0 40 40" className="h-full w-full drop-shadow-[0_0_10px_rgba(218,178,90,0.35)]">
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F2D89A" />
              <stop offset="100%" stopColor="#DAB25A" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width="38" height="38" rx="12" fill="#1D1F24" stroke="url(#logoGrad)" strokeWidth="1.2" />
          <path
            d="M14 12h8.2c3 0 5.1 1.7 5.1 4.4 0 2-1.1 3.3-2.8 3.9 2.1.5 3.5 2 3.5 4.3 0 3-2.3 4.9-5.6 4.9H14V12Zm4 6.9h3.6c1.3 0 2.1-.7 2.1-1.9s-.8-1.9-2.1-1.9H18v3.8Zm0 7.1h3.9c1.5 0 2.4-.8 2.4-2.1s-.9-2.1-2.4-2.1H18v4.2Z"
            fill="url(#logoGrad)"
          />
        </svg>
      </div>
      {!collapsed && (
        <span className="font-display text-xl font-extrabold tracking-tight text-white leading-none">
          bummps<span className="text-gold">.</span>
          <span className="block text-[9px] font-semibold tracking-[0.3em] text-ink-muted mt-0.5">ADMIN</span>
        </span>
      )}
    </div>
  );
}
