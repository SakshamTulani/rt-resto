import { z } from "zod";

/**
 * User role enum
 */
export const userRoleSchema = z.enum(["customer", "kitchen", "admin"]);
export type UserRole = z.infer<typeof userRoleSchema>;

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Register schema
 */
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});
export type RegisterInput = z.infer<typeof registerSchema>;
