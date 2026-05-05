import { PrismaClient, AdminRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email    = process.env.SUPERADMIN_EMAIL;
  const password = process.env.SUPERADMIN_PASSWORD;
  const name     = process.env.SUPERADMIN_NAME ?? 'Super Admin';

  if (!email || !password) {
    console.error('❌  Missing required env vars: SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD');
    console.error('    Usage: SUPERADMIN_EMAIL=you@example.com SUPERADMIN_PASSWORD=secret npm run seed:superadmin');
    process.exit(1);
  }

  const password_hash = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where:  { email },
    update: {},
    create: { name, email, password_hash, role: AdminRole.SUPERADMIN },
  });

  console.log(`✅  Superadmin ready → ${admin.email} (id: ${admin.id})`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
