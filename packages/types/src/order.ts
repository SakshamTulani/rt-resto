/**
 * Order status enum
 */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

/**
 * Order type
 */
export interface Order {
  id: string;
  userId: string | null;
  sessionId: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Order item type
 */
export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: string | null;
}

/**
 * Order with items for display
 */
export interface OrderWithItems extends Order {
  items: OrderItemDisplay[];
}

/**
 * Order item for display (with menu item details)
 */
export interface OrderItemDisplay extends OrderItem {
  menuItem: {
    name: string;
    imageUrl: string | null;
  };
}

/**
 * Create order input
 */
export interface CreateOrderInput {
  sessionId: string;
  items: CreateOrderItemInput[];
  notes?: string;
}

/**
 * Create order item input
 */
export interface CreateOrderItemInput {
  menuItemId: string;
  quantity: number;
  notes?: string;
}

/**
 * Order status update input
 */
export interface UpdateOrderStatusInput {
  status: OrderStatus;
}
