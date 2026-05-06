import 'server-only';
import { apiOk, apiMessage } from '@/lib/server/api-response';
import { NextRequest } from 'next/server';
import { getAuthUser, assertAdmin, assertTeacherOrAbove } from '@/lib/server/auth-helper';
import { resolveBatch } from '@/lib/server/batch-helper';
import { getClassDetailsWithFullQuestionsService } from '@/lib/server/services/topics/class-student.service';
import { updateClassService, deleteClassService } from '@/lib/server/services/topics/class.service';
import { handleError } from '@/lib/server/error-response';
import type { ParsedFile } from '@/lib/server/file-helper';
import { sanitizeRichText } from '@/lib/server/utils/sanitize';
import { CacheInvalidation } from '@/lib/server/utils/cacheInvalidation';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ batchSlug: string; topicSlug: string; classSlug: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);
    const { batchSlug, topicSlug, classSlug } = await params;
    const batch = await resolveBatch(batchSlug);
    const query = Object.fromEntries(new URL(req.url).searchParams.entries());

    const data = await getClassDetailsWithFullQuestionsService({
      studentId: 0,
      batchId: batch.id,
      topicSlug,
      classSlug,
      query,
    });
    return apiOk(data);
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ batchSlug: string; topicSlug: string; classSlug: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);
    assertTeacherOrAbove(user);
    const { batchSlug, topicSlug, classSlug } = await params;
    const batch = await resolveBatch(batchSlug);

    const contentType = req.headers.get('content-type') ?? '';
    let class_name: string | undefined;
    let description: string | undefined;
    let pdf_url: string | undefined;
    let duration_minutes: number | undefined;
    let class_date: string | undefined;
    let remove_pdf: boolean = false;
    let pdf_file: ParsedFile | undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      class_name = (formData.get('class_name') as string) ?? undefined;
      description = (formData.get('description') as string) ?? undefined;
      pdf_url = (formData.get('pdf_url') as string) ?? undefined;
      remove_pdf = formData.get('remove_pdf') === 'true';
      const dm = formData.get('duration_minutes') as string;
      if (dm) duration_minutes = Number(dm);
      class_date = (formData.get('class_date') as string) ?? undefined;
      const pdfField = formData.get('pdf_file') as File | null;
      if (pdfField) {
        const buf = await pdfField.arrayBuffer();
        pdf_file = { buffer: Buffer.from(buf), originalname: pdfField.name, mimetype: pdfField.type, size: pdfField.size };
      }
    } else {
      const body = await req.json();
      ({ class_name, description, pdf_url, remove_pdf, duration_minutes, class_date } = body);
    }

    const updated = await updateClassService({
      batchId: batch.id,
      topicSlug,
      classSlug,
      class_name,
      description: description !== undefined ? sanitizeRichText(description) : undefined,
      pdf_url,
      pdf_file,
      remove_pdf,
      duration_minutes,
      class_date,
    });

    await CacheInvalidation.invalidateBatch(batch.id);

    return apiOk({ class: updated }, 'Class updated successfully');
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ batchSlug: string; topicSlug: string; classSlug: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);
    assertTeacherOrAbove(user);
    const { batchSlug, topicSlug, classSlug } = await params;
    const batch = await resolveBatch(batchSlug);
    await deleteClassService({ batchId: batch.id, topicSlug, classSlug });
    await CacheInvalidation.invalidateBatch(batch.id);
    return apiMessage('Class deleted successfully');
  } catch (err) {
    return handleError(err);
  }
}
