interface SyncStatus {
  isRunning: boolean;
  startedAt: Date | null;
  completedAt: Date | null;
}

// In-memory sync status tracking
let syncStatus: SyncStatus = {
  isRunning: false,
  startedAt: null,
  completedAt: null,
};

// Get current sync status
export function getSyncStatus(): SyncStatus {
  return { ...syncStatus };
}

// Start sync process
export function startSync(): void {
  syncStatus.isRunning = true;
  syncStatus.startedAt = new Date();
  syncStatus.completedAt = null;
}

// Complete sync process
export function completeSync(): void {
  syncStatus.isRunning = false;
  syncStatus.completedAt = new Date();
}

// Reset sync status (for error cases)
export function resetSync(): void {
  syncStatus.isRunning = false;
  syncStatus.startedAt = null;
  syncStatus.completedAt = null;
}

// Check if sync is currently running
export function isSyncRunning(): boolean {
  return syncStatus.isRunning;
}

// Get sync completion time
export function getSyncCompletionTime(): Date | null {
  return syncStatus.completedAt;
}

// Stale-lock detection: a single sync cycle should never legitimately run > 1 hour.
// If it has, the lock is almost certainly orphaned (worker crash, restart, etc.).
const STALE_SYNC_THRESHOLD_MS = 60 * 60 * 1000;

export function isSyncStale(): boolean {
  if (!syncStatus.isRunning || !syncStatus.startedAt) return false;
  return Date.now() - syncStatus.startedAt.getTime() > STALE_SYNC_THRESHOLD_MS;
}
