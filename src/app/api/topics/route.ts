import 'server-only';
import { apiOk } from '@/lib/server/api-response';
import { withHandler } from '@/lib/server/route-handler';
import { getPaginatedTopicsService } from '@/lib/server/services/topics/topic-query.service';

export const GET = withHandler(
  async ({ query }) => {
    const page = Number(query.get('page') ?? '1');
    const limit = Number(query.get('limit') ?? '6');
    const search = query.get('search') ?? '';

    const result = await getPaginatedTopicsService({ page, limit, search });
    return apiOk(result);
  },
  { rateLimit: 'api' }
);
