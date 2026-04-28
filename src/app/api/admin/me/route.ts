import 'server-only';
import { NextResponse } from 'next/server';
import { withHandler } from '@/lib/server/route-handler';
import { getCurrentAdminService } from '@/lib/server/services/admin/admin-query.service';

export const GET = withHandler(
  async ({ user }) => {
    const admin = await getCurrentAdminService(user!.id);
    return NextResponse.json({ success: true, data: admin });
  },
  { requireAuth: true, requireRole: 'admin', rateLimit: 'api' }
);
