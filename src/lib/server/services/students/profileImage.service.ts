import { S3Service } from '@/lib/server/services/storage/s3.service';
import prisma from '@/lib/server/config/prisma';
import { ApiError } from '@/lib/server/utils/ApiError';
import type { ParsedFile } from '@/lib/server/file-helper';

// Helper function to extract S3 key from URL
function getS3KeyFromUrl(url: string): string {
  if (!url) return '';
  const urlParts = url.split('/');
  return urlParts.slice(3).join('/');
}

export class ProfileImageService {
  /**
   * Upload profile image for student
   */
  static async uploadProfileImage(
    studentId: number,
    file: ParsedFile
  ): Promise<{ url: string }> {
    // Verify student exists and capture current image URL
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { profile_image_url: true },
    });

    if (!student) {
      throw new ApiError(400, 'Student not found');
    }

    const oldImageUrl = student.profile_image_url;

    // 1. Upload new image FIRST — don't touch the old one yet.
    //    If this fails, the user's existing avatar is still intact.
    const uploaded = await S3Service.uploadFile(file, 'profile-images');

    // 2. Update DB. If this fails, clean up the orphaned new upload.
    try {
      await prisma.student.update({
        where: { id: studentId },
        data: { profile_image_url: uploaded.url },
      });
    } catch (err) {
      await S3Service.deleteFile(uploaded.key).catch(() => {/* swallow cleanup failure */});
      throw err;
    }

    // 3. Only AFTER the DB has the new URL, best-effort delete the old image.
    //    A failure here just leaves an orphan — user-facing avatar is fine.
    if (oldImageUrl) {
      const oldKey = getS3KeyFromUrl(oldImageUrl);
      if (oldKey) {
        await S3Service.deleteFile(oldKey).catch((cleanupErr) => {
          console.error('Profile image: failed to delete old image:', cleanupErr);
        });
      }
    }

    return { url: uploaded.url };
  }

  /**
   * Delete profile image for student
   */
  static async deleteProfileImage(studentId: number): Promise<void> {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { profile_image_url: true },
    });

    if (!student) {
      throw new ApiError(400, 'Student not found');
    }

    if (!student.profile_image_url) return; // nothing to delete

    // 1. Clear DB FIRST — guarantees the user never sees a broken image
    //    (DB pointing to a deleted S3 file).
    await prisma.student.update({
      where: { id: studentId },
      data: { profile_image_url: null },
    });

    // 2. Best-effort S3 cleanup. If this fails, the file orphans in S3,
    //    but the user is fine — DB no longer references it.
    const key = getS3KeyFromUrl(student.profile_image_url);
    if (key) {
      await S3Service.deleteFile(key).catch((err) => {
        console.error('Profile image: failed to delete from S3:', err);
      });
    }
  }

  
   
}