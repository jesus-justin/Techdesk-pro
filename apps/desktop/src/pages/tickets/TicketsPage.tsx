import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PriorityBadge, StatusBadge, EmptyState, LoadingSpinner } from "@techdesk-pro/ui";
import { DataTable, type DataColumn } from "../../components/DataTable";
import { useTickets } from "../../hooks/useTickets";

interface TicketRow {
  id: string;
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  assignedTo?: { name: string } | null;
  createdAt: string;
}

export function TicketsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");

  const query = useTickets({ status, priority, q: search });
  const page = query.data?.pages[0];
  const rows = useMemo(() => (page?.data ?? []) as TicketRow[], [page]);

  const columns: Array<DataColumn<TicketRow>> = [
    { header: "#ID", accessor: "id" },
    { header: "Title", accessor: "title" },
    {
      header: "Priority",
      accessor: "priority",
      render: (row) => <PriorityBadge priority={row.priority} />
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: "Assigned To",
      accessor: "assignedTo",
      render: (row) => row.assignedTo?.name ?? "Unassigned"
    },
    {
      header: "Created",
      accessor: "createdAt",
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    }
  ];

  if (query.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <select className="rounded-lg border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
          <select className="rounded-lg border px-3 py-2" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">All Priority</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
          <input
            className="rounded-lg border px-3 py-2"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="rounded-lg border px-3 py-2" onClick={() => { setStatus(""); setPriority(""); setSearch(""); }}>
            Reset
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => navigate("/tickets/new")}
        >
          New Ticket
        </button>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No tickets" subtitle="Create a ticket to get started." />
      ) : (
        <DataTable columns={columns} data={rows} onRowClick={(row) => navigate(`/tickets/${row.id}`)} />
      )}
    </div>
  );
}
