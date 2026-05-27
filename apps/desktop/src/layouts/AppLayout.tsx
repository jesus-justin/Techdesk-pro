import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tickets": "Tickets",
  "/assets": "Assets",
  "/admin/users": "Users",
  "/admin/audit": "Audit Log"
};

export function AppLayout() {
  const location = useLocation();
  const title = titles[location.pathname] ?? "TechDesk Pro";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="h-14 border-b bg-white px-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          <div className="h-8 w-8 rounded-full bg-gray-900" />
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
