import 'server-only';
import { apiOk, apiCreated } from '@/lib/server/api-response';
import { withHandler } from '@/lib/server/route-handler';
import { createCitySchema } from '@/lib/server/schemas/superadmin.schema';
import { getAllCitiesService, createCityService } from '@/lib/server/services/cities/city.service';

export const GET = withHandler(
  async () => {
    const cities = await getAllCitiesService();
    return apiOk(cities);
  },
  { requireAuth: true, requireRole: 'superadmin', rateLimit: 'api' }
);

export const POST = withHandler(
  async ({ body }) => {
    const { city_name } = body as { city_name: string };
    const city = await createCityService({ city_name });
    return apiCreated({ city }, 'City created successfully');
  },
  { requireAuth: true, requireRole: 'superadmin', rateLimit: 'api', bodySchema: createCitySchema }
);
