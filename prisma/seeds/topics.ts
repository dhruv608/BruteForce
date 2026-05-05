import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { slugify } from 'transliteration';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const prisma = new PrismaClient();

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

const BUCKET = process.env.AWS_BUCKET_NAME!;
const IMAGES_DIR = path.join(process.cwd(), 'public', 'topicImages');
const CSV_PATH = path.join(process.cwd(), 'public', 'seedData', 'topics.csv');

interface CSVRow {
  topic_name: string;
  imagePath: string;
}

async function uploadImage(localPath: string, s3Key: string): Promise<string> {
  const buffer = fs.readFileSync(localPath);
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: s3Key,
    Body: buffer,
    ContentType: 'image/png',
  }));
  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
}

async function main() {
  if (!BUCKET || !process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY) {
    console.error('❌  Missing AWS env vars: AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, AWS_BUCKET_NAME');
    process.exit(1);
  }

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌  CSV not found at: ${CSV_PATH}`);
    console.error('    Run: npm run generate:topicscsv first');
    process.exit(1);
  }

  const rows: CSVRow[] = await new Promise((resolve, reject) => {
    const collected: CSVRow[] = [];
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on('data', (d: CSVRow) => collected.push(d))
      .on('end', () => resolve(collected))
      .on('error', reject);
  });

  if (rows.length === 0) {
    console.error('❌  CSV is empty');
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of rows) {
    const topic_name = row.topic_name?.trim();
    if (!topic_name) continue;

    const slug = slugify(topic_name).toLowerCase();

    const existing = await prisma.topic.findFirst({ where: { slug } });
    if (existing) {
      console.log(`⏭️   ${slug} — already exists`);
      skipped++;
      continue;
    }

    try {
      let photo_url: string | null = null;

      if (row.imagePath?.trim()) {
        const localImage = path.join(IMAGES_DIR, row.imagePath.trim());
        if (fs.existsSync(localImage)) {
          const s3Key = `topics/${slug}.png`;
          photo_url = await uploadImage(localImage, s3Key);
        } else {
          console.warn(`⚠️   Image not found locally: ${row.imagePath} — creating topic without image`);
        }
      }

      await prisma.topic.create({
        data: { topic_name, slug, photo_url },
      });

      console.log(`✅  ${slug}`);
      created++;
    } catch (err: any) {
      console.error(`❌  ${slug} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✅  Created ${created} / ${rows.length}  (${skipped} skipped — already exists, ${failed} failed)`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
