import 'server-only';
import { NextRequest } from 'next/server';
import { apiOk } from '@/lib/server/api-response';
import { getAuthUser, assertAdmin } from '@/lib/server/auth-helper';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';
import { syncOneStudent } from '@/lib/server/services/progressSync/sync-core.service';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);

    const { id } = await params;
    if (!id || isNaN(Number(id))) {
      throw new ApiError(400, 'Valid student ID is required', [], 'INVALID_STUDENT_ID');
    }

    const studentId = Number(id);
    const result = await syncOneStudent(studentId);

    return apiOk(result, 'Student progress synchronized successfully');
  } catch (err) {
    return handleError(err);
  }
}
