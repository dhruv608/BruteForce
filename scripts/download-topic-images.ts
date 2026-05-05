import { PrismaClient } from '@prisma/client';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

const BUCKET = process.env.AWS_BUCKET_NAME!;
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'topicImages');

function extractS3Key(photoUrl: string): string {
  const url = new URL(photoUrl);
  // pathname = /topics/filename.ext  → strip leading slash
  return url.pathname.slice(1);
}

async function downloadImage(key: string, destPath: string): Promise<void> {
  const response = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  const body = response.Body as Readable;
  await new Promise<void>((resolve, reject) => {
    const writer = fs.createWriteStream(destPath);
    body.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function main() {
  if (!BUCKET || !process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY) {
    console.error('❌  Missing AWS env vars. Ensure AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, AWS_BUCKET_NAME are set.');
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const topics = await prisma.topic.findMany({
    where: { photo_url: { not: null } },
    select: { slug: true, photo_url: true },
  });

  const total = await prisma.topic.count();
  const skipped = total - topics.length;

  console.log(`Found ${topics.length} topics with images (${skipped} skipped — no photo_url)\n`);

  let downloaded = 0;
  let failed = 0;

  for (const topic of topics) {
    const destPath = path.join(OUTPUT_DIR, `${topic.slug}.png`);
    try {
      const key = extractS3Key(topic.photo_url!);
      await downloadImage(key, destPath);
      console.log(`✅  ${topic.slug}.png`);
      downloaded++;
    } catch (err: any) {
      console.error(`❌  ${topic.slug} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✅  Downloaded ${downloaded} / ${topics.length}  (${failed} failed, ${skipped} skipped — no photo_url)`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
