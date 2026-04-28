import 'server-only';
import { apiCreated } from '@/lib/server/api-response';
import { withHandler } from '@/lib/server/route-handler';
import { registerStudentSchema } from '@/lib/server/schemas/auth.schema';
import prisma from '@/lib/server/config/prisma';
import { hashPassword } from '@/lib/server/utils/password.util';
import { generateUsername } from '@/lib/server/utils/usernameGenerator';
import { ApiError } from '@/lib/server/utils/ApiError';
import { validateEmail } from '@/lib/server/utils/emailValidation.util';
import { Prisma } from '@prisma/client';

export const POST = withHandler(
  async ({ body }) => {
    const data = body as {
      name: string;
      email: string;
      username: string;
      password: string;
      batch_id: number;
      enrollment_id?: string;
      leetcode_id?: string;
      gfg_id?: string;
    };

    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      throw new ApiError(400, emailValidation.error ?? 'Invalid email');
    }

    const batch = await prisma.batch.findUnique({
      where: { id: data.batch_id },
      select: { id: true, city_id: true },
    });

    if (!batch) {
      throw new ApiError(404, 'Batch not found');
    }

    let finalUsername = data.username;
    if (!finalUsername) {
      const gen = await generateUsername(data.name, data.enrollment_id);
      finalUsername = gen.finalUsername;
    }

    const password_hash = await hashPassword(data.password);

    try {
      const student = await prisma.student.create({
        data: {
          name: data.name,
          email: data.email,
          username: finalUsername,
          password_hash,
          enrollment_id: data.enrollment_id,
          batch_id: data.batch_id,
          city_id: batch.city_id,
          leetcode_id: data.leetcode_id,
          gfg_id: data.gfg_id,
        },
        select: { id: true, name: true, email: true, username: true },
      });

      return apiCreated({ user: student }, 'Student registered successfully');
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const field = (err.meta?.target as string[]) ?? [];
        if (field.includes('email')) throw new ApiError(409, 'Email already exists', [], 'EMAIL_EXISTS');
        if (field.includes('username')) throw new ApiError(409, 'Username already exists', [], 'USERNAME_EXISTS');
        if (field.includes('enrollment_id')) throw new ApiError(409, 'Enrollment ID already exists', [], 'ENROLLMENT_ID_EXISTS');
      }
      throw err;
    }
  },
  { rateLimit: 'auth', bodySchema: registerStudentSchema }
);
