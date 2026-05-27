import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

export function useAssets(filters: Record<string, unknown>) {
  return useInfiniteQuery({
    queryKey: ["assets", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get("/assets", {
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

export function useAssetMutations() {
  const queryClient = useQueryClient();

  const createAsset = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await api.post("/assets", payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });

  const updateAsset = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Record<string, unknown> }) => {
      const response = await api.patch(`/assets/${id}`, payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });

  return { createAsset, updateAsset };
}
