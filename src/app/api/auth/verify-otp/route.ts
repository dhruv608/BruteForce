import 'server-only';
import { NextResponse } from 'next/server';
import { withHandler } from '@/lib/server/route-handler';
import { verifyOtpSchema } from '@/lib/server/schemas/auth.schema';
import { verifyOTP } from '@/lib/server/services/auth/auth-password.service';

export const POST = withHandler(
  async ({ body }) => {
    const { email, otp } = body as { email: string; otp: string };
    const result = await verifyOTP(email, otp);

    return NextResponse.json(result);
  },
  { rateLimit: 'auth', bodySchema: verifyOtpSchema }
);
