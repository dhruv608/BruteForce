import 'server-only';
import { apiOk } from '@/lib/server/api-response';
import { withHandler } from '@/lib/server/route-handler';
import { getAllBatchesService } from '@/lib/server/services/batches/batch-query.service';

export const GET = withHandler(
  async () => {
    const batches = await getAllBatchesService({});
    return apiOk(batches);
  },
  { requireAuth: true, requireRole: 'student', rateLimit: 'api' }
);
