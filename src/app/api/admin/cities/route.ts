import 'server-only';
import { NextResponse } from 'next/server';
import { withHandler } from '@/lib/server/route-handler';
import { getAllCitiesService } from '@/lib/server/services/cities/city.service';

export const GET = withHandler(
  async () => {
    const cities = await getAllCitiesService();
    return NextResponse.json(cities);
  },
  { requireAuth: true, requireRole: 'admin', rateLimit: 'api' }
);
