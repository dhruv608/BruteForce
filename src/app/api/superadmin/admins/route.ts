import 'server-only';
import { NextResponse } from 'next/server';
import { withHandler } from '@/lib/server/route-handler';
import { createAdminSchema } from '@/lib/server/schemas/admin.schema';
import { getAllAdminsService, getCurrentAdminService } from '@/lib/server/services/admin/admin-query.service';
import { createAdminService } from '@/lib/server/services/admin/admin-crud.service';

export const GET = withHandler(
  async ({ query }) => {
    const filters = Object.fromEntries(query.entries());
    // Default to TEACHER role if no role filter provided (matches Express getAllAdminsController)
    if (!filters.role) filters.role = 'TEACHER';

    const admins = await getAllAdminsService(filters);
    return NextResponse.json({ success: true, data: admins });
  },
  { requireAuth: true, requireRole: 'superadmin', rateLimit: 'api' }
);

export const POST = withHandler(
  async ({ body }) => {
    const admin = await createAdminService(body as any);
    return NextResponse.json({ success: true, message: 'Admin created successfully', data: admin }, { status: 201 });
  },
  { requireAuth: true, requireRole: 'superadmin', rateLimit: 'api', bodySchema: createAdminSchema }
);
