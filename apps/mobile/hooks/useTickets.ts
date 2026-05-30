import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import type { Asset, Comment, Ticket, User } from "@techdesk-pro/types";
import type { CreateTicketInput } from "@techdesk-pro/validators";

type TicketListItem = Ticket & {
  submittedBy: User;
  assignedTo: User | null;
  comments: Comment[];
  asset: Asset | null;
};

type TicketDetailItem = Ticket & {
  submittedBy: User;
  assignedTo: User | null;
  comments: Array<Comment & { author: User }>;
  asset: Asset | null;
};

interface TicketsPage {
  data: TicketListItem[];
  meta: {
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export function useTickets(filters?: { status?: string; q?: string }) {
  return useInfiniteQuery({
    queryKey: ["tickets", filters?.status ?? null, filters?.q ?? null],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get("/tickets", {
        params: { page: pageParam, status: filters?.status, q: filters?.q }
      });
      return response.data as TicketsPage;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.meta.hasMore ? lastPage.meta.page + 1 : undefined)
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ["ticket", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await api.get(`/tickets/${id}`);
      return response.data.data as TicketDetailItem;
    }
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTicketInput) => {
      const response = await api.post("/tickets", payload);
      return response.data.data as TicketListItem;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["tickets"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      ]);
    }
  });
}

export function useAddTicketComment(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { content: string }) => {
      const response = await api.post(`/tickets/${ticketId}/comments`, payload);
      return response.data.data as Comment;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] }),
        queryClient.invalidateQueries({ queryKey: ["tickets"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      ]);
    }
  });
}
