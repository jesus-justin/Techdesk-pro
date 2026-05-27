import { useMemo } from "react";
import { DataTable, type DataColumn } from "../../components/DataTable";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const mockUsers: UserRow[] = [
  { id: "1", name: "System Admin", email: "admin@techdesk.local", role: "ADMIN", createdAt: "2026-01-01" },
  { id: "2", name: "Carlo Reyes", email: "staff1@techdesk.local", role: "IT_STAFF", createdAt: "2026-01-02" }
];

export function UsersPage() {
  const data = useMemo(() => mockUsers, []);
  const columns: Array<DataColumn<UserRow>> = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Role",
      accessor: "role",
      render: (row) => (
        <select defaultValue={row.role} className="rounded border px-2 py-1 text-xs">
          <option value="ADMIN">ADMIN</option>
          <option value="IT_STAFF">IT_STAFF</option>
          <option value="EMPLOYEE">EMPLOYEE</option>
        </select>
      )
    },
    { header: "Created", accessor: "createdAt" }
  ];

  return <DataTable columns={columns} data={data} />;
}
