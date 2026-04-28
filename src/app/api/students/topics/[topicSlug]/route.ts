import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, assertStudent } from '@/lib/server/auth-helper';
import { getTopicOverviewWithClassesSummaryService } from '@/lib/server/services/topics/topic-progress.service';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ topicSlug: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertStudent(user);
    const { topicSlug } = await params;

    if (!user.batchId) {
      throw new ApiError(400, 'Student is not assigned to any batch');
    }

    const query = Object.fromEntries(new URL(req.url).searchParams.entries());

    const result = await getTopicOverviewWithClassesSummaryService({
      studentId: user.id,
      batchId: user.batchId,
      topicSlug,
      query,
    });

    return NextResponse.json(result);
  } catch (err) {
    return handleError(err);
  }
}
