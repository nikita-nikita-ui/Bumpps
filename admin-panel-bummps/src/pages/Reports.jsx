import { useMemo, useState } from "react";
import {
  HiOutlineEye,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineFlag,
  HiOutlineClipboardList,
} from "react-icons/hi";
import { SearchInput, Tabs } from "../components/ui/Controls";
import DataTable from "../components/ui/DataTable";
import Badge, { statusTone } from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";

const dummyReports = [
  {
    id: "RPT-1001",
    type: "Abuse",
    reported: {
      name: "Aarav Sharma",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    reporter: {
      name: "Priya Mehta",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
    date: "22 Aug 2026",
    status: "Pending",
    note: "User is repeatedly sending inappropriate and offensive messages.",
  },
  {
    id: "RPT-1002",
    type: "Spam",
    reported: {
      name: "Rahul Verma",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    reporter: {
      name: "Neha Kapoor",
      avatar: "https://i.pravatar.cc/150?img=44",
    },
    date: "22 Aug 2026",
    status: "Resolved",
    note: "User was sending repeated promotional messages to multiple users.",
  },
  {
    id: "RPT-1003",
    type: "Fake Profile",
    reported: {
      name: "Riya Singh",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
    reporter: {
      name: "Karan Malhotra",
      avatar: "https://i.pravatar.cc/150?img=13",
    },
    date: "21 Aug 2026",
    status: "Pending",
    note: "Reported profile appears to be using another person's photos.",
  },
  {
    id: "RPT-1004",
    type: "Harassment",
    reported: {
      name: "Vikram Joshi",
      avatar: "https://i.pravatar.cc/150?img=68",
    },
    reporter: {
      name: "Ananya Gupta",
      avatar: "https://i.pravatar.cc/150?img=49",
    },
    date: "21 Aug 2026",
    status: "Rejected",
    note: "The submitted report did not contain enough evidence to confirm harassment.",
  },
  {
    id: "RPT-1005",
    type: "Spam",
    reported: {
      name: "Aditya Kumar",
      avatar: "https://i.pravatar.cc/150?img=15",
    },
    reporter: {
      name: "Simran Kaur",
      avatar: "https://i.pravatar.cc/150?img=45",
    },
    date: "20 Aug 2026",
    status: "Resolved",
    note: "User was repeatedly sharing suspicious links and promotional content.",
  },
  {
    id: "RPT-1006",
    type: "Fake Profile",
    reported: {
      name: "Meera Sharma",
      avatar: "https://i.pravatar.cc/150?img=48",
    },
    reporter: {
      name: "Rohan Bansal",
      avatar: "https://i.pravatar.cc/150?img=14",
    },
    date: "20 Aug 2026",
    status: "Pending",
    note: "Profile information and uploaded photos appear inconsistent.",
  },
  {
    id: "RPT-1007",
    type: "Abuse",
    reported: {
      name: "Kabir Singh",
      avatar: "https://i.pravatar.cc/150?img=56",
    },
    reporter: {
      name: "Isha Verma",
      avatar: "https://i.pravatar.cc/150?img=25",
    },
    date: "19 Aug 2026",
    status: "Resolved",
    note: "Multiple abusive messages were reported by the user.",
  },
  {
    id: "RPT-1008",
    type: "Spam",
    reported: {
      name: "Mohit Agarwal",
      avatar: "https://i.pravatar.cc/150?img=52",
    },
    reporter: {
      name: "Pooja Sharma",
      avatar: "https://i.pravatar.cc/150?img=38",
    },
    date: "19 Aug 2026",
    status: "Pending",
    note: "User appears to be sending the same promotional message repeatedly.",
  },
];

const typeFilter = {
  "All Reports": () => true,
  Abuse: (r) =>
    r.type === "Abuse" || r.type === "Harassment",
  Spam: (r) => r.type === "Spam",
  "Fake Profiles": (r) => r.type === "Fake Profile",
};

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  iconClass = "text-gold bg-gold/[0.08] border-gold/[0.14]",
}) => (
  <div className="rounded-card border border-gold/[0.14] bg-card/70 p-5 shadow-soft backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-gold/30">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-ink-muted">
          {title}
        </p>

        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {value.toLocaleString()}
        </h2>

        <p className="mt-2 text-[11px] text-ink-faint">
          {description}
        </p>
      </div>

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl border text-xl ${iconClass}`}
      >
        <Icon />
      </div>
    </div>
  </div>
);

export default function Reports() {
  const [tab, setTab] = useState("All Reports");
  const [search, setSearch] = useState("");
  const [view, setView] = useState(null);
  const [data, setData] = useState(dummyReports);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return data
      .filter(typeFilter[tab])
      .filter((r) => {
        if (!query) return true;

        return (
          r.reported.name
            .toLowerCase()
            .includes(query) ||
          r.reporter.name
            .toLowerCase()
            .includes(query) ||
          r.id.toLowerCase().includes(query) ||
          r.type.toLowerCase().includes(query)
        );
      });
  }, [data, tab, search]);

  const stats = useMemo(
    () => ({
      total: data.length,
      pending: data.filter(
        (r) => r.status === "Pending"
      ).length,
      resolved: data.filter(
        (r) => r.status === "Resolved"
      ).length,
      rejected: data.filter(
        (r) => r.status === "Rejected"
      ).length,
    }),
    [data]
  );

  const resolve = (id, status) => {
    setData((current) =>
      current.map((report) =>
        report.id === id
          ? {
              ...report,
              status,
            }
          : report
      )
    );

    setView(null);
  };

  const columns = [
    {
      key: "id",
      header: "Report ID",
      render: (r) => (
        <span className="font-mono text-xs text-ink-muted">
          {r.id}
        </span>
      ),
    },

    {
      key: "type",
      header: "Type",
      render: (r) => (
        <Badge tone="gold">
          {r.type}
        </Badge>
      ),
    },

    {
      key: "reported",
      header: "Reported User",
      render: (r) => (
        <div className="flex items-center gap-3">
          <img
            src={r.reported.avatar}
            alt={r.reported.name}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-danger/10"
          />

          <div>
            <p className="font-semibold text-white">
              {r.reported.name}
            </p>

            <p className="text-[10px] text-ink-faint">
              Reported user
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "reporter",
      header: "Reported By",
      render: (r) => (
        <div className="flex items-center gap-3">
          <img
            src={r.reporter.avatar}
            alt={r.reporter.name}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-gold/10"
          />

          <div>
            <p className="font-medium text-ink-muted">
              {r.reporter.name}
            </p>

            <p className="text-[10px] text-ink-faint">
              Reporter
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "date",
      header: "Date",
      render: (r) => (
        <span className="text-sm text-ink-muted">
          {r.date}
        </span>
      ),
    },

    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge
          tone={statusTone(r.status)}
          dot
        >
          {r.status}
        </Badge>
      ),
    },

    {
      key: "actions",
      header: "Actions",
      render: (r) => (
        <button
          onClick={() => setView(r)}
          title="View Report"
          className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-ink-muted transition-all hover:scale-110 hover:border-gold/40 hover:bg-gold/[0.06] hover:text-gold"
        >
          <HiOutlineEye className="text-sm" />
        </button>
      ),
    },
  ];

  return (
    <div className="px-4 pb-4 pt-0 text-white sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
      <div className="mx-auto max-w-[1600px] space-y-6">

        <div className="relative overflow-hidden rounded-card border border-gold/[0.14] bg-card/70 p-6 shadow-soft backdrop-blur-xl sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Moderation Center
                </span>
              </div>

              <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
                Platform Safety
              </p>

              <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                Reports & Moderation
              </h1>

              <p className="mt-2 max-w-xl text-sm text-ink-muted">
                Review reported users, investigate complaints
                and manage moderation decisions across the
                BUMMPS platform.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/20 bg-gold/[0.06] text-2xl text-gold lg:h-14 lg:w-14">
              <HiOutlineFlag />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Reports"
            value={stats.total}
            description="All submitted reports"
            icon={HiOutlineClipboardList}
          />

          <StatCard
            title="Pending Reports"
            value={stats.pending}
            description="Awaiting moderation"
            icon={HiOutlineFlag}
            iconClass="text-yellow-400 bg-yellow-400/[0.08] border-yellow-400/[0.14]"
          />

          <StatCard
            title="Resolved Reports"
            value={stats.resolved}
            description="Successfully resolved"
            icon={HiOutlineCheck}
            iconClass="text-emerald-400 bg-emerald-400/[0.08] border-emerald-400/[0.14]"
          />

          <StatCard
            title="Rejected Reports"
            value={stats.rejected}
            description="Reports dismissed"
            icon={HiOutlineX}
            iconClass="text-red-400 bg-red-400/[0.08] border-red-400/[0.14]"
          />
        </div>

        <div className="overflow-hidden rounded-card border border-gold/[0.14] bg-card/70 shadow-soft backdrop-blur-xl">

          <div className="border-b border-gold/[0.08] p-5 sm:p-6">

            <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Report Management
                </h2>

                <p className="mt-1 text-xs text-ink-muted">
                  Review and manage reported platform users.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-ink-faint">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {filtered.length} reports found
              </div>
            </div>

            <div className="mb-5 overflow-x-auto">
              <Tabs
                tabs={Object.keys(typeFilter)}
                active={tab}
                onChange={setTab}
              />
            </div>

            <div className="flex flex-col gap-3 xl:flex-row">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search reported user or report ID..."
                className="w-full"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/[0.14] bg-gold/[0.06] text-2xl text-gold">
                  <HiOutlineFlag />
                </div>

                <h3 className="text-sm font-semibold text-white">
                  No reports found
                </h3>

                <p className="mt-1 max-w-sm text-xs text-ink-muted">
                  Try changing your search or report category.
                </p>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filtered}
                pageSize={8}
              />
            )}
          </div>
        </div>

        <Modal
          open={!!view}
          onClose={() => setView(null)}
          title="Report Details"
        >
          {view && (
            <div className="space-y-5">

              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl border border-danger/20 bg-danger/10 text-danger">
                  <HiOutlineFlag />
                </div>

                <Badge tone="gold">
                  {view.type}
                </Badge>

                <Badge
                  tone={statusTone(view.status)}
                  className="ml-auto"
                >
                  {view.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
                  <img
                    src={view.reporter.avatar}
                    alt={view.reporter.name}
                    className="mx-auto h-14 w-14 rounded-full object-cover ring-2 ring-gold/15"
                  />

                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
                    Reported By
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {view.reporter.name}
                  </p>
                </div>

                <div className="rounded-2xl border border-danger/20 bg-danger/[0.04] p-4 text-center">
                  <img
                    src={view.reported.avatar}
                    alt={view.reported.name}
                    className="mx-auto h-14 w-14 rounded-full object-cover ring-2 ring-danger/20"
                  />

                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
                    Reported User
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {view.reported.name}
                  </p>
                </div>

              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
                  Report Description
                </p>

                <p className="text-sm leading-relaxed text-ink-muted">
                  {view.note}
                </p>
              </div>

              {view.status === "Pending" && (
                <div className="flex gap-3">
                  <Button
                    variant="success"
                    className="flex-1"
                    icon={HiOutlineCheck}
                    onClick={() =>
                      resolve(view.id, "Resolved")
                    }
                  >
                    Resolve
                  </Button>

                  <Button
                    variant="danger"
                    className="flex-1"
                    icon={HiOutlineX}
                    onClick={() =>
                      resolve(view.id, "Rejected")
                    }
                  >
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