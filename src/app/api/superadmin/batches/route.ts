import 'server-only';
import { NextResponse } from 'next/server';
import { withHandler } from '@/lib/server/route-handler';
import { createBatchSchema } from '@/lib/server/schemas/superadmin.schema';
import { getAllBatchesService } from '@/lib/server/services/batches/batch-query.service';
import { createBatchService } from '@/lib/server/services/batches/batch-crud.service';

export const GET = withHandler(
  async ({ query }) => {
    const city = query.get('city') ?? undefined;
    const year = query.get('year') ? Number(query.get('year')) : undefined;
    const batches = await getAllBatchesService({ city, year });
    return NextResponse.json(batches);
  },
  { requireAuth: true, requireRole: 'superadmin', rateLimit: 'api' }
);

export const POST = withHandler(
  async ({ body }) => {
    const { batch_name, year, city_id } = body as { batch_name: string; year: number; city_id: number };
    const batch = await createBatchService({ batch_name, year, city_id });
    return NextResponse.json({ message: 'Batch created successfully', batch }, { status: 201 });
  },
  { requireAuth: true, requireRole: 'superadmin', rateLimit: 'api', bodySchema: createBatchSchema }
);
