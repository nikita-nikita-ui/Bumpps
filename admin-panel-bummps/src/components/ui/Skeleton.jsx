export function SkeletonCard({ className = "h-32" }) {
  return <div className={`skeleton rounded-card border border-white/5 ${className}`} />;
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3">
      <div className="skeleton h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3 w-1/3 rounded-full" />
        <div className="skeleton h-2.5 w-1/4 rounded-full" />
      </div>
      <div className="skeleton h-6 w-16 rounded-full" />
    </div>
  );
}

export function SkeletonGrid({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
