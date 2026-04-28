import 'server-only';
import { NextRequest } from 'next/server';
import { apiOk } from '@/lib/server/api-response';
import { getOptionalAuthUser } from '@/lib/server/auth-helper';
import { getPublicStudentProfileService } from '@/lib/server/services/students/profile-public.service';
import { handleError } from '@/lib/server/error-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const currentUser = getOptionalAuthUser(req);
    const profile = await getPublicStudentProfileService(username);

    const canEdit = currentUser && profile.student.id === currentUser.id;

    return apiOk({ ...profile, canEdit });
  } catch (err) {
    return handleError(err);
  }
}
