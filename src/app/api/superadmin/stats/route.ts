import 'server-only';
import { apiOk } from '@/lib/server/api-response';
import { withHandler } from '@/lib/server/route-handler';
import { getSuperAdminStatsService } from '@/lib/server/services/admin/superadminStats.service';

export const GET = withHandler(
  async () => {
    const stats = await getSuperAdminStatsService();
    return apiOk(stats);
  },
  { requireAuth: true, requireRole: 'superadmin', rateLimit: 'api' }
);
