import { Worker, Job } from 'bullmq';
import { redisConnection } from '@/lib/server/config/redis';
import { syncOneStudent } from '@/lib/server/services/progressSync/sync-core.service';
import { getBatchQuestions } from '@/lib/server/store/batchQuestions.store';

const WORKER_KEY = Symbol.for('bruteforce.studentSyncWorker');
const g = globalThis as any;

function createWorker() {
  // Unique ID lets us tell if the same worker is firing 'ready' multiple
  // times (Redis reconnect) vs multiple workers being spawned (HMR bug)
  const instanceId = Math.random().toString(36).slice(2, 8);

  const worker = new Worker(
    'student-sync',
    async (job: Job<{ studentId: number; batchId: number }>) => {
      const { studentId, batchId } = job.data;
      console.log(`[WORKER] ▶ student=${studentId} batch=${batchId} (job=${job.id})`);

      try {
        const batchData = getBatchQuestions(batchId);
        if (!batchData) {
          console.warn(`[WORKER] ⚠ student=${studentId}: no batch questions for batch ${batchId} — skipping`);
          return;
        }

        try {
          const result = await Promise.race([
            syncOneStudent(studentId, batchData),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Job timeout')), 60000)
            )
          ]) as Awaited<ReturnType<typeof syncOneStudent>>;

          return {
            status: "SUCCESS",
            studentId,
            newSolved: result.newSolved,
            skipped: !result.hadNewSolutions
          };
        } catch (error: any) {
          if (error.message === 'Job timeout') {
            console.error(`[WORKER] ⏱ student=${studentId}: timed out after 60s`);
            throw error;
          }

          if (error.message?.includes('Invalid LeetCode username') ||
              error.message?.includes('Invalid GFG handle') ||
              error.status === 400 ||
              error.code === 'INVALID_USERNAME') {
            return {
              status: "ERROR",
              studentId,
              reason: error.message || "Invalid Platform Username"
            };
          } else {
            console.error(`[WORKER] ✗ student=${studentId}: sync failed — ${error.message || error}`);
            throw error;
          }
        }
      } catch (error) {
        console.error(`[WORKER] ✗ student=${studentId}: unhandled error —`, error);
        throw error;
      }
    },
    {
      connection: redisConnection,
      concurrency: 1,
    }
  );

  worker.on('error', (err) => {
    console.error(`[WORKER:${instanceId}] error:`, err);
  });

  worker.on('completed', (job, result) => {
    if (result?.status === 'SUCCESS') {
      console.log(
        `[WORKER] ✓ student=${result.studentId} newSolved=${result.newSolved}${result.skipped ? ' (skipped: no new solves)' : ''}`
      );
    } else if (result?.status === 'ERROR') {
      console.warn(`[WORKER] ✗ student=${result.studentId} reason="${result.reason}"`);
    }
  });

  worker.on('failed', (job, err) => {
    console.error(`[WORKER] ✗ job=${job?.id} student=${job?.data?.studentId} failed: ${err.message}`);
  });

  worker.on('ready', () => {
    console.log(`[WORKER:${instanceId}] Ready — listening for 'student-sync' jobs`);
  });

  console.log(`[WORKER:${instanceId}] Created`);
  return worker;
}

// Use Symbol.for as the global key — more robust than property assignment
export const studentSyncWorker: Worker = g[WORKER_KEY] ?? createWorker();
g[WORKER_KEY] = studentSyncWorker;

process.on('SIGINT', async () => {
  await studentSyncWorker.close();
});

process.on('SIGTERM', async () => {
  await studentSyncWorker.close();
});

export default studentSyncWorker;
