import 'server-only';
import { NextRequest } from 'next/server';
import { getAuthUser, assertStudent } from '@/lib/server/auth-helper';
import { parseFormDataFile } from '@/lib/server/file-helper';
import { ProfileImageService } from '@/lib/server/services/students/profileImage.service';
import { CacheInvalidation } from '@/lib/server/utils/cacheInvalidation';
import { apiCreated, apiMessage } from '@/lib/server/api-response';
import { handleError } from '@/lib/server/error-response';

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    assertStudent(user);

    const file = await parseFormDataFile(req, 'file', {
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      maxSizeBytes: 5 * 1024 * 1024,
    });

    const result = await ProfileImageService.uploadProfileImage(user.id, file as any);
    await CacheInvalidation.invalidateStudentProfile(user.id);

    return apiCreated({ profileImageUrl: result.url }, 'Profile image uploaded successfully');
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    assertStudent(user);

    await ProfileImageService.deleteProfileImage(user.id);
    await CacheInvalidation.invalidateStudentProfile(user.id);

    return apiMessage('Profile image deleted successfully');
  } catch (err) {
    return handleError(err);
  }
}
