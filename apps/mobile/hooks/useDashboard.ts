import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import type { DashboardStats } from "@techdesk-pro/types";

type DashboardApiResponse = DashboardStats;

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await api.get("/dashboard");
      return response.data.data as DashboardApiResponse;
    }
  });
}
