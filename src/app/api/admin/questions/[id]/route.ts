import 'server-only';
import { apiOk, apiMessage } from '@/lib/server/api-response';
import { NextRequest } from 'next/server';
import { getAuthUser, assertAdmin, assertTeacherOrAbove } from '@/lib/server/auth-helper';
import { updateQuestionService, deleteQuestionService } from '@/lib/server/services/questions/question-core.service';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);
    assertTeacherOrAbove(user);
    const { id } = await params;
    const body = await req.json();
    const updated = await updateQuestionService({ id: Number(id), ...body });
    return apiOk({ question: updated }, 'Question updated successfully');
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);
    assertTeacherOrAbove(user);
    const { id } = await params;
    if (isNaN(Number(id))) throw new ApiError(400, 'Invalid question ID');
    await deleteQuestionService({ id: Number(id) });
    return apiMessage('Question deleted successfully');
  } catch (err) {
    return handleError(err);
  }
}
