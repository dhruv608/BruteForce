import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getOptionalAuthUser } from '@/lib/server/auth-helper';
import { logoutStudent } from '@/lib/server/services/auth/auth-logout.service';
import { clearRefreshTokenCookie } from '@/lib/server/route-handler';
import { handleError } from '@/lib/server/error-response';

export async function POST(req: NextRequest) {
  try {
    const user = getOptionalAuthUser(req);
    if (user) {
      await logoutStudent(user.id);
    }

    const response = NextResponse.json({ message: 'Student logout successful' });
    clearRefreshTokenCookie(response);
    return response;
  } catch (err) {
    return handleError(err);
  }
}
