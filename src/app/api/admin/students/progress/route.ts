import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
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
    return NextResponse.json({ message: 'Student progress added successfully', data: progress }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
