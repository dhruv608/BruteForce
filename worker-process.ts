/**
 * worker-process.ts
 *
 * This file is ONLY used when deploying on Render (or any persistent server)
 * as a separate background worker alongside a Vercel frontend deployment.
 *
 * On EC2 → DO NOT use this file. Just run: next start
 *           instrumentation.ts handles everything automatically.
 *
 * On Render → Set Start Command to: npx ts-node worker-process.ts
 */

import './src/lib/server/workers/studentSync.worker';
import './src/lib/server/queues/studentSync.events';
import { startSyncJob } from './src/lib/server/jobs/sync.job';

startSyncJob();

console.log('[WORKER PROCESS] Cron jobs + BullMQ Worker running 24/7');
console.log('[WORKER PROCESS] Student sync: 5 AM, 2 PM, 8 PM');
console.log('[WORKER PROCESS] Leaderboard sync: 9 AM, 6 PM, 11 PM');
