import type { OfflineQueueItem, SyncOperation } from "@techdesk-pro/types";

export interface SyncAdapter {
  enqueue(item: OfflineQueueItem): Promise<void>;
  getPending(): Promise<OfflineQueueItem[]>;
  markDone(id: string): Promise<void>;
  markFailed(id: string, retryCount: number): Promise<void>;
  getAll(): Promise<OfflineQueueItem[]>;
  clear(): Promise<void>;
}

interface QueueItemInternal extends OfflineQueueItem {
  maxRetries: number;
  status: "PENDING" | "DONE" | "FAILED";
}

export class OfflineQueue {
  private readonly maxRetries = 3;

  constructor(private readonly adapter: SyncAdapter) {}

  async enqueue(
    operation: SyncOperation,
    entity: string,
    payload: Record<string, unknown>
  ): Promise<void> {
    const item: OfflineQueueItem = {
      id: crypto.randomUUID(),
      operation,
      entity,
      payload,
      retryCount: 0,
      createdAt: new Date()
    };

    await this.adapter.enqueue(item);
  }

  async processPending(syncFn: (item: OfflineQueueItem) => Promise<void>): Promise<void> {
    const pending = await this.adapter.getPending();

    for (const item of pending) {
      try {
        await syncFn(item);
        await this.adapter.markDone(item.id);
      } catch {
        const retryCount = item.retryCount + 1;
        if (retryCount >= this.maxRetries) {
          await this.adapter.markFailed(item.id, retryCount);
          continue;
        }

        await this.adapter.markFailed(item.id, retryCount);
      }
    }
  }

  async getPendingCount(): Promise<number> {
    const pending = await this.adapter.getPending();
    return pending.length;
  }
}

export function resolveConflict<T extends Record<string, unknown>>(
  local: T,
  server: T,
  timestampKey: keyof T
): T {
  const localTs = new Date(String(local[timestampKey])).getTime();
  const serverTs = new Date(String(server[timestampKey])).getTime();
  return serverTs >= localTs ? server : local;
}

export function coalesceQueue(items: OfflineQueueItem[]): OfflineQueueItem[] {
  const map = new Map<string, QueueItemInternal>();

  for (const item of items) {
    const payload = item.payload as Record<string, unknown>;
    const entityId = String(payload.entityId ?? "");
    const key = `${item.entity}:${entityId}`;
    const existing = map.get(key);

    if (!existing) {
      map.set(key, {
        ...item,
        maxRetries: 3,
        status: "PENDING"
      });
      continue;
    }

    map.set(key, {
      ...existing,
      operation: item.operation,
      payload: {
        ...existing.payload,
        ...item.payload
      },
      retryCount: Math.max(existing.retryCount, item.retryCount),
      createdAt: existing.createdAt <= item.createdAt ? existing.createdAt : item.createdAt
    });
  }

  return [...map.values()].map((item) => ({
    id: item.id,
    operation: item.operation,
    entity: item.entity,
    payload: item.payload,
    retryCount: item.retryCount,
    createdAt: item.createdAt
  }));
}
