import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
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

    return NextResponse.json({
      success: true,
      message: 'Student progress synchronized successfully',
      data: result,
    });
  } catch (err) {
    return handleError(err);
  }
}
