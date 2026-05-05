import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const IMAGES_DIR = path.join(process.cwd(), 'public', 'topicImages');
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'seedData', 'topics.csv');

async function main() {
  const topics = await prisma.topic.findMany({
    select: { topic_name: true, slug: true },
    orderBy: { created_at: 'asc' },
  });

  const lines = ['topic_name,imagePath'];

  for (const topic of topics) {
    const imageFile = `${topic.slug}.png`;
    const imagePath = fs.existsSync(path.join(IMAGES_DIR, imageFile)) ? imageFile : '';
    // Wrap topic_name in quotes to handle commas or special chars
    lines.push(`"${topic.topic_name.replace(/"/g, '""')}",${imagePath}`);
  }

  fs.writeFileSync(OUTPUT_PATH, lines.join('\n'), 'utf8');
  console.log(`✅  Written ${topics.length} rows → ${OUTPUT_PATH}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
