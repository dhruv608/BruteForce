import { z } from "zod";

/**
 * Student Registration Schema
 * POST /api/auth/student/register
 */
export const registerStudentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  password: z.string().min(8, "Password must be at least 8 characters"),
  batch_id: z.number().int().positive("Batch ID is required"),
  enrollment_id: z.string().optional(),
  leetcode_id: z.string().optional(),
  gfg_id: z.string().optional(),
});

/**
 * Student Login Schema
 * POST /api/auth/student/login
 * Requires either email or username
 */
export const loginStudentSchema = z
  .object({
    email: z.string().email("Invalid email format").toLowerCase().trim().optional(),
    username: z.string().min(3, "Username must be at least 3 characters").max(50).optional(),
    password: z.string().min(1, "Password is required"),
  })
  .refine((data) => data.email || data.username, {
    message: "Either email or username is required",
    path: ["email"],
  });

/**
 * Admin Login Schema
 * POST /api/auth/admin/login
 */
export const loginAdminSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

/**
 * Forgot Password Schema
 * POST /api/auth/forgot-password
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
});

/**
 * Verify OTP Schema
 * POST /api/auth/verify-otp
 */
export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

/**
 * Reset Password Schema
 * POST /api/auth/reset-password
 */
export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * Admin Registration Schema
 * POST /api/auth/admin/register (via superadmin)
 */
export const registerAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["SUPERADMIN", "TEACHER", "INTERN"]).optional(),
  city_id: z.number().int().positive().optional(),
  batch_id: z.number().int().positive().optional(),
});

// Type exports
export type RegisterStudentInput = z.infer<typeof registerStudentSchema>;
export type LoginStudentInput = z.infer<typeof loginStudentSchema>;
export type LoginAdminInput = z.infer<typeof loginAdminSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type RegisterAdminInput = z.infer<typeof registerAdminSchema>;
