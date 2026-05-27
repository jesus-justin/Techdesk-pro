import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import type { Asset } from "@techdesk-pro/types";

interface AssetsPage {
  data: Asset[];
  meta: {
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export function useAssets(status?: string, q?: string) {
  return useInfiniteQuery({
    queryKey: ["assets", status, q],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get("/assets", {
        params: { page: pageParam, status, q }
      });
      return response.data as AssetsPage;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.meta.hasMore ? lastPage.meta.page + 1 : undefined)
  });
}

export function useAssetMutations() {
  const queryClient = useQueryClient();

  const createAsset = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await api.post("/assets", payload);
      return response.data.data as Asset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });

  const updateAsset = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Record<string, unknown> }) => {
      const response = await api.patch(`/assets/${id}`, payload);
      return response.data.data as Asset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });

  return { createAsset, updateAsset };
}
