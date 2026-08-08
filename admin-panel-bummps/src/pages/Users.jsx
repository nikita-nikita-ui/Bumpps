import { useMemo, useState, useEffect } from "react";
import { HiOutlineEye, HiOutlinePause, HiOutlinePlay, HiOutlineTrash, HiOutlineUserAdd, HiOutlineDownload } from "react-icons/hi";
import { PageHeader, SearchInput, SelectFilter, Tabs } from "../components/ui/Controls";
import DataTable from "../components/ui/DataTable";
import Badge, { statusTone } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import UserModal from "../components/UserModal";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../services/Apis/users";

const tabFilter = {
  "All Users": () => true,
  "Verified": (u) => u.isVerified,
  "Blocked": (u) => u.isDeactivated,
  "Premium": (u) => u.subscription?.isActive,
};

export default function Users() {
  const [tab, setTab] = useState("All Users");
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("All Countries");
  const [status, setStatus] = useState("All Status");
  const [selected, setSelected] = useState(null);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data.users || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const countries = [
    "All Countries",
    ...new Set(users.map((u) => u.livingIn)),
  ];
  const statuses = ["All Status", "Active", "Blocked"];
  const capitalize = (value) => {
    if (!value) return "-";

    return String(value)
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const filtered = useMemo(() => {
    return [...users]
      .filter((u) => tabFilter[tab](u))
      .filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u._id.toLowerCase().includes(search.toLowerCase())
      )
      .filter(
        (u) =>
          country === "All Countries" || u.livingIn === country
      )
      .filter((u) => {
        if (status === "All Status") return true;
        if (status === "Active") return !u.isDeactivated;
        if (status === "Blocked") return u.isDeactivated;
        return true;
      })
      .sort((a, b) => {
        const genderA = (a.gender || "").toLowerCase();
        const genderB = (b.gender || "").toLowerCase();

        if (genderA !== genderB) {
          if (genderA === "male") return -1;
          if (genderB === "male") return 1;
        }

        return (a.name || "").localeCompare(b.name || "");
      })
  }, [users, tab, search, country, status]);

  const columns = [
    {
      key: "name",
      header: "User",
      render: (u) => (
        <div className="flex items-center gap-3">
          <img
            src={u.profilePic || "/default-avatar.png"}
            alt={capitalize(u.name)}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-gold/15"
          />
          <div>
            <div className="font-medium">{capitalize(u.name)}</div>
            <p className="text-xs text-gray-400">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: "age", header: "Age" },
    {
      key: "gender",
      header: "Gender",
      render: (u) =>
        u.gender
          ? u.gender.charAt(0).toUpperCase() + u.gender.slice(1).toLowerCase()
          : "-",
    },
    {
      key: "livingIn",
      header: "Location",
      render: (u) => capitalize(u.livingIn),
    },
    {
      key: "plan",
      header: "Plan",
      render: (u) => capitalize(u.subscription?.plan || "Free"),
    },
    {
      key: "status",
      header: "Status",
      render: (u) => (
        <Badge tone={u.isVerified ? "success" : "warning"}>
          {u.isVerified ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
      key: "blockStatus",
      header: "Account",
      render: (u) => (
        <Badge tone={u.isDeactivated ? "danger" : "success"} dot>
          {u.isDeactivated ? "Blocked" : "Active"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (u) => (
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              try {
                const res = await getUserById(u._id);
                setSelected(res.data.user);
              } catch (err) {
                console.log(err);
              }
            }}
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-ink-muted transition-all hover:border-gold hover:text-gold hover:scale-110"
          >
            <HiOutlineEye className="text-sm" />
          </button>
          <button
            onClick={async () => {
              try {
                await deleteUser(u._id);
                fetchUsers();
              } catch (err) {
                console.log(err);
              }
            }}
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-ink-muted transition-all hover:border-danger hover:text-danger hover:scale-110"
          >
            <HiOutlineTrash className="text-sm" />
          </button>
          <button
            onClick={async () => {
              try {
                await updateUser(u._id, { isDeactivated: !u.isDeactivated });
                fetchUsers();
              } catch (err) {
                console.log(err);
              }
            }}
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-ink-muted transition-all hover:border-danger hover:text-danger hover:scale-110"
          >
            {u.isDeactivated ? <HiOutlinePlay className="text-sm" /> : <HiOutlinePause className="text-sm" />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Platform"
        title="User Management"
        description="Manage, verify, and moderate every member on BUMMPS."
        actions={
          <>
            <Button variant="outline" icon={HiOutlineDownload} size="md">Export</Button>
            <Button variant="primary" icon={HiOutlineUserAdd} size="md">Add User</Button>
          </>
        }
      />

      <Tabs tabs={Object.keys(tabFilter)} active={tab} onChange={setTab} />

      <div className="mb-5 flex flex-col sm:flex-row gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or ID..." className="sm:w-72" />
        <SelectFilter value={country} onChange={setCountry} options={countries} className="sm:w-48" />
        <SelectFilter value={status} onChange={setStatus} options={statuses} className="sm:w-44" />
      </div>

      <DataTable columns={columns} data={filtered} pageSize={8} />

      <UserModal user={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}