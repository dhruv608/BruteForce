import 'server-only';
import { withHandler } from '@/lib/server/route-handler';
import { getCurrentSuperAdminService } from '@/lib/server/services/admin/superadminStats.service';
import { apiOk } from '@/lib/server/api-response';

export const GET = withHandler(
  async ({ user }) => {
    const superadmin = await getCurrentSuperAdminService(user!.id);
    return apiOk({
      id: superadmin.id,
      name: superadmin.name,
      email: superadmin.email,
      role: superadmin.role,
    });
  },
  { requireAuth: true, requireRole: 'superadmin', rateLimit: 'api' }
);
