import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, assertStudent } from '@/lib/server/auth-helper';
import { getRecentQuestionsService } from '@/lib/server/services/questions/recentQuestions.service';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    assertStudent(user);

    if (!user.batchId) {
      throw new ApiError(400, 'Student is not assigned to any batch');
    }

    const sp = new URL(req.url).searchParams;

    const result = await getRecentQuestionsService({
      batchId: user.batchId,
      date: sp.get('date') ?? undefined,
      page: Number(sp.get('page') ?? '1'),
      limit: Number(sp.get('limit') ?? '12'),
    });

    return NextResponse.json(result);
  } catch (err) {
    return handleError(err);
  }
}
