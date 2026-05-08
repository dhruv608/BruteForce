import { syncLeaderboardData } from './sync-core.service';
import { deleteByPattern } from '@/lib/server/utils/redisUtils';

// Leaderboard runs independently on its own schedule.
// Reads from StudentProgress (populated by student sync). If student sync
// hasn't run yet today, this just uses the most recent existing data —
// the next leaderboard cycle will pick up fresh data automatically.
export async function tryRunLeaderboard(): Promise<void> {
  console.log('[LEADERBOARD] Running...');
  try {
    const result = await syncLeaderboardData();
    console.log(`[LEADERBOARD] ✓ Updated for ${result.studentsProcessed} students`);

    // Bust all cached leaderboard responses so the new last_calculated time
    // and updated rankings are visible immediately on next request.
    await deleteByPattern('leaderboard:student:*');
    await deleteByPattern('leaderboard:admin:*');
    console.log('[LEADERBOARD] Cache invalidated');
  } catch (error) {
    console.error('[LEADERBOARD] ✗ Sync failed:', error);
    throw error;
  }
}
