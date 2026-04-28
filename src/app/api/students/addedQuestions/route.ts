import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, assertStudent } from '@/lib/server/auth-helper';
import { getAllQuestionsWithFiltersService } from '@/lib/server/services/questions/visibility-student.service';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';
import { applyRateLimit } from '@/lib/server/rate-limiter';

export async function GET(req: NextRequest) {
  try {
    const limited = await applyRateLimit(req, 'heavy');
    if (limited) return limited;

    const user = getAuthUser(req);
    assertStudent(user);

    if (!user.batchId) {
      throw new ApiError(400, 'Student is not assigned to any batch');
    }

    const sp = new URL(req.url).searchParams;

    const result = await getAllQuestionsWithFiltersService({
      studentId: user.id,
      batchId: user.batchId,
      filters: {
        search: sp.get('search') ?? undefined,
        topic: sp.get('topic') ?? undefined,
        level: sp.get('level') ?? undefined,
        platform: sp.get('platform') ?? undefined,
        type: sp.get('type') ?? undefined,
        solved: sp.get('solved') ?? undefined,
        page: Number(sp.get('page') ?? '1'),
        limit: Number(sp.get('limit') ?? '20'),
      },
    });

    return NextResponse.json(result);
  } catch (err) {
    return handleError(err);
  }
}
