import 'server-only';
import { apiOk, apiMessage } from '@/lib/server/api-response';
import { NextRequest } from 'next/server';
import { getAuthUser, assertStudent } from '@/lib/server/auth-helper';
import { updateBookmarkService, deleteBookmarkService } from '@/lib/server/services/bookmarks/bookmark-crud.service';
import { CacheInvalidation } from '@/lib/server/utils/cacheInvalidation';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';
import { sanitizeRichText } from '@/lib/server/utils/sanitize';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertStudent(user);
    const { questionId } = await params;
    const questionIdNum = Number(questionId);
    if (isNaN(questionIdNum)) throw new ApiError(400, 'Invalid question ID');

    const body = await req.json();
    const { description } = body;
    // sanitizeRichText returns '' for null/undefined input, so this is always a string
    const cleanDescription = sanitizeRichText(description);

    const updated = await updateBookmarkService(user.id, questionIdNum, cleanDescription);

    await Promise.all([
      CacheInvalidation.invalidateBookmarksForStudent(user.id),
      CacheInvalidation.invalidateAssignedQuestionsForStudent(user.id),
      CacheInvalidation.invalidateClassProgressForStudent(user.id),
    ]);

    return apiOk(updated);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertStudent(user);
    const { questionId } = await params;
    const questionIdNum = Number(questionId);
    if (isNaN(questionIdNum)) throw new ApiError(400, 'Invalid question ID');

    await deleteBookmarkService(user.id, questionIdNum);

    await Promise.all([
      CacheInvalidation.invalidateBookmarksForStudent(user.id),
      CacheInvalidation.invalidateAssignedQuestionsForStudent(user.id),
      CacheInvalidation.invalidateClassProgressForStudent(user.id),
    ]);

    return apiMessage('Bookmark deleted successfully');
  } catch (err) {
    return handleError(err);
  }
}
