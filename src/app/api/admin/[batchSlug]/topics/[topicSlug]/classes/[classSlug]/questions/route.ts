import 'server-only';
import { NextRequest } from 'next/server';
import { apiOk } from '@/lib/server/api-response';
import { getAuthUser, assertAdmin, assertTeacherOrAbove } from '@/lib/server/auth-helper';
import { resolveBatch } from '@/lib/server/batch-helper';
import { getAssignedQuestionsOfClassService } from '@/lib/server/services/questions/visibility-query.service';
import { assignQuestionsToClassService } from '@/lib/server/services/questions/visibility.service';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ batchSlug: string; topicSlug: string; classSlug: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);
    const { batchSlug, topicSlug, classSlug } = await params;
    const batch = await resolveBatch(batchSlug);
    const sp = new URL(req.url).searchParams;

    const result = await getAssignedQuestionsOfClassService({
      batchId: batch.id,
      topicSlug,
      classSlug,
      page: Number(sp.get('page') ?? '1'),
      limit: Number(sp.get('limit') ?? '10'),
      search: sp.get('search') ?? '',
    });

    return apiOk(result, 'Assigned questions retrieved successfully');
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ batchSlug: string; topicSlug: string; classSlug: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);
    assertTeacherOrAbove(user);
    const { batchSlug, topicSlug, classSlug } = await params;
    const batch = await resolveBatch(batchSlug);
    const body = await req.json();

    if (!body.questions || !Array.isArray(body.questions)) {
      throw new ApiError(400, 'questions array is required');
    }

    const result = await assignQuestionsToClassService({
      batchId: batch.id,
      topicSlug,
      classSlug,
      questions: body.questions,
    });

    return apiOk(result, 'Questions assigned successfully');
  } catch (err) {
    return handleError(err);
  }
}
