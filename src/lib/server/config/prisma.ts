import 'server-only';
import { PrismaClient, Prisma } from '@prisma/client';

// Logging policy:
//   production:  errors only
//   development: errors + warnings (and queries if DEBUG_PRISMA=true)
const logLevels: Prisma.LogLevel[] =
  process.env.NODE_ENV === 'production'
    ? ['error']
    : process.env.DEBUG_PRISMA === 'true'
      ? ['query', 'error', 'warn']
      : ['error', 'warn'];

const prismaClientSingleton = () =>
  new PrismaClient({ log: logLevels });

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
