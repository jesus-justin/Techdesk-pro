import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import type { Ticket } from "@techdesk-pro/types";

interface TicketsPage {
  data: Ticket[];
  meta: {
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export function useTickets(status?: string) {
  return useInfiniteQuery({
    queryKey: ["tickets", status],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get("/tickets", {
        params: { page: pageParam, status }
      });
      return response.data as TicketsPage;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.meta.hasMore ? lastPage.meta.page + 1 : undefined)
  });
}

export function useTicketMutations() {
  const queryClient = useQueryClient();

  const createTicket = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await api.post("/tickets", payload);
      return response.data.data as Ticket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });

  const updateTicket = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Record<string, unknown> }) => {
      const response = await api.patch(`/tickets/${id}`, payload);
      return response.data.data as Ticket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });

  return { createTicket, updateTicket };
}
