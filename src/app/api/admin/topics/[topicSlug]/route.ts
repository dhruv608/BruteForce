import 'server-only';
import { apiOk, apiMessage } from '@/lib/server/api-response';
import { NextRequest } from 'next/server';
import { getAuthUser, assertAdmin, assertTeacherOrAbove } from '@/lib/server/auth-helper';
import { updateTopicService, deleteTopicService } from '@/lib/server/services/topics/topic.service';
import { CacheInvalidation } from '@/lib/server/utils/cacheInvalidation';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';
import type { ParsedFile } from '@/lib/server/file-helper';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ topicSlug: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);
    assertTeacherOrAbove(user);
    const { topicSlug } = await params;

    const contentType = req.headers.get('content-type') ?? '';
    let topic_name: string | undefined;
    let removePhoto: boolean = false;
    let photo: ParsedFile | undefined;

    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      topic_name = (formData.get('topic_name') as string) ?? undefined;
      removePhoto = formData.get('removePhoto') === 'true';
      const photoFile = formData.get('photo') as File | null;
      if (photoFile && photoFile.size > 0) {
        if (!ALLOWED_IMAGE_TYPES.includes(photoFile.type)) {
          throw new ApiError(400, `Invalid image type. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`);
        }
        if (photoFile.size > MAX_IMAGE_BYTES) {
          throw new ApiError(400, `Image too large. Max: ${MAX_IMAGE_BYTES / 1024 / 1024}MB`);
        }
        const buf = await photoFile.arrayBuffer();
        photo = { buffer: Buffer.from(buf), originalname: photoFile.name, mimetype: photoFile.type, size: photoFile.size };
      }
    } else {
      const body = await req.json();
      topic_name = body.topic_name;
      removePhoto = body.removePhoto === true;
    }

    const updated = await updateTopicService({ topicSlug, topic_name, photo: photo as any, removePhoto });

    await Promise.all([
      CacheInvalidation.invalidateAdminTopics(),
      CacheInvalidation.invalidateTopics(),
      CacheInvalidation.invalidateTopicOverviews(),
    ]);

    return apiOk({ topic: updated }, 'Topic updated successfully');
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ topicSlug: string }> }
) {
  return PUT(req, ctx);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ topicSlug: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);
    assertTeacherOrAbove(user);
    const { topicSlug } = await params;

    await deleteTopicService({ topicSlug });

    await Promise.all([
      CacheInvalidation.invalidateAdminTopics(),
      CacheInvalidation.invalidateTopics(),
      CacheInvalidation.invalidateTopicOverviews(),
    ]);

    return apiMessage('Topic deleted successfully');
  } catch (err) {
    return handleError(err);
  }
}
