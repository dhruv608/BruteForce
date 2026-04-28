import 'server-only';
import { apiOk } from '@/lib/server/api-response';
import { NextRequest } from 'next/server';
import { checkUsernameAvailabilityService } from '@/lib/server/services/students/username.service';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';

export async function GET(req: NextRequest) {
  try {
    const sp = new URL(req.url).searchParams;
    const username = sp.get('username');
    const userId = sp.get('userId') ?? undefined;

    if (!username) {
      throw new ApiError(400, 'Username parameter is required', [], 'REQUIRED_FIELD');
    }

    const result = await checkUsernameAvailabilityService({ username, userId });
    return apiOk(result);
  } catch (err) {
    return handleError(err);
  }
}
