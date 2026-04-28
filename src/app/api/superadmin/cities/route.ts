import 'server-only';
import { NextResponse } from 'next/server';
import { withHandler } from '@/lib/server/route-handler';
import { createCitySchema } from '@/lib/server/schemas/superadmin.schema';
import { getAllCitiesService, createCityService } from '@/lib/server/services/cities/city.service';

export const GET = withHandler(
  async () => {
    const cities = await getAllCitiesService();
    return NextResponse.json(cities);
  },
  { requireAuth: true, requireRole: 'superadmin', rateLimit: 'api' }
);

export const POST = withHandler(
  async ({ body }) => {
    const { city_name } = body as { city_name: string };
    const city = await createCityService({ city_name });
    return NextResponse.json({ message: 'City created successfully', city }, { status: 201 });
  },
  { requireAuth: true, requireRole: 'superadmin', rateLimit: 'api', bodySchema: createCitySchema }
);
