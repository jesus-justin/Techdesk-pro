import { useEffect, useMemo, useState } from "react";
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
  const queue = useMemo(() => new OfflineQueue(adapter), []);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const onOnline = async () => {
      await queue.processPending(async () => {
        return;
      });
      setPendingCount(await queue.getPendingCount());
    };

    const onOffline = async () => {
      setPendingCount(await queue.getPendingCount());
    };

    window.addEventListener("online", () => {
      void onOnline();
    });
    window.addEventListener("offline", () => {
      void onOffline();
    });

    void onOffline();

    return () => {
      window.removeEventListener("online", () => {
        void onOnline();
      });
      window.removeEventListener("offline", () => {
        void onOffline();
      });
    };
  }, [queue]);

  return { queue, pendingCount };
}
