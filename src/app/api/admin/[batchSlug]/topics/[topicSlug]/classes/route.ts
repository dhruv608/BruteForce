import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, assertAdmin, assertTeacherOrAbove } from '@/lib/server/auth-helper';
import { resolveBatch } from '@/lib/server/batch-helper';
import { getClassesByTopicService } from '@/lib/server/services/topics/class-query.service';
import { createClassInTopicService } from '@/lib/server/services/topics/class.service';
import { CacheInvalidation } from '@/lib/server/utils/cacheInvalidation';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';
import type { ParsedFile } from '@/lib/server/file-helper';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ batchSlug: string; topicSlug: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);
    const { batchSlug, topicSlug } = await params;
    const batch = await resolveBatch(batchSlug);
    const sp = new URL(req.url).searchParams;

    const data = await getClassesByTopicService({
      batchId: batch.id,
      topicSlug,
      page: Number(sp.get('page') ?? '1'),
      limit: Number(sp.get('limit') ?? '20'),
      search: sp.get('search') ?? '',
    });

    return NextResponse.json(data);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ batchSlug: string; topicSlug: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);
    assertTeacherOrAbove(user);
    const { batchSlug, topicSlug } = await params;
    const batch = await resolveBatch(batchSlug);

    const contentType = req.headers.get('content-type') ?? '';
    let class_name: string;
    let description: string | undefined;
    let pdf_url: string | undefined;
    let duration_minutes: number | undefined;
    let class_date: string | undefined;
    let pdf_file: ParsedFile | undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      class_name = formData.get('class_name') as string;
      description = (formData.get('description') as string) ?? undefined;
      pdf_url = (formData.get('pdf_url') as string) ?? undefined;
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
      ({ class_name, description, pdf_url, duration_minutes, class_date } = body);
    }

    if (!class_name) throw new ApiError(400, 'class_name is required');

    const cls = await createClassInTopicService({
      batchId: batch.id,
      topicSlug,
      class_name,
      description,
      pdf_url,
      pdf_file: pdf_file as any,
      duration_minutes,
      class_date,
    });

    await CacheInvalidation.invalidateBatch(batch.id);

    return NextResponse.json({ message: 'Class created successfully', class: cls }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
