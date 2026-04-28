import 'server-only';
import { NextResponse } from 'next/server';
import { withHandler } from '@/lib/server/route-handler';
import { getAllBatchesService } from '@/lib/server/services/batches/batch-query.service';

export const GET = withHandler(
  async ({ query }) => {
    const city = query.get('city') ?? undefined;
    const year = query.get('year') ? Number(query.get('year')) : undefined;
    const batches = await getAllBatchesService({ city, year });
    return NextResponse.json(batches);
  },
  { requireAuth: true, requireRole: 'admin', rateLimit: 'api' }
);
