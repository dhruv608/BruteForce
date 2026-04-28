import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, assertAdmin, assertTeacherOrAbove } from '@/lib/server/auth-helper';
import { updateStudentDetailsService, deleteStudentDetailsService } from '@/lib/server/services/students/student.service';
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
    const studentId = Number(id);
    if (isNaN(studentId)) throw new ApiError(400, 'Invalid student ID');
    const body = await req.json();
    const updated = await updateStudentDetailsService(studentId, body);
    return NextResponse.json({ message: 'Student updated successfully', data: updated });
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
    const studentId = Number(id);
    if (isNaN(studentId)) throw new ApiError(400, 'Invalid student ID');
    await deleteStudentDetailsService(studentId);
    return NextResponse.json({ message: 'Student deleted permanently' });
  } catch (err) {
    return handleError(err);
  }
}
