import { PrismaClient, Platform, Level } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const prisma = new PrismaClient();

interface CSVRow {
  question_name: string;
  question_link: string;
  level: string;
  type: string;
  topic_slug: string;
}

function detectPlatform(link: string): Platform {
  const l = link.toLowerCase();
  if (l.includes('leetcode.com')) return Platform.LEETCODE;
  if (l.includes('geeksforgeeks.org')) return Platform.GFG;
  return Platform.OTHER;
}

async function main() {
  const csvPath = path.join(process.cwd(), 'public', 'seedData', 'Questions-Bank.csv');

  if (!fs.existsSync(csvPath)) {
    console.error(`❌  CSV not found at: ${csvPath}`);
    process.exit(1);
  }

  const rows: CSVRow[] = await new Promise((resolve, reject) => {
    const collected: CSVRow[] = [];
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (d: CSVRow) => collected.push(d))
      .on('end', () => resolve(collected))
      .on('error', reject);
  });

  if (rows.length === 0) {
    console.error('❌  CSV is empty');
    process.exit(1);
  }

  const uniqueSlugs = [...new Set(rows.map(r => r.topic_slug?.trim()).filter(Boolean))];

  const topics = await prisma.topic.findMany({
    where: { slug: { in: uniqueSlugs } },
    select: { id: true, slug: true },
  });

  const slugToId = new Map(topics.map(t => [t.slug, t.id]));

  const missingTopics = uniqueSlugs.filter(s => !slugToId.has(s));
  if (missingTopics.length > 0) {
    console.warn(`⚠️  Topics not found in DB (${missingTopics.length}): ${missingTopics.join(', ')}`);
  }

  const dataToInsert: {
    question_name: string;
    question_link: string;
    level: Level;
    platform: Platform;
    topic_id: number;
  }[] = [];

  let skipped = 0;

  for (const row of rows) {
    const slug = row.topic_slug?.trim();
    const topicId = slugToId.get(slug);

    if (!topicId) {
      skipped++;
      continue;
    }

    const level = Level[row.level?.trim()?.toUpperCase() as keyof typeof Level] ?? Level.MEDIUM;

    dataToInsert.push({
      question_name: row.question_name?.trim(),
      question_link: row.question_link?.trim(),
      level,
      platform: detectPlatform(row.question_link ?? ''),
      topic_id: topicId,
    });
  }

  const result = await prisma.question.createMany({
    data: dataToInsert,
    skipDuplicates: true,
  });

  console.log(`Inserted ${result.count} / ${rows.length} questions  (${skipped} skipped — topic not found)`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
