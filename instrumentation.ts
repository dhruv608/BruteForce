export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[INSTRUMENTATION] Initializing background workers and cron jobs...');

    // Initialize BullMQ worker (registers event listeners at import)
    await import('./src/lib/server/workers/studentSync.worker');

    // Initialize queue events listener
    await import('./src/lib/server/queues/studentSync.events');

    // Start cron jobs (student sync + leaderboard sync)
    const { startSyncJob } = await import('./src/lib/server/jobs/sync.job');
    startSyncJob();

    console.log('[INSTRUMENTATION] Background workers and cron jobs ready');
  }
}
