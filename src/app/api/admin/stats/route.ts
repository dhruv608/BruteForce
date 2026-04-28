import 'server-only';
import { NextResponse } from 'next/server';
import { withHandler } from '@/lib/server/route-handler';
import { batchStatsSchema } from '@/lib/server/schemas/admin.schema';
import { getAdminStatsService } from '@/lib/server/services/admin/admin-stats.service';

export const POST = withHandler(
  async ({ body }) => {
    const { batch_id } = body as { batch_id: number };
    const stats = await getAdminStatsService(batch_id);
    return NextResponse.json({ success: true, data: stats });
  },
  { requireAuth: true, requireRole: 'admin', rateLimit: 'api', bodySchema: batchStatsSchema }
);
