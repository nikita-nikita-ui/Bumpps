import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineCash,
  HiOutlineReceiptRefund,
  HiOutlineCreditCard,
  HiOutlineDownload,
  HiOutlineCollection,
  HiOutlineXCircle,
  HiOutlineSearch,
} from "react-icons/hi";

import {
  SearchInput,
  SelectFilter,
  Tabs,
} from "../components/ui/Controls";

import DataTable from "../components/ui/DataTable";
import Badge, { statusTone } from "../components/ui/Badge";
import Button from "../components/ui/Button";

const transactions = [
  {
    id: "TXN-1001",
    invoice: "INV-1001",
    user: {
      name: "Aarav Sharma",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    plan: "Gold",
    amount: 49.99,
    method: "Credit Card",
    date: "Aug 22, 2026",
    status: "Success",
  },
  {
    id: "TXN-1002",
    invoice: "INV-1002",
    user: {
      name: "Ananya Verma",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
    plan: "Premium",
    amount: 79.99,
    method: "UPI",
    date: "Aug 21, 2026",
    status: "Success",
  },
  {
    id: "TXN-1003",
    invoice: "INV-1003",
    user: {
      name: "Rohan Mehta",
      avatar: "https://i.pravatar.cc/150?img=14",
    },
    plan: "Silver",
    amount: 29.99,
    method: "Credit Card",
    date: "Aug 21, 2026",
    status: "Success",
  },
  {
    id: "TXN-1004",
    invoice: "INV-1004",
    user: {
      name: "Priya Kapoor",
      avatar: "https://i.pravatar.cc/150?img=44",
    },
    plan: "VIP",
    amount: 119.99,
    method: "UPI",
    date: "Aug 20, 2026",
    status: "Refunded",
  },
  {
    id: "TXN-1005",
    invoice: "INV-1005",
    user: {
      name: "Kabir Singh",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    plan: "Gold",
    amount: 49.99,
    method: "Debit Card",
    date: "Aug 20, 2026",
    status: "Success",
  },
  {
    id: "TXN-1006",
    invoice: "INV-1006",
    user: {
      name: "Ishita Joshi",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
    plan: "Premium",
    amount: 79.99,
    method: "UPI",
    date: "Aug 19, 2026",
    status: "Failed",
  },
  {
    id: "TXN-1007",
    invoice: "INV-1007",
    user: {
      name: "Arjun Malhotra",
      avatar: "https://i.pravatar.cc/150?img=13",
    },
    plan: "VIP",
    amount: 119.99,
    method: "Credit Card",
    date: "Aug 19, 2026",
    status: "Success",
  },
  {
    id: "TXN-1008",
    invoice: "INV-1008",
    user: {
      name: "Meera Gupta",
      avatar: "https://i.pravatar.cc/150?img=45",
    },
    plan: "Silver",
    amount: 29.99,
    method: "UPI",
    date: "Aug 18, 2026",
    status: "Success",
  },
  {
    id: "TXN-1009",
    invoice: "INV-1009",
    user: {
      name: "Aditya Bansal",
      avatar: "https://i.pravatar.cc/150?img=15",
    },
    plan: "Gold",
    amount: 49.99,
    method: "Credit Card",
    date: "Aug 18, 2026",
    status: "Refunded",
  },
  {
    id: "TXN-1010",
    invoice: "INV-1010",
    user: {
      name: "Sneha Rawat",
      avatar: "https://i.pravatar.cc/150?img=48",
    },
    plan: "Premium",
    amount: 79.99,
    method: "UPI",
    date: "Aug 17, 2026",
    status: "Success",
  },
  {
    id: "TXN-1011",
    invoice: "INV-1011",
    user: {
      name: "Rahul Khanna",
      avatar: "https://i.pravatar.cc/150?img=68",
    },
    plan: "Gold",
    amount: 49.99,
    method: "Debit Card",
    date: "Aug 17, 2026",
    status: "Failed",
  },
  {
    id: "TXN-1012",
    invoice: "INV-1012",
    user: {
      name: "Simran Kaur",
      avatar: "https://i.pravatar.cc/150?img=49",
    },
    plan: "VIP",
    amount: 119.99,
    method: "Credit Card",
    date: "Aug 16, 2026",
    status: "Success",
  },
];

const tabFilter = {
  "All Transactions": () => true,
  Successful: (t) => t.status === "Success",
  Refunds: (t) => t.status === "Refunded",
  Failed: (t) => t.status === "Failed",
};

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-card border border-gold/[0.14] bg-card/70 backdrop-blur-xl shadow-soft ${className}`}
  >
    {children}
  </div>
);

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  prefix = "",
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Card className="group relative overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/30">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-ink-muted">{title}</p>

          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {prefix}
            {typeof value === "number"
              ? value.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })
              : value}
          </h2>

          <p className="mt-2 text-[11px] text-ink-faint">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/[0.14] bg-gold/[0.08] text-xl text-gold transition group-hover:bg-gold/15">
          <Icon />
        </div>
      </div>
    </Card>
  </motion.div>
);

export default function Payments() {
  const [tab, setTab] = useState("All Transactions");
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("All Plans");
  const [method, setMethod] = useState("All Methods");

  const plans = ["All Plans", "Silver", "Gold", "Premium", "VIP"];

  const methods = [
    "All Methods",
    "Credit Card",
    "Debit Card",
    "UPI",
  ];

  const stats = useMemo(() => {
    const successful = transactions.filter(
      (t) => t.status === "Success"
    );

    const refunds = transactions.filter(
      (t) => t.status === "Refunded"
    );

    const failed = transactions.filter(
      (t) => t.status === "Failed"
    );

    return {
      revenue: successful.reduce(
        (sum, t) => sum + t.amount,
        0
      ),
      transactions: transactions.length,
      refunds: refunds.reduce(
        (sum, t) => sum + t.amount,
        0
      ),
      failed: failed.length,
    };
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return transactions
      .filter(tabFilter[tab])
      .filter((t) => {
        if (!query) return true;

        return (
          t.user.name.toLowerCase().includes(query) ||
          t.invoice.toLowerCase().includes(query) ||
          t.id.toLowerCase().includes(query)
        );
      })
      .filter(
        (t) => plan === "All Plans" || t.plan === plan
      )
      .filter(
        (t) =>
          method === "All Methods" || t.method === method
      );
  }, [tab, search, plan, method]);

  const columns = [
    {
      key: "transaction",
      header: "Transaction",
      render: (t) => (
        <div>
          <p className="font-semibold text-white">{t.id}</p>
          <p className="mt-0.5 text-[11px] text-ink-faint">
            {t.invoice}
          </p>
        </div>
      ),
    },
    {
      key: "user",
      header: "User",
      render: (t) => (
        <div className="flex items-center gap-3">
          <img
            src={t.user.avatar}
            alt={t.user.name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-gold/10"
          />

          <div className="min-w-0">
            <p className="truncate font-semibold text-white">
              {t.user.name}
            </p>
            <p className="mt-0.5 text-[11px] text-ink-faint">
              Customer
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      render: (t) => (
        <span className="inline-flex items-center gap-1 rounded-pill border border-gold/20 bg-gold/10 px-2.5 py-1 text-[10px] font-semibold text-gold">
          {t.plan}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (t) => (
        <span className="font-semibold text-white">
          ${t.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "method",
      header: "Payment Method",
      render: (t) => (
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-ink-muted">
            <HiOutlineCreditCard />
          </span>

          <span className="text-sm text-ink-muted">
            {t.method}
          </span>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (t) => (
        <span className="text-sm text-ink-muted">
          {t.date}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (t) => (
        <Badge tone={statusTone(t.status)} dot>
          {t.status}
        </Badge>
      ),
    },
  ];

  const handleExport = () => {
    const headers = [
      "Transaction",
      "Invoice",
      "User",
      "Plan",
      "Amount",
      "Method",
      "Date",
      "Status",
    ];

    const rows = transactions.map((t) => [
      t.id,
      t.invoice,
      t.user.name,
      t.plan,
      t.amount,
      t.method,
      t.date,
      t.status,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "payments.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 pb-4 pt-0 text-white sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-card border border-gold/[0.14] bg-card/70 p-6 shadow-soft backdrop-blur-xl sm:p-8"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Payment Management
                </span>
              </div>

              <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
                Platform Revenue
              </p>

              <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                Payments & Billing
              </h1>

              <p className="mt-2 max-w-xl text-sm text-ink-muted">
                Track payments, subscriptions, refunds and
                transaction activity across the BUMMPS platform.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                icon={HiOutlineDownload}
                size="md"
                onClick={handleExport}
              >
                Export
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={stats.revenue}
            prefix="$"
            icon={HiOutlineCash}
            description="Successful payment revenue"
            delay={0.05}
          />

          <StatCard
            title="Transactions"
            value={stats.transactions}
            icon={HiOutlineCollection}
            description="Total payment transactions"
            delay={0.1}
          />

          <StatCard
            title="Total Refunds"
            value={stats.refunds}
            prefix="$"
            icon={HiOutlineReceiptRefund}
            description="Refunded payment amount"
            delay={0.15}
          />

          <StatCard
            title="Failed Payments"
            value={stats.failed}
            icon={HiOutlineXCircle}
            description="Unsuccessful transactions"
            delay={0.2}
          />
        </div>

        <Card className="overflow-hidden">
          <div className="border-b border-gold/[0.08] p-5 sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  All Transactions
                </h2>

                <p className="mt-1 text-xs text-ink-muted">
                  View and manage all payment activity.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-ink-faint">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {filtered.length} transactions found
              </div>
            </div>

            <div className="mb-5 overflow-x-auto">
              <Tabs
                tabs={Object.keys(tabFilter)}
                active={tab}
                onChange={setTab}
              />
            </div>

            <div className="flex flex-col gap-3 xl:flex-row">
              <div className="relative flex-1">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search by user, invoice or transaction..."
                  className="w-full"
                />
              </div>

              <SelectFilter
                value={plan}
                onChange={setPlan}
                options={plans}
                className="xl:w-52"
              />

              <SelectFilter
                value={method}
                onChange={setMethod}
                options={methods}
                className="xl:w-52"
              />
            </div>
          </div>

          <div className="relative">
            {filtered.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/[0.14] bg-gold/[0.06] text-2xl text-gold">
                  <HiOutlineSearch />
                </div>

                <h3 className="text-sm font-semibold text-white">
                  No transactions found
                </h3>

                <p className="mt-1 max-w-sm text-xs text-ink-muted">
                  Try changing your search query or filters
                  to find transactions.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <DataTable
                  columns={columns}
                  data={filtered}
                  pageSize={8}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}