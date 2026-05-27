import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable, type DataColumn } from "../../components/DataTable";
import { StatusBadge } from "@techdesk-pro/ui";
import { useAssets } from "../../hooks/useAssets";

interface AssetRow {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  manufacturer: string;
  status: "AVAILABLE" | "IN_USE" | "UNDER_REPAIR" | "RETIRED";
}

export function AssetsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const query = useAssets({ status, category, q: search });
  const rows = useMemo(() => (query.data?.pages[0]?.data ?? []) as AssetRow[], [query.data]);

  const columns: Array<DataColumn<AssetRow>> = [
    { header: "Name", accessor: "name" },
    { header: "Category", accessor: "category" },
    { header: "Serial Number", accessor: "serialNumber" },
    { header: "Manufacturer", accessor: "manufacturer" },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <select className="rounded-lg border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="IN_USE">IN_USE</option>
            <option value="UNDER_REPAIR">UNDER_REPAIR</option>
            <option value="RETIRED">RETIRED</option>
          </select>
          <input
            className="rounded-lg border px-3 py-2"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            className="rounded-lg border px-3 py-2"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">New Asset</button>
      </div>

      <DataTable columns={columns} data={rows} onRowClick={(row) => navigate(`/assets/${row.id}`)} />
    </div>
  );
}
