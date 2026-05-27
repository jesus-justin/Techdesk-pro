import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

export function useTickets(filters: Record<string, unknown>) {
  return useInfiniteQuery({
    queryKey: ["tickets", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get("/tickets", {
        params: {
          ...filters,
          page: pageParam
        }
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.meta?.hasMore ? lastPage.meta.page + 1 : undefined)
  });
}

export function useTicketMutations() {
  const queryClient = useQueryClient();

  const createTicket = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await api.post("/tickets", payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });

  const updateTicket = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Record<string, unknown> }) => {
      const response = await api.patch(`/tickets/${id}`, payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });

  return { createTicket, updateTicket };
}
