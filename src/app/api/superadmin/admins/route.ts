import 'server-only';
import { NextResponse } from 'next/server';
import { withHandler } from '@/lib/server/route-handler';
import { createAdminSchema } from '@/lib/server/schemas/admin.schema';
import { getAllAdminsService, getCurrentAdminService } from '@/lib/server/services/admin/admin-query.service';
import { createAdminService } from '@/lib/server/services/admin/admin-crud.service';

export const GET = withHandler(
  async ({ query }) => {
    const admins = await getAllAdminsService(Object.fromEntries(query.entries()));
    return NextResponse.json(admins);
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
