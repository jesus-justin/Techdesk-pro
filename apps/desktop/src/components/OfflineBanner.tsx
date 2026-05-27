import { useOfflineQueue } from "../hooks/useOfflineQueue";

export function OfflineBanner() {
  const { pendingCount } = useOfflineQueue();
  const isOffline = typeof navigator !== "undefined" ? !navigator.onLine : false;

  if (!isOffline) {
    return null;
  }

  return (
    <div className="mb-4 rounded-lg border border-amber-300 bg-amber-100 px-4 py-3 text-amber-900">
      You are offline - {pendingCount} changes queued
    </div>
  );
}
