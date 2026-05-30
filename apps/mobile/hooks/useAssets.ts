import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import type { Asset, AssetAssignment, User } from "@techdesk-pro/types";

type AssetListItem = Asset & {
  assignments: Array<AssetAssignment & { user: User }>;
};

type AssetDetailItem = Asset & {
  assignments: Array<AssetAssignment & { user: User }>;
};

interface AssetsPage {
  data: AssetListItem[];
  meta: {
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export function useAssets(filters?: { status?: string; q?: string }) {
  return useInfiniteQuery({
    queryKey: ["assets", filters?.status ?? null, filters?.q ?? null],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get("/assets", {
        params: { page: pageParam, status: filters?.status, q: filters?.q }
      });
      return response.data as AssetsPage;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.meta.hasMore ? lastPage.meta.page + 1 : undefined)
  });
}

export function useAsset(id: string) {
  return useQuery({
    queryKey: ["asset", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await api.get(`/assets/${id}`);
      return response.data.data as AssetDetailItem;
    }
  });
}
