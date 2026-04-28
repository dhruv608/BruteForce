import 'server-only';
import { apiOk, apiCreated } from '@/lib/server/api-response';
import { withHandler } from '@/lib/server/route-handler';
import { createAdminSchema } from '@/lib/server/schemas/admin.schema';
import { getAllAdminsService } from '@/lib/server/services/admin/admin-query.service';
import { createAdminService } from '@/lib/server/services/admin/admin-crud.service';

export const GET = withHandler(
  async ({ query }) => {
    const filters = Object.fromEntries(query.entries());
    // Default to TEACHER role if no role filter provided (matches Express getAllAdminsController)
    if (!filters.role) filters.role = 'TEACHER';

    const admins = await getAllAdminsService(filters);
    return apiOk(admins);
  },
  { requireAuth: true, requireRole: 'superadmin', rateLimit: 'api' }
);

export const POST = withHandler(
  async ({ body }) => {
    const admin = await createAdminService(body as any);
    return apiCreated(admin, 'Admin created successfully');
  },
  { requireAuth: true, requireRole: 'superadmin', rateLimit: 'api', bodySchema: createAdminSchema }
);
