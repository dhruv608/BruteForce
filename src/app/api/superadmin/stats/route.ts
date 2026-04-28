import 'server-only';
import { NextResponse } from 'next/server';
import { withHandler } from '@/lib/server/route-handler';
import { getSuperAdminStatsService } from '@/lib/server/services/admin/superadminStats.service';

export const GET = withHandler(
  async () => {
    const stats = await getSuperAdminStatsService();
    return NextResponse.json({ success: true, data: stats });
  },
  { requireAuth: true, requireRole: 'superadmin', rateLimit: 'api' }
);
