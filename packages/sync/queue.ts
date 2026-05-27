import type { SyncOperation } from "@techdesk-pro/types";

export interface QueueItem {
  id: string;
  entityType: string;
  entityId: string | null;
  operation: SyncOperation;
  payload: Record<string, unknown>;
  attempts: number;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
}

export type NewQueueItem = Omit<QueueItem, "id" | "attempts" | "lastError" | "createdAt" | "updatedAt">;

export interface QueueStorageAdapter {
  init(): Promise<void> | void;
  insert(item: QueueItem): Promise<void> | void;
  listPending(limit?: number): Promise<QueueItem[]> | QueueItem[];
  update(itemId: string, patch: Partial<QueueItem>): Promise<void> | void;
  remove(itemId: string): Promise<void> | void;
}

export interface QueueProcessorResult {
  ok: boolean;
  serverTimestamp?: string;
  error?: string;
}

export type QueueProcessor = (item: QueueItem) => Promise<QueueProcessorResult>;

export interface OfflineQueueOptions {
  maxRetries?: number;
  batchSize?: number;
}

const DEFAULT_BATCH_SIZE = 25;
const DEFAULT_MAX_RETRIES = 5;

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `q_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

export class OfflineQueue {
  private readonly maxRetries: number;
  private readonly batchSize: number;

  constructor(
    private readonly adapter: QueueStorageAdapter,
    options: OfflineQueueOptions = {}
  ) {
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.batchSize = options.batchSize ?? DEFAULT_BATCH_SIZE;
  }

  async init(): Promise<void> {
    await this.adapter.init();
  }

  async enqueue(input: NewQueueItem): Promise<QueueItem> {
    const timestamp = nowIso();
    const item: QueueItem = {
      id: createId(),
      entityType: input.entityType,
      entityId: input.entityId,
      operation: input.operation,
      payload: input.payload,
      attempts: 0,
      lastError: null,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    await this.adapter.insert(item);
    return item;
  }

  async getPending(limit = this.batchSize): Promise<QueueItem[]> {
    const rows = await this.adapter.listPending(limit);
    return rows
      .filter((row) => row.attempts < this.maxRetries)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async markFailed(item: QueueItem, errorMessage: string): Promise<void> {
    await this.adapter.update(item.id, {
      attempts: item.attempts + 1,
      lastError: errorMessage,
      updatedAt: nowIso()
    });
  }

  async markSynced(itemId: string): Promise<void> {
    await this.adapter.remove(itemId);
  }

  async process(processor: QueueProcessor): Promise<{
    processed: number;
    succeeded: number;
    failed: number;
  }> {
    const pending = await this.getPending();
    let succeeded = 0;
    let failed = 0;

    for (const item of pending) {
      const result = await processor(item);

      if (result.ok) {
        await this.markSynced(item.id);
        succeeded += 1;
        continue;
      }

      await this.markFailed(item, result.error ?? "Sync failed");
      failed += 1;
    }

    return {
      processed: pending.length,
      succeeded,
      failed
    };
  }
}

export function shouldApplyServerUpdate(
  localUpdatedAt: string,
  serverUpdatedAt: string
): boolean {
  // Last-write-wins based on authoritative server timestamps.
  return new Date(serverUpdatedAt).getTime() >= new Date(localUpdatedAt).getTime();
}

export function mergeLocalQueue(
  existing: QueueItem[],
  incoming: QueueItem
): QueueItem[] {
  const index = existing.findIndex(
    (item) => item.entityType === incoming.entityType && item.entityId === incoming.entityId
  );

  if (index === -1) {
    return [...existing, incoming];
  }

  const current = existing[index];

  // Coalesce multiple queued edits for the same entity into one update item.
  const merged: QueueItem = {
    ...current,
    operation:
      current.operation === "CREATE" && incoming.operation !== "DELETE"
        ? "CREATE"
        : incoming.operation,
    payload: {
      ...current.payload,
      ...incoming.payload
    },
    updatedAt: nowIso()
  };

  const next = [...existing];
  next[index] = merged;
  return next;
}
