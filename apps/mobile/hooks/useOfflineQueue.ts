import { useEffect, useMemo, useState } from "react";
import { useNetInfo } from "@react-native-community/netinfo";
import { OfflineQueue, type SyncAdapter } from "@techdesk-pro/sync";
import type { OfflineQueueItem } from "@techdesk-pro/types";

type ItemStatus = "PENDING" | "DONE" | "FAILED";

const memory = new Map<string, OfflineQueueItem & { status: ItemStatus }>();

const adapter: SyncAdapter = {
  async enqueue(item) {
    memory.set(item.id, { ...item, status: "PENDING" });
  },
  async getPending() {
    return [...memory.values()].filter((item) => item.status === "PENDING");
  },
  async markDone(id) {
    const item = memory.get(id);
    if (item) {
      memory.set(id, { ...item, status: "DONE" });
    }
  },
  async markFailed(id, retryCount) {
    const item = memory.get(id);
    if (item) {
      memory.set(id, { ...item, retryCount, status: retryCount >= 3 ? "FAILED" : "PENDING" });
    }
  },
  async getAll() {
    return [...memory.values()];
  },
  async clear() {
    memory.clear();
  }
};

export function useOfflineQueue() {
  const netInfo = useNetInfo();
  const [pendingCount, setPendingCount] = useState(0);
  const queue = useMemo(() => new OfflineQueue(adapter), []);

  useEffect(() => {
    const sync = async () => {
      if (!netInfo.isConnected) {
        const pending = await queue.getPendingCount();
        setPendingCount(pending);
        return;
      }

      await queue.processPending(async () => {
        return;
      });
      const pending = await queue.getPendingCount();
      setPendingCount(pending);
    };

    void sync();
  }, [netInfo.isConnected, queue]);

  return { queue, pendingCount };
}
