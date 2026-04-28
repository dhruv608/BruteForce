import 'server-only';
import { NextResponse } from 'next/server';
import { withHandler } from '@/lib/server/route-handler';
import { getAllBatchesService } from '@/lib/server/services/batches/batch-query.service';

export const GET = withHandler(
  async () => {
    const batches = await getAllBatchesService({});
    return NextResponse.json(batches);
  },
  { requireAuth: true, requireRole: 'student', rateLimit: 'api' }
);
