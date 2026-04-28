import 'server-only';
import { apiOk } from '@/lib/server/api-response';
import { withHandler } from '@/lib/server/route-handler';
import { verifyOtpSchema } from '@/lib/server/schemas/auth.schema';
import { verifyOTP } from '@/lib/server/services/auth/auth-password.service';

export const POST = withHandler(
  async ({ body }) => {
    const { email, otp } = body as { email: string; otp: string };
    const result = await verifyOTP(email, otp);

    return apiOk(result);
  },
  { rateLimit: 'auth', bodySchema: verifyOtpSchema }
);
