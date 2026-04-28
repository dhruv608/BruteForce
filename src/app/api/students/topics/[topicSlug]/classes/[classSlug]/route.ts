import 'server-only';
import { apiOk } from '@/lib/server/api-response';
import { NextRequest } from 'next/server';
import { getAuthUser, assertStudent } from '@/lib/server/auth-helper';
import { getClassDetailsWithFullQuestionsService } from '@/lib/server/services/topics/class-student.service';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ topicSlug: string; classSlug: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertStudent(user);
    const { topicSlug, classSlug } = await params;

    if (!user.batchId) {
      throw new ApiError(400, 'Student is not assigned to any batch');
    }

    const query = Object.fromEntries(new URL(req.url).searchParams.entries());

    const result = await getClassDetailsWithFullQuestionsService({
      studentId: user.id,
      batchId: user.batchId,
      topicSlug,
      classSlug,
      query,
    });

    return apiOk(result);
  } catch (err) {
    return handleError(err);
  }
}
