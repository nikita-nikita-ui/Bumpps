import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineEye,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineIdentification,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineXCircle,
  HiOutlineSearch,
} from "react-icons/hi";

import { SearchInput, Tabs } from "../components/ui/Controls";
import GlassCard from "../components/ui/GlassCard";
import Badge, { statusTone } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

const verificationRequests = [
  {
    id: "VR-1001",
    status: "Pending",
    submitted: "12 min ago",
    idType: "Passport",
    idImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
    user: {
      name: "Daniel Wilson",
      email: "daniel@example.com",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
  },
  {
    id: "VR-1002",
    status: "Pending",
    submitted: "28 min ago",
    idType: "Driving License",
    idImage:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3",
    user: {
      name: "James Miller",
      email: "james@example.com",
      avatar: "https://i.pravatar.cc/150?img=13",
    },
  },
  {
    id: "VR-1003",
    status: "Pending",
    submitted: "41 min ago",
    idType: "National ID",
    idImage:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
    user: {
      name: "Lucas Martin",
      email: "lucas@example.com",
      avatar: "https://i.pravatar.cc/150?img=14",
    },
  },
  {
    id: "VR-1004",
    status: "Approved",
    submitted: "1 hour ago",
    idType: "Passport",
    idImage:
      "https://images.unsplash.com/photo-1589578527966-fdac0f44566c",
    user: {
      name: "Sophia Anderson",
      email: "sophia@example.com",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
  },
  {
    id: "VR-1005",
    status: "Approved",
    submitted: "2 hours ago",
    idType: "National ID",
    idImage:
      "https://images.unsplash.com/photo-1554224154-26032ffc0d07",
    user: {
      name: "Emma Johnson",
      email: "emma@example.com",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
  },
  {
    id: "VR-1006",
    status: "Rejected",
    submitted: "3 hours ago",
    idType: "Driving License",
    idImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85",
    user: {
      name: "Michael Brown",
      email: "michael@example.com",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
  },
];

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <div className="group relative overflow-hidden rounded-card border border-gold/[0.14] bg-card/70 p-5 shadow-soft backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-gold/30">
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-ink-muted">{title}</p>

          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">
            {value}
          </h2>

          <p className="mt-2 text-[11px] text-ink-faint">{description}</p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl border border-gold/[0.14] bg-gold/[0.08] text-xl ${iconClass}`}
        >
          <Icon />
        </div>
      </div>
    </div>
  </motion.div>
);

export default function Verification() {
  const [tab, setTab] = useState("Pending");
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(verificationRequests);

  const counts = useMemo(
    () => ({
      Pending: data.filter((item) => item.status === "Pending").length,
      Approved: data.filter((item) => item.status === "Approved").length,
      Rejected: data.filter((item) => item.status === "Rejected").length,
    }),
    [data]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return data
      .filter((item) => item.status === tab)
      .filter((item) => {
        if (!query) return true;

        return (
          item.user.name.toLowerCase().includes(query) ||
          item.user.email.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query) ||
          item.idType.toLowerCase().includes(query)
        );
      });
  }, [data, tab, search]);

  const setStatus = (id, status) => {
    setData((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );

    setPreview(null);
  };

  return (
    <div className="px-4 pb-6 pt-0 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-card border border-gold/[0.14] bg-card/70 p-6 shadow-soft backdrop-blur-xl sm:p-7"
        >
          <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Verification Center
                </span>
              </div>

              <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
                Profile Verification
              </p>

              <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                Verify User Profiles
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-ink-muted">
                Review identity documents, approve authentic profiles, and
                keep the BUMMPS community safe.
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gold/[0.14] bg-gold/[0.08] text-2xl text-gold">
              <HiOutlineShieldCheck />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Requests"
            value={data.length}
            description="All verification submissions"
            icon={HiOutlineIdentification}
            iconClass="text-gold"
            delay={0.05}
          />

          <StatCard
            title="Pending Review"
            value={counts.Pending}
            description="Waiting for approval"
            icon={HiOutlineClock}
            iconClass="text-yellow-400"
            delay={0.1}
          />

          <StatCard
            title="Approved"
            value={counts.Approved}
            description="Successfully verified"
            icon={HiOutlineCheck}
            iconClass="text-emerald-400"
            delay={0.15}
          />

          <StatCard
            title="Rejected"
            value={counts.Rejected}
            description="Verification declined"
            icon={HiOutlineXCircle}
            iconClass="text-red-400"
            delay={0.2}
          />
        </div>

        <GlassCard className="overflow-hidden">
          <div className="border-b border-gold/[0.08] p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Verification Requests
                </h2>

                <p className="mt-1 text-xs text-ink-muted">
                  Review submitted identity documents and manage verification
                  status.
                </p>
              </div>

              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search applicant..."
                className="w-full sm:w-72"
              />
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Tabs
                tabs={["Pending", "Approved", "Rejected"]}
                active={tab}
                onChange={setTab}
              />

              <div className="text-xs text-ink-faint">
                Showing{" "}
                <span className="font-semibold text-gold">
                  {filtered.length}
                </span>{" "}
                {tab.toLowerCase()} requests
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <div className="group relative overflow-hidden rounded-2xl border border-gold/[0.12] bg-card/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-soft">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={item.user.avatar}
                            alt={item.user.name}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-gold/15"
                          />

                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-emerald-400" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {item.user.name}
                          </p>

                          <p className="mt-0.5 truncate text-[11px] text-ink-faint">
                            {item.user.email}
                          </p>
                        </div>
                      </div>

                      <Badge tone={statusTone(item.status)}>
                        {item.status}
                      </Badge>
                    </div>

                    <div className="my-4 h-px bg-white/[0.05]" />

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                        <p className="text-[9px] uppercase tracking-wider text-ink-faint">
                          Document
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <HiOutlineIdentification className="text-gold" />

                          <span className="text-xs font-medium text-white">
                            {item.idType}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                        <p className="text-[9px] uppercase tracking-wider text-ink-faint">
                          Submitted
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <HiOutlineClock className="text-gold" />

                          <span className="text-xs font-medium text-white">
                            {item.submitted}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] text-ink-faint">
                        Request ID
                      </span>

                      <span className="rounded-md bg-gold/[0.06] px-2 py-1 text-[10px] font-medium text-gold">
                        {item.id}
                      </span>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={HiOutlineEye}
                        onClick={() => setPreview(item)}
                        className="flex-1"
                      >
                        Preview
                      </Button>

                      {item.status === "Pending" && (
                        <>
                          <button
                            title="Approve"
                            onClick={() => setStatus(item.id, "Approved")}
                            className="grid h-9 w-9 place-items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 transition-all hover:scale-110 hover:bg-emerald-500/20"
                          >
                            <HiOutlineCheck />
                          </button>

                          <button
                            title="Reject"
                            onClick={() => setStatus(item.id, "Rejected")}
                            className="grid h-9 w-9 place-items-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400 transition-all hover:scale-110 hover:bg-red-500/20"
                          >
                            <HiOutlineX />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/[0.14] bg-gold/[0.06] text-2xl text-gold">
                  <HiOutlineSearch />
                </div>

                <p className="text-sm font-semibold text-white">
                  No {tab.toLowerCase()} requests
                </p>

                <p className="mt-1 text-xs text-ink-faint">
                  Try changing your search or verification tab.
                </p>
              </div>
            )}
          </div>
        </GlassCard>

        <Modal
          open={!!preview}
          onClose={() => setPreview(null)}
          title="Document Review"
          maxWidth="max-w-lg"
        >
          {preview && (
            <div>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={preview.user.avatar}
                    alt={preview.user.name}
                    className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-gold/20"
                  />

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {preview.user.name}
                    </p>

                    <p className="mt-0.5 truncate text-[11px] text-ink-faint">
                      {preview.user.email}
                    </p>

                    <p className="mt-1 text-[10px] text-gold">
                      {preview.idType}
                    </p>
                  </div>
                </div>

                <Badge tone={statusTone(preview.status)}>
                  {preview.status}
                </Badge>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gold/[0.14] bg-black/20 p-2">
                <img
                  src={preview.idImage}
                  alt={`${preview.user.name} document`}
                  className="max-h-[420px] w-full rounded-xl object-cover"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-[9px] uppercase tracking-wider text-ink-faint">
                    Request ID
                  </p>

                  <p className="mt-1 text-xs font-semibold text-white">
                    {preview.id}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-[9px] uppercase tracking-wider text-ink-faint">
                    Submitted
                  </p>

                  <p className="mt-1 text-xs font-semibold text-white">
                    {preview.submitted}
                  </p>
                </div>
              </div>

              {preview.status === "Pending" && (
                <div className="mt-5 flex gap-3">
                  <Button
                    variant="success"
                    className="flex-1"
                    onClick={() => setStatus(preview.id, "Approved")}
                  >
                    <HiOutlineCheck className="mr-2 inline-block" />
                    Approve
                  </Button>

                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => setStatus(preview.id, "Rejected")}
                  >
                    <HiOutlineX className="mr-2 inline-block" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}