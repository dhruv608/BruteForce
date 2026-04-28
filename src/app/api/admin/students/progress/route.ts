import 'server-only';
import { NextRequest } from 'next/server';
import { apiCreated } from '@/lib/server/api-response';
import { getAuthUser, assertAdmin } from '@/lib/server/auth-helper';
import { addStudentProgressService } from '@/lib/server/services/students/student-progress.service';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);

    const body = await req.json();
    const { student_id, question_id } = body;

    if (!student_id || !question_id) {
      throw new ApiError(400, 'student_id and question_id are required');
    }

    const progress = await addStudentProgressService(Number(student_id), Number(question_id));
    return apiCreated(progress, 'Student progress added successfully');
  } catch (err) {
    return handleError(err);
  }
}
