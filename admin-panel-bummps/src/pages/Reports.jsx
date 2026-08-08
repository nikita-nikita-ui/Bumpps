import { useMemo, useState } from "react";
import { HiOutlineEye, HiOutlineCheck, HiOutlineX, HiOutlineFlag } from "react-icons/hi";
import { PageHeader, SearchInput, Tabs } from "../components/ui/Controls";
import DataTable from "../components/ui/DataTable";
import Badge, { statusTone } from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import { reports } from "../data/ops";

const typeFilter = {
  "All Reports": () => true,
  "Abuse": (r) => r.type === "Abuse" || r.type === "Harassment",
  "Spam": (r) => r.type === "Spam",
  "Fake Profiles": (r) => r.type === "Fake Profile",
};

export default function Reports() {
  const [tab, setTab] = useState("All Reports");
  const [search, setSearch] = useState("");
  const [view, setView] = useState(null);
  const [data, setData] = useState(reports);

  const filtered = useMemo(
    () => data.filter(typeFilter[tab]).filter((r) => r.reported.name.toLowerCase().includes(search.toLowerCase())),
    [data, tab, search]
  );

  const resolve = (id, status) => {
    setData((d) => d.map((r) => (r.id === id ? { ...r, status } : r)));
    setView(null);
  };

  const columns = [
    { key: "id", header: "Report ID" },
    { key: "type", header: "Type", render: (r) => <Badge tone="gold">{r.type}</Badge> },
    {
      key: "reported",
      header: "Reported User",
      render: (r) => (
        <div className="flex items-center gap-2">
          <img src={r.reported.avatar} className="h-8 w-8 rounded-full object-cover ring-2 ring-gold/15" />
          {r.reported.name}
        </div>
      ),
    },
    { key: "date", header: "Date" },
    { key: "status", header: "Status", render: (r) => <Badge tone={statusTone(r.status)} dot>{r.status}</Badge> },
    {
      key: "actions",
      header: "Actions",
      render: (r) => (
        <button onClick={() => setView(r)} className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-ink-muted transition-all hover:border-gold hover:text-gold hover:scale-110">
          <HiOutlineEye className="text-sm" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader eyebrow="Moderation" title="Reports & Moderation" description="Review flagged content and resolve platform complaints." />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <Tabs tabs={Object.keys(typeFilter)} active={tab} onChange={setTab} />
        <SearchInput value={search} onChange={setSearch} placeholder="Search reported user..." className="sm:w-64" />
      </div>

      <DataTable columns={columns} data={filtered} pageSize={8} />

      <Modal open={!!view} onClose={() => setView(null)} title="Report Details">
        {view && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <HiOutlineFlag className="text-danger" />
              <Badge tone="gold">{view.type}</Badge>
              <Badge tone={statusTone(view.status)} className="ml-auto">{view.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="rounded-2xl border border-white/5 p-3 text-center">
                <img src={view.reporter.avatar} className="mx-auto h-12 w-12 rounded-full object-cover ring-2 ring-gold/15" />
                <p className="mt-2 text-xs text-ink-faint">Reported by</p>
                <p className="text-sm text-white">{view.reporter.name}</p>
              </div>
              <div className="rounded-2xl border border-danger/20 bg-danger/[0.04] p-3 text-center">
                <img src={view.reported.avatar} className="mx-auto h-12 w-12 rounded-full object-cover ring-2 ring-danger/20" />
                <p className="mt-2 text-xs text-ink-faint">Reported user</p>
                <p className="text-sm text-white">{view.reported.name}</p>
              </div>
            </div>

            <p className="text-sm text-ink-muted leading-relaxed mb-6">{view.note}</p>

            {view.status === "Pending" && (
              <div className="flex gap-3">
                <Button variant="success" className="flex-1" icon={HiOutlineCheck} onClick={() => resolve(view.id, "Resolved")}>Resolve</Button>
                <Button variant="danger" className="flex-1" icon={HiOutlineX} onClick={() => resolve(view.id, "Rejected")}>Reject</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
