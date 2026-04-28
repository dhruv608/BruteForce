import 'server-only';
import { apiOk } from '@/lib/server/api-response';
import { withHandler } from '@/lib/server/route-handler';

export const GET = withHandler(
  async () => {
    return apiOk(['SUPERADMIN', 'TEACHER', 'INTERN']);
  },
  { requireAuth: true, requireRole: 'admin', rateLimit: 'api' }
);
