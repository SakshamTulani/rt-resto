import { z } from "zod";

/**
 * Create menu item schema
 */
export const createMenuItemSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID"),
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  description: z.string().max(1000, "Description too long").optional(),
  imageUrl: z.string().url("Invalid URL").nullable().optional(),
  basePrice: z
    .number()
    .int("Price must be in cents")
    .positive("Price must be positive"),
  prepTimeMinutes: z.number().int().min(1).max(120).optional(),
  isVegetarian: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  isGlutenFree: z.boolean().optional(),
  stockQuantity: z.number().int().min(0).nullable().optional(),
});
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;

/**
 * Update menu item schema
 */
export const updateMenuItemSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID").optional(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url().nullable().optional(),
  basePrice: z.number().positive("Price must be positive").optional(),
  prepTimeMinutes: z.number().int().min(1).max(120).optional(),
  isAvailable: z.boolean().optional(),
  isVegetarian: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  isGlutenFree: z.boolean().optional(),
  stockQuantity: z.number().int().min(0).nullable().optional(),
});
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;

/**
 * Menu filter params schema
 */
export const menuFilterSchema = z.object({
  categoryId: z.string().uuid().optional(),
  search: z.string().max(100).optional(),
  isVegetarian: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  isGlutenFree: z.boolean().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  available: z.boolean().optional(),
});
export type MenuFilterParams = z.infer<typeof menuFilterSchema>;
