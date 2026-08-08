import { useMemo, useState } from "react";
import { HiOutlineCash, HiOutlineReceiptRefund, HiOutlineTrendingUp, HiOutlineCreditCard, HiOutlineDownload } from "react-icons/hi";
import { PageHeader, SearchInput, SelectFilter, Tabs } from "../components/ui/Controls";
import DataTable from "../components/ui/DataTable";
import StatCard from "../components/ui/StatCard";
import Badge, { statusTone } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { transactions } from "../data/ops";

const tabFilter = {
  "All Transactions": () => true,
  "Successful": (t) => t.status === "Success",
  "Refunds": (t) => t.status === "Refunded",
  "Failed": (t) => t.status === "Failed",
};

export default function Payments() {
  const [tab, setTab] = useState("All Transactions");
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("All Plans");

  const plans = ["All Plans", "Silver", "Gold", "Premium", "VIP"];

  const filtered = useMemo(
    () =>
      transactions
        .filter(tabFilter[tab])
        .filter((t) => t.user.name.toLowerCase().includes(search.toLowerCase()) || t.invoice.toLowerCase().includes(search.toLowerCase()))
        .filter((t) => plan === "All Plans" || t.plan === plan),
    [tab, search, plan]
  );

  const totalRevenue = transactions.filter((t) => t.status === "Success").reduce((s, t) => s + t.amount, 0);
  const totalRefunds = transactions.filter((t) => t.status === "Refunded").reduce((s, t) => s + t.amount, 0);

  const columns = [
    { key: "id", header: "Transaction" },
    {
      key: "user",
      header: "User",
      render: (t) => (
        <div className="flex items-center gap-2">
          <img src={t.user.avatar} className="h-8 w-8 rounded-full object-cover ring-2 ring-gold/15" />
          {t.user.name}
        </div>
      ),
    },
    { key: "plan", header: "Plan", render: (t) => <Badge tone="gold">{t.plan}</Badge> },
    { key: "amount", header: "Amount", render: (t) => `$${t.amount.toFixed(2)}` },
    { key: "method", header: "Method" },
    { key: "date", header: "Date" },
    { key: "status", header: "Status", render: (t) => <Badge tone={statusTone(t.status)} dot>{t.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Business"
        title="Payments & Billing"
        description="Track transactions, refunds, and revenue across the platform."
        actions={<Button variant="outline" icon={HiOutlineDownload}>Export CSV</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Revenue" value={totalRevenue * 42} prefix="$" icon={HiOutlineCash} trend="18.9%" trendUp delay={0} />
        <StatCard label="Transactions" value={transactions.length * 65} icon={HiOutlineCreditCard} trend="7.2%" trendUp delay={0.05} />
        <StatCard label="Refunds" value={totalRefunds * 42} prefix="$" icon={HiOutlineReceiptRefund} trend="1.4%" trendUp={false} delay={0.1} />
        <StatCard label="Growth" value={22.6} suffix="%" decimals={1} icon={HiOutlineTrendingUp} trend="4.1%" trendUp delay={0.15} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <Tabs tabs={Object.keys(tabFilter)} active={tab} onChange={setTab} />
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search user or invoice..." className="sm:w-64" />
          <SelectFilter value={plan} onChange={setPlan} options={plans} className="sm:w-40" />
        </div>
      </div>

      <DataTable columns={columns} data={filtered} pageSize={8} />
    </div>
  );
}
