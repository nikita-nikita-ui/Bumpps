import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineEye, HiOutlineCheck, HiOutlineX, HiOutlineIdentification } from "react-icons/hi";
import { PageHeader, SearchInput, Tabs } from "../components/ui/Controls";
import GlassCard from "../components/ui/GlassCard";
import Badge, { statusTone } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { verificationRequests } from "../data/users";

export default function Verification() {
  const [tab, setTab] = useState("Pending");
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(verificationRequests);

  const filtered = useMemo(() => {
    return data.filter((v) => v.status === tab).filter((v) => v.user.name.toLowerCase().includes(search.toLowerCase()));
  }, [data, tab, search]);

  const setStatus = (id, status) => {
    setData((d) => d.map((v) => (v.id === id ? { ...v, status } : v)));
    setPreview(null);
  };

  const counts = {
    Pending: data.filter((v) => v.status === "Pending").length,
    Approved: data.filter((v) => v.status === "Approved").length,
    Rejected: data.filter((v) => v.status === "Rejected").length,
  };

  return (
    <div>
      <PageHeader eyebrow="Platform" title="Verification Center" description="Review government IDs and approve authentic profiles." />

      <div className="mb-6 grid grid-cols-3 gap-4 max-w-lg">
        {Object.entries(counts).map(([k, v]) => (
          <GlassCard key={k} className="p-4 text-center" hover>
            <p className="font-display text-2xl font-bold text-gold">{v}</p>
            <p className="text-[11px] uppercase tracking-widest text-ink-muted mt-1">{k}</p>
          </GlassCard>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <Tabs tabs={["Pending", "Approved", "Rejected"]} active={tab} onChange={setTab} />
        <SearchInput value={search} onChange={setSearch} placeholder="Search applicant..." className="sm:w-64" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
        {filtered.map((v, i) => (
          <motion.div key={v.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard className="p-5 flex flex-col" hover>
              <div className="flex items-center gap-3 mb-4">
                <img src={v.user.avatar} className="h-12 w-12 rounded-full object-cover ring-2 ring-gold/20" />
                <div className="min-w-0">
                  <p className="font-medium text-white truncate">{v.user.name}</p>
                  <p className="text-[11px] text-ink-faint">{v.id} · {v.submitted}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-muted mb-4">
                <HiOutlineIdentification className="text-gold" /> {v.idType}
                <Badge tone={statusTone(v.status)} className="ml-auto">{v.status}</Badge>
              </div>
              <div className="mt-auto flex gap-2">
                <Button variant="outline" size="sm" icon={HiOutlineEye} onClick={() => setPreview(v)} className="flex-1">Preview</Button>
                {v.status === "Pending" && (
                  <>
                    <button onClick={() => setStatus(v.id, "Approved")} className="grid h-9 w-9 place-items-center rounded-full border border-success/30 bg-success/10 text-success transition-transform hover:scale-110">
                      <HiOutlineCheck />
                    </button>
                    <button onClick={() => setStatus(v.id, "Rejected")} className="grid h-9 w-9 place-items-center rounded-full border border-danger/30 bg-danger/10 text-danger transition-transform hover:scale-110">
                      <HiOutlineX />
                    </button>
                  </>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}
        {filtered.length === 0 && <p className="col-span-full text-center py-16 text-ink-faint">No {tab.toLowerCase()} requests.</p>}
      </div>

      <Modal open={!!preview} onClose={() => setPreview(null)} title="Document Review" maxWidth="max-w-md">
        {preview && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={preview.user.avatar} className="h-11 w-11 rounded-full object-cover ring-2 ring-gold/20" />
              <div>
                <p className="font-medium text-white">{preview.user.name}</p>
                <p className="text-[11px] text-ink-faint">{preview.idType}</p>
              </div>
            </div>
            <img src={preview.idImage} className="w-full rounded-2xl border border-gold/20 object-cover" />
            {preview.status === "Pending" && (
              <div className="mt-5 flex gap-3">
                <Button variant="success" className="flex-1" onClick={() => setStatus(preview.id, "Approved")}>Approve</Button>
                <Button variant="danger" className="flex-1" onClick={() => setStatus(preview.id, "Rejected")}>Reject</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
