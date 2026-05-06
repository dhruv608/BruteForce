import 'server-only';
import { apiMessage } from '@/lib/server/api-response';
import { NextRequest } from 'next/server';
import { getAuthUser, assertAdmin, assertTeacherOrAbove } from '@/lib/server/auth-helper';
import { resolveBatch } from '@/lib/server/batch-helper';
import { removeQuestionFromClassService } from '@/lib/server/services/questions/visibility.service';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';
import { CacheInvalidation } from '@/lib/server/utils/cacheInvalidation';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ batchSlug: string; topicSlug: string; classSlug: string; questionId: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);
    assertTeacherOrAbove(user);
    const { batchSlug, topicSlug, classSlug, questionId } = await params;
    const batch = await resolveBatch(batchSlug);
    const questionIdNum = Number(questionId);
    if (isNaN(questionIdNum)) throw new ApiError(400, 'Invalid question ID');

    await removeQuestionFromClassService({
      batchId: batch.id,
      topicSlug,
      classSlug,
      questionId: questionIdNum,
    });

    await CacheInvalidation.invalidateBatch(batch.id);

    return apiMessage('Question removed successfully');
  } catch (err) {
    return handleError(err);
  }
}
