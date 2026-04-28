import { z } from "zod";

/**
 * Create City Schema
 * For city creation form
 */
export const createCitySchema = z.object({
  city_name: z.string().min(1, "City name is required"),
});

/**
 * Update City Schema
 * For city update form
 */
export const updateCitySchema = z.object({
  city_name: z.string().min(1, "City name is required"),
});

/**
 * Create Batch Schema
 * For batch creation form
 */
export const createBatchSchema = z.object({
  batch_name: z.string().min(1, "Batch name is required"),
  year: z.number().int().min(2000).max(2100),
  city_id: z.number().int().positive("City is required"),
});

/**
 * Update Batch Schema
 * For batch update form
 */
export const updateBatchSchema = z.object({
  batch_name: z.string().min(1, "Batch name is required").optional(),
  year: z.number().int().min(2000).max(2100).optional(),
  city_id: z.number().int().positive().optional(),
});

// Type exports
export type CreateCityInput = z.infer<typeof createCitySchema>;
export type UpdateCityInput = z.infer<typeof updateCitySchema>;
export type CreateBatchInput = z.infer<typeof createBatchSchema>;
export type UpdateBatchInput = z.infer<typeof updateBatchSchema>;
