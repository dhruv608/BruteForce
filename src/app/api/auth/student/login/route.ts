import 'server-only';
import { NextResponse } from 'next/server';
import { withHandler, setRefreshTokenCookie } from '@/lib/server/route-handler';
import { loginStudentSchema } from '@/lib/server/schemas/auth.schema';
import { loginStudent } from '@/lib/server/services/auth/auth-login.service';

export const POST = withHandler(
  async ({ body }) => {
    const { user, accessToken, refreshToken } = await loginStudent(body as any);

    const response = NextResponse.json({
      message: 'Login successful',
      accessToken,
      user,
    });

    setRefreshTokenCookie(response, refreshToken);
    return response;
  },
  { rateLimit: 'auth', bodySchema: loginStudentSchema }
);
