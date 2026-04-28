import 'server-only';
import { NextResponse } from 'next/server';
import { withHandler } from '@/lib/server/route-handler';
import { getCurrentSuperAdminService } from '@/lib/server/services/admin/superadminStats.service';

export const GET = withHandler(
  async ({ user }) => {
    const superadmin = await getCurrentSuperAdminService(user!.id);
    return NextResponse.json({
      success: true,
      data: {
        id: superadmin.id,
        name: superadmin.name,
        email: superadmin.email,
        role: superadmin.role,
      },
    });
  },
  { requireAuth: true, requireRole: 'superadmin', rateLimit: 'api' }
);
