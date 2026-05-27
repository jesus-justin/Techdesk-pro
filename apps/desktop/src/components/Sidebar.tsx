import { LayoutDashboard, Ticket, Laptop, Users, ClipboardList, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function LinkItem({ to, label, icon }: { to: string; label: string; icon: JSX.Element }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
          isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

export function Sidebar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="w-[220px] bg-gray-900 text-white flex flex-col">
      <div className="px-4 py-5 border-b border-gray-800">
        <p className="text-lg font-semibold">TechDesk Pro</p>
      </div>

      <nav className="flex-1 p-3 space-y-2">
        <LinkItem to="/dashboard" label="Dashboard" icon={<LayoutDashboard size={16} />} />
        <LinkItem to="/tickets" label="Tickets" icon={<Ticket size={16} />} />
        <LinkItem to="/assets" label="Assets" icon={<Laptop size={16} />} />
        {user?.role === "ADMIN" ? (
          <>
            <LinkItem to="/admin/users" label="Users" icon={<Users size={16} />} />
            <LinkItem to="/admin/audit" label="Audit Log" icon={<ClipboardList size={16} />} />
          </>
        ) : null}
      </nav>

      <div className="border-t border-gray-800 p-4">
        <p className="text-sm font-medium">{user?.name}</p>
        <p className="mt-1 text-xs text-gray-400">{user?.role}</p>
        <button
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium"
          onClick={async () => {
            await logout();
            navigate("/login", { replace: true });
          }}
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </aside>
  );
}
