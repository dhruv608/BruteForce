import 'server-only';
import { apiOk } from '@/lib/server/api-response';
import { NextRequest } from 'next/server';
import { getAuthUser, assertAdmin } from '@/lib/server/auth-helper';
import { resolveBatch } from '@/lib/server/batch-helper';
import { updateQuestionVisibilityTypeService } from '@/lib/server/services/questions/visibility.service';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';
import { CacheInvalidation } from '@/lib/server/utils/cacheInvalidation';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ batchSlug: string; topicSlug: string; classSlug: string; visibilityId: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);
    const { batchSlug, topicSlug, classSlug, visibilityId } = await params;
    const batch = await resolveBatch(batchSlug);
    const visibilityIdNum = Number(visibilityId);
    if (isNaN(visibilityIdNum)) throw new ApiError(400, 'Invalid visibility ID');

    const body = await req.json();
    const { type } = body;

    if (type !== 'HOMEWORK' && type !== 'CLASSWORK') {
      throw new ApiError(400, 'type must be HOMEWORK or CLASSWORK');
    }

    const updated = await updateQuestionVisibilityTypeService({
      batchId: batch.id,
      topicSlug,
      classSlug,
      visibilityId: visibilityIdNum,
      type,
    });

    await CacheInvalidation.invalidateBatch(batch.id);

    return apiOk({ data: updated }, 'Question visibility type updated successfully');
  } catch (err) {
    return handleError(err);
  }
}
