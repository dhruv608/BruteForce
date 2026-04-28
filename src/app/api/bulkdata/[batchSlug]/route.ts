import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { parseFormDataFileAny } from '@/lib/server/file-helper';
import { createClassInTopicService } from '@/lib/server/services/topics/class.service';
import { assignQuestionsToClassService } from '@/lib/server/services/questions/visibility.service';
import prisma from '@/lib/server/config/prisma';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';
import { Readable } from 'stream';
import csv from 'csv-parser';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ batchSlug: string }> }
) {
  try {
    const { batchSlug } = await params;

    const batch = await prisma.batch.findUnique({ where: { slug: batchSlug } });
    if (!batch) {
      throw new ApiError(404, `Batch not found with slug: ${batchSlug}`);
    }

    const file = await parseFormDataFileAny(req, 'csv');

    const results = {
      message: 'Bulk upload completed',
      summary: {
        totalRows: 0,
        classesCreated: 0,
        duplicateClassesSkipped: 0,
        questionsAssigned: 0,
        questionsNotFound: 0,
      },
      errors: [] as Array<{ row: number; issue: string; action?: string; question?: string }>,
    };

    const csvData: any[] = await new Promise((resolve, reject) => {
      const rows: any[] = [];
      const readable = Readable.from(file.buffer);
      readable
        .pipe(csv())
        .on('data', (row: any) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', reject);
    });

    results.summary.totalRows = csvData.length;

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      const rowNum = i + 2;

      try {
        const topic = await prisma.topic.findUnique({ where: { slug: row.topic_slug?.trim() } });
        if (!topic) {
          results.errors.push({ row: rowNum, issue: `Topic '${row.topic_slug}' not found`, action: 'skipped' });
          continue;
        }

        let classDate: Date | null = null;
        if (row.class_date?.trim()) {
          const [day, month, year] = row.class_date.trim().split('/');
          const parsed = new Date(`${year}-${month}-${day}`);
          classDate = isNaN(parsed.getTime()) ? null : parsed;
        }

        const existingClass = await prisma.class.findFirst({
          where: { topic_id: topic.id, batch_id: batch.id, class_name: row.class_name?.trim() },
        });

        let targetClass;
        if (existingClass) {
          results.summary.duplicateClassesSkipped++;
          results.errors.push({ row: rowNum, issue: `Class '${row.class_name}' already exists`, action: 'skipped' });
          targetClass = existingClass;
        } else {
          targetClass = await createClassInTopicService({
            batchId: batch.id,
            topicSlug: row.topic_slug?.trim(),
            class_name: row.class_name?.trim(),
            description: row.description_html?.trim() || '',
            pdf_url: row.notes?.trim() || '',
            duration_minutes: row.duration ? parseInt(row.duration) : undefined,
            class_date: classDate?.toISOString() || undefined,
          });
          results.summary.classesCreated++;
        }

        const questionLinks = (row.question_links || '').split(',').map((l: string) => l.trim()).filter(Boolean);
        const types = (row.types || '').split(',').map((t: string) => t.trim().toUpperCase()).filter(Boolean);

        for (let j = 0; j < questionLinks.length; j++) {
          const questionLink = questionLinks[j];
          const type = types[j];

          if (type !== 'HOMEWORK' && type !== 'CLASSWORK') {
            results.errors.push({ row: rowNum, question: questionLink, issue: `Invalid type: ${type}`, action: 'skipped' });
            continue;
          }

          const question = await prisma.question.findUnique({ where: { question_link: questionLink } });
          if (!question) {
            results.summary.questionsNotFound++;
            results.errors.push({ row: rowNum, question: questionLink, issue: 'Question not found', action: 'skipped' });
            continue;
          }

          try {
            await assignQuestionsToClassService({
              batchId: batch.id,
              topicSlug: row.topic_slug?.trim(),
              classSlug: targetClass.slug,
              questions: [{ question_id: question.id, type: type as 'HOMEWORK' | 'CLASSWORK' }],
            });
            results.summary.questionsAssigned++;
          } catch (err: any) {
            results.errors.push({ row: rowNum, question: questionLink, issue: err.message, action: 'skipped' });
          }
        }
      } catch (err: any) {
        results.errors.push({ row: rowNum, issue: `Row processing failed: ${err.message}`, action: 'skipped' });
      }
    }

    return NextResponse.json(results);
  } catch (err) {
    return handleError(err);
  }
}
