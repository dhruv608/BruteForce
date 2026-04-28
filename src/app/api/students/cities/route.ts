import 'server-only';
import { apiOk } from '@/lib/server/api-response';
import { withHandler } from '@/lib/server/route-handler';
import { getAllCitiesService } from '@/lib/server/services/cities/city.service';

export const GET = withHandler(
  async () => {
    const cities = await getAllCitiesService();
    return apiOk(cities);
  },
  { requireAuth: true, requireRole: 'student', rateLimit: 'api' }
);
