import { z } from "zod";

/**
 * Order status enum
 */
export const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
]);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

/**
 * Create order item schema
 */
export const createOrderItemSchema = z.object({
  menuItemId: z.string().uuid("Invalid menu item ID"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(99),
  notes: z.string().max(500).optional(),
});
export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>;

/**
 * Create order schema
 */
export const createOrderSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  items: z
    .array(createOrderItemSchema)
    .min(1, "Order must have at least one item"),
  notes: z.string().max(500).optional(),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

/**
 * Update order status schema
 */
export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
});
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
