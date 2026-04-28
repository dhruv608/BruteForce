import { z } from "zod";

/**
 * Create Admin Schema
 * For admin creation form
 */
export const createAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["SUPERADMIN", "TEACHER", "INTERN"], {
    message: "Role must be SUPERADMIN, TEACHER, or INTERN",
  }),
  city_id: z.number().int().positive().optional(),
  batch_id: z.number().int().positive().optional(),
});

/**
 * Update Admin Schema
 * For admin update form
 */
export const updateAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email format").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  role: z.enum(["SUPERADMIN", "TEACHER", "INTERN"]).optional(),
});

/**
 * Batch Stats Request Schema
 * For dashboard stats
 */
export const batchStatsSchema = z.object({
  batch_id: z.number().int().positive("Batch is required"),
});

// Type exports
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
export type BatchStatsInput = z.infer<typeof batchStatsSchema>;
