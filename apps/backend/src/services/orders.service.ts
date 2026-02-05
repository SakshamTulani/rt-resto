import { db } from "../db";
import { orders, orderItems, menuItems } from "../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { orderEvents } from "../socket";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

interface CreateOrderItemInput {
  menuItemId: string;
  quantity: number;
  notes?: string;
}

interface CreateOrderInput {
  userId?: string;
  sessionId: string;
  items: CreateOrderItemInput[];
  notes?: string;
}

export const ordersService = {
  /**
   * Get all orders (for admin/kitchen)
   */
  async getAll(status?: OrderStatus) {
    return db.query.orders.findMany({
      where: status ? eq(orders.status, status) : undefined,
      with: {
        items: {
          with: {
            menuItem: true,
          },
        },
        user: {
          columns: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: [desc(orders.createdAt)],
    });
  },

  /**
   * Get orders by user ID
   */
  async getByUserId(userId: string) {
    return db.query.orders.findMany({
      where: eq(orders.userId, userId),
      with: {
        items: {
          with: {
            menuItem: true,
          },
        },
        user: {
          columns: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: [desc(orders.createdAt)],
    });
  },

  /**
   * Get orders by session ID (for guest users)
   */
  async getBySessionId(sessionId: string) {
    return db.query.orders.findMany({
      where: eq(orders.sessionId, sessionId),
      with: {
        items: {
          with: {
            menuItem: true,
          },
        },
        user: {
          columns: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: [desc(orders.createdAt)],
    });
  },

  /**
   * Get order by ID
   */
  async getById(id: string) {
    return db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: {
          with: {
            menuItem: true,
          },
        },
        user: {
          columns: {
            name: true,
            email: true,
          },
        },
      },
    });
  },

  /**
   * Validate cart items and calculate totals
   */
  async validateCart(items: CreateOrderItemInput[]) {
    const menuItemIds = items.map((item) => item.menuItemId);

    // Fetch all menu items
    const menuItemsData = await db.query.menuItems.findMany({
      where: and(
        sql`${menuItems.id} IN (${sql.join(
          menuItemIds.map((id) => sql`${id}`),
          sql`, `,
        )})`,
        eq(menuItems.isAvailable, true),
      ),
    });

    const errors: string[] = [];
    let subtotal = 0;

    const validatedItems = items.map((item) => {
      const menuItem = menuItemsData.find((m) => m.id === item.menuItemId);

      if (!menuItem) {
        errors.push(`Menu item ${item.menuItemId} not found or unavailable`);
        return null;
      }

      // Check stock
      if (
        menuItem.stockQuantity !== null &&
        menuItem.stockQuantity < item.quantity
      ) {
        errors.push(
          `Insufficient stock for ${menuItem.name}. Available: ${menuItem.stockQuantity}`,
        );
        return null;
      }

      const unitPrice = menuItem.basePrice;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      return {
        menuItemId: item.menuItemId,
        menuItem,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
        notes: item.notes,
      };
    });

    if (errors.length > 0) {
      return { valid: false, errors, items: [], subtotal: 0, tax: 0, total: 0 };
    }

    const taxRate = 0.1; // 10% tax
    const tax = Math.round(subtotal * taxRate);
    const total = subtotal + tax;

    return {
      valid: true,
      errors: [],
      items: validatedItems.filter(Boolean),
      subtotal,
      tax,
      total,
    };
  },

  /**
   * Create a new order with stock validation
   */
  async create(input: CreateOrderInput) {
    // Validate cart first
    const validation = await this.validateCart(input.items);

    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    // Create order in a transaction
    const result = await db.transaction(async (tx) => {
      // Create order
      const [order] = await tx
        .insert(orders)
        .values({
          userId: input.userId ?? null,
          sessionId: input.sessionId,
          status: "pending",
          subtotal: validation.subtotal,
          tax: validation.tax,
          total: validation.total,
          notes: input.notes ?? null,
        })
        .returning();

      // Create order items and update stock
      for (const item of validation.items) {
        if (!item) continue;

        await tx.insert(orderItems).values({
          orderId: order.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          notes: item.notes ?? null,
        });

        // Decrement stock if applicable
        if (item.menuItem.stockQuantity !== null) {
          await tx
            .update(menuItems)
            .set({
              stockQuantity: sql`${menuItems.stockQuantity} - ${item.quantity}`,
            })
            .where(eq(menuItems.id, item.menuItemId));
        }
      }

      return order;
    });

    // Fetch full order with items
    const fullOrder = await this.getById(result.id);

    // Emit socket event
    orderEvents.created({
      id: result.id,
      sessionId: input.sessionId,
      userId: input.userId,
    });

    return { success: true, order: fullOrder };
  },

  /**
   * Update order status
   */
  async updateStatus(id: string, status: OrderStatus) {
    // Get previous status for event
    const existing = await this.getById(id);
    const previousStatus = existing?.status || "pending";

    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();

    // Emit socket event
    if (order && existing) {
      orderEvents.statusUpdated({
        id: order.id,
        sessionId: existing.sessionId,
        status: order.status,
        previousStatus,
      });
    }

    return order;
  },

  /**
   * Cancel an order (only if pending or confirmed)
   */
  async cancel(id: string) {
    const order = await this.getById(id);

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      return { success: false, error: "Order cannot be cancelled" };
    }

    // Restore stock in a transaction
    await db.transaction(async (tx) => {
      // Restore stock for each item
      for (const item of order.items) {
        if (item.menuItem.stockQuantity !== null) {
          await tx
            .update(menuItems)
            .set({
              stockQuantity: sql`${menuItems.stockQuantity} + ${item.quantity}`,
            })
            .where(eq(menuItems.id, item.menuItemId));
        }
      }

      // Update order status
      await tx
        .update(orders)
        .set({ status: "cancelled", updatedAt: new Date() })
        .where(eq(orders.id, id));
    });

    // Emit socket event
    orderEvents.cancelled({
      id: order.id,
      sessionId: order.sessionId,
    });

    return { success: true };
  },
};
