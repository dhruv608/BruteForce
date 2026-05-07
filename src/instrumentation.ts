export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Validate required env vars BEFORE anything else loads.
    // Fails fast with a list of all missing vars rather than crashing at
    // first use with a cryptic error.
    const { validateEnv } = await import('@/lib/server/utils/validate-env');
    validateEnv();

    console.log('[INSTRUMENTATION] Initializing background workers and cron jobs...');

    // Initialize BullMQ worker (registers event listeners at import)
    await import('@/lib/server/workers/studentSync.worker');

    // Initialize queue events listener
    await import('@/lib/server/queues/studentSync.events');

    // Start cron jobs (student sync + leaderboard sync)
    const { startSyncJob } = await import('@/lib/server/jobs/sync.job');
    startSyncJob();

    console.log('[INSTRUMENTATION] Background workers and cron jobs ready');
  }
}
