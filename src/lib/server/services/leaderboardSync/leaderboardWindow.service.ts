import { syncLeaderboardData } from './sync-core.service';
import { isSyncRunning, getSyncCompletionTime } from '@/lib/server/utils/syncStatus';

// Leaderboard window logic with sync status awareness
export async function tryRunLeaderboard(): Promise<void> {
  const MAX_WAIT = 20 * 60 * 1000; // 20 minutes in milliseconds
  const INTERVAL = 3 * 60 * 1000;   // 3 minutes in milliseconds
  let waited = 0;

  while (waited < MAX_WAIT) {
    // Check if sync is not running AND has completed at least once
    if (!isSyncRunning() && getSyncCompletionTime() !== null) {
      try {
        const result = await syncLeaderboardData();
        console.log(`[LEADERBOARD] Updated for ${result.studentsProcessed} students`);
        return;
      } catch (error) {
        console.error('[LEADERBOARD] Sync failed:', error);
        throw error;
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, INTERVAL));
      waited += INTERVAL;
    }
  }

  // If we reach here, we've waited the maximum time
  console.warn(`[LEADERBOARD] Max wait reached — student sync didn't complete in ${MAX_WAIT / 60000}min. Skipping leaderboard cycle.`);
}
