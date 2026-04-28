import prisma from '@/lib/server/config/prisma';
import { ApiError } from '@/lib/server/utils/ApiError';
import { CacheInvalidation } from '@/lib/server/utils/cacheInvalidation';
import { buildCacheKey, delKeys, deleteByPattern } from '@/lib/server/utils/redisUtils';

export const updateStudentProfileData = async (
  studentId: number,
  { leetcode_id, gfg_id, github, linkedin, username }: any
) => {
  // Get current student to check if they already have city and batch
  const currentStudent = await prisma.student.findUnique({
    where: { id: studentId },
    select: { city_id: true, batch_id: true, username: true }
  });

  if (!currentStudent) {
    throw new ApiError(404, "Student not found", [], "STUDENT_NOT_FOUND");
  }

  // Build update data - only include fields that are provided
  const updateData: any = {};
  
  if (leetcode_id !== undefined) updateData.leetcode_id = leetcode_id;
  if (gfg_id !== undefined) updateData.gfg_id = gfg_id;
  if (github !== undefined) updateData.github = github;
  if (linkedin !== undefined) updateData.linkedin = linkedin;
  if (username !== undefined && username.trim()) updateData.username = username;

  const updated = await prisma.student.update({
    where: { id: studentId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      leetcode_id: true,
      gfg_id: true,
      github: true,
      linkedin: true,
      city_id: true,
      batch_id: true,
      created_at: true
    }
  });

  // Invalidate leaderboard caches when student profile data changes
  await CacheInvalidation.invalidateAllLeaderboards();
  
  // Invalidate student:me cache
  const meCacheKey = buildCacheKey(`student:me:${studentId}`, {});
  await delKeys(meCacheKey);

  // Invalidate student profile cache
  await CacheInvalidation.invalidateStudentProfile(studentId);

  // Invalidate public profile cache for old username if username changed
  if (username && username !== currentStudent.username) {
    await delKeys(`student:profile:public:${currentStudent.username}`);
  }

  // Invalidate heatmap cache (pattern delete — was buggy as redis.del with glob)
  await deleteByPattern(`student:heatmap:${studentId}:*`);

  return updated;
};