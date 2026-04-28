import 'server-only';
import { apiOk } from '@/lib/server/api-response';
import { withHandler } from '@/lib/server/route-handler';
import { getTopicsWithBatchProgressService } from '@/lib/server/services/topics/topic-progress.service';
import { ApiError } from '@/lib/server/utils/ApiError';

export const GET = withHandler(
  async ({ user, query }) => {
    if (!user!.batchId) {
      throw new ApiError(400, 'Student is not assigned to any batch');
    }

    const result = await getTopicsWithBatchProgressService({
      studentId: user!.id,
      batchId: user!.batchId,
      query: Object.fromEntries(query.entries()),
    });

    return apiOk(result);
  },
  { requireAuth: true, requireRole: 'student', rateLimit: 'api' }
);
