import { QueueEvents } from "bullmq";
import { redisConnection } from '@/lib/server/config/redis';
import { completeSync } from '@/lib/server/utils/syncStatus';

const EVENTS_KEY = Symbol.for('bruteforce.studentSyncQueueEvents');
const g = globalThis as any;

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

function createQueueEvents() {
  const instanceId = Math.random().toString(36).slice(2, 8);

  const events = new QueueEvents("student-sync", {
    connection: redisConnection,
  });

  events.on("drained", async () => {
    console.log('[SYNC] Cycle completed:', JSON.stringify({
      totalProcessed: syncReport.totalProcessed,
      studentsWithNewSolved: syncReport.studentsWithAddedQuestions.length,
      newQuestionsAdded: syncReport.addedQuestionsCount,
      skipped: syncReport.studentsSkippedCount,
      failed: syncReport.failedCount,
    }));

    if (syncReport.errors.length > 0) {
      console.warn('[SYNC] Errors:', JSON.stringify(syncReport.errors));
    }

    completeSync();
    resetReport();
  });

  events.on("completed", ({ jobId, returnvalue }) => {
    syncReport.totalProcessed++;

    if (returnvalue) {
      try {
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

  events.on("failed", ({ jobId, failedReason }) => {
    syncReport.totalProcessed++;
    syncReport.failedCount++;
    syncReport.errors.push({ id: -1, reason: `Job ${jobId} Failed: ${failedReason}` });
  });

  events.on("error", (err) => {
    console.error(`[QUEUE-EVENTS:${instanceId}] error:`, err);
  });

  console.log(`[QUEUE-EVENTS:${instanceId}] Listening for 'student-sync' events`);

  return events;
}

export const studentSyncQueueEvents: QueueEvents = g[EVENTS_KEY] ?? createQueueEvents();
g[EVENTS_KEY] = studentSyncQueueEvents;

process.on("SIGINT", async () => {
  await studentSyncQueueEvents.close();
});

process.on("SIGTERM", async () => {
  await studentSyncQueueEvents.close();
});

export default studentSyncQueueEvents;
