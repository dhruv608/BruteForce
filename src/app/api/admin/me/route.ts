import 'server-only';
import { apiOk } from '@/lib/server/api-response';
import { withHandler } from '@/lib/server/route-handler';
import { getCurrentAdminService } from '@/lib/server/services/admin/admin-query.service';

export const GET = withHandler(
  async ({ user }) => {
    const admin = await getCurrentAdminService(user!.id);
    return apiOk(admin);
  },
  { requireAuth: true, requireRole: 'admin', rateLimit: 'api' }
);
