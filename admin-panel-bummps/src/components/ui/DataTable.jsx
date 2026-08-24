import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function DataTable({
  columns,
  data = [],
  pageSize = 8,
  rowKey = "id",
}) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(data.length / pageSize)
  );

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  const goto = (p) => {
    setPage(Math.min(Math.max(1, p), totalPages));
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-gold/[0.10]">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-gold/[0.10] bg-white/[0.02]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-ink-muted"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paged.map((row, i) => {
              const key =
                row?.[rowKey] ??
                row?.id ??
                row?._id ??
                `row-${(page - 1) * pageSize + i}`;

              return (
                <motion.tr
                  key={String(key)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.2,
                    delay: i * 0.02,
                  }}
                  className="border-b border-white/[0.04] transition-colors duration-200 hover:bg-gold/[0.04]"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3.5 align-middle text-ink-muted"
                    >
                      {col.render
                        ? col.render(row)
                        : row?.[col.key] ?? "-"}
                    </td>
                  ))}
                </motion.tr>
              );
            })}

            {paged.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-ink-faint"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-xs text-ink-faint">
          <span>
            Page {page} of {totalPages} · {data.length} records
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goto(page - 1)}
              disabled={page === 1}
              className="grid h-8 w-8 place-items-center rounded-full border border-gold/20 text-ink-muted transition-all hover:border-gold hover:text-gold disabled:opacity-30"
            >
              <HiChevronLeft />
            </button>

            {Array.from({ length: totalPages })
              .slice(0, 5)
              .map((_, i) => (
                <button
                  key={`page-${i + 1}`}
                  onClick={() => goto(i + 1)}
                  className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold transition-all ${
                    page === i + 1
                      ? "bg-gold-gradient text-black shadow-[0_4px_16px_rgba(218,178,90,0.4)]"
                      : "border border-white/10 text-ink-muted hover:border-gold/40 hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

            <button
              onClick={() => goto(page + 1)}
              disabled={page === totalPages}
              className="grid h-8 w-8 place-items-center rounded-full border border-gold/20 text-ink-muted transition-all hover:border-gold hover:text-gold disabled:opacity-30"
            >
              <HiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}