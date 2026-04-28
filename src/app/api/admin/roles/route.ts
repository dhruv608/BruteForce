import 'server-only';
import { NextResponse } from 'next/server';
import { withHandler } from '@/lib/server/route-handler';

export const GET = withHandler(
  async () => {
    return NextResponse.json({
      success: true,
      data: ['SUPERADMIN', 'TEACHER', 'INTERN'],
    });
  },
  { requireAuth: true, requireRole: 'admin', rateLimit: 'api' }
);
