import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useDashboard } from "../../hooks/useDashboard";
import { LoadingSpinner, EmptyState } from "@techdesk-pro/ui";
import { OfflineBanner } from "../../components/OfflineBanner";

const colors = ["#3B82F6", "#F59E0B", "#10B981", "#EF4444"];

export function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!data) {
    return <EmptyState title="Dashboard unavailable" subtitle="No dashboard metrics were returned." />;
  }

  const statusData = [
    { name: "Open", value: data.openTickets },
    { name: "In Progress", value: data.inProgressTickets },
    { name: "Resolved", value: data.resolvedTickets }
  ];

  const priorityData = [
    { name: "Low", value: 8 },
    { name: "Medium", value: 14 },
    { name: "High", value: 9 },
    { name: "Critical", value: 3 }
  ];

  return (
    <div className="space-y-4">
      <OfflineBanner />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {[
          { label: "Open", value: data.openTickets },
          { label: "In Progress", value: data.inProgressTickets },
          { label: "Resolved", value: data.resolvedTickets },
          { label: "Total", value: data.totalTickets }
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">Tickets by Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" outerRadius={95} label>
                  {statusData.map((entry, idx) => (
                    <Cell key={entry.name} fill={colors[idx % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">Tickets by Priority</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Recent Activity</h2>
        {data.recentActivity.length === 0 ? (
          <p className="text-sm text-gray-500">No activity yet.</p>
        ) : (
          <ul className="space-y-2">
            {data.recentActivity.map((entry) => (
              <li key={entry.id} className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
                <span className="font-medium">{entry.action}</span> {entry.entity} at{" "}
                {new Date(entry.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
