import { useState } from "react";
import { DataTable, type DataColumn } from "../../components/DataTable";

interface AuditRow {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  performedBy: string;
  date: string;
}

const allRows: AuditRow[] = Array.from({ length: 30 }).map((_, i) => ({
  id: String(i + 1),
  action: i % 2 === 0 ? "UPDATE" : "CREATE",
  entity: i % 3 === 0 ? "TICKET" : "ASSET",
  entityId: `ENT-${i + 1}`,
  performedBy: i % 2 === 0 ? "Carlo Reyes" : "System Admin",
  date: new Date(Date.now() - i * 7200_000).toLocaleString()
}));

export function AuditLogPage() {
  const [visible, setVisible] = useState(15);
  const rows = allRows.slice(0, visible);

  const columns: Array<DataColumn<AuditRow>> = [
    { header: "Action", accessor: "action" },
    { header: "Entity", accessor: "entity" },
    { header: "Entity ID", accessor: "entityId" },
    { header: "Performed By", accessor: "performedBy" },
    { header: "Date", accessor: "date" }
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow-sm grid grid-cols-1 gap-3 md:grid-cols-4">
        <select className="rounded-lg border px-3 py-2"><option>All Users</option></select>
        <select className="rounded-lg border px-3 py-2"><option>All Actions</option></select>
        <input className="rounded-lg border px-3 py-2" type="date" />
        <input className="rounded-lg border px-3 py-2" type="date" />
      </div>

      <DataTable columns={columns} data={rows} />

      {visible < allRows.length ? (
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => setVisible((current) => current + 10)}
        >
          Load More
        </button>
      ) : null}
    </div>
  );
}
