import 'server-only';
import { apiOk } from '@/lib/server/api-response';
import { withHandler } from '@/lib/server/route-handler';
import { getAllBatchesService } from '@/lib/server/services/batches/batch-query.service';

export const GET = withHandler(
  async ({ query }) => {
    const city = query.get('city') ?? undefined;
    const yearStr = query.get('year');
    const year = yearStr ? Number(yearStr) : undefined;

    const batches = await getAllBatchesService({ city, year });
    return apiOk(batches);
  },
  { rateLimit: 'api' }
);
