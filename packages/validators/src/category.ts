import { z } from "zod";

/**
 * Create category schema
 */
export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug too long")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  sortOrder: z.number().int().min(0).optional(),
});
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

/**
 * Update category schema
 */
export const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only")
    .optional(),
  sortOrder: z.number().int().min(0).optional(),
});
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
