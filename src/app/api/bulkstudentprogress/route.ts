import 'server-only';
import { apiOk } from '@/lib/server/api-response';
import { NextRequest } from 'next/server';
import { parseFormDataFileAny } from '@/lib/server/file-helper';
import prisma from '@/lib/server/config/prisma';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';
import { Readable } from 'stream';
import csv from 'csv-parser';

export async function POST(req: NextRequest) {
  try {
    const file = await parseFormDataFileAny(req, 'csv');

    const results = {
      message: 'Student progress bulk upload completed',
      summary: {
        totalRows: 0,
        progressRecordsCreated: 0,
        studentsNotFound: 0,
        questionsNotFound: 0,
        duplicatesSkipped: 0,
      },
      errors: [] as Array<{ row: number; issue: string; question?: string; enrollment?: string }>,
    };

    const csvData: any[] = await new Promise((resolve, reject) => {
      const rows: any[] = [];
      Readable.from(file.buffer)
        .pipe(csv())
        .on('data', (row: any) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', reject);
    });

    results.summary.totalRows = csvData.length;

    if (csvData.length === 0) throw new ApiError(400, 'CSV file is empty or invalid');

    const firstRow = csvData[0];
    if (!firstRow.question_link) throw new ApiError(400, "CSV must contain 'question_link' column");

    const enrollmentColumns = Object.keys(firstRow).filter(k => k !== 'question_link');
    if (enrollmentColumns.length === 0) throw new ApiError(400, 'CSV must have at least one enrollment column');

    const questionLinks = [...new Set(csvData.map((r: any) => r.question_link?.trim()).filter(Boolean))];

    const [students, questions] = await Promise.all([
      prisma.student.findMany({
        where: { enrollment_id: { in: enrollmentColumns } },
        select: { id: true, enrollment_id: true },
      }),
      prisma.question.findMany({
        where: { question_link: { in: questionLinks as string[] } },
        select: { id: true, question_link: true },
      }),
    ]);

    const enrollmentMap = new Map(students.map(s => [s.enrollment_id, s.id]));
    const questionMap = new Map(questions.map(q => [q.question_link, q.id]));

    enrollmentColumns.forEach(e => {
      if (!enrollmentMap.has(e)) {
        results.summary.studentsNotFound++;
        results.errors.push({ row: 0, issue: `Student with enrollment '${e}' not found`, enrollment: e });
      }
    });

    const progressToCreate: Array<{ student_id: number; question_id: number }> = [];
    const seen = new Set<string>();

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      const link = row.question_link?.trim();
      if (!link) continue;

      const questionId = questionMap.get(link);
      if (!questionId) continue;

      for (const enrollment of enrollmentColumns) {
        if (row[enrollment]?.trim() !== 'Solved') continue;
        const studentId = enrollmentMap.get(enrollment);
        if (!studentId) continue;
        const key = `${studentId}-${questionId}`;
        if (seen.has(key)) { results.summary.duplicatesSkipped++; continue; }
        seen.add(key);
        progressToCreate.push({ student_id: studentId, question_id: questionId });
      }
    }

    if (progressToCreate.length > 0) {
      const existing = await prisma.studentProgress.findMany({
        where: { OR: progressToCreate.map(r => ({ student_id: r.student_id, question_id: r.question_id })) },
        select: { student_id: true, question_id: true },
      });
      const existingKeys = new Set(existing.map(r => `${r.student_id}-${r.question_id}`));
      const newRecords = progressToCreate.filter(r => {
        const k = `${r.student_id}-${r.question_id}`;
        if (existingKeys.has(k)) { results.summary.duplicatesSkipped++; return false; }
        return true;
      });

      if (newRecords.length > 0) {
        await prisma.studentProgress.createMany({ data: newRecords.map(r => ({ ...r, sync_at: new Date() })) });
        results.summary.progressRecordsCreated = newRecords.length;
      }
    }

    return apiOk(results);
  } catch (err) {
    return handleError(err);
  }
}
