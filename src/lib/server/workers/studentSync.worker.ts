import { Worker, Job } from 'bullmq';

import { redisConnection } from '@/lib/server/config/redis';

import { syncOneStudent } from '@/lib/server/services/progressSync/sync-core.service';

import { getBatchQuestions } from '@/lib/server/store/batchQuestions.store';



// Create worker for student sync jobs

export const studentSyncWorker = new Worker(

  'student-sync',

  async (job: Job<{ studentId: number; batchId: number }>) => {

    const { studentId, batchId } = job.data;

    

    try {

      // Get batch questions from memory store
      const batchData = getBatchQuestions(batchId);

      if (!batchData) {
        console.warn(`[WORKER] No batch questions found for batch ${batchId}, skipping student ${studentId}`);
        return;
      }

      

      try {

        // Add timeout safety to prevent stuck jobs

        const result = await Promise.race([

          syncOneStudent(studentId, batchData),

          new Promise((_, reject) => 

            setTimeout(() => reject(new Error('Job timeout')), 60000) // 60 seconds timeout

          )

        ]) as Awaited<ReturnType<typeof syncOneStudent>>;

        

        // Per-student success is captured in the cycle summary log;
        // no per-iteration log needed.
        return {
          status: "SUCCESS", 
          studentId, 
          newSolved: result.newSolved,
          skipped: !result.hadNewSolutions
        };

      } catch (error: any) {

        // Handle timeout specifically

        if (error.message === 'Job timeout') {

          console.error(`[WORKER] Student ${studentId}: Job timed out after 10 seconds`);

          throw error; // Re-throw for BullMQ retry

        }

        

        // Handle invalid usernames and API errors
        if (error.message?.includes('Invalid LeetCode username') ||
            error.message?.includes('Invalid GFG handle') ||
            error.status === 400 ||
            error.code === 'INVALID_USERNAME') {
          // Counted in syncReport.failedCount via the queue events handler
          return {
            status: "ERROR",
            studentId,
            reason: error.message || "Invalid Platform Username"
          };
        } else {

          console.error(`[WORKER] Student ${studentId}: Sync failed -`, error.message || error);

          throw error; // Re-throw other errors for BullMQ retry

        }

      }

      

    } catch (error) {

      console.error(`[WORKER] Failed to sync student ${studentId}:`, error);

      throw error; // Re-throw to trigger BullMQ retry mechanism

    }

  },

  {

    connection: redisConnection,

    concurrency: 1, // Process 1 job at a time to match rate limiter

  }

);



// Error handling for the worker

studentSyncWorker.on('error', (err) => {

  console.error('[WORKER] Student sync worker error:', err);

});



studentSyncWorker.on('completed', (job, result) => {
  // console.log(`[WORKER] Job ${job.id} completed for student ${job.data.studentId}`);
});

studentSyncWorker.on('failed', (job, err) => {
  // console.error(`[WORKER] Job ${job?.id} failed for student ${job?.data?.studentId}:`, err);
});



// Graceful shutdown
process.on('SIGINT', async () => {
  await studentSyncWorker.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await studentSyncWorker.close();
  process.exit(0);
});



export default studentSyncWorker;

