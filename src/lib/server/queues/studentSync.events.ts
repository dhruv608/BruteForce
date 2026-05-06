import { QueueEvents } from "bullmq";
import { redisConnection } from '@/lib/server/config/redis';
import { completeSync } from '@/lib/server/utils/syncStatus';
import { clearBatchQuestions } from '@/lib/server/store/batchQuestions.store';

// Initialize QueueEvents for completion detection
export const studentSyncQueueEvents = new QueueEvents("student-sync", {
  connection: redisConnection,
});

// State for building the final report
let syncReport = {
  totalProcessed: 0,
  addedQuestionsCount: 0,
  studentsSkippedCount: 0,
  failedCount: 0,
  studentsWithAddedQuestions: [] as { id: number; added: number }[],
  errors: [] as { id: number; reason: string }[]
};

function resetReport() {
  syncReport = {
    totalProcessed: 0,
    addedQuestionsCount: 0,
    studentsSkippedCount: 0,
    failedCount: 0,
    studentsWithAddedQuestions: [],
    errors: []
  };
}

// Handle queue drained event (all jobs completed)
studentSyncQueueEvents.on("drained", async () => {
  console.log('[SYNC] Cycle completed:', JSON.stringify({
    totalProcessed: syncReport.totalProcessed,
    studentsWithNewSolved: syncReport.studentsWithAddedQuestions.length,
    newQuestionsAdded: syncReport.addedQuestionsCount,
    skipped: syncReport.studentsSkippedCount,
    failed: syncReport.failedCount,
  }));

  // Log errors only if any occurred
  if (syncReport.errors.length > 0) {
    console.warn('[SYNC] Errors:', JSON.stringify(syncReport.errors));
  }

  // Mark sync as completed
  completeSync();

  // NOTE: We do NOT clearBatchQuestions() here anymore.
  // If any jobs went into 'delayed' for exponential backoff retry, the 'drained'
  // event still fires. Clearing memory here would make retried jobs find an empty
  // store and instantly skip. The memory cleanly overwrites itself at the start
  // of the next cron cycle.

  resetReport();
});

// Handle job completion for detailed logging
studentSyncQueueEvents.on("completed", ({ jobId, returnvalue }) => {
  syncReport.totalProcessed++;
  
  if (returnvalue) {
    try {
      // BullMQ QueueEvents often returns the value as a JSON string
      const res = typeof returnvalue === "string" ? JSON.parse(returnvalue) : returnvalue;
      
      if (res.status === "SUCCESS") {
        if (res.skipped) {
          syncReport.studentsSkippedCount++;
        } else {
          syncReport.addedQuestionsCount += res.newSolved;
          syncReport.studentsWithAddedQuestions.push({ id: res.studentId, added: res.newSolved });
        }
      } else if (res.status === "ERROR") {
        syncReport.failedCount++;
        syncReport.errors.push({ id: res.studentId, reason: res.reason });
      }
    } catch (e) {
      console.error(`Failed to parse returnvalue for job ${jobId}`, e);
    }
  }
});

// Handle job failures (Timeouts / Exceptions)
studentSyncQueueEvents.on("failed", ({ jobId, failedReason }) => {
  syncReport.totalProcessed++;
  syncReport.failedCount++;
  // Extracting student ID is hard here since job isn't fully available, 
  // but we can log the job ID.
  syncReport.errors.push({ id: -1, reason: `Job ${jobId} Failed: ${failedReason}` });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await studentSyncQueueEvents.close();
});

process.on("SIGTERM", async () => {
  await studentSyncQueueEvents.close();
});

export default studentSyncQueueEvents;
