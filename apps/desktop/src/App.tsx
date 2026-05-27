import { QueryClientProvider } from "@tanstack/react-query";
import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { useAuthStore } from "./store/authStore";
import { AppLayout } from "./layouts/AppLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { TicketsPage } from "./pages/tickets/TicketsPage";
import { NewTicketPage } from "./pages/tickets/NewTicketPage";
import { TicketDetailPage } from "./pages/tickets/TicketDetailPage";
import { AssetsPage } from "./pages/assets/AssetsPage";
import { AssetDetailPage } from "./pages/assets/AssetDetailPage";
import { UsersPage } from "./pages/admin/UsersPage";
import { AuditLogPage } from "./pages/admin/AuditLogPage";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: JSX.Element }) {
  const user = useAuthStore((state) => state.user);
  return user?.role === "ADMIN" ? children : <Navigate to="/dashboard" replace />;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="tickets" element={<TicketsPage />} />
            <Route path="tickets/new" element={<NewTicketPage />} />
            <Route path="tickets/:id" element={<TicketDetailPage />} />
            <Route path="assets" element={<AssetsPage />} />
            <Route path="assets/:id" element={<AssetDetailPage />} />
            <Route
              path="admin/users"
              element={
                <AdminRoute>
                  <UsersPage />
                </AdminRoute>
              }
            />
            <Route
              path="admin/audit"
              element={
                <AdminRoute>
                  <AuditLogPage />
                </AdminRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
